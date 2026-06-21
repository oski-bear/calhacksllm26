function useSketchStyle(id, css) {
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const el = document.createElement('style');
    el.id = id; el.textContent = css; document.head.appendChild(el);
  }
}

const CSS = `
.pd-check{ display:inline-flex; align-items:center; gap:var(--space-3); cursor:pointer;
  font-family:var(--font-body); font-size:var(--fs-body); color:var(--text-heading); user-select:none; }
.pd-check input{ position:absolute; opacity:0; width:0; height:0; }
.pd-check__box{
  flex:none; width:26px; height:26px; display:grid; place-items:center;
  background:var(--surface-card);
  border:var(--border-ink);
  border-radius:var(--radius-sketch-3);
  transform:rotate(var(--tilt-1));
  transition:background var(--dur-fast), transform var(--dur-fast) var(--ease-doodle);
}
.pd-check:hover .pd-check__box{ transform:rotate(0) scale(1.05); }
.pd-check__mark{ width:18px; height:18px; stroke:var(--accent-ink); stroke-width:3.2;
  fill:none; stroke-linecap:round; stroke-linejoin:round;
  stroke-dasharray:26; stroke-dashoffset:26; transition:stroke-dashoffset var(--dur-base) var(--ease-out); }
.pd-check input:checked + .pd-check__box{ background:var(--accent-soft); }
.pd-check input:checked + .pd-check__box .pd-check__mark{ stroke-dashoffset:0; }
.pd-check input:focus-visible + .pd-check__box{ box-shadow:0 0 0 3px var(--accent-soft); }
.pd-check--radio .pd-check__box{ border-radius:50%; }
.pd-check--radio .pd-check__dot{ width:12px; height:12px; border-radius:var(--radius-blob);
  background:var(--accent-ink); transform:scale(0); transition:transform var(--dur-fast) var(--ease-doodle); }
.pd-check--radio input:checked + .pd-check__box .pd-check__dot{ transform:scale(1); }
.pd-check[data-disabled="true"]{ opacity:.5; cursor:not-allowed; }
`;

/**
 * Checkbox — a hand-drawn tick that draws itself on when checked.
 * Set `type="radio"` styling via the `radio` flag for a single-choice dot.
 */
export function Checkbox({ label, radio = false, disabled = false, className = '', ...rest }) {
  useSketchStyle('pd-check-css', CSS);
  return (
    <label className={`pd-check ${radio ? 'pd-check--radio' : ''} ${className}`} data-disabled={disabled}>
      <input type={radio ? 'radio' : 'checkbox'} disabled={disabled} {...rest} />
      <span className="pd-check__box" aria-hidden="true">
        {radio ? (
          <span className="pd-check__dot" />
        ) : (
          <svg className="pd-check__mark" viewBox="0 0 24 24"><path d="M3 13 l6 6 L21 4" /></svg>
        )}
      </span>
      {label && <span className="pd-check__label">{label}</span>}
    </label>
  );
}
