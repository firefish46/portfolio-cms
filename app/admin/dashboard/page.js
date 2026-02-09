'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch both concurrently for better performance
        const [resProj, resSkills] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/skills')
        ]);

        const projData = resProj.ok ? await resProj.json() : [];
        const skillsData = resSkills.ok ? await resSkills.json() : [];

        setStats({
          projects: Array.isArray(projData) ? projData.length : 0,
          skills: Array.isArray(skillsData) ? skillsData.length : 0
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '800', 
          background: 'linear-gradient(to right, var(--foreground), var(--accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          System Overview
        </h1>
        <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>
          Welcome back. Here is what is happening with your portfolio.
        </p>
      </header>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        
        {/* Project Card */}
        <StatCard 
          icon="📂" 
          title="Projects" 
          count={stats.projects} 
          desc="Live showcase items" 
          link="/admin/projects"
          btnText="Manage Portfolio"
        />

        {/* Skills Card */}
        <StatCard 
          icon="🛠️" 
          title="Technical Skills" 
          count={stats.skills} 
          desc="Technologies mastered" 
          link="/admin/skills"
          btnText="Update Stack"
        />

        {/* Theme Status Card */}
        <div className="glass" style={{ 
          padding: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          borderTop: '4px solid var(--accent)',
          transition: 'transform 0.3s ease'
        }}>
          <div>
            <span style={{ fontSize: '2.5rem' }}>🎨</span>
            <h2 style={{ fontSize: '1.5rem', margin: '1rem 0 0.5rem' }}>Theme Engine</h2>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1.5rem' }}>
              Global Accent: <code style={{
                background: 'rgba(var(--accent-rgb), 0.1)', 
                color: 'var(--accent)', 
                padding: '2px 6px', 
                borderRadius: '4px'
              }}>var(--accent)</code>
            </p>
          </div>
          <Link href="/admin/settings">
            <button className="modern-btn secondary">Edit Visual Identity</button>
          </Link>
        </div>
      </div>

      {/* Modern Tip Section */}
      <section className="glass" style={{ 
        padding: '1.5rem 2rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.5rem',
        background: 'linear-gradient(135deg, var(--glass-bg), rgba(var(--accent-rgb), 0.05))'
      }}>
        <div style={{ fontSize: '2rem' }}>💡</div>
        <div>
          <h4 style={{ marginBottom: '0.2rem' }}>Pro Tip</h4>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            Changes to the <b>Theme Engine</b> update CSS variables in real-time. Your portfolio&apos;s identity is fully dynamic.
          </p>
        </div>
      </section>

      
    </div>
  );
}

function StatCard({ icon, title, count, desc, link, btnText }) {
  return (
    <div className="glass" style={{ padding: '2rem', transition: 'transform 0.3s ease' }}>
      <span style={{ fontSize: '2.5rem' }}>{icon}</span>
      <h3 style={{ opacity: 0.7, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '1rem' }}>{title}</h3>
      <h2 style={{ fontSize: '3rem', margin: '0.5rem 0', fontWeight: '800' }}>{count}</h2>
      <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '1.5rem' }}>{desc}</p>
      <Link href={link}>
        <button className="modern-btn">{btnText}</button>
      </Link>
    </div>
  );
}