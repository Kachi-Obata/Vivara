"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function WelcomePage() {
  const router = useRouter();
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), 4600);
    const navTimer = setTimeout(() => router.push("/onboarding"), 5000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <div
      className="welcome-grid"
      style={{
        position: "fixed",
        inset: 0,
        background: "#efe8d6",
        color: "#1a1d1f",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr)",
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 400ms ease",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      {/* Paper-grain texture overlay across the whole splash */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(26, 29, 31, 0.05) 1px, transparent 0)",
          backgroundSize: "20px 20px",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* LEFT: text column */}
      <div
        className="welcome-text-col"
        style={{
          position: "relative",
          padding: "48px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 3,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* Top row: logo + metadata */}
        <div
          className="welcome-top-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: 0,
            animation: "fadeIn 700ms ease forwards",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Logo size={64} />
            <div
              style={{
                width: 1,
                height: 38,
                background: "rgba(26, 29, 31, 0.22)",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 500,
                lineHeight: 1.4,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6a6458",
              }}
            >
              Clinical
              <br />
              Simulation
            </div>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "#6a6458",
            }}
          >
            v0.1 · preview
          </span>
        </div>

        {/* Middle: welcome title */}
        <div
          className="welcome-middle"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            minWidth: 0,
          }}
        >
          <div
            style={{
              opacity: 0,
              animation: "fadeUp 900ms ease 150ms forwards",
              minWidth: 0,
            }}
          >
            <h1
              className="welcome-title"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(72px, 9vw, 152px)",
                fontWeight: 500,
                letterSpacing: "-0.055em",
                lineHeight: 0.88,
                margin: 0,
                color: "#141618",
              }}
            >
              Welcome
            </h1>
            <div
              className="welcome-subtitle"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(42px, 5vw, 82px)",
                fontWeight: 400,
                letterSpacing: "-0.035em",
                lineHeight: 0.95,
                marginTop: 6,
                color: "#3a372f",
                opacity: 0,
                animation: "fadeUp 900ms ease 400ms forwards",
              }}
            >
              to Vivara.
            </div>
          </div>
          <div
            className="welcome-tagline-wrap"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 460,
              opacity: 0,
              animation: "fadeUp 900ms ease 650ms forwards",
            }}
          >
            <div
              style={{
                width: 48,
                height: 2,
                background: "#2e8896",
              }}
            />
            <p
              className="welcome-tagline"
              style={{
                fontFamily: "var(--font)",
                fontSize: 15,
                lineHeight: 1.6,
                color: "#3a372f",
                margin: 0,
              }}
            >
              A quiet space for clinical simulation and assessment.
              Where trainees rehearse judgment before the ward.
            </p>
          </div>
        </div>

        {/* Bottom: progress indicator */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            opacity: 0,
            animation: "fadeIn 700ms ease 950ms forwards",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6a6458",
            }}
          >
            <span>Initializing session</span>
            <span>Onboarding →</span>
          </div>
          <div
            style={{
              height: 1,
              background: "rgba(26, 29, 31, 0.14)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#2e8896",
                transformOrigin: "left center",
                animation: "progress 4450ms linear 150ms forwards",
                transform: "scaleX(0)",
              }}
            />
          </div>
        </div>
      </div>

      {/* RIGHT: image panel */}
      <div
        className="welcome-image-col"
        style={{
          position: "relative",
          overflow: "hidden",
          zIndex: 1,
          minWidth: 0,
        }}
      >
        <img
          src="/doctor.avif"
          alt="Clinical researcher at a microscope"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            filter: "sepia(0.28) contrast(1.03) brightness(0.96) saturate(0.85)",
            opacity: 0,
            animation: "fadeIn 1200ms ease 150ms forwards, slowZoom 8000ms ease-out forwards",
          }}
        />

        {/* Warm blend gradient on the left edge — bleeds the image into the cream column */}
        <div
          aria-hidden
          className="welcome-image-blend"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(239, 232, 214, 0.95) 0%, rgba(239, 232, 214, 0.25) 18%, rgba(239, 232, 214, 0) 40%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Top / bottom soft vignette to blend into frame edges */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(239, 232, 214, 0.35) 0%, rgba(239, 232, 214, 0) 22%, rgba(239, 232, 214, 0) 78%, rgba(239, 232, 214, 0.45) 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Editorial caption — floats over the image bottom-right */}
        <div
          className="welcome-caption"
          style={{
            position: "absolute",
            right: 32,
            bottom: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(20, 22, 24, 0.72)",
            zIndex: 3,
            opacity: 0,
            animation: "fadeIn 900ms ease 1100ms forwards",
          }}
        >
          <span
            style={{
              width: 40,
              height: 1,
              background: "rgba(20, 22, 24, 0.45)",
            }}
          />
          <span>Plate 01 — Research</span>
        </div>
      </div>
    </div>
  );
}
