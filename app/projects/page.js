import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import Project from "@/models/Projects";
import Skill from "@/models/Skill";
import Link from "next/link";

async function getData() {
  await connectDB();
  // Fetch all data in parallel for speed
  const [profile, projects, skills] = await Promise.all([
    Profile.findOne(),
    Project.find().sort({ order: 1 }).limit(3), // Show top 3 projects
    Skill.find().sort({ order: 1 })
  ]);
  return { profile, projects, skills };
}

export default async function HomePage() {
  const { profile, projects, skills } = await getData();

  return (
    <main style={{ padding: '8rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HERO SECTION */}
      <section style={{ textAlign: 'center', marginBottom: '8rem' }}>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
          fontFamily: 'var(--font-fredoka)', 
          lineHeight: 1.1,
          marginBottom: '1.5rem'
        }}>
          Hi, I&apos;m <span style={{ color: 'var(--accent)' }}>{profile?.name || "Mehedi"}</span> <br />
          {profile?.title || "Full Stack Developer"}
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          opacity: 0.7, 
          maxWidth: '600px', 
          margin: '0 auto 2.5rem',
          lineHeight: '1.6'
        }}>
          {profile?.bio || "Building digital experiences with modern web technologies."}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/projects">
            <button className="modern-btn">View My Work</button>
          </Link>
          <Link href="/contact">
            <button className="modern-btn secondary">Get In Touch</button>
          </Link>
        </div>
      </section>

      {/* TECH STACK / SKILLS */}
      <section style={{ marginBottom: '8rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Tech Stack</h2>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          justifyContent: 'center' 
        }}>
          {skills.map(skill => (
            <div key={skill._id} className="glass" style={{ padding: '0.8rem 1.5rem', borderRadius: '50px' }}>
              <span style={{ fontWeight: '600' }}>{skill.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem' }}>Featured Projects</h2>
          <Link href="/projects" style={{ color: 'var(--accent)', fontWeight: '600' }}>View All →</Link>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {projects.map(project => (
            <div key={project._id} className="glass project-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '220px', background: 'rgba(var(--accent-rgb), 0.1)' }}>
                {/* Add project images here later */}
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{project.title}</h3>
                <p style={{ opacity: 0.7, fontSize: '0.95rem', marginBottom: '1.2rem' }}>{project.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {project.tags?.slice(0, 3).map(tag => (
                    <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold' }}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}