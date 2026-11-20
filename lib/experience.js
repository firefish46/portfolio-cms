// Shared date helpers for the Experience section (used on server and in admin).
// All math is done in UTC on whole months, so results don't shift with time zones.

function toMonthIndex(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.getUTCFullYear() * 12 + d.getUTCMonth();
}

/** Months worked, counting both the start and end month (Jan–Mar = 3). */
export function monthsBetween(start, end = new Date()) {
  const a = toMonthIndex(start);
  const b = toMonthIndex(end ?? new Date());
  if (a === null || b === null || b < a) return 0;
  return b - a + 1;
}

/** "2 yrs 3 mos", "8 mos", "1 yr" */
export function formatDuration(months) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (m || !y) parts.push(`${m} mo${m === 1 ? "" : "s"}`);
  return parts.join(" ");
}

/** "Mar 2022" */
export function formatMonth(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** End date to use for a job: today if it's current or has no end date. */
export function effectiveEnd(job) {
  return job.current || !job.endDate ? new Date() : job.endDate;
}

/**
 * Total experience, counted from the earliest start date up to today.
 * Returns { years, months, totalMonths, since }.
 */
export function totalExperience(jobs = [], now = new Date()) {
  const starts = jobs
    .map((j) => toMonthIndex(j.startDate))
    .filter((v) => v !== null);
  if (!starts.length) return { years: 0, months: 0, totalMonths: 0, since: null };

  const earliest = Math.min(...starts);
  // Same inclusive counting as each job's duration, so a single current job matches the total
  const totalMonths = Math.max(0, toMonthIndex(now) - earliest + 1);
  const since = new Date(Date.UTC(Math.floor(earliest / 12), earliest % 12, 1));
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    totalMonths,
    since,
  };
}

/** Newest first: current jobs on top, then by start date descending. */
export function sortExperience(jobs = []) {
  return [...jobs].sort((a, b) => {
    if (!!b.current !== !!a.current) return b.current ? 1 : -1;
    return new Date(b.startDate) - new Date(a.startDate);
  });
}
