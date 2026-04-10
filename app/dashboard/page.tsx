"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const USER = {
  name: "Dr. Adewale", role: "Intern / House Officer", level: "Intermediate",
  xp: 245, xpNext: 500, streak: 4, avatar: "🩺", confidence: 78, path: "Emergency Medicine Fundamentals",
};

const STATS = [
  { label: "Cases Done", value: "12", icon: "📂", color: "#06b6d4" },
  { label: "Accuracy", value: "73%", icon: "🎯", color: "#22c55e" },
  { label: "Avg Time", value: "42s", icon: "⏱", color: "#f59e0b" },
  { label: "Streak", value: `${USER.streak}d`, icon: "🔥", color: "#ef4444" },
];

const BADGES = [
  { icon: "⚡", label: "Rapid Responder", earned: true },
  { icon: "🩺", label: "Clinical Thinker", earned: true },
  { icon: "⏱", label: "Cool Under Pressure", earned: true },
  { icon: "🏆", label: "Perfect Diagnosis", earned: false },
  { icon: "🧬", label: "Lab Whisperer", earned: false },
  { icon: "💊", label: "Pharmacology Pro", earned: false },
];

const DAILY_CASE = { title: "Sepsis Emergency", subtitle: "63 y/o female — Fever, confusion, hypotension", difficulty: "Hard", specialty: "Emergency Medicine", duration: "8-12 min", xp: 125 };

const LEADERBOARD = [
  { rank: 1, name: "Chioma A.", xp: 1420, role: "Resident", avatar: "👩🏾‍⚕️" },
  { rank: 2, name: "Emeka O.", xp: 1180, role: "Resident", avatar: "👨🏾‍⚕️" },
  { rank: 3, name: "Fatima B.", xp: 980, role: "Intern", avatar: "👩🏽‍⚕️" },
  { rank: 4, name: "Dr. Adewale", xp: 245, role: "Intern", avatar: "🩺", isUser: true },
  { rank: 5, name: "Kalu N.", xp: 210, role: "Student", avatar: "👨🏾‍⚕️" },
  { rank: 6, name: "Amina Y.", xp: 185, role: "Student", avatar: "👩🏾‍⚕️" },
];

const RECENT_CASES = [
  { title: "Diabetic Ketoacidosis", score: "A", xp: 30, date: "Today" },
  { title: "Acute Appendicitis", score: "S", xp: 35, date: "Yesterday" },
  { title: "Pneumonia (Paediatric)", score: "B", xp: 22, date: "2d ago" },
];

const COMPETENCIES = [
  { label: "Diagnostic Reasoning", val: 72, color: "#06b6d4" },
  { label: "Treatment Planning", val: 60, color: "#3b82f6" },
  { label: "Clinical Communication", val: 55, color: "#22c55e" },
  { label: "Time Management", val: 48, color: "#f59e0b" },
  { label: "Emergency Response", val: 65, color: "#a855f7" },
];

function BarFill({ value, color, delay }: { value: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), delay || 100); return () => clearTimeout(t); }, [value, delay]);
  return (
    <div style={{ height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: `${width}%`, borderRadius: 3, background: color, transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)" }} />
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 18, ...style }}>{children}</div>;
}

function SectionLabel({ icon, text, color }: { icon: string; text: string; color?: string }) {
  return <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: color || "var(--text-muted)", letterSpacing: 1.5, marginBottom: 14, textTransform: "uppercase" }}>{icon} {text}</div>;
}

export default function DashboardPage() {
  const router = useRouter();
  const xpPct = Math.round((USER.xp / USER.xpNext) * 100);
  const gradeColors: Record<string, string> = { S: "#a855f7", A: "#22c55e", B: "#3b82f6", C: "#f59e0b", F: "#ef4444" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "var(--font-display)", padding: "20px 16px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--accent-teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "var(--bg-primary)" }}>V</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Vivara</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-amber)" }}>🔥 {USER.streak} day streak</span>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{USER.avatar}</div>
        </div>
      </div>

      <Card style={{ marginBottom: 14, animation: "fadeUp 0.5s ease-out", background: "linear-gradient(135deg, #1a2035 0%, #0f1a2e 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 2 }}>Welcome back,</p>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{USER.name}</h1>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent-blue)", background: "rgba(59,130,246,0.1)", padding: "3px 8px", borderRadius: 4, letterSpacing: 1, textTransform: "uppercase" }}>{USER.role}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent-purple)", background: "rgba(168,85,247,0.1)", padding: "3px 8px", borderRadius: 4, letterSpacing: 1, textTransform: "uppercase" }}>{USER.path}</span>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent-teal)", fontFamily: "var(--font-mono)", lineHeight: 1 }}>{USER.xp}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, textTransform: "uppercase" }}>XP</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${xpPct}%`, borderRadius: 3, background: "linear-gradient(90deg, #06b6d4, #3b82f6)", transition: "width 1s ease" }} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", minWidth: 60 }}>{USER.xp}/{USER.xpNext} XP</span>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14, animation: "fadeUp 0.6s ease-out" }}>
        {STATS.map(s => (
          <Card key={s.label} style={{ padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "var(--font-mono)" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 0.5, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ animation: "fadeUp 0.7s ease-out", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #06b6d4, #3b82f6, #a855f7)" }} />
            <SectionLabel icon="🎯" text="Daily Case" color="var(--accent-teal)" />
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{DAILY_CASE.title}</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>{DAILY_CASE.subtitle}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {[{ label: DAILY_CASE.difficulty, color: "#ef4444" }, { label: DAILY_CASE.specialty, color: "#3b82f6" }, { label: DAILY_CASE.duration, color: "#64748b" }, { label: `+${DAILY_CASE.xp} XP`, color: "#f59e0b" }].map(t => (
                <span key={t.label} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: t.color, background: `${t.color}12`, padding: "3px 8px", borderRadius: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>{t.label}</span>
              ))}
            </div>
            <button onClick={() => router.push("/simulation")} style={{ width: "100%", padding: "12px 0", background: "var(--accent-teal)", color: "var(--bg-primary)", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}>
              Start Case →
            </button>
          </Card>

          <Card style={{ animation: "fadeUp 0.8s ease-out" }}>
            <SectionLabel icon="🏅" text="Badges" color="var(--accent-amber)" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {BADGES.map(b => (
                <div key={b.label} style={{ textAlign: "center", padding: "12px 4px", borderRadius: 10, background: b.earned ? "rgba(245,158,11,0.06)" : "rgba(100,116,139,0.06)", border: `1px solid ${b.earned ? "rgba(245,158,11,0.15)" : "rgba(100,116,139,0.1)"}`, opacity: b.earned ? 1 : 0.4 }}>
                  <div style={{ fontSize: 22, marginBottom: 4, filter: b.earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
                  <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: b.earned ? "var(--text-secondary)" : "var(--text-muted)", letterSpacing: 0.3 }}>{b.label}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ animation: "fadeUp 0.9s ease-out" }}>
            <SectionLabel icon="📊" text="Competency Tracker" color="var(--accent-blue)" />
            {COMPETENCIES.map((c, i) => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < COMPETENCIES.length - 1 ? 10 : 0 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", minWidth: 120, textAlign: "right" }}>{c.label}</span>
                <BarFill value={c.val} color={c.color} delay={400 + i * 120} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: c.color, minWidth: 28 }}>{c.val}%</span>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ animation: "fadeUp 0.7s ease-out" }}>
            <SectionLabel icon="🏆" text="Leaderboard" color="var(--accent-purple)" />
            {LEADERBOARD.map((p, i) => (
              <div key={p.rank} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 8, marginBottom: i < LEADERBOARD.length - 1 ? 4 : 0,
                background: p.isUser ? "rgba(6,182,212,0.08)" : "transparent", border: p.isUser ? "1px solid rgba(6,182,212,0.2)" : "1px solid transparent",
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, minWidth: 22, textAlign: "center", color: p.rank <= 3 ? ["#f59e0b", "#94a3b8", "#cd7f32"][p.rank - 1] : "var(--text-muted)" }}>
                  {p.rank <= 3 ? ["🥇", "🥈", "🥉"][p.rank - 1] : `#${p.rank}`}
                </span>
                <div style={{ fontSize: 18 }}>{p.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.isUser ? "var(--accent-teal)" : "var(--text-primary)" }}>{p.name}</div>
                  <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{p.role}</div>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: p.isUser ? "var(--accent-teal)" : "var(--text-secondary)" }}>{p.xp.toLocaleString()} XP</span>
              </div>
            ))}
          </Card>

          <Card style={{ animation: "fadeUp 0.8s ease-out" }}>
            <SectionLabel icon="📜" text="Recent Cases" color="var(--accent-green)" />
            {RECENT_CASES.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < RECENT_CASES.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${gradeColors[c.score]}`, fontSize: 14, fontWeight: 800, color: gradeColors[c.score], fontFamily: "var(--font-display)" }}>{c.score}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.title}</div>
                  <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{c.date}</div>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-teal)" }}>+{c.xp} XP</span>
              </div>
            ))}
          </Card>

          <Card style={{ animation: "fadeUp 0.9s ease-out" }}>
            <SectionLabel icon="⚡" text="Quick Actions" color="var(--accent-teal)" />
            {[
              { label: "Browse Case Library", icon: "📚", desc: "50+ cases across specialties", route: "/simulation" },
              { label: "Join Team Session", icon: "👥", desc: "Multiplayer collaboration", route: "/team" },
              { label: "Review Mistakes", icon: "🔍", desc: "Learn from past errors", route: "/simulation" },
            ].map((a, i) => (
              <button key={a.label} onClick={() => router.push(a.route)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                background: "transparent", border: "1px solid var(--border)", borderRadius: 10,
                cursor: "pointer", color: "var(--text-primary)", fontFamily: "var(--font-display)",
                marginBottom: i < 2 ? 8 : 0, transition: "all 0.2s", textAlign: "left",
              }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{a.desc}</div>
                </div>
              </button>
            ))}
          </Card>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 28, paddingBottom: 20 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: 1 }}>VIVARA MEDSIM — HACKATHON BUILD 2026</span>
      </div>
    </div>
  );
}
