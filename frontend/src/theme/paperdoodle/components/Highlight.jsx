import React from 'react';

function useSketchStyle(id, css) {
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const el = document.createElement('style');
    el.id = id; el.textContent = css; document.head.appendChild(el);
  }
}

const CSS = `
.pd-hl{ position:relative; padding:0 .12em; color:inherit; white-space:pre-wrap;
  background-repeat:no-repeat; background-position:0 60%; background-size:0% 88%;
  border-radius:6px 8px 7px 9px; }
.pd-hl[data-animate="true"]{ animation:pd-highlight-swipe var(--dur-slow) var(--ease-out) forwards; }
.pd-hl--static{ background-size:100% 88%; }
.pd-hl--yellow{ background-image:linear-gradient(var(--hi-yellow),var(--hi-yellow)); }
.pd-hl--pink{ background-image:linear-gradient(var(--hi-pink),var(--hi-pink)); }
.pd-hl--mint{ background-image:linear-gradient(var(--hi-mint),var(--hi-mint)); }
.pd-hl--blue{ background-image:linear-gradient(var(--accent-soft),var(--accent-soft)); }
@media (prefers-reduced-motion: reduce){
  .pd-hl[data-animate="true"]{ animation:none; background-size:100% 88%; }
}
`;

/**
 * Highlight — wraps text in a highlighter swipe that can sweep in on view.
 */
export function Highlight({ color = 'yellow', animate = false, className = '', children, ...rest }) {
  useSketchStyle('pd-hl-css', CSS);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (!animate) return;
    const t = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(t);
  }, [animate]);
  return (
    <mark
      className={`pd-hl pd-hl--${color} ${!animate ? 'pd-hl--static' : ''} ${className}`}
      data-animate={animate && on}
      {...rest}
    >{children}</mark>
  );
}
