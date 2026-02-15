import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import Project from "@/models/Projects";
import Skill from "@/models/Skill";
import Contact from "@/models/contact";
import ContactPage from "./contact/page";
import Image from "next/image";
import ProjectGallery from "@/app/components/ProjectGallery"; // ADD THIS
import ProjectsSection from "@/app/components/ProjectsSection"; // ADD THIS
import SkillsSection from "@/app/components/SkillsSection"; // ADD THIS

async function getData() {
  await connectDB();
  
  const [profileData, projectsData, skillsData, contactData] = await Promise.all([
    Profile.findOne().lean(),
    Project.find().sort({ order: 1 }).lean(),
    Skill.find().sort({ order: 1 }).lean(),
    Contact.find().sort({ createdAt: -1 }).lean()
  ]);

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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      
      {/* HOME SECTION 
          {profile?.avatar && (
          <div className="image-container" style={{ 
            width: '150px', 
            height: '150px', 
            borderRadius: '50%', 
            overflow: 'hidden',
            border: '4px solid var(--accent)', 
            marginBottom: '2rem',
          }}>
            <Image 
              src={profile.avatar} 
              alt={profile.name || "Profile Picture"} 
              width={150} 
              height={150} 
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}*/}
      <section id="home">
    
  {profile?.avatar && (
          <div className="small-profile" style={{ 
            display:'flex',
            width: '150px', 
            height: '150px', 
            borderRadius: '50%', 
            overflow: 'hidden',
            border: '2px solid var(--accent)', 
            marginBottom: '2rem',
          }}>
            <Image className="small-image"
              src={profile.avatar} 
              alt={profile.name || "Profile Picture"} 
              width={150} 
              height={150} 
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}
        <h1 className="name" style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontFamily: 'var(--font-fredoka)' }}>
          <span>{profile?.name || "Mehedi"}</span>
        </h1>
        <p className="name" style={{ fontSize: '1.2rem', opacity: 0.7, marginTop: '-1rem' }}>
          <i className="fa-solid fa-layer-group"></i> -
          {profile?.title || "Full Stack Developer"}
        </p>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="pureglass">
        <h2>About Me</h2>
        <p>{profile?.bio || "Bio will appear here once updated in the admin panel."}</p>
      </section>

      {/* SKILLS SECTION - NOW A CLIENT COMPONENT */}
      <SkillsSection skills={skills} />

     <ProjectsSection projects={projects} />

      {/* CONTACT SECTION */}
      <section className="pureglass" id="contact" style={{ padding: '10px 1rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <ContactPage contacts={Contact} />
        </div>
      </section>
    </main>
  );
}