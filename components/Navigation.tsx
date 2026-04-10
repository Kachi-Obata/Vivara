"use client";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Home", icon: "🏠" },
  { path: "/simulation", label: "Simulate", icon: "🎮" },
  { path: "/team", label: "Team", icon: "👥" },
  { path: "/onboarding", label: "Profile", icon: "⚙" },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide nav on the root redirect page
  if (pathname === "/") return null;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: "rgba(10, 14, 26, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 0,
        zIndex: 1000,
        padding: "0 12px",
      }}
    >
      <div style={{ display: "flex", maxWidth: 400, width: "100%", justifyContent: "space-around" }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "8px 16px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: 10,
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  filter: active ? "none" : "grayscale(0.6) opacity(0.5)",
                  transition: "filter 0.2s",
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  color: active ? "var(--accent-teal)" : "var(--text-muted)",
                  fontWeight: active ? 600 : 400,
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </span>
              {active && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--accent-teal)",
                    boxShadow: "0 0 6px var(--accent-teal)",
                    marginTop: -1,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
