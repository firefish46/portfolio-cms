import Link from "next/link";
import { WORK_CATEGORIES } from "@/lib/workCategories";
import { getWorks, countByCategory } from "@/lib/works";
import { CATEGORY_ICONS } from "@/app/components/WorkIcons";
import "./works.css";

export const revalidate = 3600;

export const metadata = {
  title: "Work | Mehedi Hasan",
  description: "Graphic design, websites, mobile apps and other work.",
};

export default async function WorksPage() {
  const counts = countByCategory(await getWorks());

  return (
    <div className="wk-page">
      <header className="wk-header">
        <p className="wk-eyebrow">Portfolio</p>
        <h1 className="display-title wk-title">Selected work</h1>
        <p className="wk-lead">Pick a category to see the projects in it.</p>
      </header>

      <ul className="wk-tiles">
        {WORK_CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c.slug];
          const n = counts[c.slug];
          return (
            <li key={c.slug}>
              <Link href={`/works/${c.slug}`} className="wk-tile">
                <span className="wk-tile-icon">
                  <Icon />
                </span>
                <span className="wk-tile-body">
                  <span className="wk-tile-label">{c.label}</span>
                  <span className="wk-tile-blurb">{c.blurb}</span>
                </span>
                <span className="wk-tile-foot">
                  <span className="wk-tile-count">
                    {n} project{n === 1 ? "" : "s"}
                  </span>
                  <span className="wk-tile-arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
