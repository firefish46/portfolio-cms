import { unstable_cache } from "next/cache";
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


export const revalidate = 60;

// ── Cached, parallel data fetcher ──────────────────────────────────────────
const getPageData = unstable_cache(
  async () => {
    await connectDB();

 const [profileData, aboutDataDoc, skillsData, projectsData] = await Promise.all([
  Profile.findOne().lean(),
  About.findOne().lean(),
  Skill.find().sort({ order: 1 }).lean(),
  Project.find().sort({ order: 1 }).lean(),
]);
    // Serialize once here, not in the component
    const serialize = (doc) => (doc ? JSON.parse(JSON.stringify(doc)) : null);

    return {
      profile:  serialize(profileData),
      aboutData: serialize(aboutDataDoc),
      skills:   serialize(skillsData) ?? [],
      projects: serialize(projectsData) ?? [],
    };
  },
  ["home-page-data"],
  { revalidate: 60 }
);

// ── Page ───────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const { profile, aboutData, skills, projects } = await getPageData();

  return (
    <main>
      {/* ── HOME ── */}
      <HomeSection profile={profile} />

      {/* ── ABOUT ── */}
      <AboutSection profile={profile} aboutData={aboutData} />

      {/* ── SKILLS ── */}
      <SkillsSection skills={skills} />

      {/* ── PROJECTS ── */}
      <ProjectsSection projects={projects} />

      {/* ── CONTACT ── */}
      <section className="pureglass" id="contact" style={{ padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <ContactPage />
        </div>
      </section>
    </main>
  );
}