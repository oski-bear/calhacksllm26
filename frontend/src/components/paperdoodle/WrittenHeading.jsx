import React from 'react';

function useSketchStyle(id, css) {
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const el = document.createElement('style');
    el.id = id; el.textContent = css; document.head.appendChild(el);
  }
}

const CSS = `
.pd-written{ font-family:var(--font-script); font-weight:var(--fw-bold);
  color:var(--text-heading); line-height:var(--lh-tight); letter-spacing:var(--ls-tight);
  margin:0; display:inline-block; position:relative; }
.pd-written--display{ font-size:var(--fs-display); }
.pd-written--h1{ font-size:var(--fs-h1); }
.pd-written--h2{ font-size:var(--fs-h2); }
.pd-written__ink{ display:inline-block; }
.pd-written[data-animate="true"] .pd-written__ink{
  animation:pd-write-on var(--dur-write) var(--ease-in-out) both; }
.pd-written__rule{ display:block; height:10px; margin-top:2px; overflow:visible; }
.pd-written__rule path{ fill:none; stroke:var(--accent); stroke-width:3.5; stroke-linecap:round;
  stroke-dasharray:340; stroke-dashoffset:340; }
.pd-written[data-animate="true"] .pd-written__rule path{
  animation:pd-rule-draw var(--dur-write) var(--ease-out) both; animation-delay:calc(var(--dur-write) * .55); }
@keyframes pd-rule-draw{ to{ stroke-dashoffset:0; } }
@media (prefers-reduced-motion: reduce){
  .pd-written[data-animate="true"] .pd-written__ink{ animation:none; clip-path:none; }
  .pd-written[data-animate="true"] .pd-written__rule path{ animation:none; stroke-dashoffset:0; }
}
`;

/**
 * WrittenHeading — the signature header that reveals itself left→right as if
 * being hand-written, in the flowing script face. Optionally draws an
 * underline doodle just after the text finishes.
 */
export function WrittenHeading({
  children,
  as = 'h1',
  level = 'display',
  underline = false,
  animate = true,
  className = '',
  ...rest
}) {
  useSketchStyle('pd-written-css', CSS);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (!animate) return;
    const t = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(t);
  }, [animate]);
  const Tag = as;
  return (
    <Tag className={`pd-written pd-written--${level} ${className}`} data-animate={on} {...rest}>
      <span className="pd-written__ink">{children}</span>
      {underline && (
        <svg className="pd-written__rule" viewBox="0 0 320 10" preserveAspectRatio="none" aria-hidden="true">
          <path d="M3 6 C 70 2, 150 9, 220 4 S 300 7, 317 5" />
        </svg>
      )}
    </Tag>
  );
}
