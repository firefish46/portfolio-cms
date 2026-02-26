import { Suspense } from "react";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import Project from "@/models/Projects";
import Skill from "@/models/Skill";
import About from "@/models/about";

// Components
import HomeSection from "@/app/components/home";
import AboutSection from "./components/about";
import ProjectsSection from "@/app/components/ProjectsSection";
import SkillsSection from "@/app/components/SkillsSection";
import ContactPage from "./contact/page";

// 1. This tells Next.js to cache this page but refresh it in the background 
// every 15 minutes. This makes the page load INSTANTLY for users.
export const revalidate = 900; 

export default async function HomePage() {
  await connectDB();
  
  // 2. Fetch only the Profile data first (Top of the page)
  // This is the only "await" at the top level so the shell loads fast.
  const profileData = await Profile.findOne().lean();
  const profile = profileData ? JSON.parse(JSON.stringify(profileData)) : null;

  return (
    <main>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

      {/* ── HOME (Loads First) ── */}
      <HomeSection profile={profile} />

      {/* ── ABOUT (Streams in) ── */}
      <Suspense fallback={<SectionLoader />}>
        <AboutAsync profile={profile} />
      </Suspense>

      {/* ── SKILLS (Streams in) ── */}
      <Suspense fallback={<SectionLoader />}>
        <SkillsAsync />
      </Suspense>

      {/* ── PROJECTS (Streams in) ── */}
      <Suspense fallback={<SectionLoader />}>
        <ProjectsAsync />
      </Suspense>

      {/* ── CONTACT ── */}
      <section className="pureglass" id="contact" style={{ padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <ContactPage /> 
        </div>
      </section>
    </main>
  );
}

/* ── ASYNC DATA COMPONENTS ── */

async function AboutAsync({ profile }) {
  const aboutDataDoc = await About.findOne().lean();
  const aboutData = aboutDataDoc ? JSON.parse(JSON.stringify(aboutDataDoc)) : null;
  return <AboutSection profile={profile} aboutData={aboutData} />;
}

async function SkillsAsync() {
  const skillsData = await Skill.find().sort({ order: 1 }).lean();
  return <SkillsSection skills={JSON.parse(JSON.stringify(skillsData))} />;
}

async function ProjectsAsync() {
  const projectsData = await Project.find().sort({ order: 1 }).lean();
  return <ProjectsSection projects={JSON.parse(JSON.stringify(projectsData))} />;
}

/* ── UI HELPERS ── */

function SectionLoader() {
  return (
    <div style={{ 
      height: '300px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      opacity: 0.3
    }}>
      <div className="spinner"></div>
    </div>
  );
}