import '../../css/service.css'
import React from "react";
import * as THREE from "three";
import ocean from '../../images/ocean.jpeg';
import spa from '../../images/spa.jpeg';
import island from '../../images/island.jpeg';

const defaultItems = [
  {
    id: "svc-1",
    heading: "Oceanfront Suites",
    description:
      "Wake to the sound of waves in spacious suites with panoramic sea views and private terraces.",
    image: ocean,
    alt: "Oceanfront suite with terrace overlooking the sea",
  },
  {
    id: "svc-2",
    heading: "Spa & Wellness",
    description:
      "Rejuvenate with island-inspired treatments, eucalyptus steam, and open-air massage salas.",
    image: spa,
    alt: "Spa stones and tropical leaves arranged beside a towel",
  },
  {
    id: "svc-3",
    heading: "Island Adventures",
    description:
      "Explore coral reefs, hidden lagoons, and scenic trails—guided snorkeling, kayaking, and hikes.",
    image: island,
    alt: "Crystal clear tropical water with gentle waves",
  },
];

/** Easing helpers using THREE.MathUtils */
const clamp01 = (x) => THREE.MathUtils.clamp(x, 0, 1);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutQuad = (t) => t * (2 - t);

/**
 * Animate a section with Three.js Clock + RAF:
 * - content: fade + translateY
 * - media: fade + translateX/translateY based on direction
 */
function animateIn({ content, media, duration = 0.85, from = "left" }) {
  const clock = new THREE.Clock(); // zeroed when created
  let raf = 0;

  // Initial states (GPU-friendly transforms)
  content.style.opacity = "0";
  content.style.transform = "translateY(24px)";
  media.style.opacity = "0";

  if (from === "right") media.style.transform = "translateX(28px)";
  else if (from === "left") media.style.transform = "translateX(-28px)";
  else media.style.transform = "translateY(24px)";

  const tick = () => {
    const t = clamp01(clock.getElapsedTime() / duration);
    const e1 = easeOutCubic(t); // for content
    const e2 = easeOutQuad(t);  // for media

    // Content slides up + fades
    content.style.opacity = String(e1);
    content.style.transform = `translateY(${(1 - e1) * 24}px)`;

    // Media slides from side + fades
    if (from === "right") {
      media.style.transform = `translateX(${(1 - e2) * 28}px)`;
    } else if (from === "left") {
      media.style.transform = `translateX(${- (1 - e2) * 28}px)`;
    } else {
      media.style.transform = `translateY(${(1 - e2) * 24}px)`;
    }
    media.style.opacity = String(e2);

    if (t < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      // snap to final state
      content.style.opacity = "1";
      content.style.transform = "translateY(0)";
      media.style.opacity = "1";
      media.style.transform = "translateX(0)";
      cancelAnimationFrame(raf);
    }
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/**
 * Service – 3 sections with Three.js‑driven slide + fade animations on scroll.
 *
 * Props:
 * - items: Array<{ id, heading, description, image, alt }>
 * - className?: string
 * - threshold?: number (IntersectionObserver) default 0.2
 * - rootMargin?: string default "0px 0px -12% 0px"
 * - duration?: number seconds default 0.85
 */
export default function Service({
  items = defaultItems,
  className = "",
  threshold = 0.2,
  rootMargin = "0px 0px -12% 0px",
  duration = 0.85,
}) {
  const containerRef = React.useRef(null);
  const observerRef = React.useRef(null);
  const cleanupsRef = React.useRef(new Map()); // Map<HTMLElement, () => void>

  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll(".svc-card"));

    // Respect reduced motion
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (reduceMotion) {
      cards.forEach((card) => {
        const content = card.querySelector(".svc-body");
        const media = card.querySelector(".svc-media");
        content.style.opacity = "1";
        content.style.transform = "none";
        media.style.opacity = "1";
        media.style.transform = "none";
        card.classList.add("is-visible");
      });
      return;
    }

    // Prepare initial states
    cards.forEach((card, idx) => {
      const content = card.querySelector(".svc-body");
      const media = card.querySelector(".svc-media");
      const dir = card.dataset.dir || (idx === 0 ? "left" : idx === 1 ? "right" : "up");
      // (states are also set again right before animation to be safe)
      content.style.opacity = "0";
      content.style.transform = "translateY(24px)";
      media.style.opacity = "0";
      media.style.transform =
        dir === "right" ? "translateX(28px)" : dir === "left" ? "translateX(-28px)" : "translateY(24px)";

      content.style.willChange = "transform, opacity";
      media.style.willChange = "transform, opacity";
    });

    // Observe and animate once per card
    observerRef.current = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const card = entry.target;
          const content = card.querySelector(".svc-body");
          const media = card.querySelector(".svc-media");
          const dir = card.dataset.dir || "up";

          const cleanup = animateIn({ content, media, duration, from: dir });
          cleanupsRef.current.set(card, cleanup);

          card.classList.add("is-visible");
          // Release will-change after a bit to avoid memory pressure
          setTimeout(() => {
            content.style.willChange = "auto";
            media.style.willChange = "auto";
          }, duration * 1000 + 200);

          obs.unobserve(card);
        });
      },
      { root: null, threshold, rootMargin }
    );

    cards.forEach((card, i) => {
      if (!card.dataset.dir) card.dataset.dir = i === 0 ? "left" : i === 1 ? "right" : "up";
      observerRef.current.observe(card);
    });

    return () => {
      observerRef.current?.disconnect();
      cleanupsRef.current.forEach((fn) => fn?.());
      cleanupsRef.current.clear();
    };
  }, [items, threshold, rootMargin, duration]);

  return (
    <section
      id="services"
      ref={containerRef}
      className={`vb-service ${className}`}
      aria-label="Villa Bautista services"
    >
      <div className="vb-service__inner">
        {items.slice(0, 3).map((svc, i) => {
          const dir = i === 0 ? "left" : i === 1 ? "right" : "left";
          return (
            <article
              key={svc.id ?? i}
              className="svc-card"
              data-dir={dir}
              aria-label={svc.heading}
            >
              <div className="svc-media">
                <img
                  src={svc.image}
                  alt={svc.alt || svc.heading}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="svc-body">
                <h3 className="svc-heading">{svc.heading}</h3>
                <p className="svc-desc">{svc.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
