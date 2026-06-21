function useSketchStyle(id, css) {
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const el = document.createElement('style');
    el.id = id; el.textContent = css; document.head.appendChild(el);
  }
}

const CSS = `
.pd-divider{ display:flex; align-items:center; gap:var(--space-3); color:var(--text-muted);
  font-family:var(--font-marker); font-size:var(--fs-small); margin:var(--space-6) 0; }
.pd-divider__line{ flex:1; height:0; border:none; border-top:var(--border-dashed); }
.pd-divider--plain .pd-divider__line{ border-top:2px solid var(--stroke); }
.pd-divider--wavy .pd-divider__line{
  border:none; height:8px;
  background:
    radial-gradient(circle at 6px 8px, transparent 6px, var(--stroke) 6px 7.4px, transparent 7.4px) 0 -4px / 12px 12px repeat-x;
}
.pd-divider__label{ flex:none; }
.pd-divider__doodle{ flex:none; font-family:var(--font-accent); color:var(--ink-400); }
`;

/**
 * Divider — a dashed or wavy hand-drawn rule, optionally with a centered label.
 */
export function Divider({ label, variant = 'dashed', doodle, className = '', ...rest }) {
  useSketchStyle('pd-divider-css', CSS);
  return (
    <div className={`pd-divider pd-divider--${variant} ${className}`} role="separator" {...rest}>
      <hr className="pd-divider__line" />
      {label && <span className="pd-divider__label">{label}</span>}
      {doodle && <span className="pd-divider__doodle">{doodle}</span>}
      {(label || doodle) && <hr className="pd-divider__line" />}
    </div>
  );
}
