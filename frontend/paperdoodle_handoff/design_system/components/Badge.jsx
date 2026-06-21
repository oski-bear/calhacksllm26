function useSketchStyle(id, css) {
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const el = document.createElement('style');
    el.id = id; el.textContent = css; document.head.appendChild(el);
  }
}

const CSS = `
.pd-badge{
  display:inline-flex; align-items:center; gap:var(--space-1);
  font-family:var(--font-marker); font-size:var(--fs-caption); letter-spacing:var(--ls-wide);
  line-height:1; padding:5px 12px;
  border:var(--border-ink-thin);
  border-radius:var(--radius-pill);
  background:var(--surface-card); color:var(--text-heading);
  transform:rotate(var(--tilt-2));
}
.pd-badge--blue{ background:var(--accent-soft); color:var(--accent-ink); border-color:var(--accent-ink); }
.pd-badge--lav{ background:var(--lavender-100); color:var(--accent-2-ink); border-color:var(--accent-2-ink); }
.pd-badge--red{ background:var(--danger-soft); color:var(--danger); border-color:var(--danger); }
.pd-badge--mint{ background:var(--hi-mint); color:#2c5a32; border-color:#2c5a32; }
.pd-badge--yellow{ background:var(--hi-yellow); color:var(--ink-900); border-color:var(--ink-800); }
.pd-badge--solid{ background:var(--ink-800); color:var(--paper-50); border-color:var(--ink-900); }
`;

/**
 * Badge — a small hand-drawn pill for tags, statuses and labels.
 */
export function Badge({ tone = 'default', className = '', children, ...rest }) {
  useSketchStyle('pd-badge-css', CSS);
  const map = { default:'', blue:'pd-badge--blue', lavender:'pd-badge--lav',
    red:'pd-badge--red', mint:'pd-badge--mint', yellow:'pd-badge--yellow', solid:'pd-badge--solid' };
  return (
    <span className={`pd-badge ${map[tone] || ''} ${className}`} {...rest}>{children}</span>
  );
}
