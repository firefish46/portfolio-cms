"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import "./about.css";
import { useSystemTheme } from "@/app/hooks/usesystemtheme";
// ─── System theme hook (same as HomeSection) ──────────────────
// ─── System theme hook ────────────────────────────────────────

// ─── Intersection observer hook (animate on scroll into view) ─
function useInView(threshold = 0.2) {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return [setRef, inView];
}

// ─── AboutSection ─────────────────────────────────────────────
export default function AboutSection({ profile }) {
  const isDark = useSystemTheme();
  const [sectionRef, inView] = useInView(0.15);

  const isAvailable = profile?.available ?? true;
  const location    = profile?.location  || "Remote — Worldwide";
  const bio         = profile?.bio       || "Bio will appear here once updated in the admin panel.";
  const avatar      = profile?.avatar;
  const name        = profile?.name      || "Mehedi";

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`ab-section ${isDark ? "ab-dark" : "ab-light"} ${inView ? "ab-visible" : ""}`}
      suppressHydrationWarning
    >
      {/* Blob accents */}
      <div className="ab-blob ab-blob-1" />
      <div className="ab-blob ab-blob-2" />

      <div className="ab-container">

        {/* ── Left: text content ── */}
        <div className="ab-content">

          {/* Section label */}
          <div className="ab-label">
            <span className="ab-label-line" />
            <span className="ab-label-text">About Me</span>
          </div>

          {/* Heading */}
          <h2 className="ab-heading">
            Who I <span className="ab-heading-accent">am</span>
          </h2>

          {/* Bio */}
          <p className="ab-bio">{bio}</p>

          {/* Meta row: location + availability */}
          <div className="ab-meta">

            <div className="ab-meta-item">
              <i className="fa-solid fa-location-dot ab-meta-icon" />
              <span className="ab-meta-text">{location}</span>
            </div>

            <div className="ab-meta-item">
              <span className={`ab-status-dot ${isAvailable ? "ab-status-open" : "ab-status-busy"}`} />
              <span className="ab-meta-text">
                {isAvailable ? "Open to opportunities" : "Currently unavailable"}
              </span>
            </div>

          </div>

        </div>

        {/* ── Right: image ── */}
        <div className="ab-image-wrap">
          <div className="ab-image-frame">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                width={340}
                height={380}
                style={{ objectFit: "cover", display: "block", width: "100%", height: "100%" }}
                priority
              />
            ) : (
              /* Placeholder when no avatar */
              <div className="ab-image-placeholder">
                <i className="fa-regular fa-user" />
              </div>
            )}
          </div>

          {/* Floating accent card */}
          <div className="ab-float-card">
            <span className="ab-float-icon">💻</span>
            <div>
              <p className="ab-float-title">Full Stack</p>
              <p className="ab-float-sub">Developer</p>
            </div>
          </div>

          {/* Decorative dots grid */}
          <div className="ab-dots" aria-hidden="true">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} className="ab-dot" />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}