/* Injects a component's CSS once per document. */
function useSketchStyle(id, css) {
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const el = document.createElement('style');
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }
}

const CSS = `
.pd-btn{
  font-family:var(--font-marker);
  font-size:var(--fs-small);
  letter-spacing:var(--ls-wide);
  line-height:1;
  display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);
  cursor:pointer;
  border:var(--border-ink);
  border-radius:var(--radius-sketch-1);
  background:var(--surface-card);
  color:var(--text-heading);
  padding:0 var(--space-5);
  height:var(--control-md);
  box-shadow:var(--shadow-paper);
  transform:rotate(var(--tilt-2));
  transition:transform var(--dur-fast) var(--ease-doodle),
             box-shadow var(--dur-fast) var(--ease-out),
             background var(--dur-fast) var(--ease-out);
  -webkit-tap-highlight-color:transparent;
}
.pd-btn:hover{ transform:rotate(0deg) translate(-1px,-1px); box-shadow:var(--shadow-lift); }
.pd-btn:active{ transform:translate(1px,2px) rotate(0deg); box-shadow:1px 1px 0 rgba(34,31,26,.2); }
.pd-btn:focus-visible{ outline:none; box-shadow:var(--shadow-lift), var(--focus-ring); }
.pd-btn[disabled]{ cursor:not-allowed; opacity:.5; box-shadow:none; transform:none; }

.pd-btn--primary{ background:var(--accent); color:var(--text-on-accent); border-color:var(--accent-ink); }
.pd-btn--primary:hover{ background:var(--accent-ink); }
.pd-btn--secondary{ background:var(--accent-2); color:var(--accent-2-ink); border-color:var(--accent-2-ink); }
.pd-btn--ghost{ background:transparent; box-shadow:none; border-color:transparent; }
.pd-btn--ghost:hover{ background:var(--surface-hover); box-shadow:none; border-color:var(--stroke-soft); }
.pd-btn--danger{ background:var(--danger-soft); color:var(--danger); border-color:var(--danger); }
.pd-btn--danger:hover{ background:var(--danger); color:var(--paper-50); }

.pd-btn--sm{ height:var(--control-sm); font-size:var(--fs-caption); padding:0 var(--space-3); border-radius:var(--radius-sketch-2); }
.pd-btn--lg{ height:var(--control-lg); font-size:var(--fs-body); padding:0 var(--space-8); }
.pd-btn--block{ display:flex; width:100%; }
`;

/**
 * Button — a hand-drawn action control with a wobbly ink border and a tiny tilt.
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  block = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  useSketchStyle('pd-btn-css', CSS);
  const cls = [
    'pd-btn',
    `pd-btn--${variant}`,
    size !== 'md' ? `pd-btn--${size}` : '',
    block ? 'pd-btn--block' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
