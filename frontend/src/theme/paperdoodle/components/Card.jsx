function useSketchStyle(id, css) {
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const el = document.createElement('style');
    el.id = id; el.textContent = css; document.head.appendChild(el);
  }
}

const CSS = `
.pd-card{
  position:relative;
  background:var(--surface-card);
  border:var(--border-ink);
  border-radius:var(--radius-sketch-1);
  box-shadow:var(--shadow-paper);
  padding:var(--space-6);
  color:var(--text-body);
  transition:transform var(--dur-base) var(--ease-doodle), box-shadow var(--dur-base) var(--ease-out);
}
.pd-card--tilt{ transform:rotate(var(--tilt-1)); }
.pd-card--stack{ box-shadow:var(--shadow-stack); }
.pd-card--flat{ box-shadow:none; }
.pd-card--interactive{ cursor:pointer; }
.pd-card--interactive:hover{ transform:rotate(0) translate(-2px,-3px); box-shadow:var(--shadow-lift); }
.pd-card--interactive:active{ transform:translate(1px,2px); box-shadow:var(--shadow-paper); }
.pd-card__title{ font-family:var(--font-marker); font-size:var(--fs-h3); color:var(--text-heading); margin:0 0 var(--space-2); }
.pd-card__body{ font-family:var(--font-body); font-weight:var(--fw-light); line-height:var(--lh-normal); }
`;

/**
 * Card — a sheet of paper with an inked wobbly border and a resting shadow.
 * Variants control tilt, the stacked-paper shadow and interactivity.
 */
export function Card({
  title,
  tilt = false,
  stack = false,
  flat = false,
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  useSketchStyle('pd-card-css', CSS);
  const cls = [
    'pd-card',
    tilt ? 'pd-card--tilt' : '',
    stack ? 'pd-card--stack' : '',
    flat ? 'pd-card--flat' : '',
    interactive ? 'pd-card--interactive' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {title && <h3 className="pd-card__title">{title}</h3>}
      <div className="pd-card__body">{children}</div>
    </div>
  );
}
