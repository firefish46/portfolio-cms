'use client';
import './projects.css'
import ProjectGallery from './ProjectGallery';

export default function ProjectsSection({ projects }) {
  return (
    <section id="work" className="pureglass projects-section">
      <div className="projects-container">
        <h2 className="projects-title">
          Featured <span className="accent-text">Work</span>
        </h2>
        
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project._id} className="glass project-card">
              
              <ProjectGallery images={project.images} title={project.title} />

              <div className="project-content">
                <div className="project-header">
                  <div>
                    <span className="project-category">
                      {project.category}
                    </span>
                    <h3 className="project-title">{project.title}</h3>
                  </div>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="modern-btn project-link"
                    >
                      View Project
                    </a>
                  )}
                </div>

                <p className="project-description">
                  <strong>Role:</strong> {project.role || "Developer"}<br/>
                  {project.description}
                </p>

                <div className="project-tools">
                  {project.tools?.map((tool, i) => (
                    <span key={i} className="tool-tag">
                      {tool}
                    </span>
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