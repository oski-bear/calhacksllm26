function useSketchStyle(id, css) {
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const el = document.createElement('style');
    el.id = id; el.textContent = css; document.head.appendChild(el);
  }
}

const CSS = `
.pd-tape{
  display:inline-block; position:relative;
  font-family:var(--font-accent); font-size:var(--fs-caption); color:var(--ink-800);
  padding:6px 18px; line-height:1.2; text-align:center;
  background:rgba(246,222,113,0.72);
  box-shadow:0 1px 4px rgba(34,31,26,.18);
  transform:rotate(var(--tilt-3));
  -webkit-mask-image:linear-gradient(90deg, transparent 0, #000 6px, #000 calc(100% - 6px), transparent 100%);
          mask-image:linear-gradient(90deg, transparent 0, #000 6px, #000 calc(100% - 6px), transparent 100%);
}
.pd-tape::before,.pd-tape::after{ content:''; position:absolute; top:0; bottom:0; width:8px;
  background:repeating-linear-gradient(90deg, transparent 0 1px, rgba(255,255,255,.35) 1px 2px); }
.pd-tape::before{ left:0; } .pd-tape::after{ right:0; }
.pd-tape--pink{ background:rgba(244,183,200,0.72); }
.pd-tape--mint{ background:rgba(191,227,194,0.72); }
.pd-tape--blue{ background:rgba(220,230,245,0.82); }
.pd-tape--paper{ background:rgba(250,244,230,0.9); border:1px dashed var(--ink-300); }
`;

/**
 * WashiTape — a strip of translucent decorative tape with a tiny tilt, for
 * "taping" labels, notes and photos onto the page.
 */
export function WashiTape({ color = 'yellow', tilt, className = '', children, style = {}, ...rest }) {
  useSketchStyle('pd-tape-css', CSS);
  const s = tilt != null ? { ...style, transform: `rotate(${tilt}deg)` } : style;
  return (
    <span className={`pd-tape pd-tape--${color} ${className}`} style={s} {...rest}>{children}</span>
  );
}
