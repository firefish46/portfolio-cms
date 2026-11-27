import Link from "next/link";
import { notFound } from "next/navigation";
import { WORK_CATEGORIES, getCategory } from "@/lib/workCategories";
import { getWorks } from "@/lib/works";
import { CATEGORY_ICONS } from "@/app/components/WorkIcons";
import ProjectGallery from "@/app/components/ProjectGallery";
import "../works.css";

export const revalidate = 60;

export function generateStaticParams() {
  return WORK_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const c = getCategory(category);
  return c ? { title: `${c.label} | Mehedi Hasan`, description: c.blurb } : {};
}

export default async function WorkCategoryPage({ params }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const works = (await getWorks()).filter((w) => w.workCategory === cat.slug);
  const Icon = CATEGORY_ICONS[cat.slug];

  return (
    <div className="wk-page">
      <Link href="/works" className="wk-back">← All work</Link>

      <header className="wk-header wk-header-row">
        <span className="wk-tile-icon wk-tile-icon-lg">
          <Icon />
        </span>
        <div>
          <h1 className="display-title wk-title">{cat.label}</h1>
          <p className="wk-lead">{cat.blurb}</p>
        </div>
      </header>

      {/* Quick switch between categories */}
      <nav className="wk-switch" aria-label="Categories">
        {WORK_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/works/${c.slug}`}
            className={`wk-chip ${c.slug === cat.slug ? "wk-chip-active" : ""}`}
            aria-current={c.slug === cat.slug ? "page" : undefined}
          >
            {c.label}
          </Link>
        ))}
      </nav>

      {works.length === 0 ? (
        <div className="wk-empty">
          <p>No {cat.label.toLowerCase()} projects yet.</p>
          <Link href="/works" className="wk-back">Browse other categories</Link>
        </div>
      ) : (
        <ul className="wk-grid">
          {works.map((p) => (
            <li key={p._id} className="wk-card">
              <ProjectGallery images={p.images} title={p.title} />
              <div className="wk-card-body">
                <div className="wk-card-top">
                  <div>
                    {p.category && <span className="wk-card-cat">{p.category}</span>}
                    <h2 className="wk-card-title">{p.title}</h2>
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="modern-btn wk-card-link">
                      View
                    </a>
                  )}
                </div>
                {p.role && <p className="wk-card-role">{p.role}</p>}
                {p.description && <p className="wk-card-desc">{p.description}</p>}
                {p.tools?.length > 0 && (
                  <ul className="wk-card-tools">
                    {p.tools.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
