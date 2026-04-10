"use client";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";

const NAV = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/simulation", label: "Simulation" },
  { path: "/team", label: "Team" },
  { path: "/onboarding", label: "Profile" },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") return null;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-w)",
          margin: "0 auto",
          padding: "0 24px",
          height: 52,
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 0,
          }}
          aria-label="Vivara home"
        >
          <Logo size={22} />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-0.015em",
            }}
          >
            Vivara
          </span>
        </button>

        <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          {NAV.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? "var(--text)" : "var(--text-secondary)",
                  transition: "color 120ms ease, background 120ms ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                {item.label}
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      left: 10,
                      right: 10,
                      bottom: -15,
                      height: 1,
                      background: "var(--accent)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            v0.1 · preview
          </span>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-secondary)",
              letterSpacing: "-0.01em",
            }}
          >
            AO
          </div>
        </div>
      </div>
    </header>
  );
}
