import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import Project from "@/models/Projects";
import Skill from "@/models/Skill";
import Link from "next/link";
import './page.css';

async function getData() {
  await connectDB();
  const [profile, projects, skills] = await Promise.all([
    Profile.findOne(),
    Project.find().sort({ order: 1 }).limit(3),
    Skill.find().sort({ order: 1 })
  ]);
  return { profile, projects, skills };
}

export default async function HomePage() {
  const { profile, projects, skills } = await getData();

  return (
    <main className="home-container">
      
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">👋</span>
            <span>Welcome to my portfolio</span>
          </div>
          
          <h1 className="hero-title">
            Hi, I&apos;m <span className="highlight">{profile?.name || "Mehedi"}</span>
          </h1>
          
          <h2 className="hero-subtitle">
            {profile?.title || "Full Stack Developer"}
          </h2>
          
          <p className="hero-description">
            {profile?.bio || "Building digital experiences with modern web technologies. Passionate about creating elegant solutions to complex problems."}
          </p>
          
          <div className="hero-cta">
            <Link href="/projects" className="btn-primary">
              <span>View My Work</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/contact" className="btn-secondary">
              <span>Get In Touch</span>
            </Link>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="hero-decoration">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section className="tech-section">
        <div className="section-header">
          <span className="section-label">Technologies</span>
          <h2 className="section-title">Tech Stack</h2>
          <p className="section-description">
            Tools and technologies I use to bring ideas to life
          </p>
        </div>
        
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div 
              key={skill._id} 
              className="skill-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="skill-name">{skill.name}</span>
              {skill.level && (
                <div className="skill-level">
                  <div 
                    className="skill-level-bar" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION */}
      <section className="projects-section">
        <div className="section-header">
          <div className="section-header-content">
            <div>
              <span className="section-label">Portfolio</span>
              <h2 className="section-title">Featured Projects</h2>
              <p className="section-description">
                Recent work and side projects I&apos;m proud of
              </p>
            </div>
            <Link href="/projects" className="view-all-link">
              View All Projects
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <article 
              key={project._id} 
              className="project-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="project-image">
                <div className="project-image-placeholder">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <rect width="64" height="64" rx="12" fill="currentColor" opacity="0.1"/>
                    <path d="M32 20L44 32L32 44M20 32H44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {project.featured && (
                  <span className="project-badge">Featured</span>
                )}
              </div>
              
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">
                  {project.description}
                </p>
                
                <div className="project-tags">
                  {project.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="project-tag">
                      {tag}
                    </span>
                  ))}
                  {project.tags?.length > 3 && (
                    <span className="project-tag-more">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="project-links">
                  {project.liveUrl && (
                    <a href={project.liveUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14 8.66667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H7.33333M11.3333 2H14M14 2V4.66667M14 2L7.33333 8.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" fill="currentColor"/>
                      </svg>
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Let&apos;s Work Together</h2>
          <p className="cta-description">
            Have a project in mind? Let&apos;s discuss how we can bring your ideas to life.
          </p>
          <Link href="/contact" className="btn-primary">
            <span>Start a Conversation</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}