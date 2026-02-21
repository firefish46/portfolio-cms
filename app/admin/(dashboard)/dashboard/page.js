'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Radius } from 'lucide-react';


export default function Dashboard() {
  // Added 'messages' to state
  const [stats, setStats] = useState({ projects: 0, skills: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all three concurrently for maximum speed
        const [resProj, resSkills, resMsgs] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/skills'),
          fetch('/api/contact') // Added this fetch
        ]);

        const projData = resProj.ok ? await resProj.json() : [];
        const skillsData = resSkills.ok ? await resSkills.json() : [];
        const msgsData = resMsgs.ok ? await resMsgs.json() : [];

        setStats({
          projects: Array.isArray(projData) ? projData.length : 0,
          skills: Array.isArray(skillsData) ? skillsData.length : 0,
          messages: Array.isArray(msgsData) ? msgsData.length : 0
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
      <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
/>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '800', 
          background: 'linear-gradient(to right, var(--foreground), var(--accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-fredoka)'
        }}>
          System Overview
        </h1>
        <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>
          Welcome back. Your portfolio is currently performing as follows:
        </p>
      </header>

      {/* Stats Grid */}
      <div className='homepage' style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        
        <StatCard 
          icon={<i className="fa-solid fa-code-branch"></i>}
          title="Projects" 
          count={stats.projects}  
          desc="Live showcase items" 
          link="/admin/projects"
          btnText="Manage Portfolio"
        />

        <StatCard 
         icon={<i className="fa-regular fa-file-code"></i>}

          title="Technical Skills" 
          count={stats.skills} 
          desc="Technologies in your stack" 
          link="/admin/skills"
          btnText="Update Stack"
        />

        {/* New Messages Card */}
        <StatCard 
          icon={<i className="fa-solid fa-envelope-circle-check"></i>} 
          title="Client Inquiries" 
          count={stats.messages} 
          desc="New leads from contact form" 
          link="/admin/messages"
          btnText="View Inbox"
          highlight={true} // Visual cue for new messages
        />

        {/* Theme Status Card */}
        <div className="glass-items" style={{ 
          padding: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          borderTop: '4px solid var(--accent)'
          ,background: 'var(--light-gray)',
          borderRadius: '8px'
        }}>
          <div style={{ flexWrap: 'wrap', border: '1px solid rgba(var(--accent-rgb), 0.2) ', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}><i className="fa-solid fa-brush"></i></span>
            <h2 style={{ fontSize: '1.5rem', margin: '1rem 0 0.5rem' }}>Theme Engine</h2>
            <p style={{ fontSize: '0.9rem', opacity: 0.7,  }}>
              Global Accent: <code style={{

                background: 'rgba(var(--accent-rgb), 0.1)', 
                color: 'var(--accent)', 
                padding: '2px 6px', 
                borderRadius: '4px'
              }}>var(--accent)</code>
            </p>
          </div>
          <Link href="/admin/settings">
            <button className="modern-btn secondary">Visual Identity</button>
          </Link>
        </div>
      </div>

      <section className="glass" style={{ 
        padding: '1.5rem 2rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.5rem',
        border: '1px solid rgba(var(--accent-rgb), 0.2)',
        background: 'linear-gradient(135deg, var(--glass-bg), rgba(var(--accent-rgb), 0.05))'
      }}>
        <div style={{ fontSize: '2rem' }}>💡</div>
        <div>
          <h4 style={{ marginBottom: '0.2rem' }}>Portfolio Insight</h4>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            Remember to check your <b>Client Inquiries</b> daily. Responding to leads within 24 hours increases conversion by 70%.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, title, count, desc, link, btnText, highlight }) {
  return (
    <div className="glass" style={{ 
      padding: '2rem', 
      transition: 'transform 0.3s ease',
      border: highlight ? '1px solid var(--accent)' : '1px solid transparent'
    }}>
      <div className='techspans' style={{ fontSize: '2.5rem' }}>
      <span style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>{icon}</span>
      <h3 style={{ opacity: 0.7, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '1rem' }}>{title}</h3>
     </div>
     <div className='techspans'>
      <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0', fontWeight: '800' }}>{count}</h2>
      <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '0rem', display:'flex',flexWrap:'wrap', alignItems:'center' }}>{desc}</p>
      </div>
      <Link href={link}>
      
        <button  style={{width:'6rem', height:'4rem'}} className={`modern-btn ${highlight ? '' : 'secondary'}`}>{btnText}</button>
      </Link>
    </div>
  );
}