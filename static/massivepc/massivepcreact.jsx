import { useState, useMemo, useCallback } from "react";

// ─────────────────────────────────────────────────────
// ODE Solvers & Simulation
// ─────────────────────────────────────────────────────

function stimulus(t, tOn, tOff) {
  return t >= tOn && t < tOff ? 1.0 : 0.0;
}

function runMassless({ dt, T, tOn, tOff, sigma1, sigma2, theta }) {
  // Rao & Ballard (1999) style 2-layer predictive coding
  //
  // Layer 1 (sensory):  u1 represents the "state" at level 1
  // Layer 2 (higher):   u2 represents the "state" at level 2
  //
  // Generative model:   x_pred = theta * u1   (top-down prediction of input)
  //                     u1_pred = u2           (top-down prediction of u1)
  //
  // Prediction errors:  e1 = (x - theta*u1) / sigma1^2   (sensory error)
  //                     e2 = (u1 - u2)      / sigma2^2   (higher error)
  //
  // Dynamics (gradient descent on variational free energy):
  //   du1/dt = -theta * e1 + e2     (note: theta appears because d/du1 of theta*u1)
  //            ~~ wait, let's be careful with signs ~~
  //
  // Actually, F = (1/2)*e1^2*sigma1^2 + (1/2)*e2^2*sigma2^2  (up to constants)
  // but the standard form: du/dt = - dF/du
  //
  // dF/du1 = -(x - theta*u1)*theta/sigma1^2 + (u1 - u2)/sigma2^2
  // dF/du2 = -(u1 - u2)/sigma2^2
  //
  // So:
  //   du1/dt = theta*(x - theta*u1)/sigma1^2 - (u1 - u2)/sigma2^2
  //   du2/dt = (u1 - u2)/sigma2^2

  const N = Math.floor(T / dt);
  const time = [];
  const u1Arr = [];
  const u2Arr = [];
  const e1Arr = [];
  const e2Arr = [];
  const du1Arr = [];

  let u1 = 0;
  let u2 = 0;

  for (let i = 0; i < N; i++) {
    const t = i * dt;
    const x = stimulus(t, tOn, tOff);

    const err1 = (x - theta * u1) / (sigma1 * sigma1);
    const err2 = (u1 - u2) / (sigma2 * sigma2);

    const du1 = theta * err1 - err2;
    const du2 = err2;

    time.push(t);
    u1Arr.push(u1);
    u2Arr.push(u2);
    e1Arr.push(err1);
    e2Arr.push(err2);
    du1Arr.push(du1);

    // Euler step
    u1 += du1 * dt;
    u2 += du2 * dt;
  }
  return { time, u1: u1Arr, u2: u2Arr, e1: e1Arr, e2: e2Arr, du1: du1Arr };
}

function runMassive({ dt, T, tOn, tOff, sigma1, sigma2, theta, mass, gamma }) {
  // Same free energy, but now second-order dynamics:
  //   m * d²u1/dt² + gamma * du1/dt = theta*(x - theta*u1)/sigma1^2 - (u1 - u2)/sigma2^2
  //   m * d²u2/dt² + gamma * du2/dt = (u1 - u2)/sigma2^2
  //
  // Rewritten as first-order system (for numerics only):
  //   du1/dt = v1
  //   dv1/dt = (1/m) * [ -gamma*v1 + theta*(x-theta*u1)/sigma1^2 - (u1-u2)/sigma2^2 ]
  //   du2/dt = v2
  //   dv2/dt = (1/m) * [ -gamma*v2 + (u1-u2)/sigma2^2 ]

  const N = Math.floor(T / dt);
  const time = [];
  const u1Arr = [];
  const u2Arr = [];
  const e1Arr = [];
  const e2Arr = [];
  const v1Arr = [];

  let u1 = 0, v1 = 0;
  let u2 = 0, v2 = 0;

  for (let i = 0; i < N; i++) {
    const t = i * dt;
    const x = stimulus(t, tOn, tOff);

    const err1 = (x - theta * u1) / (sigma1 * sigma1);
    const err2 = (u1 - u2) / (sigma2 * sigma2);

    const force1 = theta * err1 - err2;
    const force2 = err2;

    const dv1 = (1 / mass) * (-gamma * v1 + force1);
    const dv2 = (1 / mass) * (-gamma * v2 + force2);

    time.push(t);
    u1Arr.push(u1);
    u2Arr.push(u2);
    e1Arr.push(err1);
    e2Arr.push(err2);
    v1Arr.push(v1);

    // Euler step
    u1 += v1 * dt;
    v1 += dv1 * dt;
    u2 += v2 * dt;
    v2 += dv2 * dt;
  }
  return { time, u1: u1Arr, u2: u2Arr, e1: e1Arr, e2: e2Arr, v1: v1Arr };
}

// ─────────────────────────────────────────────────────
// Plotting with SVG
// ─────────────────────────────────────────────────────

function MiniPlot({ data, xKey, yKeys, colors, labels, title, width = 520, height = 180, yLabel }) {
  const pad = { top: 28, right: 16, bottom: 32, left: 52 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  const xs = data[xKey];
  const allYs = yKeys.flatMap((k) => data[k]);
  const xMin = xs[0], xMax = xs[xs.length - 1];
  let yMin = Math.min(0, ...allYs);
  let yMax = Math.max(0.01, ...allYs);
  const yPad = (yMax - yMin) * 0.12 || 0.1;
  yMin -= yPad;
  yMax += yPad;

  const sx = (v) => pad.left + ((v - xMin) / (xMax - xMin)) * w;
  const sy = (v) => pad.top + (1 - (v - yMin) / (yMax - yMin)) * h;

  const step = Math.max(1, Math.floor(xs.length / 400));

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <text x={pad.left + w / 2} y={14} textAnchor="middle" fontSize="12" fontWeight="600" fill="#c4c4c4" fontFamily="'IBM Plex Mono', monospace">{title}</text>
      {/* axes */}
      <line x1={pad.left} y1={sy(0)} x2={pad.left + w} y2={sy(0)} stroke="#444" strokeWidth="0.5" strokeDasharray="4,3" />
      <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + h} stroke="#555" strokeWidth="1" />
      <line x1={pad.left} y1={pad.top + h} x2={pad.left + w} y2={pad.top + h} stroke="#555" strokeWidth="1" />
      {/* y‑label */}
      {yLabel && <text x={14} y={pad.top + h / 2} textAnchor="middle" fontSize="10" fill="#888" fontFamily="'IBM Plex Mono', monospace" transform={`rotate(-90,14,${pad.top + h / 2})`}>{yLabel}</text>}
      {/* x ticks */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const v = xMin + f * (xMax - xMin);
        return <text key={f} x={sx(v)} y={pad.top + h + 14} textAnchor="middle" fontSize="9" fill="#777" fontFamily="'IBM Plex Mono', monospace">{v.toFixed(1)}</text>;
      })}
      {/* y ticks */}
      {[0, 0.5, 1].map((f) => {
        const v = yMin + f * (yMax - yMin);
        return <text key={f} x={pad.left - 6} y={sy(v) + 3} textAnchor="end" fontSize="9" fill="#777" fontFamily="'IBM Plex Mono', monospace">{v.toFixed(2)}</text>;
      })}
      {/* traces */}
      {yKeys.map((k, ki) => {
        const ys = data[k];
        let d = "";
        for (let i = 0; i < xs.length; i += step) {
          const cmd = i === 0 ? "M" : "L";
          d += `${cmd}${sx(xs[i]).toFixed(1)},${sy(ys[i]).toFixed(1)}`;
        }
        return <path key={k} d={d} fill="none" stroke={colors[ki]} strokeWidth="1.8" opacity="0.9" />;
      })}
      {/* legend */}
      {labels.map((lb, li) => (
        <g key={li} transform={`translate(${pad.left + 8 + li * 120}, ${pad.top + 12})`}>
          <line x1={0} y1={0} x2={16} y2={0} stroke={colors[li]} strokeWidth="2" />
          <text x={20} y={4} fontSize="10" fill={colors[li]} fontFamily="'IBM Plex Mono', monospace">{lb}</text>
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────
// Equation display components
// ─────────────────────────────────────────────────────

function Eq({ children }) {
  return <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "14px", color: "#e0d6c8", background: "#1a1917", borderLeft: "3px solid #f5a623", padding: "12px 16px", margin: "10px 0", borderRadius: "0 4px 4px 0", lineHeight: 1.7, overflowX: "auto" }}>{children}</div>;
}

function Section({ number, title, children }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "22px", fontWeight: 600, color: "#f5a623", marginBottom: "12px", borderBottom: "1px solid #333", paddingBottom: "6px" }}>
        <span style={{ color: "#777", marginRight: "8px" }}>§{number}</span>{title}
      </h2>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "15.5px", lineHeight: 1.72, color: "#ccc", margin: "10px 0" }}>{children}</p>;
}

function Hl({ children }) {
  return <span style={{ color: "#f5a623", fontWeight: 600 }}>{children}</span>;
}

function Code({ children }) {
  return <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: "#8ecfff", background: "#1a1a1f", padding: "1px 5px", borderRadius: "3px" }}>{children}</code>;
}

// ─────────────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────────────

export default function App() {
  const [mass, setMass] = useState(0.08);
  const [gamma, setGamma] = useState(1.0);
  const [theta, setTheta] = useState(1.0);
  const [sigma1, setSigma1] = useState(1.0);
  const [sigma2, setSigma2] = useState(1.5);

  const params = { dt: 0.0005, T: 5.0, tOn: 1.0, tOff: 3.5, sigma1, sigma2, theta };

  const massless = useMemo(() => runMassless(params), [sigma1, sigma2, theta]);
  const massive = useMemo(() => runMassive({ ...params, mass, gamma }), [sigma1, sigma2, theta, mass, gamma]);

  // Compute stimulus trace for overlay
  const stimTrace = useMemo(() => massless.time.map((t) => stimulus(t, params.tOn, params.tOff)), [sigma1, sigma2, theta]);

  // Damping ratio for display
  // approximate local curvature k ≈ theta^2/sigma1^2 + 1/sigma2^2
  const kApprox = (theta * theta) / (sigma1 * sigma1) + 1 / (sigma2 * sigma2);
  const zetaApprox = gamma / (2 * Math.sqrt(mass * kApprox));
  const regimeLabel = zetaApprox > 1 ? "Overdamped" : zetaApprox > 0.99 ? "≈ Critical" : "Underdamped";

  const sliderStyle = { width: "100%", accentColor: "#f5a623", cursor: "pointer" };
  const labelStyle = { fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "#999" };
  const valStyle = { fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: "#f5a623", fontWeight: 700 };

  return (
    <div style={{ background: "#111110", minHeight: "100vh", padding: "32px 0", color: "#ccc" }}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 24px" }}>

        {/* Title */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "30px", fontWeight: 600, color: "#f0ece4", lineHeight: 1.25, marginBottom: "6px" }}>
            Massive Predictive Coding
          </h1>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#777", margin: 0 }}>
            What happens when belief states have inertia?
          </p>
        </div>

        {/* §1 — Standard (Massless) */}
        <Section number="1" title="The Standard Model (Massless)">
          <P>
            Consider a 2-layer predictive coding network receiving sensory input <Code>x(t)</Code>.
            Layer 1 state <Code>u₁</Code> explains the input; layer 2 state <Code>u₂</Code> provides a prior on <Code>u₁</Code>.
            The generative model says: the predicted input is <Code>θ · u₁</Code>, and the predicted <Code>u₁</Code> is <Code>u₂</Code>.
          </P>
          <P>
            The <Hl>prediction errors</Hl> are:
          </P>
          <Eq>
            ε₁ = (x − θ·u₁) / σ₁² &nbsp;&nbsp; ← sensory error<br />
            ε₂ = (u₁ − u₂) / σ₂²&nbsp;&nbsp;&nbsp; ← higher-level error
          </Eq>
          <P>
            The states update by gradient descent on variational free energy <Code>F</Code>. This gives first-order (massless) dynamics:
          </P>
          <Eq>
            du₁/dt = θ·ε₁ − ε₂ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ← bottom-up error minus top-down error<br />
            du₂/dt = ε₂ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ← driven by mismatch with u₁
          </Eq>
          <P>
            These are <Hl>first-order ODEs</Hl>. Velocity <Code>du/dt</Code> is fully determined by the current state.
            No memory of past velocity. No overshoot. A step input produces an exponential rise — a <Hl>lowpass filter</Hl>.
          </P>
        </Section>

        {/* §2 — Adding Mass */}
        <Section number="2" title="Adding Mass (The Massive Variant)">
          <P>
            Now suppose each state has <Hl>inertia</Hl>. Physically: the membrane has capacitance that interacts with slow recovery currents, giving second-order dynamics. We replace the first-order rule with:
          </P>
          <Eq>
            m · d²u₁/dt² + γ · du₁/dt = θ·ε₁ − ε₂<br />
            m · d²u₂/dt² + γ · du₂/dt = ε₂
          </Eq>
          <P>
            The right-hand side is <Hl>identical</Hl> — same free energy, same prediction errors, same objective.
            The only change is the left-hand side: we've added an acceleration term <Code>m·ü</Code>. This is a choice about the <Hl>optimizer</Hl>, not the objective.
          </P>
          <P>
            The damping ratio <Code>ζ = γ / (2√(m·k))</Code>, where <Code>k</Code> is the local curvature of F, determines the character:
          </P>
          <Eq>
            ζ &gt; 1 → Overdamped &nbsp;(recovers standard PC)<br />
            ζ = 1 → Critically damped<br />
            ζ &lt; 1 → Underdamped &nbsp;(overshoot, ringing)
          </Eq>
        </Section>

        {/* §3 — What changes */}
        <Section number="3" title="What Changes?">
          <P>
            In the massless model, the <Hl>prediction error</Hl> is the thing that looks like a neuron — it has a transient response, it can be positive or negative, it signals surprise. That's why people hunt for "prediction error neurons."
          </P>
          <P>
            In the massive model, the <Hl>state itself</Hl> overshoots, rings, and shows onset transients. The velocity <Code>du/dt</Code> — which is just the time derivative of the membrane potential, not a separate variable — spikes at onset and adapts. This <Hl>looks like a real neuron</Hl> without needing to be reinterpreted as an error unit.
          </P>
          <P>
            The prediction error <Code>ε</Code> is still there, but it's just a <Hl>force</Hl>. It doesn't need its own neural population.
          </P>
        </Section>

        {/* §4 — Simulation */}
        <Section number="4" title="Simulation">
          <P>
            Below: a step stimulus <Code>x(t)</Code> that turns on at t=1 and off at t=3.5. Compare the massless and massive responses. Adjust mass and damping to see the effect.
          </P>

          {/* Controls */}
          <div style={{ background: "#1a1917", border: "1px solid #2a2a27", borderRadius: "6px", padding: "18px 20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ ...labelStyle, fontSize: "13px", color: "#ddd" }}>Parameters</span>
              <span style={{
                ...labelStyle,
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "3px",
                background: zetaApprox < 1 ? "#f5a62322" : "#4a4a4a33",
                color: zetaApprox < 1 ? "#f5a623" : "#999",
                border: `1px solid ${zetaApprox < 1 ? "#f5a62355" : "#3a3a3a"}`
              }}>
                ζ ≈ {zetaApprox.toFixed(2)} → {regimeLabel}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={labelStyle}>mass (m)</span><span style={valStyle}>{mass.toFixed(3)}</span>
                </div>
                <input type="range" min="0.001" max="0.5" step="0.001" value={mass} onChange={(e) => setMass(+e.target.value)} style={sliderStyle} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={labelStyle}>friction (γ)</span><span style={valStyle}>{gamma.toFixed(2)}</span>
                </div>
                <input type="range" min="0.1" max="4.0" step="0.01" value={gamma} onChange={(e) => setGamma(+e.target.value)} style={sliderStyle} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={labelStyle}>θ (weight)</span><span style={valStyle}>{theta.toFixed(2)}</span>
                </div>
                <input type="range" min="0.1" max="2.0" step="0.01" value={theta} onChange={(e) => setTheta(+e.target.value)} style={sliderStyle} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={labelStyle}>σ₁ / σ₂</span><span style={valStyle}>{sigma1.toFixed(1)} / {sigma2.toFixed(1)}</span>
                </div>
                <input type="range" min="0.3" max="3.0" step="0.1" value={sigma2} onChange={(e) => setSigma2(+e.target.value)} style={sliderStyle} />
              </div>
            </div>
          </div>

          {/* Plots */}
          <div style={{ background: "#161614", border: "1px solid #2a2a27", borderRadius: "6px", padding: "14px", marginBottom: "16px" }}>
            <MiniPlot
              data={{ time: massless.time, stim: stimTrace, u1: massless.u1 }}
              xKey="time" yKeys={["stim", "u1"]} colors={["#555", "#4fc3f7"]}
              labels={["stimulus", "u₁ (massless)"]}
              title="MASSLESS: u₁ — exponential rise, no overshoot"
              yLabel="u₁"
            />
          </div>

          <div style={{ background: "#161614", border: "1px solid #2a2a27", borderRadius: "6px", padding: "14px", marginBottom: "16px" }}>
            <MiniPlot
              data={{ time: massive.time, stim: stimTrace, u1: massive.u1 }}
              xKey="time" yKeys={["stim", "u1"]} colors={["#555", "#f5a623"]}
              labels={["stimulus", "u₁ (massive)"]}
              title="MASSIVE: u₁ — overshoot, ringing, adaptation"
              yLabel="u₁"
            />
          </div>

          <div style={{ background: "#161614", border: "1px solid #2a2a27", borderRadius: "6px", padding: "14px", marginBottom: "16px" }}>
            <MiniPlot
              data={{ time: massless.time, e1_ml: massless.e1, e1_m: massive.e1 }}
              xKey="time" yKeys={["e1_ml", "e1_m"]} colors={["#4fc3f7", "#f5a623"]}
              labels={["ε₁ massless", "ε₁ massive"]}
              title="PREDICTION ERRORS: ε₁ comparison"
              yLabel="ε₁"
            />
          </div>

          <div style={{ background: "#161614", border: "1px solid #2a2a27", borderRadius: "6px", padding: "14px", marginBottom: "16px" }}>
            <MiniPlot
              data={{ time: massive.time, v1: massive.v1 }}
              xKey="time" yKeys={["v1"]} colors={["#ff6b6b"]}
              labels={["du₁/dt (massive)"]}
              title="VELOCITY: du₁/dt — the thing that looks like a neuron"
              yLabel="du₁/dt"
            />
          </div>

          <div style={{ background: "#161614", border: "1px solid #2a2a27", borderRadius: "6px", padding: "14px", marginBottom: "16px" }}>
            <MiniPlot
              data={{ time: massless.time, du1: massless.du1 }}
              xKey="time" yKeys={["du1"]} colors={["#4fc3f7"]}
              labels={["du₁/dt (massless)"]}
              title="VELOCITY (MASSLESS): du₁/dt = force (no independent dynamics)"
              yLabel="du₁/dt"
            />
          </div>

          <div style={{ background: "#161614", border: "1px solid #2a2a27", borderRadius: "6px", padding: "14px", marginBottom: "8px" }}>
            <MiniPlot
              data={{ time: massive.time, u2_ml: massless.u2, u2_m: massive.u2 }}
              xKey="time" yKeys={["u2_ml", "u2_m"]} colors={["#4fc3f7", "#f5a623"]}
              labels={["u₂ massless", "u₂ massive"]}
              title="HIGHER LAYER: u₂ comparison"
              yLabel="u₂"
            />
          </div>
        </Section>

        {/* §5 — Key Insight */}
        <Section number="5" title="The Key Insight">
          <P>
            Look at the <Hl>velocity plot</Hl> (<Code>du₁/dt</Code>) for the massive system. It spikes at onset, overshoots, rings, and adapts. It has a sharp transient followed by decay — classic <Hl>high-pass</Hl> behavior. This is what real neurons look like in response to a step.
          </P>
          <P>
            In the massless model, <Code>du₁/dt</Code> is just equal to the force — it mirrors the prediction error exactly. There's no distinction between "velocity" and "error." So we need separate error neurons.
          </P>
          <P>
            In the massive model, <Code>du₁/dt</Code> has its own dynamics. It's <Hl>not</Hl> slaved to the current error. The state overshoots, which means the velocity reverses sign even while the error is still positive. This decoupling is what gives the response its neural character.
          </P>
          <P>
            <Hl>Bottom line</Hl>: if neurons have inertia (from slow currents, adaptation, etc.), then the "prediction error neuron" might just be a regular neuron whose transient response <em>is</em> the error signal — encoded in the dynamics, not in a separate population.
          </P>
        </Section>

        <div style={{ borderTop: "1px solid #2a2a27", paddingTop: "16px", marginTop: "20px" }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#555", textAlign: "center" }}>
            Try: set m very small to recover standard PC · set m large, γ small for strong ringing · ζ &lt; 1 = underdamped
          </p>
        </div>
      </div>
    </div>
  );
}