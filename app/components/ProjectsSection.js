'use client';
import { useEffect, useRef } from 'react';
import './projects.css';
import ProjectGallery from './ProjectGallery';

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

        // Distance from viewport center, normalized 0–1
        const distance = Math.abs(cardCenter - viewportCenter);
        const maxDistance = window.innerHeight * 0.75;
        const proximity = Math.max(0, 1 - distance / maxDistance);

        // Scale: 0.82 when far, 1.0 when centered
        const scale = 0.82 + proximity * 0.18;
        // Opacity: 0.45 when far, 1.0 when centered
        const opacity = 0.45 + proximity * 0.55;

        card.style.transform = `scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out';
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    // Also run on resize
    window.addEventListener('resize', update, { passive: true });
    // Run immediately after paint
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
          <div className="scroll-hint">
            Scroll down to explore ↓
          </div>
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

                <p className="project-description">
                  <strong>Role:</strong> {project.role || 'Developer'}<br />
                  {project.description}
                </p>

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