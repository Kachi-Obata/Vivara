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
  presentation: "Patient brought in by family. Found lethargic at home. Skin is warm and flushed. Altered mental status. Family reports decreased urine output over the past 24 hours.",
};

const PHASES = [
  {
    id: "initial",
    title: "Initial Assessment",
    subtitle: "The patient has just arrived. What's your first move?",
    timeLimit: 90,
    vitals: { hr: 118, bp: "82/48", temp: 39.4, rr: 26, spo2: 91, gcs: 12 },
    status: "critical",
    options: [
      {
        id: "a",
        text: "Secure airway, start high-flow O₂, obtain IV access with two large-bore cannulas, begin rapid NS bolus (30 mL/kg)",
        correct: true,
        feedback: "Excellent. You've correctly prioritized the ABCs and initiated aggressive fluid resuscitation per Surviving Sepsis Campaign guidelines.",
        impact: { hr: -8, spo2: 4, status: "critical" },
        xp: 30,
      },
      {
        id: "b",
        text: "Order a full panel of blood tests and imaging before any intervention",
        correct: false,
        feedback: "Investigations are important but this patient is hemodynamically unstable. Delaying resuscitation to wait for labs risks organ damage. Always stabilize first.",
        impact: { hr: 6, spo2: -3, status: "deteriorating" },
        xp: 5,
      },
      {
        id: "c",
        text: "Administer oral paracetamol for fever and observe for 30 minutes",
        correct: false,
        feedback: "This patient is in septic shock — oral medications are inadequate and observation without resuscitation is dangerous. The hypotension and altered consciousness require immediate IV intervention.",
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
        feedback: "Comprehensive and guideline-concordant. Drawing cultures before antibiotics is critical for identifying the causative organism. Lactate helps assess severity.",
        impact: { hr: -4, spo2: 2, status: "critical" },
        xp: 30,
      },
      {
        id: "b",
        text: "Start broad-spectrum antibiotics immediately, then order blood cultures afterwards",
        correct: false,
        feedback: "While antibiotics are urgent, drawing cultures BEFORE administration is essential. Once antibiotics are given, cultures may be falsely negative, making it harder to tailor therapy.",
        impact: { hr: 0, spo2: 1, status: "critical" },
        xp: 12,
      },
      {
        id: "c",
        text: "Order only urinalysis since UTI is suspected, and a random blood glucose",
        correct: false,
        feedback: "Too narrow. Sepsis can originate from multiple sources and causes multi-organ dysfunction. A full sepsis workup is needed to assess severity and identify the source.",
        impact: { hr: 4, spo2: -1, status: "deteriorating" },
        xp: 5,
      },
    ],
  },
  {
    id: "diagnosis",
    title: "Diagnosis",
    subtitle: "Labs are back. Lactate: 4.8 mmol/L. WBC: 19,200. Urine: positive nitrites & leukocytes. What's your working diagnosis?",
    timeLimit: 60,
    vitals: { hr: 106, bp: "88/54", temp: 38.8, rr: 22, spo2: 94, gcs: 13 },
    status: "critical",
    labResults: {
      lactate: "4.8 mmol/L (↑↑)",
      wbc: "19,200/μL (↑)",
      creatinine: "2.4 mg/dL (↑)",
      glucose: "248 mg/dL (↑)",
      ph: "7.28 (↓)",
      procalcitonin: "12.6 ng/mL (↑↑)",
    },
    options: [
      {
        id: "a",
        text: "Septic shock secondary to complicated urinary tract infection (urosepsis) with acute kidney injury",
        correct: true,
        feedback: "Correct. The qSOFA score ≥2, elevated lactate >4, hypotension, positive urinalysis, and rising creatinine all point to urosepsis with septic shock and AKI. This meets Sepsis-3 criteria.",
        impact: { hr: -2, spo2: 1, status: "critical" },
        xp: 30,
      },
      {
        id: "b",
        text: "Diabetic ketoacidosis with concurrent UTI",
        correct: false,
        feedback: "While the glucose is elevated and pH is low, this presentation is dominated by septic shock physiology. The acidosis is lactic (not ketotic), and the hemodynamic instability isn't explained by DKA alone. Sepsis must be treated as the primary driver.",
        impact: { hr: 2, spo2: 0, status: "critical" },
        xp: 10,
      },
      {
        id: "c",
        text: "Dehydration with uncomplicated UTI",
        correct: false,
        feedback: "This significantly underestimates the severity. Lactate >4, hypotension, altered mental status, and organ dysfunction indicate septic shock — not simple dehydration. Under-triaging sepsis leads to delayed treatment and increased mortality.",
        impact: { hr: 6, spo2: -2, status: "deteriorating" },
        xp: 0,
      },
    ],
  },
  {
    id: "treatment",
    title: "Treatment Plan",
    subtitle: "Diagnosis confirmed. What's your definitive management?",
    timeLimit: 90,
    vitals: { hr: 102, bp: "90/56", temp: 38.5, rr: 20, spo2: 95, gcs: 14 },
    status: "critical",
    options: [
      {
        id: "a",
        text: "IV Meropenem 1g stat (penicillin allergy noted), continue fluid resuscitation with target MAP ≥65, start noradrenaline if MAP not met after 30mL/kg fluids, insert urinary catheter, monitor urine output hourly, recheck lactate in 6 hours, refer to ICU",
        correct: true,
        feedback: "Outstanding management. You've chosen an appropriate carbapenem (avoiding penicillin due to allergy), set clear hemodynamic targets, planned vasopressor escalation, and arranged ICU care. This is textbook Hour-1 Bundle compliance.",
        impact: { hr: -12, spo2: 3, status: "stable" },
        xp: 35,
      },
      {
        id: "b",
        text: "IV Amoxicillin-Clavulanate, continue IV fluids, monitor on the general ward",
        correct: false,
        feedback: "Two critical errors: (1) Amoxicillin contains penicillin — the patient has a documented penicillin allergy. (2) Septic shock requires ICU-level monitoring and vasopressor readiness. General ward management risks rapid deterioration.",
        impact: { hr: 8, spo2: -3, status: "deteriorating" },
        xp: 0,
      },
      {
        id: "c",
        text: "Oral Ciprofloxacin, discharge with follow-up in 48 hours",
        correct: false,
        feedback: "This patient is in septic shock with organ dysfunction. Discharge would be life-threatening. Oral antibiotics cannot achieve adequate bioavailability in a patient with compromised perfusion. This requires immediate inpatient management.",
        impact: { hr: 18, spo2: -8, status: "deteriorating" },
        xp: 0,
      },
    ],
  },
];

// ─── STATUS COLORS ───────────────────────────────────────────
const STATUS_CONFIG = {
  stable: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "STABLE", pulse: false },
  critical: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", label: "CRITICAL", pulse: true },
  deteriorating: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "DETERIORATING", pulse: true },
};

// ─── STYLES ──────────────────────────────────────────────────


// ─── HELPER COMPONENTS ───────────────────────────────────────

function VitalBox({ label, value, unit, icon, alert, animate }) {
  return (
    <div style={{
      background: alert ? "rgba(239,68,68,0.08)" : "rgba(6,182,212,0.04)",
      border: `1px solid ${alert ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
      borderRadius: 12,
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      position: "relative",
      overflow: "hidden",
      transition: "all 0.4s ease",
      animation: animate ? "vitalPulse 1.5s ease-in-out infinite" : "none",
    }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, textTransform: "uppercase" }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: alert ? "var(--accent-red)" : "var(--accent-teal)", fontFamily: "var(--font-mono)" }}>
        {value}
        {unit && <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 4 }}>{unit}</span>}
      </div>
    </div>
  );
}

function PatientMonitor({ vitals, status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, boxShadow: `0 0 8px ${cfg.color}`, animation: cfg.pulse ? "statusBlink 1s ease-in-out infinite" : "none" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: cfg.color, letterSpacing: 1.5, textTransform: "uppercase" }}>
            PATIENT STATUS: {cfg.label}
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>LIVE MONITOR</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
        <VitalBox label="HR" value={vitals.hr} unit="bpm" icon="♥" alert={vitals.hr > 115} animate={vitals.hr > 115} />
        <VitalBox label="BP" value={vitals.bp} unit="mmHg" icon="↕" alert={parseInt(vitals.bp) < 90} />
        <VitalBox label="Temp" value={vitals.temp} unit="°C" icon="🌡" alert={vitals.temp > 38.5} />
        <VitalBox label="RR" value={vitals.rr} unit="/min" icon="〰" alert={vitals.rr > 24} />
        <VitalBox label="SpO₂" value={vitals.spo2} unit="%" icon="◉" alert={vitals.spo2 < 93} />
        <VitalBox label="GCS" value={vitals.gcs} unit="/15" icon="⊕" alert={vitals.gcs < 13} />
      </div>
    </div>
  );
}

function Timer({ seconds, max }) {
  const pct = (seconds / max) * 100;
  const urgent = pct < 25;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: urgent ? "var(--accent-red)" : "var(--accent-teal)", minWidth: 45, animation: urgent ? "timerFlash 0.6s ease-in-out infinite" : "none" }}>
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
      </div>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          borderRadius: 2,
          background: urgent ? "var(--accent-red)" : "var(--accent-teal)",
          transition: "width 1s linear, background 0.3s",
        }} />
      </div>
    </div>
  );
}

function LabPanel({ results }) {
  if (!results) return null;
  return (
    <div style={{
      background: "rgba(168,85,247,0.06)",
      border: "1px solid rgba(168,85,247,0.2)",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "var(--accent-purple)", letterSpacing: 1.5, marginBottom: 10, textTransform: "uppercase" }}>
        📋 Lab Results
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 6 }}>
        {Object.entries(results).map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", textTransform: "capitalize" }}>{k}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: v.includes("↑") || v.includes("↓") ? "var(--accent-amber)" : "var(--text-primary)" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RESULTS SCREEN ──────────────────────────────────────────
function ResultsScreen({ score, totalXP, decisions, onRestart }) {
  const pct = Math.round((score / decisions.length) * 100);
  const grade = pct === 100 ? "S" : pct >= 75 ? "A" : pct >= 50 ? "B" : pct >= 25 ? "C" : "F";
  const gradeColors = { S: "#a855f7", A: "#22c55e", B: "#3b82f6", C: "#f59e0b", F: "#ef4444" };
  const badges = [];
  if (pct === 100) badges.push({ icon: "🏆", label: "Perfect Diagnosis" });
  if (pct >= 75) badges.push({ icon: "⚡", label: "Rapid Responder" });
  if (decisions.every(d => d.timeLeft > 10)) badges.push({ icon: "⏱", label: "Cool Under Pressure" });
  if (pct >= 50) badges.push({ icon: "🩺", label: "Clinical Thinker" });

  return (
    <div style={{ animation: "fadeUp 0.6s ease-out", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--accent-teal)", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Simulation Complete</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0, marginBottom: 4 }}>Performance Report</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Sepsis Emergency — {PATIENT.name}, {PATIENT.age}y/o</p>
      </div>

      {/* Grade circle */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div style={{
          width: 120, height: 120, borderRadius: "50%",
          border: `4px solid ${gradeColors[grade]}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 30px ${gradeColors[grade]}33`,
        }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: gradeColors[grade], fontFamily: "var(--font-display)", lineHeight: 1 }}>{grade}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{totalXP} XP</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Accuracy", value: `${pct}%` },
          { label: "Correct", value: `${score}/${decisions.length}` },
          { label: "Total XP", value: totalXP },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent-teal)", fontFamily: "var(--font-mono)" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent-amber)", letterSpacing: 1.5, marginBottom: 12, textTransform: "uppercase" }}>Badges Earned</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {badges.map(b => (
              <div key={b.label} style={{
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "var(--text-primary)",
                fontFamily: "var(--font-display)", fontWeight: 600,
              }}>
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase-by-phase breakdown */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent-blue)", letterSpacing: 1.5, marginBottom: 12, textTransform: "uppercase" }}>Phase Breakdown</div>
        {decisions.map((d, i) => (
          <div key={i} style={{
            padding: "12px 0",
            borderBottom: i < decisions.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
                {d.correct ? "✅" : "❌"} {PHASES[i].title}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-teal)" }}>+{d.xp} XP</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>
              {d.feedback}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        style={{
          width: "100%",
          padding: "14px 0",
          background: "var(--accent-teal)",
          color: "var(--bg-primary)",
          border: "none",
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          cursor: "pointer",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(6,182,212,0.3)"; }}
        onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

// ─── INTRO SCREEN ────────────────────────────────────────────
function IntroScreen({ onStart }) {
  return (
    <div style={{ animation: "fadeUp 0.6s ease-out", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🏥</div>
      <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent-teal)", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Vivara MedSim</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 8px" }}>Sepsis Emergency</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, margin: "0 0 28px", fontFamily: "var(--font-display)" }}>
        A 63-year-old female presents to the emergency department with fever, confusion, and hypotension. You are the attending physician. Every decision matters.
      </p>

      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 20,
        textAlign: "left",
        marginBottom: 28,
      }}>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent-amber)", letterSpacing: 1.5, marginBottom: 12, textTransform: "uppercase" }}>📋 Patient Summary</div>
        {[
          ["Name", PATIENT.name],
          ["Age / Sex", `${PATIENT.age} / ${PATIENT.sex}`],
          ["Weight", PATIENT.weight],
          ["Allergies", PATIENT.allergies],
          ["Chief Complaint", PATIENT.chiefComplaint],
          ["PMHx", PATIENT.history],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 12, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", minWidth: 100, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, padding: 12, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 8 }}>
          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent-amber)", marginBottom: 4, textTransform: "uppercase" }}>⚠ Presentation</div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0, fontFamily: "var(--font-display)" }}>{PATIENT.presentation}</p>
        </div>
      </div>

      <button
        onClick={onStart}
        style={{
          padding: "14px 48px",
          background: "var(--accent-teal)",
          color: "var(--bg-primary)",
          border: "none",
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          cursor: "pointer",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(6,182,212,0.3)"; }}
        onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}
      >
        Begin Simulation →
      </button>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function SimulationPage() {
  const router = useRouter();
  const [screen, setScreen] = useState("intro"); // intro | sim | results
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [decisions, setDecisions] = useState([]);
  const [runningVitals, setRunningVitals] = useState(PHASES[0].vitals);
  const [runningStatus, setRunningStatus] = useState(PHASES[0].status);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  const phase = PHASES[phaseIdx];

  // Timer
  useEffect(() => {
    if (screen !== "sim" || showFeedback) return;
    setTimer(phase.timeLimit);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto-select worst option on timeout
          handleSelect(phase.options[phase.options.length - 1], 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phaseIdx, screen, showFeedback]);

  const handleSelect = useCallback((option, timeLeft) => {
    if (showFeedback) return;
    clearInterval(timerRef.current);
    setSelected(option.id);
    setShowFeedback(true);

    // Update vitals
    setRunningVitals(prev => ({
      ...prev,
      hr: prev.hr + (option.impact.hr || 0),
      spo2: Math.min(100, prev.spo2 + (option.impact.spo2 || 0)),
    }));
    if (option.impact.status) setRunningStatus(option.impact.status);

    setDecisions(prev => [...prev, {
      correct: option.correct,
      xp: option.xp,
      feedback: option.feedback,
      timeLeft: timeLeft ?? timer,
    }]);
  }, [showFeedback, timer]);

  const nextPhase = () => {
    setTransitioning(true);
    setTimeout(() => {
      if (phaseIdx < PHASES.length - 1) {
        const next = phaseIdx + 1;
        setPhaseIdx(next);
        setSelected(null);
        setShowFeedback(false);
        setRunningVitals(prev => ({ ...PHASES[next].vitals, hr: prev.hr, spo2: prev.spo2 }));
      } else {
        setScreen("results");
      }
      setTransitioning(false);
    }, 300);
  };

  const restart = () => {
    router.push("/dashboard");
  };

  const totalXP = decisions.reduce((s, d) => s + d.xp, 0);
  const score = decisions.filter(d => d.correct).length;

  return (
    <>

      <div style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-display)",
        padding: "20px 16px",
        maxWidth: 800,
        margin: "0 auto",
      }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, padding: "0 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--accent-teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "var(--bg-primary)" }}>V</div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>Vivara</span>
          </div>
          {screen === "sim" && (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-amber)" }}>⚡ {totalXP} XP</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
                Phase {phaseIdx + 1}/{PHASES.length}
              </span>
            </div>
          )}
        </div>

        {/* Phase progress */}
        {screen === "sim" && (
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {PHASES.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i < phaseIdx ? "var(--accent-teal)" : i === phaseIdx ? "var(--accent-blue)" : "var(--border)",
                transition: "background 0.4s",
              }} />
            ))}
          </div>
        )}

        <div style={{ opacity: transitioning ? 0 : 1, transition: "opacity 0.3s" }}>
          {screen === "intro" && <IntroScreen onStart={() => setScreen("sim")} />}

          {screen === "sim" && (
            <div style={{ animation: "fadeUp 0.5s ease-out" }}>
              {/* Phase header */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent-blue)", letterSpacing: 1.5, marginBottom: 4, textTransform: "uppercase" }}>
                  Phase {phaseIdx + 1} — {phase.title}
                </div>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.5 }}>{phase.subtitle}</p>
              </div>

              <Timer seconds={timer} max={phase.timeLimit} />
              <PatientMonitor vitals={runningVitals} status={runningStatus} />
              {phase.labResults && <LabPanel results={phase.labResults} />}

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {phase.options.map((opt, i) => {
                  const isSelected = selected === opt.id;
                  const showResult = showFeedback;
                  const isCorrect = opt.correct;
                  let borderColor = "var(--border)";
                  let bg = "var(--bg-card)";
                  if (showResult && isSelected && isCorrect) { borderColor = "var(--accent-green)"; bg = "rgba(34,197,94,0.06)"; }
                  else if (showResult && isSelected && !isCorrect) { borderColor = "var(--accent-red)"; bg = "rgba(239,68,68,0.06)"; }
                  else if (showResult && isCorrect) { borderColor = "rgba(34,197,94,0.3)"; }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => !showFeedback && handleSelect(opt, timer)}
                      disabled={showFeedback}
                      style={{
                        background: bg,
                        border: `1.5px solid ${borderColor}`,
                        borderRadius: 12,
                        padding: "14px 16px",
                        textAlign: "left",
                        cursor: showFeedback ? "default" : "pointer",
                        transition: "all 0.2s",
                        opacity: showFeedback && !isSelected && !isCorrect ? 0.4 : 1,
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-display)",
                        fontSize: 13,
                        lineHeight: 1.6,
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                      onMouseEnter={e => { if (!showFeedback) { e.currentTarget.style.borderColor = "var(--accent-teal)"; e.currentTarget.style.background = "var(--bg-card-hover)"; } }}
                      onMouseLeave={e => { if (!showFeedback) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; } }}
                    >
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600,
                        color: showResult && isSelected ? (isCorrect ? "var(--accent-green)" : "var(--accent-red)") : "var(--accent-teal)",
                        minWidth: 20, paddingTop: 1,
                      }}>
                        {showResult && isSelected ? (isCorrect ? "✓" : "✗") : String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {showFeedback && (
                <div style={{ marginTop: 16, animation: "fadeUp 0.4s ease-out" }}>
                  <div style={{
                    background: decisions[decisions.length - 1]?.correct ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
                    border: `1px solid ${decisions[decisions.length - 1]?.correct ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                  }}>
                    <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: decisions[decisions.length - 1]?.correct ? "var(--accent-green)" : "var(--accent-red)", letterSpacing: 1.5, marginBottom: 6, textTransform: "uppercase" }}>
                      {decisions[decisions.length - 1]?.correct ? "✓ Correct" : "✗ Incorrect"} — +{decisions[decisions.length - 1]?.xp} XP
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                      {phase.options.find(o => o.id === selected)?.feedback}
                    </p>
                  </div>

                  <button
                    onClick={nextPhase}
                    style={{
                      width: "100%",
                      padding: "13px 0",
                      background: "var(--accent-teal)",
                      color: "var(--bg-primary)",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: "var(--font-display)",
                      cursor: "pointer",
                      transition: "transform 0.15s",
                    }}
                    onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
                    onMouseLeave={e => e.target.style.transform = ""}
                  >
                    {phaseIdx < PHASES.length - 1 ? `Continue to ${PHASES[phaseIdx + 1].title} →` : "View Results →"}
                  </button>
                </div>
              )}
            </div>
          )}

          {screen === "results" && <ResultsScreen score={score} totalXP={totalXP} decisions={decisions} onRestart={restart} />}
        </div>
      </div>
    </>
  );
}
