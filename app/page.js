import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import Project from "@/models/Projects";
import Skill from "@/models/Skill";
import Contact from "@/models/contact";
import About from "@/models/about";
import ContactPage from "./contact/page";
import ProjectsSection from "@/app/components/ProjectsSection";
import SkillsSection from "@/app/components/SkillsSection";
import HomeSection from "@/app/components/home";
import AboutSection from "./components/about";

async function getData() {
  await connectDB();
  
  // Use findOne() for About unless you specifically have multiple About sections
  const [profileData, projectsData, skillsData, contactData, aboutDataDoc] = await Promise.all([
    Profile.findOne().lean(),
    Project.find().sort({ order: 1 }).lean(),
    Skill.find().sort({ order: 1 }).lean(),
    Contact.find().sort({ createdAt: -1 }).lean(),
    About.findOne().lean() // Changed .find() to .findOne()
  ]);

  const clean = (d) => (!d ? null : JSON.parse(JSON.stringify(d)));

  return {
    profile: clean(profileData),
    projects: clean(projectsData),
    skills: clean(skillsData),
    contacts: clean(contactData),
    aboutData: clean(aboutDataDoc) // Key name must match what you destructure below
  };
}

export default async function HomePage() {
  // Extract aboutData here!
  const { profile, projects, skills, aboutData } = await getData();

  return (
    <main>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

      {/* ── HOME ── */}
      <HomeSection profile={profile} />

      {/* ── ABOUT ── */}
      <AboutSection 
        profile={profile} 
        aboutData={aboutData} 
      />

      {/* ── SKILLS ── */}
      <SkillsSection skills={skills} />

      {/* ── PROJECTS ── */}
      <ProjectsSection projects={projects} />

      {/* ── CONTACT ── */}
      <section className="pureglass" id="contact" style={{ padding: "10px 1rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          {/* Note: Pass 'contacts' (plural from getData) not 'Contact' (the Model) */}
          <ContactPage contacts={projects} /> 
        </div>
      </section>
    </main>
  );
}