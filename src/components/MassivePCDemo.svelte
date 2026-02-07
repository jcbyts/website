<script>
  // ─────────────────────────────────────────────────────
  // ODE Solvers & Simulation
  // ─────────────────────────────────────────────────────

  function stimulus(t, tOn, tOff) {
    return t >= tOn && t < tOff ? 1.0 : 0.0;
  }

  function runMassless({ dt, T, tOn, tOff, sigma1, sigma2, theta }) {
    const N = Math.floor(T / dt);
    const time = [], u1Arr = [], u2Arr = [], e1Arr = [], e2Arr = [], du1Arr = [];
    let u1 = 0, u2 = 0;
    for (let i = 0; i < N; i++) {
      const t = i * dt;
      const x = stimulus(t, tOn, tOff);
      const err1 = (x - theta * u1) / (sigma1 * sigma1);
      const err2 = (u1 - u2) / (sigma2 * sigma2);
      const du1 = theta * err1 - err2;
      const du2 = err2;
      time.push(t); u1Arr.push(u1); u2Arr.push(u2);
      e1Arr.push(err1); e2Arr.push(err2); du1Arr.push(du1);
      u1 += du1 * dt;
      u2 += du2 * dt;
    }
    return { time, u1: u1Arr, u2: u2Arr, e1: e1Arr, e2: e2Arr, du1: du1Arr };
  }

  function runMassive({ dt, T, tOn, tOff, sigma1, sigma2, theta, mass, gamma }) {
    const N = Math.floor(T / dt);
    const time = [], u1Arr = [], u2Arr = [], e1Arr = [], e2Arr = [], v1Arr = [];
    let u1 = 0, v1 = 0, u2 = 0, v2 = 0;
    for (let i = 0; i < N; i++) {
      const t = i * dt;
      const x = stimulus(t, tOn, tOff);
      const err1 = (x - theta * u1) / (sigma1 * sigma1);
      const err2 = (u1 - u2) / (sigma2 * sigma2);
      const force1 = theta * err1 - err2;
      const force2 = err2;
      const dv1 = (1 / mass) * (-gamma * v1 + force1);
      const dv2 = (1 / mass) * (-gamma * v2 + force2);
      time.push(t); u1Arr.push(u1); u2Arr.push(u2);
      e1Arr.push(err1); e2Arr.push(err2); v1Arr.push(v1);
      u1 += v1 * dt; v1 += dv1 * dt;
      u2 += v2 * dt; v2 += dv2 * dt;
    }
    return { time, u1: u1Arr, u2: u2Arr, e1: e1Arr, e2: e2Arr, v1: v1Arr };
  }

  // ─────────────────────────────────────────────────────
  // MiniPlot helper
  // ─────────────────────────────────────────────────────

  function buildPlot(data, xKey, yKeys, colors, labels, title, yLabel, width = 520, height = 180) {
    const pad = { top: 28, right: 16, bottom: 32, left: 52 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;
    const xs = data[xKey];
    const allYs = yKeys.flatMap(k => data[k]);
    const xMin = xs[0], xMax = xs[xs.length - 1];
    let yMin = Math.min(0, ...allYs);
    let yMax = Math.max(0.01, ...allYs);
    const yPad = (yMax - yMin) * 0.12 || 0.1;
    yMin -= yPad; yMax += yPad;
    const sx = v => pad.left + ((v - xMin) / (xMax - xMin)) * w;
    const sy = v => pad.top + (1 - (v - yMin) / (yMax - yMin)) * h;
    const step = Math.max(1, Math.floor(xs.length / 400));
    // Build path strings
    const paths = yKeys.map(k => {
      const ys = data[k];
      let d = "";
      for (let i = 0; i < xs.length; i += step) {
        d += `${i === 0 ? "M" : "L"}${sx(xs[i]).toFixed(1)},${sy(ys[i]).toFixed(1)}`;
      }
      return d;
    });
    // X ticks
    const xTicks = [0, 0.25, 0.5, 0.75, 1].map(f => {
      const v = xMin + f * (xMax - xMin);
      return { x: sx(v), label: v.toFixed(1) };
    });
    // Y ticks
    const yTicks = [0, 0.5, 1].map(f => {
      const v = yMin + f * (yMax - yMin);
      return { y: sy(v), label: v.toFixed(2) };
    });
    // Legend items
    const legendItems = labels.map((lb, li) => ({
      tx: pad.left + 8 + li * 120, label: lb, color: colors[li]
    }));
    return { pad, w, h, width, height, sx, sy, paths, colors, xTicks, yTicks, title, yLabel, legendItems, zeroY: sy(0) };
  }

  // ─────────────────────────────────────────────────────
  // Reactive state
  // ─────────────────────────────────────────────────────

  let mass = 0.08;
  let gamma = 1.0;
  let theta = 1.0;
  let sigma1 = 1.0;
  let sigma2 = 1.5;

  const simParams = { dt: 0.0005, T: 5.0, tOn: 1.0, tOff: 3.5 };

  $: params = { ...simParams, sigma1, sigma2, theta };
  $: massless = runMassless(params);
  $: massive = runMassive({ ...params, mass, gamma });
  $: stimTrace = massless.time.map(t => stimulus(t, simParams.tOn, simParams.tOff));

  // Damping ratio
  $: kApprox = (theta * theta) / (sigma1 * sigma1) + 1 / (sigma2 * sigma2);
  $: zetaApprox = gamma / (2 * Math.sqrt(mass * kApprox));
  $: regimeLabel = zetaApprox > 1 ? "Overdamped" : zetaApprox > 0.99 ? "≈ Critical" : "Underdamped";

  // Build all 6 plots reactively
  $: plot1 = buildPlot(
    { time: massless.time, stim: stimTrace, u1: massless.u1 },
    "time", ["stim", "u1"], ["#555", "#4fc3f7"],
    ["stimulus", "u₁ (massless)"],
    "MASSLESS: u₁ — exponential rise, no overshoot", "u₁"
  );
  $: plot2 = buildPlot(
    { time: massive.time, stim: stimTrace, u1: massive.u1 },
    "time", ["stim", "u1"], ["#555", "#f5a623"],
    ["stimulus", "u₁ (massive)"],
    "MASSIVE: u₁ — overshoot, ringing, adaptation", "u₁"
  );
  $: plot3 = buildPlot(
    { time: massless.time, e1_ml: massless.e1, e1_m: massive.e1 },
    "time", ["e1_ml", "e1_m"], ["#4fc3f7", "#f5a623"],
    ["ε₁ massless", "ε₁ massive"],
    "PREDICTION ERRORS: ε₁ comparison", "ε₁"
  );
  $: plot4 = buildPlot(
    { time: massive.time, v1: massive.v1 },
    "time", ["v1"], ["#ff6b6b"],
    ["du₁/dt (massive)"],
    "VELOCITY: du₁/dt — the thing that looks like a neuron", "du₁/dt"
  );
  $: plot5 = buildPlot(
    { time: massless.time, du1: massless.du1 },
    "time", ["du1"], ["#4fc3f7"],
    ["du₁/dt (massless)"],
    "VELOCITY (MASSLESS): du₁/dt = force (no independent dynamics)", "du₁/dt"
  );
  $: plot6 = buildPlot(
    { time: massive.time, u2_ml: massless.u2, u2_m: massive.u2 },
    "time", ["u2_ml", "u2_m"], ["#4fc3f7", "#f5a623"],
    ["u₂ massless", "u₂ massive"],
    "HIGHER LAYER: u₂ comparison", "u₂"
  );

  $: allPlots = [plot1, plot2, plot3, plot4, plot5, plot6];
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
</svelte:head>

<div class="mpc-root">
  <!-- Controls -->
  <div class="mpc-controls">
    <div class="mpc-controls-header">
      <span class="mpc-label" style="font-size:13px; color:#ddd;">Parameters</span>
      <span class="mpc-badge" class:underdamped={zetaApprox < 1}>
        ζ ≈ {zetaApprox.toFixed(2)} → {regimeLabel}
      </span>
    </div>
    <div class="mpc-grid">
      <div>
        <div class="mpc-slider-row">
          <span class="mpc-label">mass (m)</span><span class="mpc-val">{mass.toFixed(3)}</span>
        </div>
        <input type="range" min="0.001" max="0.5" step="0.001" bind:value={mass} class="mpc-slider" />
      </div>
      <div>
        <div class="mpc-slider-row">
          <span class="mpc-label">friction (γ)</span><span class="mpc-val">{gamma.toFixed(2)}</span>
        </div>
        <input type="range" min="0.1" max="4.0" step="0.01" bind:value={gamma} class="mpc-slider" />
      </div>
      <div>
        <div class="mpc-slider-row">
          <span class="mpc-label">θ (weight)</span><span class="mpc-val">{theta.toFixed(2)}</span>
        </div>
        <input type="range" min="0.1" max="2.0" step="0.01" bind:value={theta} class="mpc-slider" />
      </div>
      <div>
        <div class="mpc-slider-row">
          <span class="mpc-label">σ₁ / σ₂</span><span class="mpc-val">{sigma1.toFixed(1)} / {sigma2.toFixed(1)}</span>
        </div>
        <input type="range" min="0.3" max="3.0" step="0.1" bind:value={sigma2} class="mpc-slider" />
      </div>
    </div>
  </div>

  <!-- Plots -->
  {#each allPlots as p}
    <div class="mpc-plot-box">
      <svg width={p.width} height={p.height} viewBox="0 0 {p.width} {p.height}" style="display:block; max-width:100%; height:auto;">
        <!-- title -->
        <text x={p.pad.left + p.w / 2} y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#c4c4c4" font-family="'IBM Plex Mono', monospace">{p.title}</text>
        <!-- axes -->
        <line x1={p.pad.left} y1={p.zeroY} x2={p.pad.left + p.w} y2={p.zeroY} stroke="#444" stroke-width="0.5" stroke-dasharray="4,3" />
        <line x1={p.pad.left} y1={p.pad.top} x2={p.pad.left} y2={p.pad.top + p.h} stroke="#555" stroke-width="1" />
        <line x1={p.pad.left} y1={p.pad.top + p.h} x2={p.pad.left + p.w} y2={p.pad.top + p.h} stroke="#555" stroke-width="1" />
        <!-- y-label -->
        {#if p.yLabel}
          <text x="14" y={p.pad.top + p.h / 2} text-anchor="middle" font-size="10" fill="#888" font-family="'IBM Plex Mono', monospace" transform="rotate(-90,14,{p.pad.top + p.h / 2})">{p.yLabel}</text>
        {/if}
        <!-- x ticks -->
        {#each p.xTicks as tick}
          <text x={tick.x} y={p.pad.top + p.h + 14} text-anchor="middle" font-size="9" fill="#777" font-family="'IBM Plex Mono', monospace">{tick.label}</text>
        {/each}
        <!-- y ticks -->
        {#each p.yTicks as tick}
          <text x={p.pad.left - 6} y={tick.y + 3} text-anchor="end" font-size="9" fill="#777" font-family="'IBM Plex Mono', monospace">{tick.label}</text>
        {/each}
        <!-- traces -->
        {#each p.paths as d, i}
          <path {d} fill="none" stroke={p.colors[i]} stroke-width="1.8" opacity="0.9" />
        {/each}
        <!-- legend -->
        {#each p.legendItems as item}
          <g transform="translate({item.tx}, {p.pad.top + 12})">
            <line x1="0" y1="0" x2="16" y2="0" stroke={item.color} stroke-width="2" />
            <text x="20" y="4" font-size="10" fill={item.color} font-family="'IBM Plex Mono', monospace">{item.label}</text>
          </g>
        {/each}
      </svg>
    </div>
  {/each}

  <!-- Footer hint -->
  <div class="mpc-footer">
    Try: set m very small to recover standard PC · set m large, γ small for strong ringing · ζ &lt; 1 = underdamped
  </div>
</div>

<style>
  .mpc-root {
    background: #111110;
    padding: 24px;
    border-radius: 8px;
    color: #ccc;
  }
  .mpc-controls {
    background: #1a1917;
    border: 1px solid #2a2a27;
    border-radius: 6px;
    padding: 18px 20px;
    margin-bottom: 20px;
  }
  .mpc-controls-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .mpc-badge {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 3px;
    background: #4a4a4a33;
    color: #999;
    border: 1px solid #3a3a3a;
  }
  .mpc-badge.underdamped {
    background: #f5a62322;
    color: #f5a623;
    border-color: #f5a62355;
  }
  .mpc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 24px;
  }
  @media (max-width: 500px) {
    .mpc-grid { grid-template-columns: 1fr; }
  }
  .mpc-slider-row {
    display: flex;
    justify-content: space-between;
  }
  .mpc-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #999;
  }
  .mpc-val {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    color: #f5a623;
    font-weight: 700;
  }
  .mpc-slider {
    width: 100%;
    accent-color: #f5a623;
    cursor: pointer;
  }
  .mpc-plot-box {
    background: #161614;
    border: 1px solid #2a2a27;
    border-radius: 6px;
    padding: 14px;
    margin-bottom: 16px;
  }
  .mpc-footer {
    border-top: 1px solid #2a2a27;
    padding-top: 16px;
    margin-top: 20px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: #555;
    text-align: center;
  }
</style>

