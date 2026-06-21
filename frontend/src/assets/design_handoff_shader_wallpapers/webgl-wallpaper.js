/* ============================================================
   Tiny WebGL engine for the Paperdoodle wallpapers.
   Full-screen triangle + swappable fragment shader. Feeds time,
   smoothed pointer, pointer velocity and a ring of click ripples.
   window.PDWallpaper(canvas)
   ============================================================ */
(function () {
  const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

  const MAXR = 12;
  const LIFE = 6.0; // seconds a ripple stays alive

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s) + '\n' + src);
    }
    return s;
  }

  class PDWallpaper {
    constructor(canvas) {
      this.canvas = canvas;
      const gl = canvas.getContext('webgl', { antialias: true, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
      if (!gl) throw new Error('WebGL unavailable');
      this.gl = gl;
      gl.getExtension('OES_standard_derivatives');

      // full-screen triangle
      this.buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

      this.programs = {}; // cache by shader id
      this.current = null;

      // pointer state, normalized 0..1, y up
      this.mouse = [0.5, 0.5];
      this.target = [0.5, 0.5];
      this.vel = [0, 0];
      this.ripples = []; // {x,y,t}

      this.start = performance.now();
      this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      this._resize = this.resize.bind(this);
      window.addEventListener('resize', this._resize);
      this.resize();

      this._loop = this.frame.bind(this);
      requestAnimationFrame(this._loop);
    }

    resize() {
      const w = Math.floor(window.innerWidth * this.dpr);
      const h = Math.floor(window.innerHeight * this.dpr);
      this.canvas.width = w;
      this.canvas.height = h;
      this.canvas.style.width = window.innerWidth + 'px';
      this.canvas.style.height = window.innerHeight + 'px';
      this.gl.viewport(0, 0, w, h);
    }

    setShader(def) {
      const gl = this.gl;
      let prog = this.programs[def.id];
      if (!prog) {
        const p = gl.createProgram();
        gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, def.frag));
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(p));
        }
        prog = {
          p,
          a_pos: gl.getAttribLocation(p, 'a_pos'),
          u_res: gl.getUniformLocation(p, 'u_res'),
          u_time: gl.getUniformLocation(p, 'u_time'),
          u_mouse: gl.getUniformLocation(p, 'u_mouse'),
          u_mvel: gl.getUniformLocation(p, 'u_mvel'),
          u_ripples: gl.getUniformLocation(p, 'u_ripples[0]'),
        };
        this.programs[def.id] = prog;
      }
      this.current = prog;
      // paint at least one frame immediately so a switch shows even when
      // requestAnimationFrame is throttled (e.g. backgrounded / capture).
      this.render(performance.now());
    }

    // pointer in CSS pixels (top-left origin) → store normalized, y up
    pointer(px, py) {
      this.target = [px / window.innerWidth, 1 - py / window.innerHeight];
    }
    click(px, py) {
      this.ripples.push({ x: px / window.innerWidth, y: 1 - py / window.innerHeight, t: performance.now() });
    }

    frame(now) {
      if (this._stopped) return;
      requestAnimationFrame(this._loop);
      this.render(now);
    }

    // Stop the RAF loop and detach listeners (call on unmount to avoid leaks).
    stop() {
      this._stopped = true;
      window.removeEventListener('resize', this._resize);
      const ext = this.gl && this.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }

    render(now) {
      const gl = this.gl;
      const prog = this.current;
      if (!prog) return;

      // ease the pointer toward its target; derive velocity
      const nx = this.mouse[0] + (this.target[0] - this.mouse[0]) * 0.12;
      const ny = this.mouse[1] + (this.target[1] - this.mouse[1]) * 0.12;
      this.vel = [nx - this.mouse[0], ny - this.mouse[1]];
      this.mouse = [nx, ny];

      // prune + pack ripples
      const t = (now - this.start) / 1000;
      this.ripples = this.ripples.filter(r => (now - r.t) / 1000 < LIFE);
      const data = new Float32Array(MAXR * 3);
      for (let i = 0; i < MAXR; i++) data[i * 3 + 2] = -1; // inactive
      const live = this.ripples.slice(-MAXR);
      for (let i = 0; i < live.length; i++) {
        data[i * 3 + 0] = live[i].x;
        data[i * 3 + 1] = live[i].y;
        data[i * 3 + 2] = (now - live[i].t) / 1000;
      }

      gl.useProgram(prog.p);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
      gl.enableVertexAttribArray(prog.a_pos);
      gl.vertexAttribPointer(prog.a_pos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(prog.u_res, this.canvas.width, this.canvas.height);
      gl.uniform1f(prog.u_time, t);
      gl.uniform2f(prog.u_mouse, this.mouse[0], this.mouse[1]);
      gl.uniform2f(prog.u_mvel, this.vel[0], this.vel[1]);
      gl.uniform3fv(prog.u_ripples, data);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }

  window.PDWallpaper = PDWallpaper;
})();
