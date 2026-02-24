'use client';
import './page.css';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// ─── Image Processing Utilities ────────────────────────────────────────────────

const MAX_FILE_SIZE_MB = 5;
const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.8;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file) {
  if (!file.type.startsWith('image/')) {
    return `"${file.name}" is not an image. Videos and other files are not allowed.`;
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `"${file.name}" exceeds ${MAX_FILE_SIZE_MB} MB (${formatBytes(file.size)}). Please use a smaller image.`;
  }
  return null;
}

function processImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        const base64 = dataUrl.split(',')[1];
        const compressedSize = Math.round((base64.length * 3) / 4);

        resolve({ dataUrl, originalSize: file.size, compressedSize, name: file.name });
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

// ─── Toast Component ────────────────────────────────────────────────────────────

function Toast({ messages, onDismiss }) {
  if (!messages.length) return null;
  return (
    <div className="toast-container">
      {messages.map((msg, i) => (
        <div key={i} className="toast-item">
          <span className="toast-icon">⚠️</span>
          <span className="toast-text">{msg}</span>
          <button className="toast-dismiss" onClick={() => onDismiss(i)}>✕</button>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', link: '', category: '', role: '', tools: '', images: []
  });
  const [imagesMeta, setImagesMeta] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('/api/projects').then((res) => res.json()).then((data) => setProjects(data));
  }, []);

  const dismissError = (index) => setErrors(prev => prev.filter((_, i) => i !== index));

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newErrors = [];
    const validFiles = [];

    for (const file of files) {
      const err = validateFile(file);
      if (err) newErrors.push(err);
      else validFiles.push(file);
    }

    if (newErrors.length) setErrors(prev => [...prev, ...newErrors]);
    if (!validFiles.length) return;

    setProcessing(true);
    try {
      const results = await Promise.all(validFiles.map(processImage));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...results.map(r => r.dataUrl)] }));
      setImagesMeta(prev => [...prev, ...results.map(({ originalSize, compressedSize, name }) => ({ originalSize, compressedSize, name }))]);
    } catch (err) {
      setErrors(prev => [...prev, err.message]);
    } finally {
      setProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeSelectedImage = (indexToRemove) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== indexToRemove) }));
    setImagesMeta(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      tools: typeof formData.tools === 'string'
        ? formData.tools.split(',').map(t => t.trim())
        : formData.tools
    };

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData),
    });

    if (res.ok) {
      const newProject = await res.json();
      setProjects([...projects, newProject]);
      setFormData({ title: '', description: '', link: '', category: '', role: '', tools: '', images: [] });
      setImagesMeta([]);
    }
  };

  const confirmDelete = (project) => { setProjectToDelete(project); setShowDeleteModal(true); };

  const executeDelete = async () => {
    if (!projectToDelete) return;
    const idToRemove = projectToDelete._id;
    setShowDeleteModal(false);
    setProjects(projects.filter(p => p._id !== idToRemove));
    try {
      await fetch(`/api/projects?id=${idToRemove}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Background delete failed:', err);
    } finally {
      setProjectToDelete(null);
    }
  };

  return (
    <div className="admin-projects-wrapper">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />

      <Toast messages={errors} onDismiss={dismissError} />

      {/* ── Add Project Form ── */}
      <section className="childglass admin-section">
        <h2><i className="fa-solid fa-diagram-project"></i> Add New Project</h2>

        <form onSubmit={handleSubmit} className="project-form">
          <input
            type="text" placeholder="Project Title"
            value={formData.title} required
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            type="text" placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <input
            type="text" placeholder="My Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <input
            type="text" placeholder="Live Link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
          <input
            type="text" placeholder="Tools used (comma separated)"
            value={formData.tools}
            className="full-width"
            onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            className="full-width"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {/* ── Image Upload ── */}
          <div className="full-width">
            <span className="upload-label">
              Project Screenshots
              <span className="upload-constraints">
                Images only · Max {MAX_FILE_SIZE_MB} MB each · Auto-optimized to {MAX_DIMENSION}px
              </span>
            </span>

            <label
              className={`upload-zone${processing ? ' is-processing' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length) {
                  handleImageChange({ target: { files: e.dataTransfer.files } });
                }
              }}
            >
              <span className="upload-zone-icon">{processing ? '⚙️' : '📁'}</span>
              <span className="upload-zone-hint">
                {processing ? 'Processing images…' : 'Click to browse or drag & drop images here'}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={processing}
                style={{ display: 'none' }}
              />
            </label>

            {formData.images.length > 0 && (
              <div className="image-preview-grid">
                {formData.images.map((img, i) => {
                  const meta = imagesMeta[i];
                  const saved = meta ? Math.max(0, meta.originalSize - meta.compressedSize) : 0;
                  const pct = meta && meta.originalSize > 0
                    ? Math.round((saved / meta.originalSize) * 100)
                    : 0;
                  return (
                    <div key={i} className="image-preview-item">
                      <div className="image-preview-thumb">
                        <Image
                          src={img}
                          alt="preview"
                          width={100}
                          height={100}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <button
                          type="button"
                          className="image-remove-btn"
                          onClick={() => removeSelectedImage(i)}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                      {meta && (
                        <div className="image-meta">
                          <div className="image-meta-size">{formatBytes(meta.compressedSize)}</div>
                          {pct > 0 && <div className="image-meta-saved">−{pct}% saved</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button type="submit" id='project-submit-btn' className="modern-btn full-width" disabled={processing}>
            {processing ? 'Processing images…' : 'Save Project'}
          </button>
        </form>
      </section>

      {/* ── Existing Projects ── */}
      <section className="childglass admin-section">
        <h2>Existing Projects</h2>
        <div className="project-list">
          {projects.map((project) => (
            <div key={project._id} className="childglass project-list-item">
              <div className="project-list-item-info">
                <strong>{project.title}</strong>
                <p>Role: {project.role}</p>
              </div>
              <button className="delete-btn" onClick={() => confirmDelete(project)}>
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Delete Modal ── */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="childglass modal-card">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete <strong>{projectToDelete?.title}</strong>?</p>
            <div className="modal-actions">
              <button className="modal-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="modal-btn modal-btn-danger" onClick={executeDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}