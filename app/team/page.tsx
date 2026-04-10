"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";



const TEAM_CASE = {
  title: "Multi-Trauma: Road Traffic Accident",
  subtitle: "28 y/o male motorcyclist — GCS 9, open femur fracture, suspected pneumothorax",
  difficulty: "Critical",
  specialty: "Emergency & Trauma",
  duration: "15-20 min",
  xp: 250,
  teamSize: 4,
};

const ROLES = [
  {
    id: "triage",
    title: "Triage Lead",
    desc: "Primary assessment, ABCDE approach, prioritizes interventions",
    icon: "🔴",
    color: "#ef4444",
    player: { name: "Dr. Adewale", avatar: "🩺", ready: true, isUser: true },
  },
  {
    id: "diagnostics",
    title: "Diagnostician",
    desc: "Orders and interprets labs, imaging, and monitoring data",
    icon: "🔬",
    color: "#3b82f6",
    player: { name: "Chioma A.", avatar: "👩🏾‍⚕️", ready: true, isUser: false },
  },
  {
    id: "treatment",
    title: "Treatment Lead",
    desc: "Manages drugs, fluids, procedures, and escalation decisions",
    icon: "💊",
    color: "#22c55e",
    player: { name: "Emeka O.", avatar: "👨🏾‍⚕️", ready: false, isUser: false },
  },
  {
    id: "nurse",
    title: "Nurse Coordinator",
    desc: "Monitors vitals, manages lines, documents, and communicates with team",
    icon: "📋",
    color: "#a855f7",
    player: { name: "Fatima B.", avatar: "👩🏽‍⚕️", ready: false, isUser: false },
  },
];

const CHAT_MESSAGES = [
  { sender: "Chioma A.", avatar: "👩🏾‍⚕️", text: "I'll handle imaging orders. FAST scan and chest X-ray ready to go.", time: "2m ago", color: "#3b82f6" },
  { sender: "Dr. Adewale", avatar: "🩺", text: "I'll lead the primary survey. Let's run ABCDE systematically.", time: "1m ago", color: "#ef4444", isUser: true },
  { sender: "Emeka O.", avatar: "👨🏾‍⚕️", text: "Prepping IV access and trauma drug tray. Give me 30 seconds.", time: "45s ago", color: "#22c55e" },
  { sender: "Fatima B.", avatar: "👩🏽‍⚕️", text: "Setting up monitoring — BP, SpO₂, ECG. Will document all interventions.", time: "20s ago", color: "#a855f7" },
  { sender: "System", avatar: "⚙", text: "All team members have joined. Waiting for ready confirmation...", time: "Just now", color: "#64748b", isSystem: true },
];

function RoleCard({ role, onToggleReady }) {
  const { player } = role;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: player.ready ? `${role.color}08` : "var(--bg-card)",
        border: `1.5px solid ${player.ready ? role.color + "44" : "var(--border)"}`,
        borderRadius: 14,
        padding: 18,
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? `0 8px 24px ${role.color}15` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Role color accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: role.color, opacity: player.ready ? 1 : 0.3, transition: "opacity 0.3s" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>{role.icon}</span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{role.title}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: role.color, letterSpacing: 1, textTransform: "uppercase" }}>{role.id.toUpperCase()}</div>
          </div>
        </div>
        {/* Ready indicator */}
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          background: player.ready ? "rgba(34,197,94,0.1)" : "rgba(100,116,139,0.1)",
          border: `1px solid ${player.ready ? "rgba(34,197,94,0.25)" : "rgba(100,116,139,0.15)"}`,
          borderRadius: 20, padding: "3px 10px",
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: player.ready ? "#22c55e" : "#64748b",
            boxShadow: player.ready ? "0 0 6px #22c55e" : "none",
            animation: player.ready ? "readyPulse 2s ease-in-out infinite" : "none",
          }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: player.ready ? "#22c55e" : "var(--text-muted)", letterSpacing: 0.5 }}>
            {player.ready ? "READY" : "WAITING"}
          </span>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 14 }}>{role.desc}</p>

      {/* Player info */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
        background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid var(--border)",
      }}>
        <div style={{ fontSize: 22 }}>{player.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: player.isUser ? "var(--accent-teal)" : "var(--text-primary)" }}>
            {player.name} {player.isUser && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent-teal)", background: "rgba(6,182,212,0.1)", padding: "1px 6px", borderRadius: 3, marginLeft: 4 }}>YOU</span>}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>
            {player.isUser ? "Intern — 245 XP" : ["Resident — 1,420 XP", "Resident — 1,180 XP", "Intern — 980 XP"][ROLES.findIndex(r => r.id === role.id) - 1] || "Intern — 980 XP"}
          </div>
        </div>
        {player.isUser && (
          <button onClick={onToggleReady} style={{
            padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600,
            fontFamily: "var(--font-mono)", cursor: "pointer", transition: "all 0.2s",
            background: player.ready ? "rgba(34,197,94,0.15)" : "var(--accent-teal)",
            color: player.ready ? "#22c55e" : "var(--bg-primary)",
          }}>
            {player.ready ? "✓ Ready" : "Ready Up"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function TeamPage() {
  const router = useRouter();
  const [roles, setRoles] = useState(ROLES);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [countdown, setCountdown] = useState(null);
  const allReady = roles.every(r => r.player.ready);

  // Simulate others readying up
  useEffect(() => {
    const t1 = setTimeout(() => {
      setRoles(prev => prev.map(r => r.id === "treatment" ? { ...r, player: { ...r.player, ready: true } } : r));
    }, 3000);
    const t2 = setTimeout(() => {
      setRoles(prev => prev.map(r => r.id === "nurse" ? { ...r, player: { ...r.player, ready: true } } : r));
    }, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Countdown when all ready
  useEffect(() => {
    if (allReady && countdown === null) {
      setCountdown(5);
      setMessages(prev => [...prev, { sender: "System", avatar: "⚙", text: "All team members ready! Simulation starting in 5 seconds...", time: "Now", color: "#22c55e", isSystem: true }]);
    }
  }, [allReady]);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const toggleReady = () => {
    setRoles(prev => prev.map(r => r.player.isUser ? { ...r, player: { ...r.player, ready: !r.player.ready } } : r));
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { sender: "Dr. Adewale", avatar: "🩺", text: chatInput, time: "Now", color: "#ef4444", isUser: true }]);
    setChatInput("");
  };

  const readyCount = roles.filter(r => r.player.ready).length;

  return (
    <>
      <style>{`
        .team-layout { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
        @media (max-width: 700px) { .team-layout { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "var(--font-display)", padding: "20px 16px", maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--accent-teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "var(--bg-primary)" }}>V</div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Vivara</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20,
              background: allReady ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
              border: `1px solid ${allReady ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)"}`,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: allReady ? "#22c55e" : "#f59e0b" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: allReady ? "#22c55e" : "#f59e0b" }}>
                {readyCount}/{ROLES.length} READY
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>Team Lobby</span>
          </div>
        </div>

        {/* Case Preview Banner */}
        <div style={{
          background: "linear-gradient(135deg, #1a2035 0%, #0f1a2e 100%)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 18,
          marginBottom: 16,
          animation: "fadeUp 0.4s ease-out",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #ef4444, #f59e0b, #3b82f6)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent-red)", letterSpacing: 1.5, marginBottom: 4, textTransform: "uppercase" }}>👥 Team Simulation</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{TEAM_CASE.title}</h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{TEAM_CASE.subtitle}</p>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                { label: TEAM_CASE.difficulty, color: "#ef4444" },
                { label: TEAM_CASE.specialty, color: "#3b82f6" },
                { label: TEAM_CASE.duration, color: "#64748b" },
                { label: `+${TEAM_CASE.xp} XP`, color: "#f59e0b" },
              ].map(t => (
                <span key={t.label} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: t.color, background: `${t.color}12`, padding: "3px 8px", borderRadius: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="team-layout">
          {/* Left: Role cards */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {roles.map((r, i) => (
                <div key={r.id} style={{ animation: `fadeUp 0.5s ease-out ${i * 0.1}s both` }}>
                  <RoleCard role={r} onToggleReady={toggleReady} />
                </div>
              ))}
            </div>

            {/* Countdown / Start */}
            {allReady && countdown !== null && countdown > 0 ? (
              <div style={{
                textAlign: "center", padding: 24, background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.2)", borderRadius: 14, animation: "fadeUp 0.3s ease-out",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-green)", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>All Ready — Starting In</div>
                <div style={{ fontSize: 56, fontWeight: 800, color: "var(--accent-green)", fontFamily: "var(--font-display)", animation: "countPulse 1s ease-in-out infinite" }}>
                  {countdown}
                </div>
              </div>
            ) : allReady && countdown === 0 ? (
              <button onClick={() => router.push("/simulation")} style={{
                width: "100%", padding: "16px 0", background: "var(--accent-green)", color: "var(--bg-primary)",
                border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, fontFamily: "var(--font-display)",
                cursor: "pointer", animation: "fadeUp 0.3s ease-out",
              }}>
                🚀 Launch Team Simulation
              </button>
            ) : (
              <div style={{
                textAlign: "center", padding: 16, background: "var(--bg-card)",
                border: "1px solid var(--border)", borderRadius: 14,
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: 1.5 }}>
                  WAITING FOR ALL TEAM MEMBERS TO READY UP...
                </div>
              </div>
            )}
          </div>

          {/* Right: Chat */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            display: "flex",
            flexDirection: "column",
            height: "fit-content",
            maxHeight: 560,
            animation: "fadeUp 0.6s ease-out",
          }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-teal)", letterSpacing: 1.5, textTransform: "uppercase" }}>💬 Team Chat</div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ animation: `slideIn 0.3s ease-out ${i * 0.05}s both` }}>
                  {m.isSystem ? (
                    <div style={{
                      textAlign: "center", padding: "6px 12px", borderRadius: 8,
                      background: "rgba(100,116,139,0.06)", border: "1px solid rgba(100,116,139,0.1)",
                    }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: m.color }}>{m.text}</span>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 14 }}>{m.avatar}</span>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: m.isUser ? "var(--accent-teal)" : "var(--text-primary)" }}>{m.sender}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginLeft: "auto" }}>{m.time}</span>
                      </div>
                      <div style={{
                        padding: "8px 12px", borderRadius: "2px 10px 10px 10px",
                        background: m.isUser ? "rgba(6,182,212,0.08)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${m.isUser ? "rgba(6,182,212,0.15)" : "var(--border)"}`,
                        fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5,
                      }}>
                        {m.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="Type a message..."
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
                  background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 12,
                  fontFamily: "var(--font-display)", outline: "none",
                }}
              />
              <button onClick={sendChat} style={{
                padding: "8px 14px", borderRadius: 8, border: "none", background: "var(--accent-teal)",
                color: "var(--bg-primary)", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)",
                cursor: "pointer",
              }}>
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 28, paddingBottom: 20 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: 1 }}>VIVARA MEDSIM — MULTIPLAYER PREVIEW</span>
        </div>
      </div>
    </>
  );
}
