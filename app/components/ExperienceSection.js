import "./experience.css";
import {
  monthsBetween,
  formatDuration,
  formatMonth,
  effectiveEnd,
  totalExperience,
  sortExperience,
} from "@/lib/experience";

export default function ExperienceSection({ experience = [] }) {
  if (!experience.length) return null;

  const jobs = sortExperience(experience);
  const total = totalExperience(jobs);
  const companies = new Set(jobs.map((j) => j.company?.trim().toLowerCase())).size;

  // "4+" once past a year, otherwise show months
  const headline = total.years >= 1 ? `${total.years}+` : `${total.months}`;
  const headlineLabel =
    total.years >= 1
      ? `Year${total.years > 1 ? "s" : ""} of experience`
      : `Month${total.months === 1 ? "" : "s"} of experience`;

  return (
    <section id="experience" className="xp-section">
      <div className="xp-container">
        <header className="xp-header">
          <div className="xp-label">
            <span className="xp-label-line" />
            <span className="xp-label-text">Career</span>
          </div>
          <h2 className="xp-heading">
            Work <span className="xp-accent">Experience</span>
          </h2>
        </header>

        <div className="xp-stats">
          <div className="xp-stat xp-stat-main">
            <span className="xp-stat-value">{headline}</span>
            <span className="xp-stat-label">{headlineLabel}</span>
            {total.since && (
              <span className="xp-stat-sub">Since {formatMonth(total.since)}</span>
            )}
          </div>
          <div className="xp-stat">
            <span className="xp-stat-value">{jobs.length}</span>
            <span className="xp-stat-label">Role{jobs.length === 1 ? "" : "s"}</span>
          </div>
          <div className="xp-stat">
            <span className="xp-stat-value">{companies}</span>
            <span className="xp-stat-label">Compan{companies === 1 ? "y" : "ies"}</span>
          </div>
        </div>

        <ol className="xp-timeline">
          {jobs.map((job) => {
            const end = effectiveEnd(job);
            const isCurrent = job.current || !job.endDate;
            const duration = formatDuration(monthsBetween(job.startDate, end));

            return (
              <li key={job._id} className={`xp-item ${isCurrent ? "xp-item-current" : ""}`}>
                <span className="xp-dot" aria-hidden="true" />

                <article className="xp-card">
                  <div className="xp-card-top">
                    <div>
                      <h3 className="xp-role">{job.role}</h3>
                      <p className="xp-company">
                        {job.companyUrl ? (
                          <a href={job.companyUrl} target="_blank" rel="noopener noreferrer">
                            {job.company}
                          </a>
                        ) : (
                          job.company
                        )}
                        {job.employmentType && (
                          <span className="xp-type"> · {job.employmentType}</span>
                        )}
                      </p>
                    </div>
                    {isCurrent && <span className="xp-badge">Current</span>}
                  </div>

                  <p className="xp-meta">
                    <i className="fa-regular fa-calendar" aria-hidden="true" />
                    <time dateTime={new Date(job.startDate).toISOString()}>
                      {formatMonth(job.startDate)}
                    </time>
                    {" – "}
                    {isCurrent ? "Present" : formatMonth(job.endDate)}
                    <span className="xp-duration">{duration}</span>
                    {job.location && (
                      <span className="xp-location">
                        <i className="fa-solid fa-location-dot" aria-hidden="true" />
                        {job.location}
                      </span>
                    )}
                  </p>

                  {job.description && <p className="xp-desc">{job.description}</p>}

                  {job.tools?.length > 0 && (
                    <ul className="xp-tools">
                      {job.tools.map((t) => (
                        <li key={t} className="xp-tool">{t}</li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
