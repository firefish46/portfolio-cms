'use client';

import { handleContact } from "../actions";
import './contact.css';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" className="contact-submit-btn" disabled={pending}>
      <span className="btn-text">{pending ? 'Sending...' : 'Send Message'}</span>
      <span className="btn-icon">→</span>
    </button>
  );
}

export default function ContactPage() {
  const [showNotification, setShowNotification] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  async function handleSubmit(formData) {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };
    
    setSubmittedData(data);
    
    try {
      // Call the server action
      await handleContact(formData);
      
      // Show notification
      setShowNotification(true);
      
      // Hide after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 500000000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <>
      {/* Animated mesh gradient background */}
      <div className="mesh-background"></div>
      
      <div className="contact-page-wrapper">
        <div className="contact-header">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            Have a project in mind? Let&apos;s build something great together.
          </p>
        </div>

             <form action={handleSubmit} className="contact-form glass">
          <div className="form-group">
            <input 
              id="name"
              name="name" 
              type="text" 
              required 
              className="form-input"
              placeholder=" "
            />
            <label htmlFor="name" className="form-label">
              <span className="label-icon">👤</span>
              Your Name
            </label>
          </div>
          
          <div className="form-group">
            <input 
              id="email"
              name="email" 
              type="email" 
              required 
              className="form-input"
              placeholder=" "
            />
            <label htmlFor="email" className="form-label">
              <span className="label-icon">✉️</span>
              Email Address
            </label>
          </div>

          <div className="form-group">
            <textarea 
              id="message"
              name="message" 
              rows="6" 
              required 
              className="form-textarea"
              placeholder=" "
            ></textarea>
            <label htmlFor="message" className="form-label">
              <span className="label-icon">💬</span>
              Message
            </label>
          </div>

          <SubmitButton />
        </form>

        {/* Success notification will be rendered here */}
      </div>

      {/* Floating success notification */}
      {showNotification && submittedData && (
        <div className="success-notification">
          <div className="notification-header">
            <div className="notification-icon">✓</div>
            <div>
              <h3>Message Sent Successfully!</h3>
              <p className="notification-meta">From: {submittedData.name}</p>
            </div>
            <button 
              className="notification-close"
              onClick={() => setShowNotification(false)}
            >
              ×
            </button>
          </div>
          <div className="notification-body">
            <p className="notification-email">{submittedData.email}</p>
            <p className="notification-message">&quot;{submittedData.message}&quot;</p>
          </div>
        </div>
      )}
    </>
  );
}