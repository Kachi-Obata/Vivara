"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const USER = {
  name: "Adewale",
  fullName: "Dr. Adewale",
  role: "Intern",
  level: "Intermediate",
  xp: 245,
  xpNext: 500,
  streak: 4,
  confidence: 78,
  path: "Emergency Medicine Fundamentals",
};

const DAILY_CASE = {
  id: "SEP-01",
  title: "Sepsis Emergency",
  summary: "A 63-year-old female presents with fever, confusion, and hypotension after a recent UTI. You are the attending physician.",
  specialty: "Emergency Medicine",
  difficulty: "Hard",
  duration: "8–12 min",
  xp: 125,
  patient: "Adaeze Okonkwo, 63 F",
};

const RECENT_CASES = [
  { id: "DKA-02", title: "Diabetic Ketoacidosis", grade: "A", xp: 30, when: "Today", minutes: 7 },
  { id: "APP-01", title: "Acute Appendicitis", grade: "S", xp: 35, when: "Yesterday", minutes: 6 },
  { id: "PED-03", title: "Paediatric Pneumonia", grade: "B", xp: 22, when: "2 days ago", minutes: 9 },
];

const COMPETENCIES = [
  { label: "Diagnostic reasoning", val: 72 },
  { label: "Treatment planning", val: 60 },
  { label: "Clinical communication", val: 55 },
  { label: "Time management", val: 48 },
  { label: "Emergency response", val: 65 },
];

const LEADERBOARD = [
  { rank: 1, name: "Chioma A.", xp: 1420, role: "Resident" },
  { rank: 2, name: "Emeka O.", xp: 1180, role: "Resident" },
  { rank: 3, name: "Fatima B.", xp: 980, role: "Intern" },
  { rank: 4, name: "Adewale", xp: 245, role: "Intern", isUser: true },
  { rank: 5, name: "Kalu N.", xp: 210, role: "Student" },
  { rank: 6, name: "Amina Y.", xp: 185, role: "Student" },
];

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

const GRADE_COLOR: Record<string, string> = {
  S: "var(--accent)",
  A: "var(--stable)",
  B: "var(--text-secondary)",
  C: "var(--watch)",
  F: "var(--critical)",
};

export default function DashboardPage() {
  const router = useRouter();
  const xpPct = Math.round((USER.xp / USER.xpNext) * 100);

  return (
    <div
      className="page-shell"
      style={{
        maxWidth: "var(--max-w)",
        margin: "0 auto",
        padding: "56px 24px 96px",
        animation: "fadeIn 300ms ease",
      }}
    >
      {/* Greeting row */}
      <div className="dashboard-greeting-row" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 56, flexWrap: "wrap", gap: 24 }}>
        <div>
          <div className="label" style={{ marginBottom: 12 }}>
            Good morning
          </div>
          <h1
            className="dashboard-greeting-h1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: 10,
            }}
          >
            {USER.fullName}.
          </h1>
          <div
            className="dashboard-greeting-meta"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-muted)",
              letterSpacing: "0.02em",
              flexWrap: "wrap",
            }}
          >
            <span>{USER.role}</span>
            <span style={{ color: "var(--text-faint)" }}>·</span>
            <span>{USER.level}</span>
            <span style={{ color: "var(--text-faint)" }}>·</span>
            <span>
              <span style={{ color: "var(--text-secondary)" }}>{USER.xp}</span> / {USER.xpNext} XP
            </span>
            <span style={{ color: "var(--text-faint)" }}>·</span>
            <span>
              <span style={{ color: "var(--accent)" }}>{USER.streak}</span> day streak
            </span>
          </div>
        </div>
        <div className="dashboard-right-stats" style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ textAlign: "right", paddingRight: 20, borderRight: "1px solid var(--border)" }}>
            <div className="label" style={{ marginBottom: 6 }}>
              Confidence
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              {USER.confidence}
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginLeft: 3 }}>
                /100
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right", paddingLeft: 20 }}>
            <div className="label" style={{ marginBottom: 6 }}>
              Path
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-secondary)",
                maxWidth: 200,
                lineHeight: 1.3,
              }}
            >
              {USER.path}
            </div>
          </div>
        </div>
      </div>

      {/* Thin XP progress rule across full width */}
      <div style={{ marginBottom: 64 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span>Progress to next tier</span>
          <span>{xpPct}%</span>
        </div>
        <Bar value={xpPct} delay={200} />
      </div>

      {/* Hero — Up next */}
      <section
        className="dashboard-hero"
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "40px 0 44px",
          marginBottom: 72,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 40,
          alignItems: "flex-end",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span className="label" style={{ color: "var(--accent)" }}>
              Up next
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
              Case {DAILY_CASE.id}
            </span>
          </div>
          <h2
            className="dashboard-hero-h2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            {DAILY_CASE.title}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              maxWidth: 580,
              marginBottom: 28,
            }}
          >
            {DAILY_CASE.summary}
          </p>
          <div className="dashboard-hero-actions" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => router.push("/simulation")}
              style={{
                padding: "11px 20px",
                background: "var(--accent)",
                color: "#08090a",
                borderRadius: "var(--radius)",
                fontSize: 13,
                fontWeight: 600,
                transition: "background 150ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
            >
              Begin case →
            </button>
            <button
              style={{
                padding: "11px 18px",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-secondary)",
                background: "transparent",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.borderColor = "var(--text-muted)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "var(--border-strong)";
              }}
            >
              Browse library
            </button>
          </div>
        </div>

        {/* Metadata column */}
        <div
          className="dashboard-hero-meta"
          style={{
            display: "grid",
            gridTemplateColumns: "auto",
            gap: 16,
            minWidth: 180,
            borderLeft: "1px solid var(--border)",
            paddingLeft: 32,
            alignSelf: "stretch",
          }}
        >
          {[
            { k: "Patient", v: DAILY_CASE.patient },
            { k: "Specialty", v: DAILY_CASE.specialty },
            { k: "Difficulty", v: DAILY_CASE.difficulty },
            { k: "Duration", v: DAILY_CASE.duration },
            { k: "Reward", v: `+${DAILY_CASE.xp} XP` },
          ].map((row) => (
            <div key={row.k}>
              <div
                className="label"
                style={{ fontSize: 9, marginBottom: 3 }}
              >
                {row.k}
              </div>
              <div style={{ fontSize: 13, color: "var(--text)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
                {row.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two column lower: activity + ranking */}
      <section className="dashboard-lower" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 64 }}>
        {/* Activity */}
        <div>
          {/* Recent cases */}
          <div style={{ marginBottom: 56 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 20,
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
                Recent cases
              </h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  letterSpacing: "0.04em",
                }}
              >
                12 total
              </span>
            </div>
            <div>
              {/* Table header */}
              <div
                className="dashboard-recent-header"
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr 80px 80px 60px",
                  gap: 16,
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <span></span>
                <span>Case</span>
                <span>Time</span>
                <span className="dashboard-when-hide">When</span>
                <span style={{ textAlign: "right" }}>XP</span>
              </div>
              {RECENT_CASES.map((c) => (
                <div
                  key={c.id}
                  className="dashboard-recent-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "24px 1fr 80px 80px 60px",
                    gap: 16,
                    padding: "14px 0",
                    borderBottom: "1px solid var(--border)",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: GRADE_COLOR[c.grade],
                    }}
                  >
                    {c.grade}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{c.title}</div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--text-muted)",
                        letterSpacing: "0.04em",
                        marginTop: 2,
                      }}
                    >
                      {c.id}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {c.minutes}m
                  </span>
                  <span
                    className="dashboard-when-hide"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {c.when}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--text)",
                      textAlign: "right",
                    }}
                  >
                    +{c.xp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Competency */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 20,
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
                Competency index
              </h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  letterSpacing: "0.04em",
                }}
              >
                5 domains
              </span>
            </div>
            {COMPETENCIES.map((c, i) => (
              <div
                key={c.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 40px",
                  gap: 20,
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i === COMPETENCIES.length - 1 ? "none" : "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: 13, color: "var(--text)" }}>{c.label}</span>
                <Bar value={c.val} delay={300 + i * 80} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--text-muted)",
                    textAlign: "right",
                  }}
                >
                  {c.val}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort */}
        <aside>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 20,
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
              Cohort ranking
            </h3>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: "0.04em",
              }}
            >
              This week
            </span>
          </div>
          {LEADERBOARD.map((p) => (
            <div
              key={p.rank}
              style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr auto",
                gap: 14,
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
                position: "relative",
              }}
            >
              {p.isUser && (
                <div
                  style={{
                    position: "absolute",
                    left: -16,
                    top: 14,
                    bottom: 14,
                    width: 2,
                    background: "var(--accent)",
                  }}
                />
              )}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  letterSpacing: "0.02em",
                }}
              >
                {String(p.rank).padStart(2, "0")}
              </span>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: p.isUser ? "var(--accent)" : "var(--text)",
                    fontWeight: p.isUser ? 600 : 500,
                  }}
                >
                  {p.name}
                  {p.isUser && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        color: "var(--accent)",
                        marginLeft: 8,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      You
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--text-muted)",
                    letterSpacing: "0.04em",
                    marginTop: 2,
                  }}
                >
                  {p.role}
                </div>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: p.isUser ? "var(--accent)" : "var(--text-secondary)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {p.xp.toLocaleString()}
              </span>
            </div>
          ))}
        </aside>
      </section>
    </div>
  );
}
