/* ============================================================
   Paperdoodle interactive wallpaper shaders (WebGL1 / GLSL ES 1.00)
   Five fragment shaders, all sharing a common header (palette,
   noise helpers, paper grain, mouse + ripple uniforms).
   Exposed as window.PD_SHADERS — an ordered array of:
     { id, name, tag, accent, frag }
   ============================================================ */
(function () {
  // Shared header prepended to every fragment shader.
  const COMMON = `
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec2  u_res;      // drawing-buffer size, px
uniform float u_time;     // seconds
uniform vec2  u_mouse;    // smoothed pointer, 0..1, y up
uniform vec2  u_mvel;     // pointer velocity (per frame, 0..1 space)
#define MAXR 12
uniform vec3  u_ripples[MAXR]; // xy = click pos (0..1), z = age (s); z<0 inactive

/* ---- warm paper / pen palette (from the design tokens) ---- */
#define PAPER   vec3(0.984,0.965,0.914)
#define PAPER2  vec3(0.957,0.925,0.847)
#define PAPER3  vec3(0.929,0.878,0.769)
#define PAPER4  vec3(0.886,0.820,0.675)
#define INK     vec3(0.169,0.149,0.125)
#define BLUE    vec3(0.176,0.357,0.659)
#define BLUEINK vec3(0.118,0.247,0.467)
#define RED     vec3(0.796,0.271,0.212)
#define YEL     vec3(0.965,0.871,0.443)
#define PINK    vec3(0.957,0.718,0.784)
#define MINT    vec3(0.749,0.890,0.761)
#define LAV     vec3(0.878,0.831,0.949)
#define LAVINK  vec3(0.420,0.310,0.627)

float hash21(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){
    v += a * vnoise(p);
    p = p * 2.02 + 7.1;
    a *= 0.5;
  }
  return v;
}
// paper tooth — multiply a faint fibrous grain onto the final colour
vec3 paperGrain(vec3 col, vec2 uv){
  float g = vnoise(uv * u_res * 0.7);
  float fib = fbm(uv * vec2(u_res.x/u_res.y,1.0) * 7.0);
  col *= 0.965 + 0.05 * g;
  col = mix(col, col * 0.93, fib * 0.10);
  // gentle vignette like the edge of a sheet
  vec2 c = uv - 0.5;
  col *= 1.0 - dot(c, c) * 0.18;
  return col;
}
vec2 aspect(){ return vec2(u_res.x / u_res.y, 1.0); }
`;

  /* ---------- 1. INK BLOOM ---------- */
  const inkBloom = `
void main(){
  vec2 uv  = gl_FragCoord.xy / u_res;
  vec2 asp = aspect();
  vec2 p   = uv * asp;
  vec2 m   = u_mouse * asp;

  // parchment with a slow drifting tone variation
  vec3 col = mix(PAPER, PAPER2, fbm(p * 2.0 + vec2(u_time * 0.02, 0.0)));
  col = mix(col, PAPER3, fbm(p * 0.8 - u_time * 0.01) * 0.4);

  // ink that blooms under the cursor, with an organic bleeding edge
  float warp = fbm(p * 3.5 + u_time * 0.06) - 0.5;
  float dm = length(p - m) + warp * 0.22;
  float bloom = smoothstep(0.30, 0.02, dm);

  float ink = bloom;

  // click splats — grow then slowly soak away
  for (int i = 0; i < MAXR; i++){
    vec3 r = u_ripples[i];
    if (r.z < 0.0) continue;
    vec2 rp = r.xy * asp;
    float grow = 0.05 + 0.20 * (1.0 - exp(-r.z * 3.0));
    float fade = exp(-r.z * 0.45);
    float d = length(p - rp) + (fbm(p * 4.0 + float(i) * 9.7) - 0.5) * 0.14;
    float splat = smoothstep(grow, grow - 0.05, d) * fade;
    // a few tendrils so splats look hand-flicked
    float tnd = smoothstep(0.02, 0.0, abs(d - grow) - fbm(p*7.0+float(i))*0.04) * fade * 0.5;
    ink = max(ink, max(splat, tnd));
  }

  // ink fibres + darker pooled core
  float fib = fbm(p * 28.0);
  vec3 inkCol = mix(BLUEINK, BLUE, fib * 0.7 + 0.15);
  inkCol = mix(inkCol, BLUEINK, smoothstep(0.5, 1.0, ink)); // pools darken
  col = mix(col, inkCol, smoothstep(0.0, 0.45, ink));

  // faint blue halo where ink is just bleeding in
  col = mix(col, mix(col, BLUE, 0.18), smoothstep(0.45, 0.0, dm) * (1.0 - bloom));

  gl_FragColor = vec4(paperGrain(col, uv), 1.0);
}`;

  /* ---------- 2. CONTOURS ---------- */
  const contours = `
void main(){
  vec2 uv  = gl_FragCoord.xy / u_res;
  vec2 asp = aspect();
  vec2 p   = uv * asp;
  vec2 m   = u_mouse * asp;

  // height field: rolling terrain that drifts
  float h = fbm(p * 1.6 + vec2(u_time * 0.025, u_time * 0.012));
  // the cursor is a hill
  float dm = length(p - m);
  h += 0.7 * exp(-dm * dm * 7.0);
  // clicks send expanding contour ripples
  for (int i = 0; i < MAXR; i++){
    vec3 r = u_ripples[i];
    if (r.z < 0.0) continue;
    float d = length(p - r.xy * asp);
    h += sin(d * 26.0 - r.z * 7.0) * exp(-d * 3.5) * exp(-r.z * 1.1) * 0.18;
  }
  // hand wobble so lines aren't mechanical
  h += fbm(p * 6.0) * 0.035;

  float lines = h * 16.0;
  float f = fract(lines);
  float dist = min(f, 1.0 - f);
  float w = fwidth(lines) * 1.4 + 0.0008;
  float line = 1.0 - smoothstep(0.0, w, dist - 0.015);

  // every 5th line heavier (index contour)
  float idx = floor(lines);
  float heavy = step(0.5, abs(fract(idx / 5.0)) < 0.001 ? 1.0 : 0.0);

  vec3 col = mix(PAPER, PAPER2, fbm(p * 3.0));
  vec3 lineCol = mix(INK, BLUE, smoothstep(0.45, 0.0, dm));
  col = mix(col, lineCol, line * (0.55 + 0.35 * heavy));

  gl_FragColor = vec4(paperGrain(col, uv), 1.0);
}`;

  /* ---------- 3. HIGHLIGHTER ---------- */
  const highlighter = `
void main(){
  vec2 uv  = gl_FragCoord.xy / u_res;
  vec2 asp = aspect();
  vec2 p   = uv * asp;

  vec3 col = mix(PAPER, PAPER2, fbm(p * 3.0));

  // faint ruled notebook lines
  float ruled = abs(fract(uv.y * 9.0 - 0.5) - 0.5);
  col = mix(col, col * mix(vec3(1.0), BLUE, 0.25), 1.0 - smoothstep(0.0, fwidth(uv.y*9.0)*1.5, ruled));

  float rows = 9.0;
  float ry  = uv.y * rows;
  float idx = floor(ry);
  float band = fract(ry);
  float wob = (vnoise(vec2(uv.x * 5.0, idx * 3.0)) - 0.5) * 0.20;
  float mask = smoothstep(0.16, 0.22, band + wob) * (1.0 - smoothstep(0.80, 0.86, band + wob));

  // colour cycles yellow / pink / mint per row
  float sel = mod(idx, 3.0);
  vec3 hcol = sel < 1.0 ? YEL : (sel < 2.0 ? PINK : MINT);

  // proximity glow around the cursor
  float glow = exp(-pow(length((uv - u_mouse) * asp), 2.0) * 9.0);
  // swipe along the row the cursor sits on
  float rc = (idx + 0.5) / rows;
  float sameRow = exp(-pow((uv.y - rc) * rows, 2.0) * 1.6);
  float swipeX  = exp(-pow((uv.x - u_mouse.x) * asp.x, 2.0) * 2.0);

  float intensity = 0.10 + 1.05 * glow + 0.85 * sameRow * swipeX;

  // clicks lay down a full bright swipe across that row
  for (int i = 0; i < MAXR; i++){
    vec3 r = u_ripples[i];
    if (r.z < 0.0) continue;
    float crc = (floor(r.y * rows) + 0.5) / rows;
    float sr  = exp(-pow((uv.y - crc) * rows, 2.0) * 1.6);
    float spread = 0.35 + 0.65 * (1.0 - exp(-r.z * 2.5)); // ink runs outward
    float xfall = exp(-pow((uv.x - r.x) * asp.x, 2.0) * (3.5 - spread * 2.5));
    intensity += 1.2 * sr * xfall * exp(-r.z * 0.8);
  }
  intensity = clamp(intensity, 0.0, 1.35);

  float tex = 0.80 + 0.20 * fbm(p * 44.0);          // marker streakiness
  float alpha = clamp(mask * intensity, 0.0, 0.92);
  col *= mix(vec3(1.0), hcol * tex, alpha);          // highlighter = multiply

  gl_FragColor = vec4(paperGrain(col, uv), 1.0);
}`;

  /* ---------- 4. SCRIBBLES (flow-field hatching) ---------- */
  const scribbles = `
void main(){
  vec2 uv  = gl_FragCoord.xy / u_res;
  vec2 asp = aspect();
  vec2 p   = uv * asp;
  vec2 m   = u_mouse * asp;

  vec3 col = mix(PAPER, PAPER2, fbm(p * 3.0));

  // base flow angle from drifting noise
  float n = fbm(p * 1.8 + vec2(u_time * 0.04, -u_time * 0.02));
  float ang = n * 6.2831;

  // cursor bends the field into a swirl around it
  vec2 d = p - m;
  float dist = length(d);
  float infl = exp(-dist * dist * 3.2);
  float swirl = atan(d.y, d.x) + 1.5708;
  ang = mix(ang, swirl, infl * 0.92);

  // clicks add decaying vortices
  for (int i = 0; i < MAXR; i++){
    vec3 r = u_ripples[i];
    if (r.z < 0.0) continue;
    vec2 rd = p - r.xy * asp;
    float rl = length(rd);
    float k = exp(-rl * rl * 5.0) * exp(-r.z * 0.7);
    ang = mix(ang, atan(rd.y, rd.x) + 1.5708 + r.z * 2.0, k * 0.9);
  }

  vec2 dir = vec2(cos(ang), sin(ang));
  // coordinate across the stroke direction → parallel hatch lines
  float coord = dot(p, vec2(-dir.y, dir.x)) * 62.0;
  coord += fbm(p * 7.0) * 2.2;                       // per-stroke jitter
  float fc = abs(fract(coord) - 0.5) * 2.0;
  float w = fwidth(coord) * 1.6 + 0.02;
  float stroke = 1.0 - smoothstep(0.0, w + 0.28, fc);

  // broken strokes (pen lifts) so it reads as scribble, denser near cursor
  float along = dot(p, dir) * 30.0;
  float brk = step(0.32, vnoise(vec2(along, coord * 0.4)));
  float density = 0.30 + 0.62 * infl;
  stroke *= mix(brk, 1.0, infl);

  vec3 inkCol = mix(INK, BLUE, infl);
  col = mix(col, inkCol, stroke * density);

  gl_FragColor = vec4(paperGrain(col, uv), 1.0);
}`;

  /* ---------- 5. GRID LENS ---------- */
  const gridLens = `
void main(){
  vec2 uv  = gl_FragCoord.xy / u_res;
  vec2 asp = aspect();

  // magnifying bubble centred on the cursor
  vec2 d  = uv - u_mouse;
  vec2 dA = d * asp;
  float dist = length(dA);
  float R = 0.30;
  float lens = smoothstep(R, 0.0, dist);
  vec2 uv2 = uv - normalize(d + 1e-6) * (lens * lens) * 0.07;

  // click ripples ride across the sheet as refraction waves
  for (int i = 0; i < MAXR; i++){
    vec3 r = u_ripples[i];
    if (r.z < 0.0) continue;
    vec2 rd = uv - r.xy;
    float dd = length(rd * asp);
    float wave = sin(dd * 38.0 - r.z * 9.0) * exp(-dd * 5.0) * exp(-r.z * 1.4);
    uv2 += normalize(rd + 1e-6) * wave * 0.02;
  }

  // graph paper, with hand wobble on the rules
  float GRID = 22.0;
  vec2 g = uv2 * asp * GRID;
  g += vec2(fbm(uv2 * 5.0), fbm(uv2 * 5.0 + 9.0)) * 0.18;
  vec2 gf = abs(fract(g) - 0.5);
  vec2 gw = fwidth(g) * 1.4 + 0.01;
  float lineX = 1.0 - smoothstep(0.0, gw.x, gf.x);
  float lineY = 1.0 - smoothstep(0.0, gw.y, gf.y);
  float minor = max(lineX, lineY);

  // heavier major rules every 5 squares
  vec2 G2 = uv2 * asp * (GRID / 5.0);
  vec2 g2f = abs(fract(G2) - 0.5);
  vec2 g2w = fwidth(G2) * 1.4 + 0.004;
  float major = max(1.0 - smoothstep(0.0, g2w.x, g2f.x),
                    1.0 - smoothstep(0.0, g2w.y, g2f.y));

  vec3 col = mix(PAPER, PAPER2, fbm(uv2 * 3.0));
  col = mix(col, mix(BLUE, BLUEINK, 0.2), minor * 0.40);
  col = mix(col, BLUEINK, major * 0.55);

  // glassy lens highlight + faint rim
  col = mix(col, col * 1.07, lens * 0.5);
  col = mix(col, col * 0.9, smoothstep(R, R - 0.02, dist) * (1.0 - lens) * 0.0);

  gl_FragColor = vec4(paperGrain(col, uv), 1.0);
}`;

  window.PD_SHADERS = [
    { id: 'ink',   name: 'Ink Bloom',   tag: 'Ballpoint blue that blossoms under your cursor — click to flick a splat.', accent: '#2D5BA8', frag: COMMON + inkBloom },
    { id: 'topo',  name: 'Contours',    tag: 'A hand-drawn map that hills up around you — click to send a ripple.',       accent: '#5B5347', frag: COMMON + contours },
    { id: 'hilite',name: 'Highlighter', tag: 'Glowing marker rows light up as you pass — click to lay a swipe.',           accent: '#EFCF3F', frag: COMMON + highlighter },
    { id: 'scrib', name: 'Scribbles',   tag: 'Pen hatching that swirls toward your hand — click to spin a vortex.',        accent: '#221F1A', frag: COMMON + scribbles },
    { id: 'grid',  name: 'Grid Lens',   tag: 'Graph paper warped through a magnifier — click to drop a wave.',             accent: '#6B4FA0', frag: COMMON + gridLens },
  ];
})();
