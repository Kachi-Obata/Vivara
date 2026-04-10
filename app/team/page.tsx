"use client";
// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const TEAM_CASE = {
  id: "TRM-04",
  title: "Multi-trauma — road traffic accident",
  subtitle:
    "28-year-old male motorcyclist. GCS 9, open femur fracture, suspected pneumothorax.",
  difficulty: "Critical",
  specialty: "Emergency & Trauma",
  duration: "15–20 min",
  xp: 250,
};

const INITIAL_ROLES = [
  {
    id: "triage",
    title: "Triage lead",
    desc: "Primary assessment, ABCDE approach, prioritizes interventions.",
    player: { name: "Adewale", meta: "Intern · 245 XP", ready: true, isUser: true },
  },
  {
    id: "diagnostics",
    title: "Diagnostician",
    desc: "Orders and interprets labs, imaging, and monitoring data.",
    player: { name: "Chioma A.", meta: "Resident · 1,420 XP", ready: true, isUser: false },
  },
  {
    id: "treatment",
    title: "Treatment lead",
    desc: "Manages drugs, fluids, procedures, and escalation decisions.",
    player: { name: "Emeka O.", meta: "Resident · 1,180 XP", ready: false, isUser: false },
  },
  {
    id: "nurse",
    title: "Nurse coordinator",
    desc: "Monitors vitals, manages lines, documents, coordinates the team.",
    player: { name: "Fatima B.", meta: "Intern · 980 XP", ready: false, isUser: false },
  },
];

const INITIAL_MESSAGES = [
  {
    sender: "Chioma A.",
    text: "I'll handle imaging orders. FAST scan and chest X-ray ready to go.",
    time: "2m ago",
  },
  {
    sender: "Adewale",
    text: "I'll lead the primary survey. Let's run ABCDE systematically.",
    time: "1m ago",
    isUser: true,
  },
  {
    sender: "Emeka O.",
    text: "Prepping IV access and trauma drug tray. Give me 30 seconds.",
    time: "45s ago",
  },
  {
    sender: "Fatima B.",
    text: "Setting up monitoring — BP, SpO₂, ECG. Will document all interventions.",
    time: "20s ago",
  },
  {
    sender: "system",
    text: "All team members have joined. Waiting for ready confirmation.",
    time: "Just now",
    isSystem: true,
  },
];

export default function TeamPage() {
  const router = useRouter();
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const allReady = roles.every((r) => r.player.ready);
  const readyCount = roles.filter((r) => r.player.ready).length;

  useEffect(() => {
    const t1 = setTimeout(() => {
      setRoles((prev) =>
        prev.map((r) => (r.id === "treatment" ? { ...r, player: { ...r.player, ready: true } } : r))
      );
    }, 3000);
    const t2 = setTimeout(() => {
      setRoles((prev) =>
        prev.map((r) => (r.id === "nurse" ? { ...r, player: { ...r.player, ready: true } } : r))
      );
    }, 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (allReady && countdown === null) {
      setCountdown(5);
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "All ready. Starting in 5 seconds.", time: "Now", isSystem: true },
      ]);
    }
  }, [allReady]);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((prev) => (prev! - 1)), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const toggleReady = () => {
    setRoles((prev) =>
      prev.map((r) => (r.player.isUser ? { ...r, player: { ...r.player, ready: !r.player.ready } } : r))
    );
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: "Adewale", text: chatInput, time: "Now", isUser: true },
    ]);
    setChatInput("");
  };

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
      {/* Header */}
      <div
        className="team-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 40,
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span className="label" style={{ color: "var(--accent)" }}>
              Team lobby
            </span>
            <span style={{ color: "var(--text-faint)" }}>·</span>
            <span className="mono" style={{ color: "var(--text-muted)" }}>
              Case {TEAM_CASE.id}
            </span>
          </div>
          <h1
            className="team-h1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              marginBottom: 10,
              maxWidth: 640,
            }}
          >
            {TEAM_CASE.title}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 620 }}>
            {TEAM_CASE.subtitle}
          </p>
        </div>

        <div
          className="team-meta-bar"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            background: "var(--bg-elevated)",
          }}
        >
          {[
            { k: "Specialty", v: TEAM_CASE.specialty },
            { k: "Difficulty", v: TEAM_CASE.difficulty },
            { k: "Duration", v: TEAM_CASE.duration },
            { k: "Reward", v: `+${TEAM_CASE.xp} XP` },
          ].map((m, i) => (
            <div
              key={m.k}
              style={{
                padding: "12px 16px",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
              }}
            >
              <div className="label" style={{ fontSize: 9, marginBottom: 4 }}>
                {m.k}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text)",
                }}
              >
                {m.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="team-layout" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48 }}>
        {/* Roles */}
        <div>
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
              Roles
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: allReady ? "var(--stable)" : "var(--watch)",
                  animation: allReady ? "none" : "blink 1.4s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: allReady ? "var(--stable)" : "var(--watch)",
                  letterSpacing: "0.04em",
                }}
              >
                {readyCount} / {roles.length} ready
              </span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)" }}>
            {roles.map((r, i) => (
              <div
                key={r.id}
                className="team-role-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 20,
                  alignItems: "center",
                  padding: "20px 0",
                  borderBottom: "1px solid var(--border)",
                  animation: `fadeUp 400ms ease ${i * 60}ms both`,
                  position: "relative",
                }}
              >
                {r.player.isUser && (
                  <div
                    style={{
                      position: "absolute",
                      left: -16,
                      top: 20,
                      bottom: 20,
                      width: 2,
                      background: "var(--accent)",
                    }}
                  />
                )}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--text-muted)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 15,
                        fontWeight: 600,
                        color: "var(--text)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {r.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      marginBottom: 10,
                      paddingLeft: 26,
                    }}
                  >
                    {r.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      paddingLeft: 26,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: r.player.isUser ? "var(--accent)" : "var(--text)",
                        fontWeight: r.player.isUser ? 600 : 500,
                      }}
                    >
                      {r.player.name}
                      {r.player.isUser && (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            color: "var(--accent)",
                            marginLeft: 8,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          You
                        </span>
                      )}
                    </span>
                    <span className="mono" style={{ color: "var(--text-muted)" }}>
                      {r.player.meta}
                    </span>
                  </div>
                </div>

                <div className="team-role-actions" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: r.player.ready ? "var(--stable)" : "var(--text-faint)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: r.player.ready ? "var(--stable)" : "var(--text-muted)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {r.player.ready ? "Ready" : "Waiting"}
                    </span>
                  </div>
                  {r.player.isUser && (
                    <button
                      onClick={toggleReady}
                      style={{
                        padding: "6px 12px",
                        background: r.player.ready ? "transparent" : "var(--accent)",
                        color: r.player.ready ? "var(--text-secondary)" : "#08090a",
                        border: r.player.ready ? "1px solid var(--border-strong)" : "1px solid var(--accent)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 12,
                        fontWeight: 600,
                        transition: "all 150ms ease",
                      }}
                    >
                      {r.player.ready ? "Unready" : "Ready up"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Start state */}
          <div style={{ marginTop: 28 }}>
            {allReady && countdown !== null && countdown > 0 ? (
              <div
                style={{
                  borderLeft: "2px solid var(--stable)",
                  paddingLeft: 20,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 16,
                }}
              >
                <span
                  className="label"
                  style={{ color: "var(--stable)" }}
                >
                  All ready — launching in
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 32,
                    fontWeight: 600,
                    color: "var(--stable)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {countdown}
                </span>
              </div>
            ) : allReady && countdown === 0 ? (
              <button
                onClick={() => router.push("/simulation")}
                style={{
                  padding: "11px 20px",
                  background: "var(--accent)",
                  color: "#08090a",
                  borderRadius: "var(--radius)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Launch team simulation →
              </button>
            ) : (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  letterSpacing: "0.04em",
                }}
              >
                Waiting for all team members to ready up…
              </div>
            )}
          </div>
        </div>

        {/* Chat */}
        <aside
          className="team-chat"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            background: "var(--bg-elevated)",
            display: "flex",
            flexDirection: "column",
            maxHeight: 560,
            height: "fit-content",
            minHeight: 420,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="label">Team chat</span>
            <span className="mono" style={{ color: "var(--text-muted)" }}>
              {messages.filter((m) => !m.isSystem).length}
            </span>
          </div>
          <div
            ref={chatRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {messages.map((m, i) =>
              m.isSystem ? (
                <div
                  key={i}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--text-muted)",
                    letterSpacing: "0.04em",
                    textAlign: "center",
                    padding: "6px 0",
                  }}
                >
                  — {m.text} —
                </div>
              ) : (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: m.isUser ? "var(--accent)" : "var(--text)",
                      }}
                    >
                      {m.sender}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--text-muted)",
                      }}
                    >
                      {m.time}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.55,
                    }}
                  >
                    {m.text}
                  </p>
                </div>
              )
            )}
          </div>
          <div
            style={{
              padding: 10,
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Message the team…"
              style={{
                flex: 1,
                padding: "8px 12px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                color: "var(--text)",
                transition: "border-color 150ms ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
            <button
              onClick={sendChat}
              style={{
                padding: "8px 14px",
                background: chatInput.trim() ? "var(--accent)" : "var(--bg-subtle)",
                color: chatInput.trim() ? "#08090a" : "var(--text-muted)",
                borderRadius: "var(--radius-sm)",
                fontSize: 12,
                fontWeight: 600,
                transition: "all 150ms ease",
              }}
            >
              Send
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
