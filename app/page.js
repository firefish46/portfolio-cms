import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import Project from "@/models/Projects";
import Skill from "@/models/Skill";
import Contact from "@/models/contact"; // Make sure to create this client component
import ContactPage from "./contact/page";
import Image from "next/image";
export const revalidate = 0;
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
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Featured Work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {projects.map(project => (
              <div key={project._id} className="glass project-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '200px', background: 'var(--glass-border)' }}></div> {/* Placeholder for image */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{project.title}</h3>
                  <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1rem' }}>{project.description}</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {project.tags?.map(tag => (
                      <span key={tag} style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>#{tag}</span>
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