import '../../css/header.css';
import React from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";

export default function Header() {
  const [open, setOpen] = React.useState(false);

  const {refs, floatingStyles, context} = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end",
    middleware: [offset(8), flip(), shift({padding: 8})],
    whileElementsMounted: autoUpdate,
  });

  // Interactions: click to open, dismiss on outside click/ESC, ARIA role=menu
  const click = useClick(context);
  const dismiss = useDismiss(context, {escapeKey: true});
  const role = useRole(context, {role: "menu"});
  const {getReferenceProps, getFloatingProps} = useInteractions([
    click,
    dismiss,
    role,
  ]);

  // Close the menu when a menu item is clicked
  const handleNav = () => setOpen(false);

  return (
    <header className="vb-header">
      <div className="vb-brand">
        <div className="vb-logo" aria-hidden="true">
          {/* Simple logo glyph (replace with your image if desired) */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 10.5L12 3l9 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 9.5V21h14V9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 21v-6h4v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="vb-title">Villa Bautista</span>
      </div>

      {/* Inline nav for ≥768px (desktop/tablet) */}
      <nav className="vb-nav-inline" aria-label="Primary">
        <a href="#services" className="vb-link">Services</a>
        <a href="#contact" className="vb-link vb-cta">Contact us</a>
      </nav>

      {/* Burger for mobile */}
      <button
        ref={refs.setReference}
        {...getReferenceProps({
          className: "vb-burger",
          "aria-label": open ? "Close menu" : "Open menu",
          "aria-expanded": open,
          "aria-controls": "vb-menu",
        })}
      >
        {/* Burger icon */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Floating menu using Floating UI (mobile-first; you can keep it enabled for all sizes if you prefer) */}
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <nav
              id="vb-menu"
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps({
                className: "vb-menu",
                "aria-label": "Mobile navigation",
              })}
            >
              <a href="#about" className="vb-item" role="menuitem" onClick={handleNav}>
                About
              </a>
              <a href="#services" className="vb-item" role="menuitem" onClick={handleNav}>
                Services
              </a>
              <a href="#contact" className="vb-item vb-item-cta" role="menuitem" onClick={handleNav}>
                Contact us
              </a>
            </nav>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </header>
  );
}
