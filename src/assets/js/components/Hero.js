import '../../css/hero.css';
import React from "react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css"; 
import "@glidejs/glide/dist/css/glide.theme.min.css";
import ssvilla from '../../images/ss-villa.jpeg';
import infinity from '../../images/infinity.jpeg';
import sunset from '../../images/sunset.jpeg';
import spa from '../../images/spa.jpeg';
import island from '../../images/island.jpeg';

const defaultSlides = [
  {
    id: "slide-1",
    heading: "Seaside Villas",
    description:
      "Wake up to the sound of waves and panoramic ocean views in our private villas.",
    cta: { label: "Book now", href: "#contact" },
    image: ssvilla,
  },
  {
    id: "slide-2",
    heading: "Infinity Pool Bliss",
    description:
      "Unwind in our cliffside infinity pool with cocktails and golden sunsets.",
    cta: { label: "View services", href: "#services" },
    image: infinity,
  },
  {
    id: "slide-3",
    heading: "Sunset Dining",
    description:
      "Cuisine crafted by our executive chef, served beachfront under the stars.",
    cta: { label: "Reserve a table", href: "#contact" },
    image: sunset,
  },
  {
    id: "slide-4",
    heading: "Spa & Wellness",
    description:
      "Holistic treatments inspired by the island—rejuvenate mind and body.",
    cta: { label: "Explore spa", href: "#services" },
    image: spa
  },
  {
    id: "slide-5",
    heading: "Island Excursions",
    description:
      "Discover hidden lagoons, coral reefs, and scenic trails with our guides.",
    cta: { label: "Plan an adventure", href: "#about" },
    image: island,
  },
];

/**
 * Hero – Mobile-first carousel with Glide.js
 *
 * Props:
 * - slides: Array<{ id, heading, description, cta: {label, href}, image }>
 * - autoplay: number | boolean (ms or false). Default: 5000
 * - className: string (optional)
 * - heightMobile: CSS height (default '60vh')
 * - heightDesktop: CSS height (default '80vh')
 */
export default function Hero({
  slides = defaultSlides,
  autoplay = 5000,
  className = "",
  heightMobile = "60vh",
  heightDesktop = "80vh",
}) {
  const rootRef = React.useRef(null);
  const glideRef = React.useRef(null);

  React.useEffect(() => {
    if (!rootRef.current) return;

    // Destroy any existing instance (React StrictMode safe)
    if (glideRef.current) {
      glideRef.current.destroy();
      glideRef.current = null;
    }

    glideRef.current = new Glide(rootRef.current, {
      type: "carousel",
      startAt: 0,
      perView: 1, // mobile-first single slide
      focusAt: "center",
      gap: 0,
      animationDuration: 600,
      autoplay: autoplay === false ? false : autoplay, // ms or false
      hoverpause: true,
      // Keep 1 per view across sizes; adjust here if you ever want multi-slide on desktop
      breakpoints: {
        1024: { perView: 1 },
        768: { perView: 1 },
        480: { perView: 1 },
      },
    });

    glideRef.current.mount();

    // Cleanup on unmount
    return () => {
      if (glideRef.current) {
        glideRef.current.destroy();
        glideRef.current = null;
      }
    };
  }, [slides.length, autoplay]);

  return (
    <section className={`vb-hero glide ${className}`} ref={rootRef} aria-label="Villa Bautista highlights">
      {/* Track */}
      <div className="glide__track" data-glide-el="track">
        <ul className="glide__slides vb-hero__slides">
          {slides.map((s, idx) => (
            <li
              key={s.id ?? idx}
              className="glide__slide vb-hero__slide"
              style={{ "--vb-hero-mobile-h": heightMobile, "--vb-hero-desktop-h": heightDesktop }}
            >
              {/* Background layer */}
              <div
                className="vb-hero__bg"
                role="img"
                aria-label={s.heading}
                style={{ backgroundImage: `url(${s.image})` }}
              />
              {/* Overlay gradient for readability */}
              <div className="vb-hero__scrim" />
              {/* Content */}
              <div className="vb-hero__content">
                <h2 className="vb-hero__heading">{s.heading}</h2>
                <p className="vb-hero__desc">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Arrows */}
      <div className="glide__arrows vb-hero__arrows" data-glide-el="controls" aria-label="Slide controls">
        <button
          className="glide__arrow glide__arrow--left vb-hero__arrow"
          data-glide-dir="<"
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </button>
        <button
          className="glide__arrow glide__arrow--right vb-hero__arrow"
          data-glide-dir=">"
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Bullets */}
      <div className="glide__bullets vb-hero__bullets" data-glide-el="controls[nav]" aria-label="Slide navigation">
        {slides.map((_, i) => (
          <button
            key={`bullet-${i}`}
            className="glide__bullet vb-hero__bullet"
            data-glide-dir={`=${i}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}