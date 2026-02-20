"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./about.css";
import { useSystemTheme } from "@/app/hooks/usesystemtheme";

// ─── Intersection observer hook (animate on scroll into view) ─
function useInView(threshold = 0.2) {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, inView];
}

export default function AboutSection({ profile, aboutData }) {
  const isDark = useSystemTheme();
  const [sectionRef, inView] = useInView(0.15);

  // 1. Basic Info from Profile Model
  const isAvailable = profile?.available ?? true;
  const location    = profile?.location  || "Remote — Worldwide";
  const bio         = profile?.bio       || "Bio will appear here once updated in the admin panel.";

  // 2. Dynamic Data from About Model (with local fallbacks if empty)
  const highlights = aboutData?.highlights?.length > 0 
    ? aboutData.highlights 
    : [
        { title: "AI-Augmented Speed", desc: "Leveraging LLMs to ship features 3x faster than traditional workflows." },
        { title: "Clean Architecture", desc: "Building scalable, maintainable systems that don't break under pressure." },
        { title: "Full-Stack Vision", desc: "Seamless integration between pixel-perfect UI and robust backend logic." }
      ];

  const aiTools = aboutData?.aiTools?.length > 0 
    ? aboutData.aiTools 
    : [
        { name: "ChatGPT", image: "/icons/openai.svg", color: "#10a37f", delay: "0s" },
        { name: "Gemini", image: "/icons/gemini.svg", color: "#4285f4", delay: "1.5s" },
        { name: "Claude", image: "/icons/claude.svg", color: "#d97757", delay: "3s" },
        { name: "Cursor", image: "/icons/cursor.svg", color: "#5eead4", delay: "4.5s" },
        { name: "Copilot", image: "/icons/copilot.svg", color: "#ffffff", delay: "0.8s" },
        { name: "Android Studio", image: "/icons/android.svg", color: "#3ddc84", delay: "2.2s" },
        { name: "Perplexity", image: "/icons/perplexity.svg", color: "#20b2aa", delay: "3.7s" },
        { name: "DeepSeek", image: "/icons/deepseek.svg", color: "#3b82f6", delay: "5.2s" },
      ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`ab-section ${isDark ? "ab-dark" : "ab-light"} ${inView ? "ab-visible" : ""}`}
      suppressHydrationWarning
    >
      {/* Background accents */}
      <div className="ab-blob ab-blob-1" />
      <div className="ab-blob ab-blob-2" />

      <div className="ab-container">
        
        {/* ── LEFT: CONTENT ── */}
        <div className="ab-content">
          <div className="ab-label">
            <span className="ab-label-line" />
            <span className="ab-label-text">About Me</span>
          </div>

          <h2 className="ab-heading">
            Who I <span className="ab-heading-accent">am</span>
          </h2>
          <p className="ab-bio">{bio}</p>

          {/* ── WHY CHOOSE ME SECTION ── */}
          <div className="ab-label" style={{ marginTop: '3rem' }}>
            <span className="ab-label-line" />
            <span className="ab-label-text">Why Choose Me</span>
          </div>
          <h2 className="ab-heading" style={{ fontSize: '2rem' }}>
            The <span className="ab-heading-accent">Edge</span> I bring
          </h2>

          <div className="ab-highlights">
            {highlights.map((item, i) => (
              <div key={i} className="ab-highlight-item">
                <i className="fa-solid fa-check-circle ab-check" />
                <div>
                  <h4 className="ab-high-title">{item.title}</h4>
                  <p className="ab-high-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

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

        {/* ── RIGHT: FLOATING TECH ORBIT ── */}
        <div className="ab-tech-orbit">
          <div className="orbit-center">
             <div className="center-pulse"></div>
             <i className="fa-solid fa-bolt center-icon"></i>
          </div>
          
          {aiTools.map((tool, index) => (
            <div 
              key={index} 
              className="tech-float-card"
              style={{ 
                '--delay': tool.delay || '0s', 
                '--color': tool.color || 'var(--accent)',
                '--idx': index 
              }}
            >
              <div className="tech-icon-container">
                <Image 
                  src={tool.image} 
                  alt={tool.name}
                  height={24}
                  width={24} 
                  className="tech-svg-icon"
                />
              </div>
              <span className="tech-name">{tool.name}</span>
            </div>
          ))}

          {/* Mesh Gradient Background */}
          <div className="ab-mesh-bg"></div>
        </div>

      </div>
    </section>
  );
}