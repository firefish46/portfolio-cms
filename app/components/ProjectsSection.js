'use client';
import { useEffect, useRef, useState } from 'react';
import './projects.css';
import ProjectGallery from './ProjectGallery';
import Link from 'next/link';

// ─── Collapsible description ──────────────────────────────────
function ProjectDescription({ role, description }) {
  const [expanded, setExpanded] = useState(false);
  const needsClamp = description?.length > 150;

  return (
    <div>
      <p
        className="project-description"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: expanded ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <strong>Role:</strong> {role || 'Developer'}<br />
        {description}
      </p>
      {needsClamp && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600,
            padding: '0.2rem 0', marginTop: '0.25rem',
          }}
        >
          {expanded ? 'Show less ↑' : 'See more ↓'}
        </button>
      )}
    </div>
  );
}

// ─── ProjectsSection ──────────────────────────────────────────
export default function ProjectsSection({ projects }) {
  const cardRefs = useRef([]);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      const maxDistance = viewportHeight * 0.75;

      // Read all layout first, then write, so the browser lays out once per frame
      const rects = cards.map((card) => card.getBoundingClientRect());
      rects.forEach((rect, i) => {
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        const proximity = Math.max(0, 1 - distance / maxDistance);
        const scale = 0.82 + proximity * 0.18;
        const opacity = 0.45 + proximity * 0.55;
        cards[i].style.transform = `scale(${scale.toFixed(3)})`;
        cards[i].style.opacity = opacity.toFixed(3);
      });
    };

    // At most one update per animation frame, however many scroll events fire
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [projects]);

  return (
    <section id="work" className="projects-section">
      <div className="projects-container">

        <h2 className="projects-title">
          Recent <span className="accent-text">Projects</span>
        </h2>

        {projects.length > 1 && (
          <div className="scroll-hint">Scroll down to explore ↓</div>
        )}

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="project-card"
              ref={el => cardRefs.current[index] = el}
            >
              <ProjectGallery images={project.images} title={project.title} />

              <div className="project-content">
                <div className="project-header">
                  <div>
                    <span className="project-category">{project.category}</span>
                    <h3 className="project-title">{project.title}</h3>
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modern-btn project-link"
                    >
                      View
                    </a>
                  )}
                </div>

                {/* ✅ Replaced <p> with collapsible component */}
                <ProjectDescription
                  role={project.role}
                  description={project.description}
                />

                <div className="project-tools">
                  {project.tools?.map((tool, i) => (
                    <span key={i} className="tool-tag">{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="projects-more">
          <Link href="/works" className="modern-btn secondary projects-more-link">
            Browse all work by category →
          </Link>
        </div>

      </div>
    </section>
  );
}