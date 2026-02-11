import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import Project from "@/models/Projects";
import Skill from "@/models/Skill";
import Contact from "@/models/contact"; // Make sure to create this client component
import ContactPage from "./contact/page";
import Image from "next/image";
 import ProjectGallery from "@/app/components/ProjectGallery";

async function getData() {
  await connectDB();
  
  // 1. Use .lean() to get plain JS objects instead of Mongoose Documents
  const [profileData, projectsData, skillsData,contactData] = await Promise.all([
    Profile.findOne().lean(),
    Project.find().sort({ order: 1 }).lean(),
    Skill.find().sort({ order: 1 }).lean(),
    Contact.find().sort({ createdAt: -1 }).lean()
  ]);

  // 2. The "Ultimate Serializer": Converts ObjectIds and Dates to Strings
  // This removes the "Only plain objects" error completely
  const cleanData = (data) => {
    if (!data) return null;
    return JSON.parse(JSON.stringify(data));
  };

  return {
    profile: cleanData(profileData),
    projects: cleanData(projectsData),
    skills: cleanData(skillsData),
    contacts: cleanData(contactData)
  };
}
export default async function HomePage() {
  const { profile, projects, skills } = await getData();

  return (
    <main style={{ scrollBehavior: 'smooth' }}>
      
<section id="home">
 {profile?.avatar && (
  <div style={{ 
    width: '150px', 
    height: '150px', 
    borderRadius: '50%', 
    overflow: 'hidden',
    border: '4px solid var(--accent)', 
    marginBottom: '2rem',
    position: 'relative' // Required for 'fill' layout if used
  }}>
    <Image 
      src={profile.avatar} 
      alt={profile.name || "Profile Picture"} 
      width={150} 
      height={150} 
      style={{ objectFit: 'cover' }}
      priority // This ensures the image loads immediately (improves LCP)
    />
  </div>
)}
  

  {/* NAME & TITLE */}
  <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontFamily: 'var(--font-fredoka)' }}>
    I&apos;m <span style={{ color: 'var(--accent)' }}>{profile?.name || "Mehedi"}</span>
  </h1>
  <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>
    {profile?.title || "Full Stack Developer"}
  </p>
</section>

{/* BIO SECTION */}
<section id="about">
  <h2>About Me</h2>
  <p>{profile?.bio || "Your bio will appear here once updated in the admin panel."}</p>
</section>

      {/* 3. SKILLS SECTION */}
      <section id="skills" style={{ padding: '100px 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Technical Stack</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', maxWidth: '900px', margin: '0 auto' }}>
          {skills.map(skill => (
            <div key={skill._id} className="glass" style={{ padding: '0.8rem 1.5rem', borderRadius: '50px', fontWeight: 'bold' }}>
              {skill.name}
            </div>
          ))}
        </div>
      </section>

  {/* 4. PROJECTS SECTION */}
<section id="work" style={{ padding: '100px 2rem', background: 'rgba(255,255,255,0.02)' }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
    <h2 style={{ fontSize: '3rem', marginBottom: '4rem', textAlign: 'center', fontFamily: 'var(--font-fredoka)' }}>
      Featured <span style={{ color: 'var(--accent)' }}>Work</span>
    </h2>
    
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
      gap: '3rem' 
    }}>
      {projects.map(project => (
        <div key={project._id} className="glass project-card" style={{ 
          padding: '0', 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.3s ease'
        }}>
          
          {/* MULTI-PHOTO DISPLAY (Horizontal Scroll) */}
  <ProjectGallery images={project.images} title={project.title} />

          <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {project.category}
                </span>
                <h3 style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>{project.title}</h3>
              </div>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="modern-btn" style={{ padding: '8px 15px', fontSize: '0.8rem' }}>
                  Visit Project
                </a>
              )}
            </div>

            <p style={{ fontSize: '0.95rem', opacity: 0.7, marginBottom: '1.5rem', lineHeight: '1.6' }}>
              <strong>Role:</strong> {project.role || "Developer"}<br/>
              {project.description}
            </p>

            {/* TOOLS / TECH STACK */}
            <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {project.tools?.map((tool, i) => (
                <span key={i} style={{ 
                  fontSize: '0.7rem', 
                  padding: '5px 12px', 
                  borderRadius: '20px', 
                  background: 'rgba(var(--accent-rgb), 0.1)', 
                  border: '1px solid rgba(var(--accent-rgb), 0.2)',
                  color: 'var(--accent)'
                }}>
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

      {/* 5. CONTACT SECTION */}
      <section id="contact" style={{ padding: '100px 2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Get In Touch</h2>
          <p style={{ opacity: 0.6, marginBottom: '3rem' }}>Let&apos;s talk about your next project.</p>
          <div className="glass" style={{ padding: '2rem' }}>
           <ContactPage  contacts={Contact} />
          </div>
        </div>
      </section>

    </main>
  );
}