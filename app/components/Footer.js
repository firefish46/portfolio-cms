'use client';

import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import "./Footer.css";

export default function Footer() {
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
            <a href="www.linkedin.com/in/mehedi-hasan526" target="_blank" rel="noopener noreferrer">
              <Linkedin size={18} />
            </a>
            <a href="mailto:mehedi7hasan10134@gmail.com">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
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
          <Link href="/contact" className="footer-btn">
            Get In Touch
            <ArrowUpRight size={16} />
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Mehedi. All rights reserved.
        <span>Built with Next.js & MongoDB.</span>
      </div>
    </footer>
  );
}