'use client';
import { useEffect, useRef, useState } from 'react';
import './projects.css';
import ProjectGallery from './ProjectGallery';

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
    const cards = cardRefs.current;

    const update = () => {
      const viewportCenter = window.innerHeight / 2;
      cards.forEach((card) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        const maxDistance = window.innerHeight * 0.75;
        const proximity = Math.max(0, 1 - distance / maxDistance);
        const scale = 0.82 + proximity * 0.18;
        const opacity = 0.45 + proximity * 0.55;
        card.style.transform = `scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out';
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    requestAnimationFrame(update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
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

      </div>
    </section>
  );
}