import { useState, useEffect } from "react";

// ── PolyAI Brand System ──────────────────────────────────────────────────────
// Primary:   Macaw (#C8E32A) — vibrant lime-yellow, the "invasive" brand green
// Dark:      #0C0C0C / #111111 — near-black backgrounds
// Mid:       #1A1A1A / #222222 — card/surface
// Border:    #2A2A2A — subtle rule
// Text:      #F5F5F5 (primary), #888 (muted), #555 (faint)
// Secondary: warm pastel accents (#E8D5B4, #B4D4E8, #E8B4C8)
// Fonts:     "Outfit" (≈ Matter SQ), "Space Mono" (≈ Basis Grotesque Mono)

const MACAW      = "#C8E32A";
const MACAW_DIM  = "#8FA81A";
const MACAW_GLOW = "rgba(200,227,42,0.18)";
const MACAW_SOFT = "rgba(200,227,42,0.08)";
const BG         = "#0C0C0C";
const SURFACE    = "#161616";
const CARD       = "#1C1C1C";
const BORDER     = "#282828";
const BORDER_LT  = "#333333";
const TEXT       = "#F0F0F0";
const MUTED      = "#888888";
const FAINT      = "#444444";

// Each stage gets a warm-pastel secondary tint used for subtle accents
const stages = [
  {
    id: 1, label: "Define", short: "DEF",
    tint: "#D4EAFF", tintDim: "rgba(212,234,255,0.12)",
    description: "Establish what success looks like before touching the platform.",
    steps: [
      "Document the use case and caller intent",
      "Align on scope with all stakeholders",
      "Write acceptance criteria — the test cases that must pass",
      "Understand call volumes and intent distribution",
    ],
    principle: "What does a successful call look like, and how will you know when the agent achieves it?",
  },
  {
    id: 2, label: "Design", short: "DES",
    tint: "#FFE8D4", tintDim: "rgba(255,232,212,0.12)",
    description: "Apply Agent Design principles to the use case before writing a single line of content.",
    steps: [
      "Choose greeting — brief, open-ended, trust-building",
      "Plan how to guide callers toward correct response formats",
      "Define misunderstanding and correction-handling",
      "Set brevity targets — no verbose or marketing language",
    ],
    principle: "Most mistakes happen here. Utterances that invite yes/no when you need a data point are the most common failure mode.",
  },
  {
    id: 3, label: "Build", short: "BLD",
    tint: "#D4FFE8", tintDim: "rgba(212,255,232,0.12)",
    description: "Construct in a deliberate sequence — each layer depends on the one before it.",
    steps: [
      "① Agent Rules — personality, scope, and limits first",
      "② Knowledge Base — facts and responses for the retrieval engine",
      "③ Flows — only after KB is established, for structured paths",
      "④ Functions — integrations and logic; always involve engineering",
    ],
    principle: "The sequence is intentional. Rules constrain everything. KB is highest-leverage, lowest-risk. Functions carry the most risk.",
  },
  {
    id: 4, label: "Test", short: "TST",
    tint: "#FFF4D4", tintDim: "rgba(255,244,212,0.12)",
    description: "Verify every change in Local Chat before it touches any live environment.",
    steps: [
      "Test expected caller utterances in Local Chat",
      "Test edge cases and misunderstandings",
      "Confirm KB entries surface correctly",
      "Verify agent responses are natural and brief",
    ],
    principle: "This is the safety gate. Never promote a change you haven't tested locally first.",
  },
  {
    id: 5, label: "Promote", short: "PRO",
    tint: "#EED4FF", tintDim: "rgba(238,212,255,0.12)",
    description: "Move changes through Environments and Branches — staging before production.",
    steps: [
      "Promote change to a staging branch",
      "Run acceptance criteria tests against staging",
      "Get sign-off on the full test suite",
      "Promote to production — revert branch if anything breaks",
    ],
    principle: "Branches make experimentation safe. If something breaks, you revert a branch — not undo a live change.",
  },
  {
    id: 6, label: "Review", short: "REV",
    tint: "#FFD4D4", tintDim: "rgba(255,212,212,0.12)",
    description: "Post-launch is the start of the improvement loop, not the end of the build.",
    steps: [
      "Use Conversation Review to hear specific calls",
      "Use Smart Analyst to identify patterns at scale",
      "Track KPIs from Stage 1 via Custom Dashboards",
      "Feed insights back into Stage 3 — Build — and iterate",
    ],
    principle: "The loop is the product. Every review cycle makes the agent meaningfully better.",
  },
];

// ── PolyAI logo mark — the "dot speaker grille" pattern ─────────────────────
function PolyDotMark({ size = 32, color = MACAW }) {
  const dots = [
    [0,0],[1,0],[2,0],
    [0,1],[1,1],[2,1],
    [0,2],[1,2],[2,2],
  ];
  const gap = size / 3.2;
  const r   = size / 12;
  const off = (size - gap * 2) / 2 - r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {dots.map(([c, row], i) => (
        <circle
          key={i}
          cx={off + c * gap}
          cy={off + row * gap}
          r={r * (1 - Math.abs(1 - c) * 0.15 - Math.abs(1 - row) * 0.15)}
          fill={color}
          opacity={0.85 + 0.15 * (c === 1 && row === 1 ? 1 : 0)}
        />
      ))}
    </svg>
  );
}

// ── Polar helpers ─────────────────────────────────────────────────────────────
function polar(angleDeg, r, ox = 0, oy = 0) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: ox + Math.cos(rad) * r, y: oy + Math.sin(rad) * r };
}

function arcD(cx, cy, r, a1, a2) {
  const p1 = polar(a1, r, cx, cy);
  const p2 = polar(a2, r, cx, cy);
  const large = (a2 - a1 + 360) % 360 > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
}

// ── Main component ────────────────────────────────────────────────────────────
export const AgentBuildMethodology = () => {
  const [active, setActive] = useState(0);
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setAnimTick(n => n + 1), 60);
    return () => clearInterval(t);
  }, []);

  const stage = stages[active];
  const CX = 240, CY = 240, OR = 168, NR = 30;
  const total = stages.length;

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
        <PolyDotMark size={36} color={MACAW} />
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Agent Build Methodology
          </div>
          <div style={{
            fontSize: 11, color: MUTED, letterSpacing: "0.18em", textTransform: "uppercase",
            fontFamily: "'Space Mono', monospace", marginTop: 2,
          }}>
            PolyAcademy · Level 1 Framework
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 32,
        alignItems: "center", justifyContent: "center",
        width: "100%", maxWidth: 920,
      }}>

        {/* ── Orbit Diagram ── */}
        <div style={{ flexShrink: 0 }}>
          <svg width={480} height={480} viewBox="0 0 480 480" style={{ overflow: "visible" }}>
            <defs>
              <radialGradient id="macawGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={MACAW} stopOpacity="0.22" />
                <stop offset="100%" stopColor={MACAW} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#222" stopOpacity="1" />
                <stop offset="100%" stopColor="#111" stopOpacity="1" />
              </radialGradient>
              <filter id="macawBloom" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="8" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="softBloom" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <marker id="arrowhead" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <polygon points="0 0, 5 2.5, 0 5" fill={MACAW} opacity={0.5} />
              </marker>
            </defs>

            {/* Outer decorative ring */}
            <circle cx={CX} cy={CY} r={OR + 48} fill="none" stroke={BORDER} strokeWidth={1} strokeDasharray="2 8" />

            {/* Orbit track */}
            <circle cx={CX} cy={CY} r={OR} fill="none" stroke={FAINT} strokeWidth={1} />

            {/* Active arc highlight — spans from active to next */}
            {(() => {
              const a1 = (active / total) * 360;
              const a2 = ((active + 1) / total) * 360;
              return (
                <path
                  d={arcD(CX, CY, OR, a1, a2)}
                  fill="none"
                  stroke={MACAW}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  filter="url(#softBloom)"
                  opacity={0.9}
                />
              );
            })()}

            {/* Center glow for active */}
            <circle cx={CX} cy={CY} r={88}
              fill="url(#macawGlow)"
              filter="url(#macawBloom)"
              opacity={0.6}
            />

            {/* Center circle */}
            <circle cx={CX} cy={CY} r={72} fill="url(#centerGrad)" stroke={BORDER_LT} strokeWidth={1} />
            <circle cx={CX} cy={CY} r={58} fill="none" stroke={MACAW} strokeWidth={1} strokeOpacity={0.2} />

            {/* Center PolyAI dots */}
            {[0,1,2,3,4,5,6,7,8].map(i => {
              const col = i % 3, row = Math.floor(i / 3);
              const cx2 = CX - 14 + col * 14;
              const cy2 = CY - 24 + row * 14;
              const isCenter = col === 1 && row === 1;
              return (
                <circle key={i} cx={cx2} cy={cy2}
                  r={isCenter ? 4 : 3}
                  fill={MACAW}
                  opacity={isCenter ? 1 : 0.5}
                />
              );
            })}

            {/* Stage number */}
            <text x={CX} y={CY + 22} textAnchor="middle"
              fill={MACAW} fontSize={11}
              fontFamily="'Space Mono', monospace"
              letterSpacing="0.15em"
            >
              {String(active + 1).padStart(2, '0')} / 06
            </text>

            {/* Stage nodes */}
            {stages.map((s, i) => {
              const angle = (i / total) * 360;
              const { x: nx, y: ny } = polar(angle, OR, CX, CY);
              const isActive = i === active;
              const labelOff = polar(angle, OR + 48, CX, CY);

              // Anchor text based on position
              const ta = labelOff.x < CX - 10 ? "end"
                       : labelOff.x > CX + 10 ? "start"
                       : "middle";

              return (
                <g key={s.id} style={{ cursor: "pointer" }} onClick={() => setActive(i)}>
                  {/* Glow for active */}
                  {isActive && (
                    <circle cx={nx} cy={ny} r={NR + 14}
                      fill={MACAW_GLOW}
                      filter="url(#macawBloom)"
                    />
                  )}
                  {/* Ring */}
                  <circle cx={nx} cy={ny} r={NR + 5}
                    fill="none"
                    stroke={isActive ? MACAW : BORDER}
                    strokeWidth={isActive ? 1.5 : 1}
                    strokeOpacity={isActive ? 0.6 : 1}
                  />
                  {/* Node fill */}
                  <circle cx={nx} cy={ny} r={NR}
                    fill={isActive ? MACAW : SURFACE}
                    stroke={isActive ? MACAW : BORDER_LT}
                    strokeWidth={1}
                  />
                  {/* Number */}
                  <text x={nx} y={ny - 5} textAnchor="middle"
                    fill={isActive ? BG : MUTED}
                    fontSize={9} fontFamily="'Space Mono', monospace"
                    letterSpacing="0.12em" fontWeight={700}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </text>
                  {/* Short label inside node */}
                  <text x={nx} y={ny + 10} textAnchor="middle"
                    fill={isActive ? BG : "#666"}
                    fontSize={8} fontFamily="'Space Mono', monospace"
                    letterSpacing="0.1em"
                  >
                    {s.short}
                  </text>

                  {/* Label outside */}
                  <text x={labelOff.x} y={labelOff.y + 4}
                    textAnchor={ta}
                    fill={isActive ? MACAW : MUTED}
                    fontSize={12}
                    fontFamily="'Outfit', sans-serif"
                    fontWeight={isActive ? 600 : 400}
                    filter={isActive ? "url(#softBloom)" : "none"}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}

            {/* Loop arrow — small curved arrow at bottom center to show cyclical nature */}
            <path
              d="M 210 418 Q 240 432 270 418"
              fill="none" stroke={MACAW} strokeWidth={1.5}
              strokeOpacity={0.5} strokeDasharray="3 3"
              markerEnd="url(#arrowhead)"
            />
            <text x={CX} y={442} textAnchor="middle"
              fill={FAINT} fontSize={9} fontFamily="'Space Mono', monospace"
              letterSpacing="0.15em"
            >
              CONTINUOUS LOOP
            </text>
          </svg>
        </div>

        {/* ── Detail Panel ── */}
        <div style={{ flex: "1 1 280px", maxWidth: 360 }}>

          {/* Stage badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: MACAW_SOFT, border: `1px solid ${MACAW}33`,
            borderRadius: 4, padding: "4px 10px", marginBottom: 16,
          }}>
            <span style={{ fontSize: 10, color: MACAW, fontFamily: "'Space Mono', monospace", letterSpacing: "0.18em" }}>
              STAGE {String(active + 1).padStart(2, '0')}
            </span>
            <span style={{ width: 1, height: 10, background: MACAW, opacity: 0.3 }} />
            <span style={{ fontSize: 10, color: MUTED, fontFamily: "'Space Mono', monospace", letterSpacing: "0.12em" }}>
              {stage.short}
            </span>
          </div>

          {/* Stage title */}
          <h2 style={{
            fontSize: 32, fontWeight: 700, color: TEXT,
            margin: "0 0 8px", letterSpacing: "-0.03em", lineHeight: 1,
          }}>
            {stage.label}
          </h2>

          {/* Description */}
          <p style={{
            fontSize: 13, color: MUTED, lineHeight: 1.6, margin: "0 0 20px",
            fontWeight: 300,
          }}>
            {stage.description}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: BORDER, marginBottom: 20 }} />

          {/* Steps */}
          <div style={{ marginBottom: 20 }}>
            {stage.steps.map((step, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "9px 0",
                borderBottom: `1px solid ${BORDER}`,
              }}>
                <div style={{
                  width: 22, height: 22, flexShrink: 0,
                  border: `1px solid ${MACAW}44`,
                  background: MACAW_SOFT,
                  borderRadius: 3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: MACAW,
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: 0,
                  marginTop: 1,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 13, color: "#C0C0C0", lineHeight: 1.55 }}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Principle callout */}
          <div style={{
            background: SURFACE, borderRadius: 6,
            borderLeft: `3px solid ${MACAW}`,
            padding: "12px 14px",
            marginBottom: 20,
          }}>
            <div style={{
              fontSize: 9, color: MACAW, letterSpacing: "0.2em",
              fontFamily: "'Space Mono', monospace", marginBottom: 6,
              textTransform: "uppercase",
            }}>
              Key Principle
            </div>
            <p style={{
              fontSize: 12, color: MUTED, lineHeight: 1.65,
              margin: 0, fontStyle: "italic",
            }}>
              "{stage.principle}"
            </p>
          </div>

          {/* Nav buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setActive((active - 1 + 6) % 6)}
              style={{
                flex: 1, padding: "10px 0",
                background: "transparent",
                border: `1px solid ${BORDER_LT}`,
                borderRadius: 5, color: MUTED,
                fontSize: 11, cursor: "pointer",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.1em",
              }}
            >
              ← PREV
            </button>
            <button
              onClick={() => setActive((active + 1) % 6)}
              style={{
                flex: 2, padding: "10px 0",
                background: MACAW,
                border: `1px solid ${MACAW}`,
                borderRadius: 5, color: BG,
                fontSize: 11, cursor: "pointer", fontWeight: 700,
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.1em",
              }}
            >
              NEXT STAGE →
            </button>
          </div>
        </div>
      </div>

      {/* ── Stage pills ── */}
      <div style={{
        display: "flex", gap: 6, marginTop: 36,
        flexWrap: "wrap", justifyContent: "center",
      }}>
        {stages.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            style={{
              padding: "5px 13px",
              borderRadius: 20,
              border: `1px solid ${i === active ? MACAW : BORDER}`,
              background: i === active ? MACAW_SOFT : "transparent",
              color: i === active ? MACAW : FAINT,
              fontSize: 10, cursor: "pointer",
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.1em",
            }}
          >
            {String(i + 1).padStart(2, '0')} · {s.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 28, display: "flex", alignItems: "center", gap: 8,
      }}>
        <PolyDotMark size={16} color={FAINT} />
        <span style={{
          fontSize: 10, color: FAINT,
          fontFamily: "'Space Mono', monospace", letterSpacing: "0.15em",
        }}>
          POLYACADEMY · AGENT BUILD METHODOLOGY
        </span>
      </div>
    </div>
  );
}
