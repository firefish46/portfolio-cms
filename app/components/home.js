"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import "./home.css";

// ─── System theme hook ────────────────────────────────────────────────────────
function useSystemTheme() {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => true
  );
}

// ─── HomeSection ─────────────────────────────────────────────────────────────
export default function HomeSection({ profile }) {
  const title = profile?.title || "Full Stack Developer";
  const isDark = useSystemTheme();
  const [waving, setWaving] = useState(false);
  const [hasWaved, setHasWaved] = useState(false);

  // Auto-wave once on mount
  useEffect(() => {
    const t = setTimeout(() => {
      setWaving(true);
      setHasWaved(true);
      setTimeout(() => setWaving(false), 2000);
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const handleWaveClick = useCallback(() => {
    if (waving) return;
    setWaving(true);
    setTimeout(() => setWaving(false), 2000);
  }, [waving]);

  return (
    <section
      id="home"
      className={`hs-section ${isDark ? "hs-dark" : "hs-light"}`}
      suppressHydrationWarning
    >
      <div className="hs-card">

        {/* Avatar */}
        {profile?.avatar && (
          <div className="hs-avatar-wrap">
            <div className="hs-avatar-ring" />
            <div className="hs-avatar-img">
              <Image
                src={profile.avatar}
                alt={profile.name || "Profile Picture"}
                width={120}
                height={120}
                style={{ objectFit: "cover", display: "block" }}
                priority
              />
            </div>
          </div>
        )}

        {/* Greeting row */}
        <div className="hs-greeting">
          <span className="hs-greeting-text">Hello, I&apos;m</span>
          <button
            className={`hs-wave-btn ${waving ? "hs-waving" : ""}`}
            onClick={handleWaveClick}
            aria-label="Wave hello"
            title="Click to wave!"
          >
            👋
          </button>
        </div>

        {/* Name */}
        <h1 className="hs-name">
          {profile?.name || "Mehedi"}
        </h1>

        {/* Divider */}
        <div className="hs-divider" />

        {/* Title */}
        <div className="hs-title-row">
          <span className="hs-title-text">{title}</span>
        </div>
{/* Social links */}
        <div className="hs-socials">
          {/* GitHub */}
          <a
            className="hs-social-link"
            href={profile?.socials?.github || "https://github.com"}
            target="_blank" 
            rel="noreferrer" 
            aria-label="GitHub"
          >
            <i className="fa-brands fa-github" />
            <span className="hs-social-tooltip">GitHub</span>
          </a>

          {/* LinkedIn */}
          <a
            className="hs-social-link"
            href={profile?.socials?.linkedin || "https://linkedin.com"}
            target="_blank" 
            rel="noreferrer" 
            aria-label="LinkedIn"
          >
            <i className="fa-brands fa-linkedin" />
            <span className="hs-social-tooltip">LinkedIn</span>
          </a>

          {/* Twitter / X */}
          <a
            className="hs-social-link"
            href={profile?.socials?.twitter || "https://twitter.com"}
            target="_blank" 
            rel="noreferrer" 
            aria-label="Twitter"
          >
            <i className="fa-brands fa-x-twitter" />
            <span className="hs-social-tooltip">Twitter</span>
          </a>

          {/* Email - Stays directly on profile object based on your model */}
          <a
            className="hs-social-link"
            href={`mailto:${profile?.email || "hello@example.com"}`}
            aria-label="Email"
          >
            <i className="fa-solid fa-envelope" />
            <span className="hs-social-tooltip">Email</span>
          </a>
        </div>

        {/* Scroll hint */}
        <div className="hs-scroll-hint">
          <div className="hs-scroll-dot" />
          <span>scroll</span>
        </div>

      </div>
    </section>
  );
}