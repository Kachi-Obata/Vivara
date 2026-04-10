"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  { id: "student", icon: "📚", title: "Medical Student", desc: "Pre-clinical or clinical year student building foundational skills", level: "Beginner", color: "#22c55e" },
  { id: "intern", icon: "🩺", title: "Intern / House Officer", desc: "Recently graduated, gaining supervised clinical experience", level: "Intermediate", color: "#3b82f6" },
  { id: "resident", icon: "⚕", title: "Resident Doctor", desc: "Postgraduate trainee refining specialty-level decision-making", level: "Advanced", color: "#a855f7" },
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
    domain: "Cardiology — ECG Interpretation",
  },
  intern: {
    stem: "A 28-year-old woman at 34 weeks gestation presents with severe headache, visual disturbances, and blood pressure of 168/110 mmHg. Urinalysis shows 3+ proteinuria. What is the MOST appropriate immediate management?",
    options: [
      { id: "a", text: "Discharge with oral antihypertensives and follow-up in 1 week", correct: false },
      { id: "b", text: "IV Magnesium Sulfate loading dose, IV Labetalol, and urgent obstetric review", correct: true },
      { id: "c", text: "Oral Nifedipine only and bed rest", correct: false },
      { id: "d", text: "CT scan of the head before any treatment", correct: false },
    ],
    domain: "Obstetrics — Hypertensive Emergency",
  },
  resident: {
    stem: "A 70-year-old man with COPD on home oxygen presents with acute dyspnea. ABG on 2L O₂: pH 7.25, PaCO₂ 72 mmHg, PaO₂ 55 mmHg, HCO₃⁻ 32 mEq/L. What does this ABG pattern represent?",
    options: [
      { id: "a", text: "Acute respiratory alkalosis", correct: false },
      { id: "b", text: "Acute-on-chronic respiratory acidosis with partial metabolic compensation", correct: true },
      { id: "c", text: "Fully compensated metabolic acidosis", correct: false },
      { id: "d", text: "Mixed respiratory and metabolic alkalosis", correct: false },
    ],
    domain: "Pulmonology — ABG Analysis",
  },
};

const ASSESSMENTS: Record<string, any> = {
  student: {
    correct: {
      overall: "Strong Foundation", summary: "Your baseline assessment indicates solid grasp of core clinical concepts. You correctly identified a classic STEMI presentation — a critical pattern recognition skill for emergency medicine.",
      strengths: ["Pattern recognition in acute presentations", "ECG lead-territory correlation", "Systematic approach to chest pain differentials"],
      gaps: ["Advanced pharmacological management", "Multi-system emergency protocols", "Time-critical decision-making under pressure"],
      path: "Emergency Medicine Fundamentals", confidence: 78,
    },
    incorrect: {
      overall: "Building Blocks", summary: "Your baseline reveals areas for growth in acute cardiac presentations. Recognizing STEMI patterns on ECG is a foundational emergency skill that Vivara will help you master through repeated simulation.",
      strengths: ["Willingness to engage with clinical reasoning", "Awareness of differential diagnosis approach"],
      gaps: ["ECG interpretation and lead-territory mapping", "Distinguishing cardiac emergencies from mimics", "Acute coronary syndrome management protocols"],
      path: "Cardiac Emergency Foundations", confidence: 42,
    },
  },
  intern: {
    correct: {
      overall: "Clinical Ready", summary: "Excellent clinical judgment. You correctly prioritized seizure prophylaxis and blood pressure control in pre-eclampsia with severe features — a time-sensitive obstetric emergency.",
      strengths: ["Obstetric emergency recognition", "Evidence-based pharmacological choices", "Appropriate escalation instincts"],
      gaps: ["Complex multi-organ management", "Rare obstetric complications", "Leadership in emergency team coordination"],
      path: "High-Acuity Obstetric Scenarios", confidence: 82,
    },
    incorrect: {
      overall: "Developing Judgment", summary: "This scenario tested recognition of pre-eclampsia with severe features — a condition requiring immediate intervention to prevent eclamptic seizures and maternal/fetal compromise.",
      strengths: ["Engagement with high-stakes scenarios", "Baseline obstetric knowledge present"],
      gaps: ["Severity stratification in hypertensive pregnancy", "Magnesium sulfate protocols and indications", "Distinguishing urgent from emergent obstetric presentations"],
      path: "Obstetric Emergency Protocols", confidence: 45,
    },
  },
  resident: {
    correct: {
      overall: "Advanced Clinician", summary: "Sharp analytical skills. You correctly parsed a complex ABG showing acute decompensation on a background of chronic CO₂ retention — a nuanced interpretation that many clinicians miss.",
      strengths: ["Complex ABG interpretation", "Understanding of compensation physiology", "Integration of clinical context with lab data"],
      gaps: ["Rare ventilatory failure scenarios", "NIV vs intubation decision frameworks", "Multi-organ failure management"],
      path: "Critical Care Decision-Making", confidence: 91,
    },
    incorrect: {
      overall: "Refining Expertise", summary: "ABG interpretation with mixed disorders is one of the most challenging areas in acute medicine. The elevated bicarbonate here signals chronic renal compensation, indicating this isn't a purely acute process.",
      strengths: ["Engagement with complex pathophysiology", "Awareness of acid-base framework"],
      gaps: ["Differentiating acute vs chronic respiratory failure", "Interpreting compensation patterns", "Integrating ABG with clinical trajectory"],
      path: "Advanced ABG & Ventilation", confidence: 55,
    },
  },
};

function ProgressDots({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 32 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i <= step ? "var(--accent-teal)" : "var(--border)", transition: "all 0.4s ease" }} />
      ))}
    </div>
  );
}

function BarFill({ value, color, delay }: { value: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), delay || 100); return () => clearTimeout(t); }, [value, delay]);
  return (
    <div style={{ height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: `${width}%`, borderRadius: 3, background: color, transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)" }} />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [animIn, setAnimIn] = useState(true);

  const transition = (fn: () => void) => { setAnimIn(false); setTimeout(() => { fn(); setAnimIn(true); }, 300); };

  const question = role ? CALIBRATION_QUESTIONS[role] : null;
  const isCorrect = answer ? question?.options.find((o: any) => o.id === answer)?.correct : false;
  const assessment = role ? ASSESSMENTS[role]?.[isCorrect ? "correct" : "incorrect"] : null;

  const handleAnswer = (id: string) => { if (showResult) return; setAnswer(id); setShowResult(true); };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "var(--font-display)", padding: "20px 16px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--accent-teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "var(--bg-primary)" }}>V</div>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Vivara</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>AI Calibration</span>
      </div>

      <ProgressDots step={step} />

      <div style={{ opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(12px)", transition: "all 0.3s ease" }}>

        {step === 0 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent-teal)", letterSpacing: 2, marginBottom: 6, textTransform: "uppercase" }}>Step 1 of 3</div>
              <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>What&apos;s your clinical level?</h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>This helps Vivara calibrate case difficulty and feedback depth to your experience.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {ROLES.map(r => {
                const active = role === r.id;
                return (
                  <button key={r.id} onClick={() => setRole(r.id)} style={{
                    background: active ? `${r.color}0D` : "var(--bg-card)", border: `1.5px solid ${active ? r.color : "var(--border)"}`,
                    borderRadius: 14, padding: "20px 18px", textAlign: "left", cursor: "pointer", transition: "all 0.25s", width: "100%", color: "var(--text-primary)",
                    transform: active ? "scale(1.02)" : "scale(1)", boxShadow: active ? `0 4px 20px ${r.color}1A` : "none",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ fontSize: 28 }}>{r.icon}</div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: r.color, letterSpacing: 1.5, textTransform: "uppercase", background: `${r.color}15`, padding: "3px 8px", borderRadius: 4 }}>{r.level}</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{r.title}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{r.desc}</div>
                  </button>
                );
              })}
            </div>
            <button disabled={!role} onClick={() => transition(() => setStep(1))} style={{
              width: "100%", padding: "14px 0", background: role ? "var(--accent-teal)" : "var(--border)",
              color: role ? "var(--bg-primary)" : "var(--text-muted)", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", cursor: role ? "pointer" : "not-allowed",
            }}>Continue →</button>
          </div>
        )}

        {step === 1 && question && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent-teal)", letterSpacing: 2, marginBottom: 6, textTransform: "uppercase" }}>Step 2 of 3</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Quick Calibration</h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>One question to baseline your clinical reasoning.</p>
            </div>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent-purple)", letterSpacing: 1.5, marginBottom: 10, textTransform: "uppercase" }}>📋 {question.domain}</div>
              <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.7 }}>{question.stem}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {question.options.map((opt: any, i: number) => {
                const sel = answer === opt.id; const correct = opt.correct;
                let border = "var(--border)"; let bg = "var(--bg-card)";
                if (showResult && sel && correct) { border = "var(--accent-green)"; bg = "rgba(34,197,94,0.06)"; }
                else if (showResult && sel && !correct) { border = "var(--accent-red)"; bg = "rgba(239,68,68,0.06)"; }
                else if (showResult && correct) { border = "rgba(34,197,94,0.3)"; }
                return (
                  <button key={opt.id} onClick={() => handleAnswer(opt.id)} disabled={showResult} style={{
                    background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: "13px 16px",
                    textAlign: "left", cursor: showResult ? "default" : "pointer", transition: "all 0.2s",
                    color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: 13, lineHeight: 1.6,
                    display: "flex", gap: 12, alignItems: "flex-start", opacity: showResult && !sel && !correct ? 0.4 : 1,
                  }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: showResult && sel ? (correct ? "var(--accent-green)" : "var(--accent-red)") : "var(--accent-teal)", minWidth: 18 }}>
                      {showResult && sel ? (correct ? "✓" : "✗") : String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>
            {showResult && (
              <div style={{ animation: "fadeUp 0.4s ease-out" }}>
                <div style={{ background: isCorrect ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${isCorrect ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: isCorrect ? "var(--accent-green)" : "var(--accent-red)", letterSpacing: 1, textTransform: "uppercase" }}>
                    {isCorrect ? "✓ Correct" : "✗ Incorrect"} — Calibration data recorded
                  </span>
                </div>
                <button onClick={() => transition(() => setStep(2))} style={{ width: "100%", padding: "14px 0", background: "var(--accent-teal)", color: "var(--bg-primary)", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", cursor: "pointer" }}>
                  View AI Assessment →
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && assessment && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent-teal)", letterSpacing: 2, marginBottom: 6, textTransform: "uppercase" }}>Step 3 of 3</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>AI Assessment Complete</h1>
            </div>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Clinical Confidence Index</div>
              <div style={{ fontSize: 52, fontWeight: 800, color: "var(--accent-teal)", fontFamily: "var(--font-display)", lineHeight: 1 }}>{assessment.confidence}<span style={{ fontSize: 20, color: "var(--text-muted)" }}>%</span></div>
              <div style={{ marginTop: 10 }}><BarFill value={assessment.confidence} color="var(--accent-teal)" delay={400} /></div>
              <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700, color: assessment.confidence >= 70 ? "var(--accent-green)" : "var(--accent-amber)" }}>{assessment.overall}</div>
            </div>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent-blue)", letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>🤖 AI Analysis</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{assessment.summary}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent-green)", letterSpacing: 1.5, marginBottom: 10, textTransform: "uppercase" }}>✦ Strengths</div>
                {assessment.strengths.map((s: string, i: number) => (
                  <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, padding: "4px 0", borderBottom: i < assessment.strengths.length - 1 ? "1px solid rgba(34,197,94,0.08)" : "none" }}>{s}</div>
                ))}
              </div>
              <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent-amber)", letterSpacing: 1.5, marginBottom: 10, textTransform: "uppercase" }}>△ Growth Areas</div>
                {assessment.gaps.map((g: string, i: number) => (
                  <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, padding: "4px 0", borderBottom: i < assessment.gaps.length - 1 ? "1px solid rgba(245,158,11,0.08)" : "none" }}>{g}</div>
                ))}
              </div>
            </div>
            <div style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: 12, padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 28 }}>🗺</div>
              <div>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent-purple)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>Recommended Pathway</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{assessment.path}</div>
              </div>
            </div>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 18, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: 1.5, marginBottom: 14, textTransform: "uppercase" }}>Competency Baseline</div>
              {[
                { label: "Diagnostic Reasoning", val: isCorrect ? 72 : 35, color: "var(--accent-teal)" },
                { label: "Treatment Planning", val: isCorrect ? 60 : 28, color: "var(--accent-blue)" },
                { label: "Clinical Communication", val: isCorrect ? 55 : 50, color: "var(--accent-green)" },
                { label: "Time Management", val: isCorrect ? 48 : 40, color: "var(--accent-amber)" },
                { label: "Emergency Response", val: isCorrect ? 65 : 30, color: "var(--accent-purple)" },
              ].map((s, i) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", minWidth: 140, textAlign: "right" }}>{s.label}</span>
                  <BarFill value={s.val} color={s.color} delay={300 + i * 150} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: s.color, minWidth: 30 }}>{s.val}%</span>
                </div>
              ))}
            </div>
            <button onClick={() => router.push("/dashboard")} style={{
              width: "100%", padding: "14px 0", background: "var(--accent-teal)", color: "var(--bg-primary)",
              border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}>Go to Dashboard →</button>
          </div>
        )}
      </div>
    </div>
  );
}
