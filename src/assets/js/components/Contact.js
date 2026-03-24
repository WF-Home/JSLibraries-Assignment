import '../../css/contact.css';
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons (Vite/Cra bundlers)
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: shadow,
});

/**
 * Contact – Mobile-first responsive contact section with a Leaflet map.
 *
 * Props:
 * - coords: [lat, lng] of the resort. Defaults approximate to Baliwag center.
 * - zoom: initial map zoom (default 16)
 * - className: optional container class
 */
export default function Contact({
  coords = [14.9351, 120.8863], // Approx Baliwag; replace with precise coords if available
  zoom = 16,
  className = "",
}) {
  const [lat, lng] = coords;

  return (
    <section id="contact" className={`vb-contact ${className}`} aria-label="Contact Villa Bautista">
      {/* Contact Info (left on desktop, first on mobile) */}
      <div className="vb-contact__info">
        <h2 className="vb-contact__title">Get in touch</h2>

        <p className="vb-contact__lead">
          Questions, bookings, or special requests—our team is here to help.
        </p>

        <div className="vb-contact__card">
          <div className="vb-contact__row">
            <span className="vb-contact__label">Address</span>
            <address className="vb-contact__value">
              1662 Aldama St, Baliwag, Bulacan, Philippines
            </address>
          </div>

          <div className="vb-contact__row">
            <span className="vb-contact__label">Phone</span>
            <a className="vb-contact__value" href="tel:+63-999-000-0000">
              +63 999 000 0000
            </a>
          </div>

          <div className="vb-contact__row">
            <span className="vb-contact__label">Email</span>
            <a className="vb-contact__value" href="mailto:hello@villabautista.example">
              hello@villabautista.example
            </a>
          </div>

          <div className="vb-contact__row">
            <span className="vb-contact__label">Hours</span>
            <span className="vb-contact__value">Mon–Sun · 8:00 AM – 8:00 PM</span>
          </div>
        </div>

        {/* Optional: a lightweight contact CTA */}
        <div className="vb-contact__actions">
          <a className="vb-contact__btn" href="#contact-form">Send a message</a>
          <a className="vb-contact__btn vb-contact__btn--alt" href="tel:+63-999-000-0000">Call now</a>
        </div>
      </div>

      {/* Map (right on desktop, second on mobile) */}
      <div className="vb-contact__mapwrap" role="region" aria-label="Map location">
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          scrollWheelZoom={false}
          className="vb-contact__map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>
              <strong>Villa Bautista</strong>
              <br />
              1662 Aldama St, Baliwag, Bulacan
            </Popup>
          </Marker>
        </MapContainer>
        <p className="vb-contact__mapnote">
          Tip: Pin is approximate—use your maps app for turn‑by‑turn directions.
        </p>
      </div>
    </section>
  );
}
