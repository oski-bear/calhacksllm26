import React from 'react';

function useSketchStyle(id, css) {
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const el = document.createElement('style');
    el.id = id; el.textContent = css; document.head.appendChild(el);
  }
}

const CSS = `
.pd-field{ display:flex; flex-direction:column; gap:var(--space-2); font-family:var(--font-marker); }
.pd-field__label{ color:var(--text-heading); font-size:var(--fs-small); letter-spacing:var(--ls-normal); }
.pd-field__hint{ color:var(--text-muted); font-size:var(--fs-caption); font-family:var(--font-body); }
.pd-field__hint--error{ color:var(--danger); }

.pd-input{
  font-family:var(--font-body); font-size:var(--fs-body); color:var(--text-heading);
  background:var(--surface-card);
  border:var(--border-ink);
  border-radius:var(--radius-sketch-2);
  padding:0 var(--space-4); height:var(--control-md);
  box-shadow:var(--shadow-inset);
  transition:border-color var(--dur-fast), box-shadow var(--dur-fast);
  width:100%; box-sizing:border-box;
}
.pd-input::placeholder{ color:var(--text-faint); }
.pd-input:hover{ border-color:var(--ink-900); }
.pd-input:focus{ outline:none; border-color:var(--accent); box-shadow:var(--shadow-inset), 0 0 0 3px var(--accent-soft); }
.pd-input--textarea{ height:auto; min-height:96px; padding:var(--space-3) var(--space-4); resize:vertical; line-height:var(--lh-normal); }
.pd-input--error{ border-color:var(--danger); }
.pd-input[disabled]{ opacity:.55; cursor:not-allowed; background:var(--surface-sunken); }
`;

/**
 * Input — a text field on paper with an inked, wobbly border and a pressed-in well.
 * Renders a <textarea> when multiline is set.
 */
export function Input({
  label,
  hint,
  error,
  multiline = false,
  id,
  className = '',
  ...rest
}) {
  useSketchStyle('pd-input-css', CSS);
  const autoId = React.useId();
  const fieldId = id || autoId;
  const Tag = multiline ? 'textarea' : 'input';
  const inputCls = [
    'pd-input',
    multiline ? 'pd-input--textarea' : '',
    error ? 'pd-input--error' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <div className="pd-field">
      {label && <label className="pd-field__label" htmlFor={fieldId}>{label}</label>}
      <Tag id={fieldId} className={inputCls} aria-invalid={!!error} {...rest} />
      {(error || hint) && (
        <span className={`pd-field__hint ${error ? 'pd-field__hint--error' : ''}`}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
