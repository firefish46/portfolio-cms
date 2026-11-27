import { unstable_cache } from "next/cache";
import { TAGS, CONTENT_TTL } from "@/lib/cache";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import Project from "@/models/Projects";
import Skill from "@/models/Skill";
import About from "@/models/about";
import Experience from "@/models/Experience";

// Components
import HomeSection from "@/app/components/home";
import AboutSection from "./components/about";
import ProjectsSection from "@/app/components/ProjectsSection";
import SkillsSection from "@/app/components/SkillsSection";
import ExperienceSection from "@/app/components/ExperienceSection";
import ContactPage from "./contact/page";


// Cached for an hour; admin saves clear the "content" tag immediately.
export const revalidate = 3600;

// ── Cached, parallel data fetcher ──────────────────────────────────────────
const getPageData = unstable_cache(
  async () => {
    await connectDB();

    const [profileData, aboutDataDoc, skillsData, projectsData, experienceData] = await Promise.all([
  Profile.findOne().lean(),
  About.findOne().lean(),
  Skill.find().sort({ order: 1 }).lean(),
  Project.find().sort({ order: 1 }).lean(),
  Experience.find().sort({ current: -1, startDate: -1 }).lean(),
]);
    // Serialize once here, not in the component
    const serialize = (doc) => (doc ? JSON.parse(JSON.stringify(doc)) : null);

    return {
      profile:  serialize(profileData),
      aboutData: serialize(aboutDataDoc),
      skills:   serialize(skillsData) ?? [],
      projects: serialize(projectsData) ?? [],
      experience: serialize(experienceData) ?? [],
    };
  },
  ["home-page-data"],
  { revalidate: CONTENT_TTL, tags: [TAGS.content] }
);

// ── Page ───────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const { profile, aboutData, skills, projects, experience } = await getPageData();

  return (
    <main>
      {/* ── HOME ── */}
      <HomeSection profile={profile} />

      {/* ── ABOUT ── */}
      <AboutSection profile={profile} aboutData={aboutData} />

      {/* ── EXPERIENCE ── */}
      <ExperienceSection experience={experience} />

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