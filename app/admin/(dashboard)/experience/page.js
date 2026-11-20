'use client';
import { useState, useEffect } from 'react';
import './admin-experience.css';
import {
  monthsBetween,
  formatDuration,
  formatMonth,
  effectiveEnd,
  totalExperience,
  sortExperience,
} from '@/lib/experience';

const EMPTY = {
  role: '',
  company: '',
  companyUrl: '',
  employmentType: 'Full-time',
  location: '',
  start: '',      // "YYYY-MM" (from <input type="month">)
  end: '',
  current: false,
  description: '',
  tools: '',
};

const TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote'];

// "2022-03" <-> Date (first of month, UTC)
const monthToDate = (m) => (m ? `${m}-01T00:00:00.000Z` : null);
const dateToMonth = (d) => (d ? new Date(d).toISOString().slice(0, 7) : '');

export default function AdminExperience() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/experience')
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load experience'));
  }, []);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
    setError('');
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setError('');
    setForm({
      role: item.role || '',
      company: item.company || '',
      companyUrl: item.companyUrl || '',
      employmentType: item.employmentType || 'Full-time',
      location: item.location || '',
      start: dateToMonth(item.startDate),
      end: dateToMonth(item.endDate),
      current: !!item.current,
      description: item.description || '',
      tools: (item.tools || []).join(', '),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.current && !form.end) {
      setError('Add an end date, or tick "I currently work here".');
      return;
    }
    if (!form.current && form.end < form.start) {
      setError("End date can't be before the start date.");
      return;
    }

    const payload = {
      role: form.role,
      company: form.company,
      companyUrl: form.companyUrl,
      employmentType: form.employmentType,
      location: form.location,
      startDate: monthToDate(form.start),
      endDate: form.current ? null : monthToDate(form.end),
      current: form.current,
      description: form.description,
      tools: form.tools,
      ...(editingId && { id: editingId }),
    };

    setSaving(true);
    try {
      const res = await fetch('/api/experience', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setItems((prev) =>
        editingId ? prev.map((i) => (i._id === editingId ? data : i)) : [data, ...prev]
      );
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    const id = deletingId;
    setDeletingId(null);
    const previous = items;
    setItems((prev) => prev.filter((i) => i._id !== id));
    if (editingId === id) resetForm();

    const res = await fetch(`/api/experience?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setItems(previous);
      setError('Server failed to delete.');
    }
  };

  const sorted = sortExperience(items);
  const total = totalExperience(items);

  // Live preview of this entry's duration
  const previewMonths = form.start
    ? monthsBetween(monthToDate(form.start), form.current ? new Date() : monthToDate(form.end) || new Date())
    : 0;

  return (
    <div className="axp-layout">
      {/* FORM */}
      <section className="axp-panel axp-form-panel">
        <h2>{editingId ? '✏️ Edit Experience' : '💼 Add Experience'}</h2>

        <form onSubmit={handleSubmit} className="axp-form">
          <div className="axp-row">
            <label className="axp-field">
              <span>Job title *</span>
              <input value={form.role} onChange={set('role')} placeholder="Frontend Developer" required />
            </label>
            <label className="axp-field">
              <span>Company *</span>
              <input value={form.company} onChange={set('company')} placeholder="Acme Inc." required />
            </label>
          </div>

          <div className="axp-row">
            <label className="axp-field">
              <span>Employment type</span>
              <select value={form.employmentType} onChange={set('employmentType')}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="axp-field">
              <span>Location</span>
              <input value={form.location} onChange={set('location')} placeholder="Dhaka · Remote" />
            </label>
          </div>

          <div className="axp-row">
            <label className="axp-field">
              <span>Start date *</span>
              <input type="month" value={form.start} onChange={set('start')} required />
            </label>
            <label className="axp-field">
              <span>End date</span>
              <input
                type="month"
                value={form.current ? '' : form.end}
                onChange={set('end')}
                disabled={form.current}
                min={form.start || undefined}
              />
            </label>
          </div>

          <label className="axp-check">
            <input type="checkbox" checked={form.current} onChange={set('current')} />
            I currently work here
          </label>

          {form.start && (
            <p className="axp-preview">
              Duration: <b>{formatDuration(previewMonths)}</b>
              {form.current && ' (keeps counting automatically)'}
            </p>
          )}

          <label className="axp-field">
            <span>Company website</span>
            <input type="url" value={form.companyUrl} onChange={set('companyUrl')} placeholder="https://..." />
          </label>

          <label className="axp-field">
            <span>Description</span>
            <textarea
              rows={5}
              value={form.description}
              onChange={set('description')}
              placeholder="What you built, owned, or improved…"
            />
          </label>

          <label className="axp-field">
            <span>Tech used (comma separated)</span>
            <input value={form.tools} onChange={set('tools')} placeholder="React, Next.js, MongoDB" />
          </label>

          {error && <p className="axp-error">{error}</p>}

          <div className="axp-actions">
            {editingId && (
              <button type="button" className="modern-btn secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
            <button type="submit" className="modern-btn" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add experience'}
            </button>
          </div>
        </form>
      </section>

      {/* LIST */}
      <section className="axp-panel">
        <div className="axp-summary">
          <div>
            <span className="axp-summary-value">
              {total.years} yr{total.years === 1 ? '' : 's'} {total.months} mo{total.months === 1 ? '' : 's'}
            </span>
            <span className="axp-summary-label">
              Total experience{total.since && ` · since ${formatMonth(total.since)}`}
            </span>
          </div>
          <span className="axp-summary-count">{items.length} entries</span>
        </div>

        <div className="axp-list">
          {sorted.map((item) => {
            const isCurrent = item.current || !item.endDate;
            return (
              <div key={item._id} className={`axp-item ${editingId === item._id ? 'axp-item-active' : ''}`}>
                <div className="axp-item-info">
                  <b>{item.role}</b>
                  <span>{item.company}{item.employmentType && ` · ${item.employmentType}`}</span>
                  <small>
                    {formatMonth(item.startDate)} – {isCurrent ? 'Present' : formatMonth(item.endDate)}
                    {' · '}
                    {formatDuration(monthsBetween(item.startDate, effectiveEnd(item)))}
                  </small>
                </div>
                <div className="axp-item-actions">
                  <button onClick={() => startEdit(item)} aria-label="Edit">
                    <i className="fa-solid fa-pen" />
                  </button>
                  <button onClick={() => setDeletingId(item._id)} aria-label="Delete" className="axp-danger">
                    <i className="fa-solid fa-trash-can" />
                  </button>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <p className="axp-empty">No experience yet. Add your first job on the left.</p>
          )}
        </div>
      </section>

      {deletingId && (
        <div className="axp-modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="axp-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this experience?</h3>
            <p>It will be removed from your portfolio.</p>
            <div className="axp-actions">
              <button className="modern-btn secondary" onClick={() => setDeletingId(null)}>Keep it</button>
              <button className="modern-btn axp-delete-btn" onClick={executeDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
