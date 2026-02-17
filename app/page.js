import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import Project from "@/models/Projects";
import Skill from "@/models/Skill";
import Contact from "@/models/contact";
import ContactPage from "./contact/page";
import ProjectsSection from "@/app/components/ProjectsSection";
import SkillsSection from "@/app/components/SkillsSection";
import HomeSection from "@/app/components/home"; // ← NEW
import AboutSection from "./components/about";


async function getData() {
  await connectDB();
  const [profileData, projectsData, skillsData, contactData] = await Promise.all([
    Profile.findOne().lean(),
    Project.find().sort({ order: 1 }).lean(),
    Skill.find().sort({ order: 1 }).lean(),
    Contact.find().sort({ createdAt: -1 }).lean()
  ]);
  const clean = (d) => (!d ? null : JSON.parse(JSON.stringify(d)));
  return {
    profile:  clean(profileData),
    projects: clean(projectsData),
    skills:   clean(skillsData),
    contacts: clean(contactData)
  };
}

export default async function HomePage() {
  const { profile, projects, skills } = await getData();

  return (
    <main >
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

      {/* ── HOME ── */}
      <HomeSection profile={profile} />

      {/* ── ABOUT ── */}
      
      <AboutSection  profile={profile}/>
      {/* ── SKILLS ── */}
      <SkillsSection skills={skills} />

      {/* ── PROJECTS ── */}
      <ProjectsSection projects={projects} />

      {/* ── CONTACT ── */}
      <section className="pureglass" id="contact" style={{ padding: "10px 1rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <ContactPage contacts={Contact} />
        </div>
      </section>
    </main>
  );
}