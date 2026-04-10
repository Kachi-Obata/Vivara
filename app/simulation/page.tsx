"use client";
// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── CASE DATA ───────────────────────────────────────────────
const PATIENT = {
  name: "Adaeze Okonkwo",
  age: 63,
  sex: "Female",
  weight: "72 kg",
  allergies: "Penicillin",
  chiefComplaint: "Fever, confusion, and low blood pressure for 2 days",
  history: "Type 2 Diabetes, Hypertension, recent UTI treated with oral antibiotics 1 week ago",
  presentation:
    "Patient brought in by family. Found lethargic at home. Skin is warm and flushed. Altered mental status. Family reports decreased urine output over the past 24 hours.",
};

const PHASES = [
  {
    id: "initial",
    title: "Initial assessment",
    subtitle: "The patient has just arrived. What's your first move?",
    timeLimit: 90,
    vitals: { hr: 118, bp: "82/48", temp: 39.4, rr: 26, spo2: 91, gcs: 12 },
    status: "critical",
    options: [
      {
        id: "a",
        text: "Secure airway, start high-flow O₂, obtain IV access with two large-bore cannulas, begin rapid NS bolus (30 mL/kg)",
        correct: true,
        feedback:
          "Excellent. You've correctly prioritized the ABCs and initiated aggressive fluid resuscitation per Surviving Sepsis Campaign guidelines.",
        impact: { hr: -8, spo2: 4, status: "critical" },
        xp: 30,
      },
      {
        id: "b",
        text: "Order a full panel of blood tests and imaging before any intervention",
        correct: false,
        feedback:
          "Investigations are important but this patient is hemodynamically unstable. Delaying resuscitation to wait for labs risks organ damage. Always stabilize first.",
        impact: { hr: 6, spo2: -3, status: "deteriorating" },
        xp: 5,
      },
      {
        id: "c",
        text: "Administer oral paracetamol for fever and observe for 30 minutes",
        correct: false,
        feedback:
          "This patient is in septic shock — oral medications are inadequate and observation without resuscitation is dangerous. The hypotension and altered consciousness require immediate IV intervention.",
        impact: { hr: 12, spo2: -5, status: "deteriorating" },
        xp: 0,
      },
    ],
  },
  {
    id: "investigation",
    title: "Investigation",
    subtitle: "Patient is receiving fluids. What investigations do you order?",
    timeLimit: 75,
    vitals: { hr: 110, bp: "86/52", temp: 39.1, rr: 24, spo2: 93, gcs: 13 },
    status: "critical",
    options: [
      {
        id: "a",
        text: "Blood cultures (x2 sets before antibiotics), FBC, U&E, LFTs, lactate, ABG, urinalysis, blood glucose, and chest X-ray",
        correct: true,
        feedback:
          "Comprehensive and guideline-concordant. Drawing cultures before antibiotics is critical for identifying the causative organism. Lactate helps assess severity.",
        impact: { hr: -4, spo2: 2, status: "critical" },
        xp: 30,
      },
      {
        id: "b",
        text: "Start broad-spectrum antibiotics immediately, then order blood cultures afterwards",
        correct: false,
        feedback:
          "While antibiotics are urgent, drawing cultures BEFORE administration is essential. Once antibiotics are given, cultures may be falsely negative, making it harder to tailor therapy.",
        impact: { hr: 0, spo2: 1, status: "critical" },
        xp: 12,
      },
      {
        id: "c",
        text: "Order only urinalysis since UTI is suspected, and a random blood glucose",
        correct: false,
        feedback:
          "Too narrow. Sepsis can originate from multiple sources and causes multi-organ dysfunction. A full sepsis workup is needed to assess severity and identify the source.",
        impact: { hr: 4, spo2: -1, status: "deteriorating" },
        xp: 5,
      },
    ],
  },
  {
    id: "diagnosis",
    title: "Diagnosis",
    subtitle:
      "Labs are back. Lactate: 4.8 mmol/L. WBC: 19,200. Urine: positive nitrites & leukocytes. What's your working diagnosis?",
    timeLimit: 60,
    vitals: { hr: 106, bp: "88/54", temp: 38.8, rr: 22, spo2: 94, gcs: 13 },
    status: "critical",
    labResults: {
      Lactate: "4.8 mmol/L (↑↑)",
      WBC: "19,200/μL (↑)",
      Creatinine: "2.4 mg/dL (↑)",
      Glucose: "248 mg/dL (↑)",
      pH: "7.28 (↓)",
      Procalcitonin: "12.6 ng/mL (↑↑)",
    },
    options: [
      {
        id: "a",
        text: "Septic shock secondary to complicated urinary tract infection (urosepsis) with acute kidney injury",
        correct: true,
        feedback:
          "Correct. The qSOFA score ≥2, elevated lactate >4, hypotension, positive urinalysis, and rising creatinine all point to urosepsis with septic shock and AKI. This meets Sepsis-3 criteria.",
        impact: { hr: -2, spo2: 1, status: "critical" },
        xp: 30,
      },
      {
        id: "b",
        text: "Diabetic ketoacidosis with concurrent UTI",
        correct: false,
        feedback:
          "While the glucose is elevated and pH is low, this presentation is dominated by septic shock physiology. The acidosis is lactic (not ketotic), and the hemodynamic instability isn't explained by DKA alone.",
        impact: { hr: 2, spo2: 0, status: "critical" },
        xp: 10,
      },
      {
        id: "c",
        text: "Dehydration with uncomplicated UTI",
        correct: false,
        feedback:
          "This significantly underestimates the severity. Lactate >4, hypotension, altered mental status, and organ dysfunction indicate septic shock — not simple dehydration.",
        impact: { hr: 6, spo2: -2, status: "deteriorating" },
        xp: 0,
      },
    ],
  },
  {
    id: "treatment",
    title: "Treatment plan",
    subtitle: "Diagnosis confirmed. What's your definitive management?",
    timeLimit: 90,
    vitals: { hr: 102, bp: "90/56", temp: 38.5, rr: 20, spo2: 95, gcs: 14 },
    status: "critical",
    options: [
      {
        id: "a",
        text: "IV Meropenem 1g stat (penicillin allergy noted), continue fluid resuscitation targeting MAP ≥65, start noradrenaline if MAP not met, insert urinary catheter, hourly urine output, recheck lactate in 6 hours, refer to ICU",
        correct: true,
        feedback:
          "Outstanding management. You've chosen an appropriate carbapenem (avoiding penicillin due to allergy), set clear hemodynamic targets, planned vasopressor escalation, and arranged ICU care. Textbook Hour-1 Bundle compliance.",
        impact: { hr: -12, spo2: 3, status: "stable" },
        xp: 35,
      },
      {
        id: "b",
        text: "IV Amoxicillin-Clavulanate, continue IV fluids, monitor on the general ward",
        correct: false,
        feedback:
          "Two critical errors: (1) Amoxicillin contains penicillin — the patient has a documented penicillin allergy. (2) Septic shock requires ICU-level monitoring and vasopressor readiness.",
        impact: { hr: 8, spo2: -3, status: "deteriorating" },
        xp: 0,
      },
      {
        id: "c",
        text: "Oral Ciprofloxacin, discharge with follow-up in 48 hours",
        correct: false,
        feedback:
          "This patient is in septic shock with organ dysfunction. Discharge would be life-threatening. Oral antibiotics cannot achieve adequate bioavailability in compromised perfusion.",
        impact: { hr: 18, spo2: -8, status: "deteriorating" },
        xp: 0,
      },
    ],
  },
];

const STATUS_CONFIG: Record<string, { color: string; label: string; pulse: boolean }> = {
  stable: { color: "var(--stable)", label: "Stable", pulse: false },
  critical: { color: "var(--watch)", label: "Critical", pulse: true },
  deteriorating: { color: "var(--critical)", label: "Deteriorating", pulse: true },
};

// ─── COMPONENTS ──────────────────────────────────────────────

function Vital({ label, value, unit, alert }: any) {
  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <span
        className="label"
        style={{ fontSize: 10, color: "var(--text-muted)" }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 18,
            fontWeight: 500,
            color: alert ? "var(--critical)" : "var(--text)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--text-muted)",
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

function PatientMonitor({ vitals, status }: any) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 24px",
        background: "var(--bg-elevated)",
      }}
    >
      <div
        className="sim-monitor-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: cfg.color,
              animation: cfg.pulse ? "blink 1.4s ease-in-out infinite" : "none",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 500,
              color: cfg.color,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {cfg.label}
          </span>
          <span className="mono" style={{ color: "var(--text-faint)", fontSize: 11 }}>
            ·
          </span>
          <span className="label">Live monitor</span>
        </div>
        <span className="mono" style={{ color: "var(--text-muted)" }}>
          {PATIENT.name} · {PATIENT.age}
          {PATIENT.sex[0]}
        </span>
      </div>
      <div
        className="sim-monitor-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          columnGap: 24,
        }}
      >
        <Vital label="HR" value={vitals.hr} unit="bpm" alert={vitals.hr > 115} />
        <Vital label="BP" value={vitals.bp} unit="mmHg" alert={parseInt(vitals.bp) < 90} />
        <Vital label="Temp" value={vitals.temp} unit="°C" alert={vitals.temp > 38.5} />
        <Vital label="RR" value={vitals.rr} unit="/min" alert={vitals.rr > 24} />
        <Vital label="SpO₂" value={vitals.spo2} unit="%" alert={vitals.spo2 < 93} />
        <Vital label="GCS" value={vitals.gcs} unit="/15" alert={vitals.gcs < 13} />
      </div>
    </div>
  );
}

function Timer({ seconds, max }: { seconds: number; max: number }) {
  const pct = (seconds / max) * 100;
  const urgent = pct < 25;
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <span className="label">Time remaining</span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 500,
            color: urgent ? "var(--critical)" : "var(--text)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
        </span>
      </div>
      <div style={{ height: 2, background: "var(--border)", borderRadius: 1, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: urgent ? "var(--critical)" : "var(--accent)",
            transition: "width 1000ms linear, background 300ms ease",
          }}
        />
      </div>
    </div>
  );
}

function LabPanel({ results }: any) {
  if (!results) return null;
  return (
    <div
      style={{
        borderLeft: "2px solid var(--accent-line)",
        paddingLeft: 20,
        margin: "28px 0",
      }}
    >
      <div className="label" style={{ marginBottom: 14 }}>
        Lab results
      </div>
      <div className="sim-lab-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 32px" }}>
        {Object.entries(results).map(([k, v]: any) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{k}</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 500,
                color: v.includes("↑") || v.includes("↓") ? "var(--watch)" : "var(--text)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── INTRO ───────────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ animation: "fadeUp 400ms ease", maxWidth: 720, margin: "0 auto" }}>
      <div className="label" style={{ marginBottom: 14, color: "var(--accent)" }}>
        Case SEP-01 · Emergency Medicine
      </div>
      <h1
        className="sim-intro-h1"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          marginBottom: 16,
        }}
      >
        Sepsis emergency.
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--text-secondary)",
          lineHeight: 1.65,
          marginBottom: 48,
          maxWidth: 580,
        }}
      >
        A 63-year-old female presents to the emergency department with fever, confusion, and hypotension. You
        are the attending physician. Every decision carries weight.
      </p>

      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-0.01em",
            }}
          >
            Patient record
          </h3>
          <span className="mono" style={{ color: "var(--text-muted)" }}>
            Triage 14:22
          </span>
        </div>
        {[
          ["Name", PATIENT.name],
          ["Age / Sex", `${PATIENT.age} / ${PATIENT.sex}`],
          ["Weight", PATIENT.weight],
          ["Allergies", PATIENT.allergies],
          ["Chief complaint", PATIENT.chiefComplaint],
          ["History", PATIENT.history],
        ].map(([k, v]) => (
          <div
            key={k}
            className="sim-intro-row"
            style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr",
              gap: 24,
              padding: "12px 0",
              borderBottom: "1px solid var(--border)",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                paddingTop: 2,
              }}
            >
              {k}
            </span>
            <span style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.55 }}>{v}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          borderLeft: "2px solid var(--watch)",
          paddingLeft: 20,
          marginBottom: 48,
        }}
      >
        <div
          className="label"
          style={{ color: "var(--watch)", marginBottom: 8 }}
        >
          Presentation
        </div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65 }}>
          {PATIENT.presentation}
        </p>
      </div>

      <button
        onClick={onStart}
        style={{
          padding: "12px 22px",
          background: "var(--accent)",
          color: "#08090a",
          borderRadius: "var(--radius)",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Begin case →
      </button>
    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────
function ResultsScreen({ score, totalXP, decisions, onRestart }: any) {
  const pct = Math.round((score / decisions.length) * 100);
  const grade = pct === 100 ? "S" : pct >= 75 ? "A" : pct >= 50 ? "B" : pct >= 25 ? "C" : "F";
  const gradeColors: Record<string, string> = {
    S: "var(--accent)",
    A: "var(--stable)",
    B: "var(--text-secondary)",
    C: "var(--watch)",
    F: "var(--critical)",
  };

  return (
    <div style={{ animation: "fadeUp 400ms ease", maxWidth: 720, margin: "0 auto" }}>
      <div className="label" style={{ marginBottom: 14, color: "var(--accent)" }}>
        Case complete
      </div>
      <h1
        className="sim-results-h1"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          marginBottom: 10,
        }}
      >
        Performance report.
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 48 }}>
        Sepsis Emergency · {PATIENT.name}, {PATIENT.age}
        {PATIENT.sex[0]}
      </p>

      {/* Metrics row */}
      <div
        className="sim-results-metrics"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          marginBottom: 56,
        }}
      >
        {[
          { k: "Grade", v: grade, color: gradeColors[grade] },
          { k: "Accuracy", v: `${pct}%`, color: "var(--text)" },
          { k: "Correct", v: `${score}/${decisions.length}`, color: "var(--text)" },
          { k: "Total XP", v: `+${totalXP}`, color: "var(--text)" },
        ].map((m, i) => (
          <div
            key={m.k}
            style={{
              padding: "24px 20px",
              borderRight: i < 3 ? "1px solid var(--border)" : "none",
            }}
          >
            <div className="label" style={{ marginBottom: 10 }}>
              {m.k}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: m.color,
                lineHeight: 1,
              }}
            >
              {m.v}
            </div>
          </div>
        ))}
      </div>

      {/* Phase breakdown */}
      <div style={{ marginBottom: 56 }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 20,
            letterSpacing: "-0.01em",
          }}
        >
          Phase breakdown
        </h3>
        {decisions.map((d: any, i: number) => (
          <div
            key={i}
            style={{
              padding: "20px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 500,
                    color: d.correct ? "var(--stable)" : "var(--critical)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    minWidth: 70,
                  }}
                >
                  {d.correct ? "Correct" : "Incorrect"}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--text)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {PHASES[i].title}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--text-muted)",
                }}
              >
                +{d.xp} XP
              </span>
            </div>
            <p
              className="sim-phase-feedback"
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                paddingLeft: 82,
              }}
            >
              {d.feedback}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onRestart}
          style={{
            padding: "11px 20px",
            background: "var(--accent)",
            color: "#08090a",
            borderRadius: "var(--radius)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Back to dashboard →
        </button>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────
export default function SimulationPage() {
  const router = useRouter();
  const [screen, setScreen] = useState("intro");
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [runningVitals, setRunningVitals] = useState(PHASES[0].vitals);
  const [runningStatus, setRunningStatus] = useState(PHASES[0].status);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<any>(null);

  const phase = PHASES[phaseIdx];

  useEffect(() => {
    if (screen !== "sim" || showFeedback) return;
    setTimer(phase.timeLimit);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSelect(phase.options[phase.options.length - 1], 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phaseIdx, screen, showFeedback]);

  const handleSelect = useCallback(
    (option: any, timeLeft: number) => {
      if (showFeedback) return;
      clearInterval(timerRef.current);
      setSelected(option.id);
      setShowFeedback(true);

      setRunningVitals((prev: any) => ({
        ...prev,
        hr: prev.hr + (option.impact.hr || 0),
        spo2: Math.min(100, prev.spo2 + (option.impact.spo2 || 0)),
      }));
      if (option.impact.status) setRunningStatus(option.impact.status);

      setDecisions((prev) => [
        ...prev,
        {
          correct: option.correct,
          xp: option.xp,
          feedback: option.feedback,
          timeLeft: timeLeft ?? timer,
        },
      ]);
    },
    [showFeedback, timer]
  );

  const nextPhase = () => {
    setTransitioning(true);
    setTimeout(() => {
      if (phaseIdx < PHASES.length - 1) {
        const next = phaseIdx + 1;
        setPhaseIdx(next);
        setSelected(null);
        setShowFeedback(false);
        setRunningVitals((prev: any) => ({ ...PHASES[next].vitals, hr: prev.hr, spo2: prev.spo2 }));
      } else {
        setScreen("results");
      }
      setTransitioning(false);
    }, 250);
  };

  const restart = () => router.push("/dashboard");

  const totalXP = decisions.reduce((s, d) => s + d.xp, 0);
  const score = decisions.filter((d) => d.correct).length;
  const lastDecision = decisions[decisions.length - 1];

  return (
    <div
      className="page-shell"
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "56px 24px 96px",
        animation: "fadeIn 300ms ease",
      }}
    >
      {/* Sim header */}
      {screen === "sim" && (
        <>
          <div
            className="sim-header-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="label" style={{ color: "var(--accent)" }}>
                Case SEP-01
              </span>
              <span style={{ color: "var(--text-faint)" }}>·</span>
              <span className="mono" style={{ color: "var(--text-muted)" }}>
                Phase {phaseIdx + 1} / {PHASES.length}
              </span>
            </div>
            <span className="mono" style={{ color: "var(--text-muted)" }}>
              +{totalXP} XP earned
            </span>
          </div>

          {/* Phase progress segmented */}
          <div style={{ display: "flex", gap: 4, marginBottom: 40 }}>
            {PHASES.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 2,
                  background:
                    i < phaseIdx ? "var(--accent)" : i === phaseIdx ? "var(--text-secondary)" : "var(--border)",
                  transition: "background 400ms ease",
                }}
              />
            ))}
          </div>
        </>
      )}

      <div style={{ opacity: transitioning ? 0 : 1, transition: "opacity 250ms ease" }}>
        {screen === "intro" && <IntroScreen onStart={() => setScreen("sim")} />}

        {screen === "sim" && (
          <div style={{ animation: "fadeUp 400ms ease" }}>
            {/* Phase title */}
            <div style={{ marginBottom: 28 }}>
              <h2
                className="sim-phase-h2"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  marginBottom: 10,
                }}
              >
                {phase.title}
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  maxWidth: 680,
                }}
              >
                {phase.subtitle}
              </p>
            </div>

            <Timer seconds={timer} max={phase.timeLimit} />

            <div style={{ marginBottom: 28 }}>
              <PatientMonitor vitals={runningVitals} status={runningStatus} />
            </div>

            {phase.labResults && <LabPanel results={phase.labResults} />}

            {/* Options */}
            <div
              style={{
                marginTop: 32,
                marginBottom: 20,
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <div className="label">Select action</div>
              <span className="mono" style={{ color: "var(--text-muted)" }}>
                {phase.options.length} options
              </span>
            </div>

            <div style={{ borderTop: "1px solid var(--border)" }}>
              {phase.options.map((opt: any, i: number) => {
                const isSelected = selected === opt.id;
                const showResult = showFeedback;
                const isCorrect = opt.correct;

                let bg = "transparent";
                let borderLeft = "2px solid transparent";
                let textCol = "var(--text)";

                if (showResult && isSelected && isCorrect) {
                  bg = "var(--stable-dim)";
                  borderLeft = "2px solid var(--stable)";
                } else if (showResult && isSelected && !isCorrect) {
                  bg = "var(--critical-dim)";
                  borderLeft = "2px solid var(--critical)";
                } else if (showResult && isCorrect) {
                  borderLeft = "2px solid rgba(76, 169, 106, 0.4)";
                } else if (showResult && !isSelected) {
                  textCol = "var(--text-muted)";
                }

                return (
                  <button
                    key={opt.id}
                    className="sim-option-row"
                    onClick={() => !showFeedback && handleSelect(opt, timer)}
                    disabled={showFeedback}
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "40px 1fr 28px",
                      gap: 16,
                      alignItems: "flex-start",
                      padding: "18px 20px",
                      background: bg,
                      borderBottom: "1px solid var(--border)",
                      borderLeft: borderLeft,
                      textAlign: "left",
                      transition: "all 150ms ease",
                      color: textCol,
                    }}
                    onMouseEnter={(e) => {
                      if (!showFeedback) e.currentTarget.style.background = "var(--bg-hover)";
                    }}
                    onMouseLeave={(e) => {
                      if (!showFeedback) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--text-muted)",
                        letterSpacing: "0.04em",
                        paddingTop: 2,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: 14, lineHeight: 1.6 }}>{opt.text}</span>
                    <span
                      className="sim-option-check"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color:
                          showResult && isSelected
                            ? isCorrect
                              ? "var(--stable)"
                              : "var(--critical)"
                            : "transparent",
                        textAlign: "right",
                        paddingTop: 2,
                      }}
                    >
                      {showResult && isSelected ? (isCorrect ? "✓" : "✗") : ""}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && lastDecision && (
              <div style={{ animation: "fadeUp 300ms ease", marginTop: 28 }}>
                <div
                  style={{
                    borderLeft: `2px solid ${lastDecision.correct ? "var(--stable)" : "var(--critical)"}`,
                    paddingLeft: 20,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: lastDecision.correct ? "var(--stable)" : "var(--critical)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {lastDecision.correct ? "Correct" : "Incorrect"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--text-muted)",
                      }}
                    >
                      +{lastDecision.xp} XP
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    {phase.options.find((o: any) => o.id === selected)?.feedback}
                  </p>
                </div>

                <button
                  onClick={nextPhase}
                  style={{
                    padding: "11px 20px",
                    background: "var(--accent)",
                    color: "#08090a",
                    borderRadius: "var(--radius)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {phaseIdx < PHASES.length - 1 ? `Continue — ${PHASES[phaseIdx + 1].title} →` : "View results →"}
                </button>
              </div>
            )}
          </div>
        )}

        {screen === "results" && (
          <ResultsScreen score={score} totalXP={totalXP} decisions={decisions} onRestart={restart} />
        )}
      </div>
    </div>
  );
}
