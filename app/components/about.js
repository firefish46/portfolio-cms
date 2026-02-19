"use client";

import { useEffect, useState } from "react";
import "./about.css";
import { useSystemTheme } from "@/app/hooks/usesystemtheme";

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

export default function AboutSection({ profile }) {
  const isDark = useSystemTheme();
  const [sectionRef, inView] = useInView(0.15);

  const isAvailable = profile?.available ?? true;
  const location    = profile?.location  || "Remote — Worldwide";
  const bio         = profile?.bio       || "Bio will appear here...";

const aiTools = [
  { name: "ChatGPT", image: "/icons/openai.svg", color: "#10a37f", delay: "0s" },
  { name: "Gemini", image: "/icons/gemini.svg", color: "#4285f4", delay: "1.5s" },
  { name: "Claude", image: "/icons/claude.svg", color: "#d97757", delay: "3s" },
  { name: "Cursor", image: "/icons/cursor.svg", color: "#5eead4", delay: "4.5s" },
  { name: "Copilot", image: "/icons/copilot.svg", color: "#ffffff", delay: "0.8s" },
  { name: "Android Studio", image: "/icons/android.svg", color: "#3ddc84", delay: "2.2s" },
  { name: "Perplexity", image: "/icons/perplexity.svg", color: "#20b2aa", delay: "3.7s" },
  { name: "DeepSeek", image: "/icons/deepseek.svg", color: "#3b82f6", delay: "5.2s" },
];
  const highlights = [
    { title: "AI-Augmented Speed", desc: "Leveraging LLMs to ship features 3x faster than traditional workflows." },
    { title: "Clean Architecture", desc: "Building scalable, maintainable systems that don't break under pressure." },
    { title: "Full-Stack Vision", desc: "Seamless integration between pixel-perfect UI and robust backend logic." }
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`ab-section ${isDark ? "ab-dark" : "ab-light"} ${inView ? "ab-visible" : ""}`}
    >
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

          {/* ── NEW: WHY CHOOSE ME SECTION ── */}
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
              style={{ '--delay': tool.delay, '--color': tool.color }}
            >
            <div className="tech-icon-container">
      <img 
        src={tool.image} 
        alt={tool.name} 
        className="tech-svg-icon"
      />
    </div>
              <span className="tech-name">{tool.name}</span>
            </div>
          ))}

          {/* Decorative Mesh Background behind orbit */}
          <div className="ab-mesh-bg"></div>
        </div>

      </div>
    </section>
  );
}