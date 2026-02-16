'use client';
import { X } from 'lucide-react';
import './skill.css'
// Icon mapping for common technologies
const getSkillIcon = (skillName) => {
  const name = skillName.toLowerCase();
  const iconMap = {
// Frontend
  'react': 'fa-brands fa-react',
  'vue': 'fa-brands fa-vuejs',
  'vue.js': 'fa-brands fa-vuejs',
  'angular': 'fa-brands fa-angular',
  'svelte': 'fa-brands fa-js',
  'html': 'fa-brands fa-html5',
  'html5': 'fa-brands fa-html5',
  'css': 'fa-brands fa-css3-alt',
  'css3': 'fa-brands fa-css3-alt',
  'javascript': 'fa-brands fa-js',
  'js': 'fa-brands fa-js',
  'typescript': 'fa-brands fa-js',
  'ts': 'fa-brands fa-js',
  'sass': 'fa-brands fa-sass',
  'scss': 'fa-brands fa-sass',
  'less': 'fa-brands fa-less',
  'bootstrap': 'fa-brands fa-bootstrap',
  'tailwind': 'fa-brands fa-css3-alt',
  'tailwindcss': 'fa-brands fa-css3-alt',
  'next.js': 'fa-brands fa-react',
  'nextjs': 'fa-brands fa-react',
  'gatsby': 'fa-brands fa-react',
  'redux': 'fa-brands fa-react',
  'webpack': 'fa-brands fa-js',
  'vite': 'fa-solid fa-bolt',
  
  // Backend
  'node': 'fa-brands fa-node',
  'node.js': 'fa-brands fa-node-js',
  'nodejs': 'fa-brands fa-node-js',
  'express': 'fa-brands fa-node',
  'express.js': 'fa-brands fa-node',
  'nestjs': 'fa-brands fa-node',
  'nest.js': 'fa-brands fa-node',
  'python': 'fa-brands fa-python',
  'django': 'fa-brands fa-python',
  'flask': 'fa-solid fa-pepper-hot',
  'fastapi': 'fa-brands fa-python',
  'java': 'fa-brands fa-java',
  'spring': 'fa-brands fa-java',
  'spring boot': 'fa-brands fa-java',
  'php': 'fa-brands fa-php',
  'laravel': 'fa-brands fa-laravel',
  'ruby': 'fa-solid fa-gem',
  'rails': 'fa-solid fa-gem',
  'ruby on rails': 'fa-solid fa-gem',
  'go': 'fa-brands fa-golang',
  'golang': 'fa-brands fa-golang',
  'rust': 'fa-brands fa-rust',
  'c#': 'fa-solid fa-code',
  'c++': 'fa-brands fa-cuttlefish',
  'csharp': 'fa-solid fa-code',
  '.net': 'fa-solid fa-code',
  'dotnet': 'fa-solid fa-code',
  
  // Databases
  'mongodb': 'fa-brands fa-envira',
  'mysql': 'fa-solid fa-database',
  'postgresql': 'fa-brands fa-postgresql',
  'postgres': 'fa-brands fa-postgresql',
  'redis': 'fa-solid fa-database',
  'sqlite': 'fa-solid fa-database',
  'oracle': 'fa-solid fa-database',
  'mariadb': 'fa-solid fa-database',
  'dynamodb': 'fa-brands fa-aws',
  'firebase': 'fa-solid fa-fire',
  'supabase': 'fa-solid fa-database',
  'cassandra': 'fa-solid fa-database',
  'elasticsearch': 'fa-solid fa-magnifying-glass',
  
  // Cloud & DevOps
  'aws': 'fa-brands fa-aws',
  'amazon web services': 'fa-brands fa-aws',
  'azure': 'fa-brands fa-microsoft',
  'gcp': 'fa-brands fa-google',
  'google cloud': 'fa-brands fa-google',
  'docker': 'fa-brands fa-docker',
  'kubernetes': 'fa-solid fa-dharmachakra',
  'k8s': 'fa-solid fa-dharmachakra',
  'jenkins': 'fa-brands fa-jenkins',
  'terraform': 'fa-solid fa-cube',
  'ansible': 'fa-solid fa-server',
  'gitlab': 'fa-brands fa-gitlab',
  'github': 'fa-brands fa-github',
  'bitbucket': 'fa-brands fa-bitbucket',
  'circleci': 'fa-solid fa-circle',
  
  // Tools & Others
  'git': 'fa-brands fa-git-alt',
  'npm': 'fa-brands fa-npm',
  'yarn': 'fa-brands fa-yarn',
  'figma': 'fa-brands fa-figma',
  'sketch': 'fa-brands fa-sketch',
  'photoshop': 'fa-solid fa-image',
  'illustrator': 'fa-solid fa-palette',
  'jira': 'fa-brands fa-jira',
  'confluence': 'fa-brands fa-confluence',
  'slack': 'fa-brands fa-slack',
  'trello': 'fa-brands fa-trello',
  'vscode': 'fa-solid fa-code',
  'visual studio code': 'fa-solid fa-code',
  'postman': 'fa-solid fa-paper-plane',
  'insomnia': 'fa-solid fa-moon',
  'linux': 'fa-brands fa-linux',
  'ubuntu': 'fa-brands fa-ubuntu',
  'windows': 'fa-brands fa-windows',
  'macos': 'fa-brands fa-apple',
  'android': 'fa-brands fa-android',
  'ios': 'fa-brands fa-apple',
  'swift': 'fa-brands fa-swift',
  'kotlin': 'fa-brands fa-android',
  'flutter': 'fa-solid fa-mobile-screen',
  'react native': 'fa-brands fa-react',
  'graphql': 'fa-solid fa-diagram-project',
  'rest': 'fa-solid fa-plug',
  'api': 'fa-solid fa-plug',
  'wordpress': 'fa-brands fa-wordpress',
  'shopify': 'fa-brands fa-shopify',
  'woocommerce': 'fa-brands fa-wordpress',
  };

  
  // Check for exact match
  if (iconMap[name]) {
    return `${iconMap[name]}`;
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