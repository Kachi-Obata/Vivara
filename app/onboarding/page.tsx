"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  {
    id: "student",
    title: "Medical Student",
    desc: "Pre-clinical or clinical year. Building foundational reasoning.",
    level: "Beginner",
  },
  {
    id: "intern",
    title: "Intern / House Officer",
    desc: "Recently graduated. Gaining supervised clinical experience.",
    level: "Intermediate",
  },
  {
    id: "resident",
    title: "Resident",
    desc: "Postgraduate trainee. Refining specialty-level decision-making.",
    level: "Advanced",
  },
];

const CALIBRATION_QUESTIONS: Record<string, any> = {
  student: {
    stem: "A 45-year-old man presents with sudden onset crushing chest pain radiating to his left arm, diaphoresis, and nausea. His ECG shows ST-segment elevation in leads II, III, and aVF. What is the MOST likely diagnosis?",
    options: [
      { id: "a", text: "Inferior ST-Elevation Myocardial Infarction (STEMI)", correct: true },
      { id: "b", text: "Acute pericarditis", correct: false },
      { id: "c", text: "Pulmonary embolism", correct: false },
      { id: "d", text: "Gastroesophageal reflux disease (GERD)", correct: false },
    ],
    domain: "Cardiology — ECG interpretation",
  },
  intern: {
    stem: "A 28-year-old woman at 34 weeks gestation presents with severe headache, visual disturbances, and blood pressure of 168/110 mmHg. Urinalysis shows 3+ proteinuria. What is the MOST appropriate immediate management?",
    options: [
      { id: "a", text: "Discharge with oral antihypertensives and follow-up in 1 week", correct: false },
      { id: "b", text: "IV Magnesium Sulfate loading dose, IV Labetalol, and urgent obstetric review", correct: true },
      { id: "c", text: "Oral Nifedipine only and bed rest", correct: false },
      { id: "d", text: "CT scan of the head before any treatment", correct: false },
    ],
    domain: "Obstetrics — Hypertensive emergency",
  },
  resident: {
    stem: "A 70-year-old man with COPD on home oxygen presents with acute dyspnea. ABG on 2L O₂: pH 7.25, PaCO₂ 72 mmHg, PaO₂ 55 mmHg, HCO₃⁻ 32 mEq/L. What does this ABG pattern represent?",
    options: [
      { id: "a", text: "Acute respiratory alkalosis", correct: false },
      { id: "b", text: "Acute-on-chronic respiratory acidosis with partial metabolic compensation", correct: true },
      { id: "c", text: "Fully compensated metabolic acidosis", correct: false },
      { id: "d", text: "Mixed respiratory and metabolic alkalosis", correct: false },
    ],
    domain: "Pulmonology — ABG analysis",
  },
};

const ASSESSMENTS: Record<string, any> = {
  student: {
    correct: {
      overall: "Strong foundation",
      summary: "Solid grasp of core clinical concepts. You correctly identified a classic STEMI presentation — a critical pattern recognition skill for emergency medicine.",
      strengths: ["Pattern recognition in acute presentations", "ECG lead-territory correlation", "Systematic approach to chest pain differentials"],
      gaps: ["Advanced pharmacological management", "Multi-system emergency protocols", "Time-critical decision-making under pressure"],
      path: "Emergency Medicine Fundamentals",
      confidence: 78,
    },
    incorrect: {
      overall: "Building blocks",
      summary: "Recognizing STEMI patterns on ECG is a foundational emergency skill. Vivara will help you master it through repeated simulation.",
      strengths: ["Willingness to engage with clinical reasoning", "Awareness of differential diagnosis approach"],
      gaps: ["ECG interpretation and lead-territory mapping", "Distinguishing cardiac emergencies from mimics", "Acute coronary syndrome management protocols"],
      path: "Cardiac Emergency Foundations",
      confidence: 42,
    },
  },
  intern: {
    correct: {
      overall: "Clinical ready",
      summary: "Excellent clinical judgment. You correctly prioritized seizure prophylaxis and blood pressure control in pre-eclampsia with severe features — a time-sensitive obstetric emergency.",
      strengths: ["Obstetric emergency recognition", "Evidence-based pharmacological choices", "Appropriate escalation instincts"],
      gaps: ["Complex multi-organ management", "Rare obstetric complications", "Leadership in emergency team coordination"],
      path: "High-Acuity Obstetric Scenarios",
      confidence: 82,
    },
    incorrect: {
      overall: "Developing judgment",
      summary: "This scenario tested recognition of pre-eclampsia with severe features — a condition requiring immediate intervention to prevent eclamptic seizures.",
      strengths: ["Engagement with high-stakes scenarios", "Baseline obstetric knowledge present"],
      gaps: ["Severity stratification in hypertensive pregnancy", "Magnesium sulfate protocols and indications", "Distinguishing urgent from emergent obstetric presentations"],
      path: "Obstetric Emergency Protocols",
      confidence: 45,
    },
  },
  resident: {
    correct: {
      overall: "Advanced clinician",
      summary: "Sharp analytical skills. You correctly parsed a complex ABG showing acute decompensation on a background of chronic CO₂ retention — a nuanced interpretation many clinicians miss.",
      strengths: ["Complex ABG interpretation", "Understanding of compensation physiology", "Integration of clinical context with lab data"],
      gaps: ["Rare ventilatory failure scenarios", "NIV vs intubation decision frameworks", "Multi-organ failure management"],
      path: "Critical Care Decision-Making",
      confidence: 91,
    },
    incorrect: {
      overall: "Refining expertise",
      summary: "ABG interpretation with mixed disorders is one of the most challenging areas in acute medicine. The elevated bicarbonate here signals chronic renal compensation.",
      strengths: ["Engagement with complex pathophysiology", "Awareness of acid-base framework"],
      gaps: ["Differentiating acute vs chronic respiratory failure", "Interpreting compensation patterns", "Integrating ABG with clinical trajectory"],
      path: "Advanced ABG & Ventilation",
      confidence: 55,
    },
  },
};

function Bar({ value, delay = 0 }: { value: number; delay?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div style={{ height: 2, background: "var(--border)", borderRadius: 1, overflow: "hidden", width: "100%" }}>
      <div
        style={{
          height: "100%",
          width: `${w}%`,
          background: "var(--text-secondary)",
          transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = role ? CALIBRATION_QUESTIONS[role] : null;
  const isCorrect = answer ? question?.options.find((o: any) => o.id === answer)?.correct : false;
  const assessment = role ? ASSESSMENTS[role]?.[isCorrect ? "correct" : "incorrect"] : null;

  const handleAnswer = (id: string) => {
    if (showResult) return;
    setAnswer(id);
    setShowResult(true);
  };

  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "56px 24px 96px",
        animation: "fadeIn 300ms ease",
      }}
    >
      {/* Step header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
        <span className="label" style={{ color: "var(--accent)" }}>
          Calibration
        </span>
        <span style={{ color: "var(--text-faint)" }}>·</span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          Step {step + 1} of 3
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 20,
                height: 2,
                background: i <= step ? "var(--accent)" : "var(--border)",
                transition: "background 300ms ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Step 0 — Role */}
      {step === 0 && (
        <div style={{ animation: "fadeUp 400ms ease" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              marginBottom: 10,
            }}
          >
            What&apos;s your clinical level?
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 40, maxWidth: 520 }}>
            We&apos;ll calibrate case difficulty and feedback depth to your experience.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 40, background: "var(--border)" }}>
            {ROLES.map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 20,
                    alignItems: "center",
                    padding: "20px 20px 20px 0",
                    background: active ? "var(--bg-selected)" : "var(--bg)",
                    textAlign: "left",
                    transition: "background 150ms ease",
                    position: "relative",
                    paddingLeft: 20,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "var(--bg)";
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      background: active ? "var(--accent)" : "transparent",
                      transition: "background 150ms ease",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--text)",
                        letterSpacing: "-0.01em",
                        marginBottom: 4,
                      }}
                    >
                      {r.title}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{r.desc}</div>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: active ? "var(--accent)" : "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    {r.level}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              disabled={!role}
              onClick={() => setStep(1)}
              style={{
                padding: "10px 18px",
                background: role ? "var(--accent)" : "var(--bg-subtle)",
                color: role ? "#08090a" : "var(--text-muted)",
                borderRadius: "var(--radius)",
                fontSize: 13,
                fontWeight: 600,
                transition: "background 150ms ease",
              }}
            >
              Continue →
            </button>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
              or press Enter
            </span>
          </div>
        </div>
      )}

      {/* Step 1 — MCQ */}
      {step === 1 && question && (
        <div style={{ animation: "fadeUp 400ms ease" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              marginBottom: 8,
            }}
          >
            Baseline question
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 36 }}>
            One question to baseline your reasoning. No penalty — answer honestly.
          </p>

          <div
            style={{
              borderLeft: "2px solid var(--accent)",
              paddingLeft: 20,
              marginBottom: 32,
            }}
          >
            <div className="label" style={{ marginBottom: 12 }}>
              {question.domain}
            </div>
            <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.65 }}>{question.stem}</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            {question.options.map((opt: any, i: number) => {
              const sel = answer === opt.id;
              const correct = opt.correct;
              let border = "var(--border)";
              let bg = "transparent";
              let textCol = "var(--text)";
              if (showResult && sel && correct) {
                border = "var(--stable)";
                bg = "var(--stable-dim)";
              } else if (showResult && sel && !correct) {
                border = "var(--critical)";
                bg = "var(--critical-dim)";
              } else if (showResult && correct) {
                border = "rgba(76, 169, 106, 0.35)";
              } else if (showResult && !sel) {
                textCol = "var(--text-muted)";
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.id)}
                  disabled={showResult}
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "28px 1fr 20px",
                    gap: 14,
                    alignItems: "flex-start",
                    padding: "14px 16px",
                    borderTop: i === 0 ? `1px solid ${border}` : "none",
                    borderBottom: `1px solid ${border}`,
                    borderLeft: `1px solid ${border}`,
                    borderRight: `1px solid ${border}`,
                    background: bg,
                    textAlign: "left",
                    transition: "all 150ms ease",
                    color: textCol,
                    marginTop: i === 0 ? 0 : -1,
                  }}
                  onMouseEnter={(e) => {
                    if (!showResult) {
                      e.currentTarget.style.background = "var(--bg-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showResult) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 500,
                      color:
                        showResult && sel
                          ? correct
                            ? "var(--stable)"
                            : "var(--critical)"
                          : "var(--text-muted)",
                      paddingTop: 2,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ fontSize: 14, lineHeight: 1.55 }}>{opt.text}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      paddingTop: 2,
                      color:
                        showResult && sel
                          ? correct
                            ? "var(--stable)"
                            : "var(--critical)"
                          : "transparent",
                    }}
                  >
                    {showResult && sel ? (correct ? "✓" : "✗") : ""}
                  </span>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div style={{ animation: "fadeUp 300ms ease" }}>
              <div
                style={{
                  padding: "12px 16px",
                  background: isCorrect ? "var(--stable-dim)" : "var(--critical-dim)",
                  borderLeft: `2px solid ${isCorrect ? "var(--stable)" : "var(--critical)"}`,
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: isCorrect ? "var(--stable)" : "var(--critical)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {isCorrect ? "Correct" : "Incorrect"}
                </span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Calibration data recorded.
                </span>
              </div>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: "10px 18px",
                  background: "var(--accent)",
                  color: "#08090a",
                  borderRadius: "var(--radius)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                View assessment →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2 — Assessment */}
      {step === 2 && assessment && (
        <div style={{ animation: "fadeUp 400ms ease" }}>
          <div className="label" style={{ marginBottom: 14 }}>
            Assessment
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            {assessment.overall}.
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              marginBottom: 48,
              maxWidth: 620,
            }}
          >
            {assessment.summary}
          </p>

          {/* Confidence — aligned metric, no circles, no glow */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              marginBottom: 48,
            }}
          >
            <div style={{ padding: "20px 24px 20px 0", borderRight: "1px solid var(--border)" }}>
              <div className="label" style={{ marginBottom: 10 }}>
                Confidence index
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 44,
                    fontWeight: 600,
                    color: "var(--text)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {assessment.confidence}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 14,
                    color: "var(--text-muted)",
                  }}
                >
                  / 100
                </span>
              </div>
              <Bar value={assessment.confidence} delay={200} />
            </div>
            <div style={{ padding: "20px 0 20px 24px" }}>
              <div className="label" style={{ marginBottom: 10 }}>
                Recommended path
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--text)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.3,
                }}
              >
                {assessment.path}
              </div>
            </div>
          </div>

          {/* Strengths & gaps — two columns with rule */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              marginBottom: 48,
            }}
          >
            <div>
              <div className="label" style={{ marginBottom: 16 }}>
                Strengths
              </div>
              {assessment.strengths.map((s: string, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      minWidth: 18,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="label" style={{ marginBottom: 16 }}>
                Growth areas
              </div>
              {assessment.gaps.map((g: string, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      minWidth: 18,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Competency baseline — dense table */}
          <div style={{ marginBottom: 56 }}>
            <div className="label" style={{ marginBottom: 16 }}>
              Competency baseline
            </div>
            {[
              { label: "Diagnostic reasoning", val: isCorrect ? 72 : 35 },
              { label: "Treatment planning", val: isCorrect ? 60 : 28 },
              { label: "Clinical communication", val: isCorrect ? 55 : 50 },
              { label: "Time management", val: isCorrect ? 48 : 40 },
              { label: "Emergency response", val: isCorrect ? 65 : 30 },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr 40px",
                  gap: 20,
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: 13, color: "var(--text)" }}>{s.label}</span>
                <Bar value={s.val} delay={300 + i * 80} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--text-muted)",
                    textAlign: "right",
                  }}
                >
                  {s.val}%
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            style={{
              padding: "10px 18px",
              background: "var(--accent)",
              color: "#08090a",
              borderRadius: "var(--radius)",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Go to dashboard →
          </button>
        </div>
      )}
    </div>
  );
}
