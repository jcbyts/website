<script>
  import { onMount } from 'svelte';

  let canvas;
  let gl;
  let video;
  
  // UI state
  let rho = 0.92;
  let gain = 1.0;
  let flowSigma = 0.0;  // optional flow smoothing (0 = none)
  let flowPrior = 0.5;  // Gaussian prior at zero velocity (regularization)

  // Internal resolution (keep small for phone)
  const INTERNAL_W = 192;
  const INTERNAL_H = 144;

  // CPU grayscale buffers (float32 [0,1])
  let prevGray = new Float32Array(INTERNAL_W * INTERNAL_H);
  let currGray = new Float32Array(INTERNAL_W * INTERNAL_H);
  let flowDense = new Float32Array(INTERNAL_W * INTERNAL_H * 2);

  // Pyramid buffers for Lucas-Kanade (3 levels: 192x144, 96x72, 48x36)
  const pyramidLevels = 3;
  const pyramids = {
    prev: [],
    curr: []
  };

  // Initialize pyramid levels
  for (let L = 0; L < pyramidLevels; L++) {
    const w = INTERNAL_W >> L;
    const h = INTERNAL_H >> L;
    pyramids.prev.push(new Float32Array(w * h));
    pyramids.curr.push(new Float32Array(w * h));
  }

  // Temp buffers for separable blur and LK computation
  const tmpA = new Float32Array(INTERNAL_W * INTERNAL_H);
  const tmpB = new Float32Array(INTERNAL_W * INTERNAL_H);
  const tmpWarp = new Float32Array(INTERNAL_W * INTERNAL_H);

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
  let isUserFacing = false;
  let lastVideoTime = -1;

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

      // Detect actual facing mode from track settings
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings?.() ?? {};
      isUserFacing = settings.facingMode === 'user';
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

  function boxBlurSep(src, W, H, r, dst) {
  // horizontal into tmpA
  for (let y=0; y<H; y++) {
    let sum = 0;
    for (let k=-r; k<=r; k++) sum += src[y*W + Math.min(W-1, Math.max(0, k))];
    for (let x=0; x<W; x++) {
      tmpA[y*W + x] = sum / (2*r+1);
      const x0 = Math.max(0, x - r);
      const x1 = Math.min(W-1, x + r + 1);
      sum += src[y*W + x1] - src[y*W + x0];
    }
  }
  // vertical into dst
  for (let x=0; x<W; x++) {
    let sum = 0;
    for (let k=-r; k<=r; k++) sum += tmpA[Math.min(H-1, Math.max(0, k))*W + x];
    for (let y=0; y<H; y++) {
      dst[y*W + x] = sum / (2*r+1);
      const y0 = Math.max(0, y - r);
      const y1 = Math.min(H-1, y + r + 1);
      sum += tmpA[y1*W + x] - tmpA[y0*W + x];
    }
  }
}

// fast “matchable” image: high-pass + clamp
function preprocessForFlow(gray, W, H) {
  // small blur (r=2) -> tmpB
  boxBlurSep(gray, W, H, 2, tmpB);

  // high-pass
  for (let i=0; i<gray.length; i++) {
    let x = gray[i] - tmpB[i];
    // clamp outliers (helps a lot on phone noise)
    if (x < -0.2) x = -0.2;
    if (x >  0.2) x =  0.2;
    gray[i] = x;
  }
}

// Downsample 2x2 average for pyramid
function down2x(src, W, H, dst) {
  const W2 = W >> 1;
  const H2 = H >> 1;
  for (let y = 0; y < H2; y++) {
    const y0 = (2 * y) * W;
    const y1 = (2 * y + 1) * W;
    for (let x = 0; x < W2; x++) {
      const x0 = 2 * x;
      dst[y * W2 + x] = 0.25 * (src[y0 + x0] + src[y0 + x0 + 1] + src[y1 + x0] + src[y1 + x0 + 1]);
    }
  }
}

// Build image pyramid
function buildPyramid(img, pyramid) {
  // Level 0 is the original
  pyramid[0].set(img);

  // Downsample for each subsequent level
  for (let L = 1; L < pyramidLevels; L++) {
    const wPrev = INTERNAL_W >> (L - 1);
    const hPrev = INTERNAL_H >> (L - 1);
    down2x(pyramid[L - 1], wPrev, hPrev, pyramid[L]);
  }
}

// Dense pyramid Lucas-Kanade optical flow
function computeDensePyramidLK(prevPyr, currPyr, flowOut) {
  const winSize = 11;  // LK window size
  const halfWin = Math.floor(winSize / 2);
  const iterations = 3;  // iterations per level

  // Gaussian prior at zero velocity (regularization)
  // Higher lambda = stronger bias toward zero flow
  const lambda = flowPrior;  // Use UI parameter

  // Store flow at each level for upsampling
  let uPrev = null;
  let vPrev = null;

  // Start from coarsest level
  for (let L = pyramidLevels - 1; L >= 0; L--) {
    const W = INTERNAL_W >> L;
    const H = INTERNAL_H >> L;
    const prev = prevPyr[L];
    const curr = currPyr[L];

    // Allocate flow for this level
    const u = new Float32Array(W * H);
    const v = new Float32Array(W * H);

    // If not coarsest, upsample flow from previous (coarser) level
    if (uPrev !== null) {
      const WPrev = INTERNAL_W >> (L + 1);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const xPrev = Math.floor(x / 2);
          const yPrev = Math.floor(y / 2);
          const iPrev = yPrev * WPrev + xPrev;
          const i = y * W + x;
          u[i] = uPrev[iPrev] * 2.0;
          v[i] = vPrev[iPrev] * 2.0;
        }
      }
    }

    // Iterative refinement at this level
    for (let iter = 0; iter < iterations; iter++) {
      // Warp curr toward prev using current flow
      warpBilinear(curr, W, H, u, v, tmpWarp);

      // Compute gradients on warped image
      const Ix = new Float32Array(W * H);
      const Iy = new Float32Array(W * H);
      computeGradients(tmpWarp, W, H, Ix, Iy);

      // Compute temporal derivative
      const It = new Float32Array(W * H);
      for (let i = 0; i < W * H; i++) {
        It[i] = tmpWarp[i] - prev[i];
      }

      // Solve LK for each pixel
      for (let y = halfWin; y < H - halfWin; y++) {
        for (let x = halfWin; x < W - halfWin; x++) {
          let Axx = 0, Axy = 0, Ayy = 0, bx = 0, by = 0;

          // Sum over window
          for (let dy = -halfWin; dy <= halfWin; dy++) {
            for (let dx = -halfWin; dx <= halfWin; dx++) {
              const i = (y + dy) * W + (x + dx);
              const ix = Ix[i];
              const iy = Iy[i];
              const it = It[i];

              Axx += ix * ix;
              Axy += ix * iy;
              Ayy += iy * iy;
              bx -= ix * it;
              by -= iy * it;
            }
          }

          // Solve 2x2 system with Gaussian prior at zero
          // Add regularization: (A + lambda*I) * du = b - lambda*u
          const i = y * W + x;
          const Axx_reg = Axx + lambda;
          const Ayy_reg = Ayy + lambda;
          const bx_reg = bx - lambda * u[i];
          const by_reg = by - lambda * v[i];

          const det = Axx_reg * Ayy_reg - Axy * Axy;
          if (det > 1e-4) {
            let du = (Ayy_reg * bx_reg - Axy * by_reg) / det;
            let dv = (-Axy * bx_reg + Axx_reg * by_reg) / det;

            // Clamp step
            du = Math.max(-1, Math.min(1, du));
            dv = Math.max(-1, Math.min(1, dv));

            u[i] += du;
            v[i] += dv;
          }
        }
      }
    }

    // Save flow for upsampling to next finer level
    uPrev = u;
    vPrev = v;
  }

  // Copy finest level flow to output (interleaved format)
  for (let i = 0; i < INTERNAL_W * INTERNAL_H; i++) {
    flowOut[i * 2 + 0] = uPrev[i];
    flowOut[i * 2 + 1] = vPrev[i];
  }

  // Optional: smooth final flow
  if (flowSigma > 0) {
    const r = Math.max(1, Math.round(flowSigma));
    const uSmooth = new Float32Array(INTERNAL_W * INTERNAL_H);
    const vSmooth = new Float32Array(INTERNAL_W * INTERNAL_H);

    for (let i = 0; i < INTERNAL_W * INTERNAL_H; i++) {
      uSmooth[i] = flowOut[i * 2 + 0];
      vSmooth[i] = flowOut[i * 2 + 1];
    }

    boxBlur2D(uSmooth, INTERNAL_W, INTERNAL_H, r, tmpA);
    boxBlur2D(vSmooth, INTERNAL_W, INTERNAL_H, r, tmpB);

    for (let i = 0; i < INTERNAL_W * INTERNAL_H; i++) {
      flowOut[i * 2 + 0] = tmpA[i];
      flowOut[i * 2 + 1] = tmpB[i];
    }
  }
}

// Bilinear warp
function warpBilinear(src, W, H, u, v, dst) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const fx = x + u[i];
      const fy = y + v[i];

      const x0 = Math.max(0, Math.min(W - 2, Math.floor(fx)));
      const y0 = Math.max(0, Math.min(H - 2, Math.floor(fy)));
      const x1 = x0 + 1;
      const y1 = y0 + 1;

      const wx = fx - x0;
      const wy = fy - y0;

      const i00 = y0 * W + x0;
      const i10 = y0 * W + x1;
      const i01 = y1 * W + x0;
      const i11 = y1 * W + x1;

      dst[i] = (1 - wx) * (1 - wy) * src[i00] +
               wx * (1 - wy) * src[i10] +
               (1 - wx) * wy * src[i01] +
               wx * wy * src[i11];
    }
  }
}

// Compute gradients
function computeGradients(img, W, H, Ix, Iy) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;

      const xm = Math.max(0, x - 1);
      const xp = Math.min(W - 1, x + 1);
      Ix[i] = (img[y * W + xp] - img[y * W + xm]) * 0.5;

      const ym = Math.max(0, y - 1);
      const yp = Math.min(H - 1, y + 1);
      Iy[i] = (img[yp * W + x] - img[ym * W + x]) * 0.5;
    }
  }
}

// Box blur 2D
function boxBlur2D(src, W, H, r, dst) {
  if (r <= 0) {
    dst.set(src);
    return;
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0, cnt = 0;
      for (let dx = -r; dx <= r; dx++) {
        const xx = x + dx;
        if (xx >= 0 && xx < W) {
          sum += src[y * W + xx];
          cnt++;
        }
      }
      tmpA[y * W + x] = sum / cnt;
    }
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0, cnt = 0;
      for (let dy = -r; dy <= r; dy++) {
        const yy = y + dy;
        if (yy >= 0 && yy < H) {
          sum += tmpA[yy * W + x];
          cnt++;
        }
      }
      dst[y * W + x] = sum / cnt;
    }
  }
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
  if (u_useFloat == 1) {
    return f.rg;  // Direct pixel values
  } else {
    // Decode from UNORM8: map [0,1] -> [-MAX_FLOW, MAX_FLOW]
    const float MAX_FLOW = 16.0;
    return (f.rg * 2.0 - 1.0) * MAX_FLOW;
  }
}

// BORDER_REFLECT101 for a single axis
float reflect101(float x, float maxVal) {
  float m = maxVal;
  x = abs(x);
  float period = 2.0 * m;
  float t = mod(x, period);
  if (t > m) t = period - t;
  return t;
}

void main(){
  vec2 flow_px = readFlow(v_uv) * u_flowGain;

  // Backward warp: p' = p - flow
  vec2 p = v_uv * u_texSize - 0.5;  // pixel-centered coords
  vec2 q = p - flow_px;

  // Apply BORDER_REFLECT101
  q.x = reflect101(q.x, u_texSize.x - 1.0);
  q.y = reflect101(q.y, u_texSize.y - 1.0);

  // Convert back to UV for nearest-neighbor sampling
  vec2 uv_warp = (floor(q) + 0.5) / u_texSize;

  float warped = readStim(uv_warp);
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
  offCtx.setTransform(1,0,0,1,0,0);
  offCtx.clearRect(0,0,INTERNAL_W, INTERNAL_H);

  if (isUserFacing) {
    offCtx.translate(INTERNAL_W, 0);
    offCtx.scale(-1, 1); // mirror horizontally only
  }

  offCtx.drawImage(video, 0, 0, INTERNAL_W, INTERNAL_H);
  offCtx.restore();

  const im = offCtx.getImageData(0,0,INTERNAL_W, INTERNAL_H).data;
  for (let i=0, j=0; j<bufFloat.length; j++, i+=4) {
    const r = im[i], g = im[i+1], b = im[i+2];
    bufFloat[j] = (0.2126*r + 0.7152*g + 0.0722*b) / 255.0;
  }
}




  function uploadFlowTexture(tex, flowDense, W, H) {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    if (useFloat) {
      // Direct upload: flow values are in pixels
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0,0, W,H, gl.RG, gl.FLOAT, flowDense);
    } else {
      // Encode to UNORM8: map [-MAX_FLOW, MAX_FLOW] -> [0, 255]
      const MAX_FLOW = 16.0;
      const enc = new Uint8Array(W*H*4);
      for (let i=0; i<W*H; i++) {
        let u = flowDense[2*i+0];
        let v = flowDense[2*i+1];
        u = Math.max(-MAX_FLOW, Math.min(MAX_FLOW, u));
        v = Math.max(-MAX_FLOW, Math.min(MAX_FLOW, v));
        const ru = ((u/MAX_FLOW)*0.5 + 0.5) * 255;
        const rv = ((v/MAX_FLOW)*0.5 + 0.5) * 255;
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

    // Only compute flow when new video frame arrives
    const currentVideoTime = video.currentTime;
    if (currentVideoTime !== lastVideoTime) {
      lastVideoTime = currentVideoTime;

      grabGrayscaleInto(currGray);

      if (!initializedPrev) {
        prevGray.set(currGray);
        initializedPrev = true;
        animationId = requestAnimationFrame(step);
        return;
      }

      // Build pyramids
      buildPyramid(prevGray, pyramids.prev);
      buildPyramid(currGray, pyramids.curr);

      // Compute dense pyramid LK flow
      computeDensePyramidLK(pyramids.prev, pyramids.curr, flowDense);

      // Sanity check for NaNs
      for (let i = 0; i < flowDense.length; i += 2) {
        if (!Number.isFinite(flowDense[i]) || !Number.isFinite(flowDense[i + 1])) {
          console.warn('NaN flow at index', i);
          flowDense[i] = 0;
          flowDense[i + 1] = 0;
        }
      }

      uploadFlowTexture(flowTex, flowDense, INTERNAL_W, INTERNAL_H);

      // Advance frame
      prevGray.set(currGray);
    }

    // Render stimulus every frame (not just when video updates)

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
      <span>flow smooth (σ)</span>
      <input type="range" min="0" max="6" step="0.5" bind:value={flowSigma}>
      <span>{flowSigma.toFixed(1)}</span>
    </div>
    <div class="row">
      <span>flow prior (λ)</span>
      <input type="range" min="0" max="2.0" step="0.1" bind:value={flowPrior}>
      <span>{flowPrior.toFixed(1)}</span>
    </div>
    <div class="tips">
      Dense pyramid Lucas-Kanade flow with Gaussian prior at zero velocity.
      Adjust <code>λ</code> to reduce noise (higher = stronger bias toward zero flow).
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
