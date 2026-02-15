'use client';
import { X } from 'lucide-react';
import './skill.css'
// Icon mapping for common technologies
const getSkillIcon = (skillName) => {
  const name = skillName.toLowerCase();
  const iconMap = {
    // Frontend
    'react': 'fa-react',
    'vue': 'fa-vuejs',
    'angular': 'fa-angular',
    'javascript': 'fa-js',
    'typescript': 'fa-js', // or create custom
    'html': 'fa-html5',
    'css': 'fa-css3-alt',
    'sass': 'fa-sass',
    'tailwind': 'fa-css3-alt',
    
    // Backend
    'node': 'fa-node',
    'nodejs': 'fa-node-js',
    'python': 'fa-python',
    'php': 'fa-php',
    'java': 'fa-java',
    'laravel': 'fa-laravel',
    'django': 'fa-python',
    
    // Databases
    'mongodb': 'fa-database',
    'mysql': 'fa-database',
    'postgresql': 'fa-database',
    'redis': 'fa-database',
    
    // Tools
    'git': 'fa-git-alt',
    'github': 'fa-github',
    'docker': 'fa-docker',
    'aws': 'fa-aws',
    'linux': 'fa-linux',
    'ubuntu': 'fa-ubuntu',
    'figma': 'fa-figma',
    'npm': 'fa-npm',
    'yarn': 'fa-yarn',
    
    // Mobile
    'android': 'fa-android',
    'apple': 'fa-apple',
    'swift': 'fa-swift',
  };

  // Check for exact match
  if (iconMap[name]) {
    return `fa-brands ${iconMap[name]}`;
  }
  
  // Check for partial match
  for (const [key, value] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return `fa-brands ${value}`;
    }
  }
  
  // Default fallback
  return 'fa-solid fa-code';
};

export default function SkillsSection({ skills }) {
  return (
    <>
      <section id="skills" style={{ padding: '100px 2rem', position: 'relative', overflow: 'hidden' }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          pointerEvents: 'none'
        }}>
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '1rem', 
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
            fontFamily: 'var(--font-fredoka)',
            letterSpacing: '-2px',
            background: 'linear-gradient(135deg, var(--text) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            My Toolbox
          </h2>
          
          <p style={{
            textAlign: 'center',
            marginBottom: '4rem',
            opacity: 0.7,
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto 4rem'
          }}>
            Technologies and tools I use to bring ideas to life
          </p>

          <div style={{ 
            display: 'flex', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '2rem',
            flexWrap: 'wrap',
            
            alignContent: 'center',
            justifyContent: 'center', 
            perspective: '1000px'
          }}>
            {skills.map((skill, index) => (
              <div 
                key={skill._id} 
                className=" skill-card"
               
              >
                {/* Hover glow effect */}
                <div className="skill-glow"></div>

                {/* Animated icon container */}
                <div 
                  className="skill-icon"
                  style={{
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  {/* Icon background pulse */}
                  <div 
                    className="icon-pulse"
                    style={{
                      animationDelay: `${index * 0.3}s`
                    }}
                  ></div>
                  
                  {/* Icon with proper mapping */}
                  <i className={getSkillIcon(skill.name)}></i>
                </div>

                {/* Skill name */}
                <span className="skill-name">
                  {skill.name}
                </span>

                {/* Animated dots 
                <div className="dot-container">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                   <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                indicator */}
              </div>
            ))}
          </div>
        </div>
      </section>

  
    </>
  );
}