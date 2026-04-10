"use client";
import { useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock scroll when menu open + Escape to close
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  if (pathname === "/") return null;

  const go = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <>
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
          className="nav-container"
          style={{
            maxWidth: "var(--max-w)",
            margin: "0 auto",
            padding: "0 24px",
            height: 68,
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
        >
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              padding: 0,
            }}
            aria-label="Vivara home"
          >
            <Logo size={48} />
          </button>

          <nav
            className="nav-links-desktop"
            style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}
          >
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
                        bottom: -23,
                        height: 1,
                        background: "var(--accent)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div
            className="nav-meta-desktop"
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
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

          {/* Hamburger toggle — mobile only */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              marginLeft: "auto",
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-sm)",
              background: "transparent",
              color: "var(--text)",
              transition: "all 150ms ease",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="15" y2="5" />
                  <line x1="3" y1="9" x2="15" y2="9" />
                  <line x1="3" y1="13" x2="15" y2="13" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "#efe8d6",
            color: "#1a1d1f",
            display: "flex",
            flexDirection: "column",
            animation: "menuSlideDown 280ms cubic-bezier(0.22, 1, 0.36, 1)",
            overflow: "hidden",
          }}
        >
          {/* Paper-grain texture — matches welcome splash */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(26, 29, 31, 0.05) 1px, transparent 0)",
              backgroundSize: "20px 20px",
              pointerEvents: "none",
            }}
          />

          {/* Top bar — logo + close */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: "1px solid rgba(26, 29, 31, 0.12)",
              zIndex: 2,
            }}
          >
            <button
              onClick={() => go("/dashboard")}
              style={{ display: "flex", alignItems: "center", padding: 0 }}
              aria-label="Vivara home"
            >
              <Logo size={40} />
            </button>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(26, 29, 31, 0.2)",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                color: "#1a1d1f",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <line x1="4" y1="4" x2="14" y2="14" />
                <line x1="14" y1="4" x2="4" y2="14" />
              </svg>
            </button>
          </div>

          {/* Eyebrow */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              padding: "36px 24px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6a6458",
              zIndex: 2,
            }}
          >
            <span style={{ width: 24, height: 1, background: "#6a6458" }} />
            Navigate
          </div>

          {/* Nav links stacked */}
          <nav
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              zIndex: 2,
            }}
          >
            {NAV.map((item, i) => {
              const active = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "22px 24px",
                    borderTop: i === 0 ? "1px solid rgba(26, 29, 31, 0.12)" : "none",
                    borderBottom: "1px solid rgba(26, 29, 31, 0.12)",
                    background: "transparent",
                    textAlign: "left",
                    position: "relative",
                  }}
                >
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        background: "#2e8896",
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 32,
                      fontWeight: 500,
                      letterSpacing: "-0.025em",
                      color: active ? "#141618" : "#2a2d30",
                    }}
                  >
                    {item.label}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        color: active ? "#2e8896" : "#8a8273",
                        textTransform: "uppercase",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke={active ? "#2e8896" : "#6a6458"}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <line x1="3" y1="8" x2="12" y2="8" />
                      <polyline points="8,4 12,8 8,12" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer — version + profile */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              padding: "22px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(26, 29, 31, 0.12)",
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                color: "#6a6458",
                textTransform: "uppercase",
              }}
            >
              v0.1 · preview
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: "#6a6458",
                  textTransform: "uppercase",
                }}
              >
                Signed in
              </span>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "rgba(26, 29, 31, 0.06)",
                  border: "1px solid rgba(26, 29, 31, 0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#1a1d1f",
                }}
              >
                AO
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
