import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Projects";
import Skill from "@/models/Skill";
import Profile from "@/models/Profile";
//import ContactForm from "./components/ContactForm"; // We'll create this next

async function getData() {
  await connectDB();
  const [profile, projects, skills] = await Promise.all([
    Profile.findOne(),
    Project.find().sort({ order: 1 }),
    Skill.find().sort({ order: 1 })
  ]);
  return { profile, projects, skills };
}

export default async function HomePage() {
  const { profile, projects, skills } = await getData();

  return (
    <main style={{ color: 'var(--foreground)' }}>
      
      {/* SECTION 1: HERO */}
      <section id="home" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 2rem'
      }}>
        <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontFamily: 'var(--font-fredoka)', marginBottom: '1rem' }}>
          {profile?.name || "Your Name"}<span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <p style={{ fontSize: '1.5rem', opacity: 0.8, maxWidth: '700px', lineHeight: '1.6' }}>
          {profile?.bio || "A Full-stack Developer crafting high-performance digital experiences."}
        </p>
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem' }}>
          <a href="#work" className="modern-btn">Explore Work</a>
          <a href="#contact" className="modern-btn secondary">Let&apos;s Talk</a>
        </div>
      </section>

      {/* SECTION 2: SKILLS (The Marquee/Grid) */}
      <section id="skills" style={{ padding: '10rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem' }}>Mastered Technologies</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', justifyContent: 'center', maxWidth: '900px', margin: '0 auto' }}>
          {skills.map(skill => (
            <div key={skill._id} className="glass" style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: '500' }}>
              {skill.name}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: PROJECTS */}
      <section id="work" style={{ padding: '10rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>Selected Projects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
            {projects.map(project => (
              <div key={project._id} className="glass project-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '250px', background: 'linear-gradient(45deg, var(--glass-border), transparent)' }}></div>
                <div style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{project.title}</h3>
                  <p style={{ opacity: 0.7, lineHeight: '1.7', marginBottom: '1.5rem' }}>{project.description}</p>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    {project.tags?.map(tag => (
                      <span key={tag} style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CONTACT */}
      <section id="contact" style={{ padding: '10rem 2rem', background: 'rgba(var(--accent-rgb), 0.03)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Start a Conversation</h2>
          <p style={{ opacity: 0.6, marginBottom: '3rem' }}>Have a project in mind? I&lsquo;m currently available for freelance work.</p>
        { /* <ContactForm />*/}
        </div>
      </section>

    </main>
  );
}