<script>
  import { onMount } from 'svelte';

  let canvas;
  let gl;
  let video;
  
  // UI state
  let rho = 0.92;
  let gain = 1.0;
  let radius = 4;
  let blockSize = 10;

  // Internal resolution (keep small for phone)
  const INTERNAL_W = 192;
  const INTERNAL_H = 144;

  // CPU grayscale buffers
  let prevGray = new Float32Array(INTERNAL_W * INTERNAL_H);
  let currGray = new Float32Array(INTERNAL_W * INTERNAL_H);
  let flowDense = new Float32Array(INTERNAL_W * INTERNAL_H * 2);

  // Offscreen canvas for downsample + grayscale
  let off;
  let offCtx;

  // WebGL resources
  let progUpdate, progRender;
  let vao;
  let stimTexA, stimTexB, fboA, fboB;
  let flowTex;
  let useFloat = false;
  let ping = true;
  let initializedPrev = false;
  let animationId;

  onMount(async () => {
    // Initialize WebGL
    gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false });
    if (!gl) {
      console.error("WebGL2 not available");
      return;
    }

    // Setup offscreen canvas
    off = document.createElement('canvas');
    off.width = INTERNAL_W;
    off.height = INTERNAL_H;
    offCtx = off.getContext('2d', { willReadFrequently: true });

    // Setup webcam
    video = document.createElement('video');
    video.playsInline = true;
    video.muted = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, 
        audio: false
      });
      video.srcObject = stream;
      await video.play();
    } catch (err) {
      console.error("Camera access denied:", err);
      return;
    }

    // Check float texture support
    const extColorFloat = gl.getExtension('EXT_color_buffer_float');
    useFloat = !!extColorFloat;

    // Initialize WebGL resources
    initWebGL();
    resizeCanvasToDisplay();
    window.addEventListener('resize', resizeCanvasToDisplay);

    // Start animation loop
    animationId = requestAnimationFrame(step);

    return () => {
      // Cleanup
      if (animationId) cancelAnimationFrame(animationId);
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      window.removeEventListener('resize', resizeCanvasToDisplay);
    };
  });

  function resizeCanvasToDisplay() {
    if (!canvas) return;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error(log);
    }
    return sh;
  }

  function link(vsSrc, fsSrc) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(p);
      gl.deleteProgram(p);
      throw new Error(log);
    }
    return p;
  }

  const VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = (a_pos * 0.5) + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

  const FS_UPDATE = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o;

uniform sampler2D u_prevStim;
uniform sampler2D u_flow;
uniform float u_rho;
uniform float u_noiseSeed;
uniform vec2 u_texSize;
uniform float u_flowGain;
uniform int u_useFloat;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float randn(vec2 p){
  float u1 = max(1e-6, hash(p + u_noiseSeed));
  float u2 = hash(p.yx + 13.37 + u_noiseSeed);
  float r = sqrt(-2.0 * log(u1));
  float th = 6.2831853 * u2;
  return r * cos(th);
}

float readStim(vec2 uv){
  vec4 t = texture(u_prevStim, uv);
  if (u_useFloat == 1) return t.r;
  return (t.r * 2.0 - 1.0);
}

vec2 readFlow(vec2 uv){
  vec4 f = texture(u_flow, uv);
  if (u_useFloat == 1) return f.rg;
  vec2 x = (f.rg * 2.0 - 1.0);
  return x * 8.0;
}

void main(){
  vec2 flow_px = readFlow(v_uv) * u_flowGain;
  vec2 flow_uv = flow_px / u_texSize;
  vec2 uv_warp = v_uv - flow_uv;
  vec2 px = floor(uv_warp * u_texSize) + 0.5;
  vec2 uv_nn = px / u_texSize;
  float warped = readStim(uv_nn);
  float eps = randn(gl_FragCoord.xy);
  float rho_val = clamp(u_rho, 0.0, 0.999);
  float stim = rho_val * warped + sqrt(max(0.0, 1.0 - rho_val*rho_val)) * eps;
  if (u_useFloat == 1) {
    o = vec4(stim, 0.0, 0.0, 1.0);
  } else {
    float enc = clamp(0.5 + 0.5 * stim, 0.0, 1.0);
    o = vec4(enc, 0.0, 0.0, 1.0);
  }
}`;

const FS_RENDER = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o;
uniform sampler2D u_stim;
uniform int u_useFloat;
uniform float u_cropAmount;

float readStim(vec2 uv){
  vec4 t = texture(u_stim, uv);
  if (u_useFloat == 1) return t.r;
  return (t.r * 2.0 - 1.0);
}

void main(){
  // Crop edges to hide block artifacts
  vec2 uv_cropped = mix(vec2(u_cropAmount), vec2(1.0 - u_cropAmount), v_uv);

  float s = readStim(uv_cropped);
  float clip = 3.0;
  float x = clamp(s, -clip, clip);
  float y = (x + clip) / (2.0 * clip);
  o = vec4(y, y, y, 1.0);
}`;

  function initWebGL() {
    progUpdate = link(VS, FS_UPDATE);
    progRender = link(VS, FS_RENDER);

    // Fullscreen quad
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1,  -1, 1,
      -1, 1,  1,-1,   1, 1
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    // Create textures
    if (useFloat) {
      stimTexA = makeTex(gl.R16F, gl.RED, gl.HALF_FLOAT, INTERNAL_W, INTERNAL_H);
      stimTexB = makeTex(gl.R16F, gl.RED, gl.HALF_FLOAT, INTERNAL_W, INTERNAL_H);
      flowTex = makeTex(gl.RG16F, gl.RG, gl.HALF_FLOAT, INTERNAL_W, INTERNAL_H);
    } else {
      stimTexA = makeTex(gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, INTERNAL_W, INTERNAL_H);
      stimTexB = makeTex(gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, INTERNAL_W, INTERNAL_H);
      flowTex = makeTex(gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, INTERNAL_W, INTERNAL_H);
    }

    fboA = makeFBO(stimTexA);
    fboB = makeFBO(stimTexB);

    uploadStimInit(stimTexA);
    uploadStimInit(stimTexB);
  }

  function makeTex(internalFormat, format, type, w, h) {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return t;
  }

  function makeFBO(tex) {
    const f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (!ok) throw new Error("FBO incomplete");
    return f;
  }

  function gaussian() {
    let u=0, v=0;
    while (u===0) u=Math.random();
    while (v===0) v=Math.random();
    return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
  }

  function uploadStimInit(tex) {
    if (useFloat) {
      const init = new Float32Array(INTERNAL_W * INTERNAL_H);
      for (let i=0;i<init.length;i++) init[i] = gaussian();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, INTERNAL_W, INTERNAL_H, gl.RED, gl.FLOAT, init);
    } else {
      const init = new Uint8Array(INTERNAL_W * INTERNAL_H * 4);
      for (let i=0;i<INTERNAL_W*INTERNAL_H;i++){
        const v = Math.max(0, Math.min(255, (128 + 40*gaussian())|0));
        init[4*i+0]=v; init[4*i+1]=0; init[4*i+2]=0; init[4*i+3]=255;
      }
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, INTERNAL_W, INTERNAL_H, gl.RGBA, gl.UNSIGNED_BYTE, init);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  function grabGrayscaleInto(bufFloat) {
    offCtx.save();
    // Flip horizontally and vertically to correct the image
    offCtx.translate(INTERNAL_W, INTERNAL_H);
    offCtx.scale(-1, -1);
    offCtx.drawImage(video, 0, 0, INTERNAL_W, INTERNAL_H);
    offCtx.restore();

    const im = offCtx.getImageData(0,0,INTERNAL_W, INTERNAL_H).data;
    for (let i=0, j=0; j<bufFloat.length; j++, i+=4) {
      const r = im[i], g = im[i+1], b = im[i+2];
      bufFloat[j] = (0.2126*r + 0.7152*g + 0.0722*b) / 255.0;
    }
  }

  function computeBlockFlow(prev, curr, W, H, blockSize, radius) {
    const gw = Math.floor(W / blockSize);
    const gh = Math.floor(H / blockSize);
    const flow = new Float32Array(gw * gh * 2);

    for (let by=0; by<gh; by++) {
      for (let bx=0; bx<gw; bx++) {
        const x0 = bx * blockSize;
        const y0 = by * blockSize;
        let bestSSD = Infinity;
        let bestDx = 0, bestDy = 0;

        for (let dy=-radius; dy<=radius; dy++) {
          const yy = y0 + dy;
          if (yy < 0 || yy + blockSize >= H) continue;
          for (let dx=-radius; dx<=radius; dx++) {
            const xx = x0 + dx;
            if (xx < 0 || xx + blockSize >= W) continue;

            let ssd = 0.0;
            for (let y=0; y<blockSize; y++) {
              const i1 = (y0 + y) * W + x0;
              const i2 = (yy + y) * W + xx;
              for (let x=0; x<blockSize; x++) {
                const d = prev[i1 + x] - curr[i2 + x];
                ssd += d*d;
              }
            }
            if (ssd < bestSSD) {
              bestSSD = ssd;
              bestDx = dx;
              bestDy = dy;
            }
          }
        }

        const k = (by * gw + bx) * 2;
        flow[k+0] = bestDx;
        flow[k+1] = bestDy;
      }
    }
    return { flow, gw, gh };
  }

  function upsampleFlowGridToDense(flow, gw, gh, W, H, blockSize, outDense) {
    for (let y=0; y<H; y++) {
      const by = Math.min(gh-1, Math.floor(y / blockSize));
      for (let x=0; x<W; x++) {
        const bx = Math.min(gw-1, Math.floor(x / blockSize));
        const k = (by * gw + bx) * 2;
        const o = (y * W + x) * 2;
        outDense[o+0] = flow[k+0];
        outDense[o+1] = flow[k+1];
      }
    }
    boxBlurFlow(outDense, W, H, 1);
    boxBlurFlow(outDense, W, H, 1);
  }

  function boxBlurFlow(f, W, H, r) {
    if (r <= 0) return;
    const tmp = new Float32Array(f.length);
    for (let y=0; y<H; y++) {
      for (let x=0; x<W; x++) {
        let su=0, sv=0, cnt=0;
        for (let dx=-r; dx<=r; dx++) {
          const xx = x + dx;
          if (xx<0||xx>=W) continue;
          const i = (y*W + xx)*2;
          su += f[i]; sv += f[i+1]; cnt++;
        }
        const o = (y*W + x)*2;
        tmp[o] = su/cnt; tmp[o+1] = sv/cnt;
      }
    }
    for (let y=0; y<H; y++) {
      for (let x=0; x<W; x++) {
        let su=0, sv=0, cnt=0;
        for (let dy=-r; dy<=r; dy++) {
          const yy = y + dy;
          if (yy<0||yy>=H) continue;
          const i = (yy*W + x)*2;
          su += tmp[i]; sv += tmp[i+1]; cnt++;
        }
        const o = (y*W + x)*2;
        f[o] = su/cnt; f[o+1] = sv/cnt;
      }
    }
  }

  function uploadFlowTexture(tex, flowDense, W, H) {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    if (useFloat) {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, W,H, gl.RG, gl.FLOAT, flowDense);
    } else {
      const enc = new Uint8Array(W*H*4);
      for (let i=0; i<W*H; i++) {
        let u = flowDense[2*i+0];
        let v = flowDense[2*i+1];
        u = Math.max(-8, Math.min(8, u));
        v = Math.max(-8, Math.min(8, v));
        const ru = ((u/8)*0.5 + 0.5) * 255;
        const rv = ((v/8)*0.5 + 0.5) * 255;
        enc[4*i+0] = ru|0;
        enc[4*i+1] = rv|0;
        enc[4*i+2] = 0;
        enc[4*i+3] = 255;
      }
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, W,H, gl.RGBA, gl.UNSIGNED_BYTE, enc);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  function step(tms) {
    if (!gl || !video || !offCtx) return;

    resizeCanvasToDisplay();
    grabGrayscaleInto(currGray);

    if (!initializedPrev) {
      prevGray.set(currGray);
      initializedPrev = true;
      animationId = requestAnimationFrame(step);
      return;
    }

    const { flow, gw, gh } = computeBlockFlow(prevGray, currGray, INTERNAL_W, INTERNAL_H, blockSize, radius);
    upsampleFlowGridToDense(flow, gw, gh, INTERNAL_W, INTERNAL_H, blockSize, flowDense);
    uploadFlowTexture(flowTex, flowDense, INTERNAL_W, INTERNAL_H);

    const srcStim = ping ? stimTexA : stimTexB;
    const dstFbo  = ping ? fboB : fboA;
    const dstStim = ping ? stimTexB : stimTexA;

    gl.bindFramebuffer(gl.FRAMEBUFFER, dstFbo);
    gl.viewport(0,0,INTERNAL_W, INTERNAL_H);
    gl.useProgram(progUpdate);
    gl.bindVertexArray(vao);

    gl.uniform1f(gl.getUniformLocation(progUpdate, "u_rho"), rho);
    gl.uniform1f(gl.getUniformLocation(progUpdate, "u_noiseSeed"), (tms * 0.001) % 1000.0);
    gl.uniform2f(gl.getUniformLocation(progUpdate, "u_texSize"), INTERNAL_W, INTERNAL_H);
    gl.uniform1f(gl.getUniformLocation(progUpdate, "u_flowGain"), gain);
    gl.uniform1i(gl.getUniformLocation(progUpdate, "u_useFloat"), useFloat ? 1 : 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, srcStim);
    gl.uniform1i(gl.getUniformLocation(progUpdate, "u_prevStim"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, flowTex);
    gl.uniform1i(gl.getUniformLocation(progUpdate, "u_flow"), 1);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.useProgram(progRender);

    gl.uniform1i(gl.getUniformLocation(progRender, "u_useFloat"), useFloat ? 1 : 0);
    // Crop 5% from each edge to hide block artifacts
    gl.uniform1f(gl.getUniformLocation(progRender, "u_cropAmount"), 0.05);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, dstStim);
    gl.uniform1i(gl.getUniformLocation(progRender, "u_stim"), 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    ping = !ping;
    prevGray.set(currGray);

    animationId = requestAnimationFrame(step);
  }
</script>

<div class="motion-noise-wrapper">
  <canvas bind:this={canvas} class="motion-canvas"></canvas>
  <div class="hud">
    <div><b>Motion-defined noise</b> (WebGL2 + webcam)</div>
    <div class="row">
      <span>ρ (coherence)</span>
      <input type="range" min="0.70" max="0.99" step="0.005" bind:value={rho}>
      <span>{rho.toFixed(3)}</span>
    </div>
    <div class="row">
      <span>flow gain</span>
      <input type="range" min="0.2" max="3.0" step="0.05" bind:value={gain}>
      <span>{gain.toFixed(2)}</span>
    </div>
    <div class="row">
      <span>search radius</span>
      <input type="range" min="1" max="8" step="1" bind:value={radius}>
      <span>{radius}</span>
    </div>
    <div class="row">
      <span>block size</span>
      <input type="range" min="6" max="18" step="2" bind:value={blockSize}>
      <span>{blockSize}</span>
    </div>
    <div class="tips">
      Tips: if single-frame structure leaks, try smaller <code>gain</code>, larger <code>block</code>, smaller <code>rad</code>, or lower <code>ρ</code>.
      The display is intentionally pixelated (nearest-neighbor).
    </div>
  </div>
</div>

<style>
  .motion-noise-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    max-height: 800px;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -14px;
    margin-right: -14px;
  }

  /* Mobile: fill the screen */
  @media (max-width: 768px) {
    .motion-noise-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      max-height: none;
      margin: 0;
      z-index: 10;
    }
  }

  .motion-canvas {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }

  .hud {
    position: absolute;
    left: 10px;
    top: 10px;
    color: #fff;
    font: 12px/1.3 system-ui, sans-serif;
    background: rgba(0,0,0,0.45);
    padding: 10px;
    border-radius: 10px;
    max-width: 360px;
    backdrop-filter: blur(4px);
  }

  /* Mobile: smaller HUD */
  @media (max-width: 768px) {
    .hud {
      font-size: 11px;
      padding: 8px;
      max-width: calc(100vw - 20px);
      left: 5px;
      top: 5px;
    }

    .hud input {
      width: 120px !important;
    }
  }

  .hud input {
    width: 180px;
  }

  .hud .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: 6px 0;
  }

  .hud code {
    color: #9ef;
  }

  .tips {
    margin-top: 8px;
    opacity: 0.9;
  }

  /* Mobile: hide tips to save space */
  @media (max-width: 768px) {
    .tips {
      display: none;
    }
  }
</style>
