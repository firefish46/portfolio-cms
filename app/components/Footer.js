'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  // Initialize with the current year directly
  const [year] = useState(new Date().getFullYear().toString());

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-section">
          <h2 className="footer-logo">Mehedi</h2>
          <p className="footer-description">
            Building scalable web applications with modern technologies.
            Focused on performance, clean architecture, and real-world impact.
          </p>

          <div className="footer-socials">
            <a href="https://github.com/firefish46" target="_blank" rel="noopener noreferrer">
              <Github size={18} />
            </a>
            {/* Added https:// to fix the broken LinkedIn link */}
            <a href="https://www.linkedin.com/in/mehedi-hasan526" target="_blank" rel="noopener noreferrer">
              <Linkedin size={18} />
            </a>
            <a href="mailto:mehedi7hasan10134@gmail.com">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Navigation - Make sure these match your app folder structure */}
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul>
            <li><Link href="#home">Home</Link></li>
            <li><Link href="#work">Projects</Link></li>
            {/* If your about page is public, use /about. If it's admin-only, use /admin/about */}
            <li><Link href="#about">About</Link></li>
            <li><Link href="#message">Contact</Link></li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="footer-section">
          <h3>Tech Stack</h3>
          <ul>
            <li>Next.js</li>
            <li>React</li>
            <li>MongoDB</li>
            <li>Node.js</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="footer-section">
          <h3>Let’s Work</h3>
          <p className="footer-cta-text">
            Open to internships, collaborations, and challenging projects.
          </p>
          <Link href="#message" className="footer-btn">
            Get In Touch
            <ArrowUpRight size={16} />
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        {/* We use a fallback "2026" or similar if year isn't set yet to avoid jumping text */}
        © {year || "2026"} Mehedi. All rights reserved.
        <span>Built with Next.js & MongoDB.</span>
      </div>
    </footer>
  );
}