# 🧠 Vivara MedSim

**AI-Powered Virtual Clinical Simulation Platform**

Vivara MedSim is a flight simulator for doctors — an adaptive clinical simulation platform that gives medical trainees in low- and middle-income countries (LMICs) hands-on decision-making experience without requiring physical clinical placements.

Built for the **Harvard T.H. Chan School of Public Health Hackathon 2026**.

---

## 🎯 The Problem

Medical students across Sub-Saharan Africa, South Asia, and Latin America graduate with strong theoretical knowledge but dangerously insufficient clinical experience. High patient volumes mean students observe rather than participate. When they finally see their first patient independently, they're underprepared — leading to diagnostic errors, delayed interventions, and preventable deaths.

## 💡 The Solution

Vivara MedSim provides AI-powered, adaptive clinical simulations that feel real. Think of it as what flight simulators did for aviation safety — but for medicine.

- **Adaptive difficulty** calibrated to each learner's level
- **LMIC-aware scenarios** reflecting local disease burdens and resource constraints
- **Real-time decision consequences** — patients respond to your choices
- **Longitudinal analytics** tracking competency growth over time
- **Gamification** with XP, badges, streaks, and leaderboards

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/vivara-medsim.git
cd vivara-medsim

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Vercel

```bash
# Push to GitHub, then:
# 1. Go to vercel.com
# 2. Import your GitHub repo
# 3. Deploy — zero config needed
```

Or use the Vercel CLI:

```bash
npx vercel
```

---

## 📁 Project Structure

```
vivara-medsim/
├── app/
│   ├── layout.tsx              # Root layout with shared navigation
│   ├── globals.css             # Design system tokens & animations
│   ├── page.tsx                # Entry point → redirects to /onboarding
│   ├── onboarding/page.tsx     # AI Calibration (role select → MCQ → assessment)
│   ├── dashboard/page.tsx      # Main hub (stats, badges, leaderboard, daily case)
│   ├── simulation/page.tsx     # Core simulation engine (4-phase sepsis case)
│   └── team/page.tsx           # Multiplayer team lobby (mock)
├── components/
│   └── Navigation.tsx          # Bottom navigation bar
├── public/
│   └── manifest.json           # PWA manifest
├── package.json
├── next.config.js
└── tsconfig.json
```

---

## 🧩 Demo Flow

### 1. Onboarding / AI Calibration (`/onboarding`)
- Select your role: Medical Student, Intern, or Resident
- Answer one role-appropriate MCQ
- Receive an AI-generated assessment with confidence score, strengths, growth areas, and a recommended simulation pathway

### 2. Dashboard (`/dashboard`)
- Profile card with XP progress
- Stats: accuracy, cases completed, average decision time, streak
- Badge collection (earned & locked)
- Competency tracker with animated skill bars
- Daily case card linking to the simulation
- Live leaderboard
- Quick actions for navigation

### 3. Simulation Engine (`/simulation`)
- **Phase 1 — Initial Assessment**: Stabilize the patient (ABCs, fluid resuscitation)
- **Phase 2 — Investigation**: Order appropriate labs and cultures
- **Phase 3 — Diagnosis**: Interpret results, form working diagnosis
- **Phase 4 — Treatment**: Definitive management plan

Each phase includes:
- Live patient vitals monitor (HR, BP, Temp, RR, SpO₂, GCS)
- Countdown timer with urgency indicators
- Decision options with real-time consequences
- Immediate clinical feedback with evidence-based explanations
- XP rewards scaled to decision quality

### 4. Multiplayer Mock (`/team`)
- Team lobby with 4 clinical roles (Triage Lead, Diagnostician, Treatment Lead, Nurse Coordinator)
- Live ready-up system with auto-countdown
- Functional team chat
- Trauma case preview

---

## ⚙️ Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Framework   | Next.js 14 (App Router)       |
| Language    | TypeScript                    |
| Styling     | Inline styles + CSS variables |
| Fonts       | Plus Jakarta Sans, JetBrains Mono |
| Deployment  | Vercel                        |
| Data        | Static JSON (no backend)      |

---

## 🎨 Design System

| Token              | Value                          |
|--------------------|--------------------------------|
| Background         | `#0a0e1a`                      |
| Card               | `#1a2035`                      |
| Border             | `#2a3454`                      |
| Primary Accent     | `#06b6d4` (Teal)               |
| Success            | `#22c55e` (Green)              |
| Warning            | `#f59e0b` (Amber)              |
| Error              | `#ef4444` (Red)                |
| Display Font       | Plus Jakarta Sans              |
| Monospace Font     | JetBrains Mono                 |

---

## 🗺 Roadmap (Post-Hackathon)

- [ ] OpenAI/Claude API integration for dynamic AI patient responses
- [ ] Persistent user accounts with authentication
- [ ] Case library with 50+ scenarios across specialties
- [ ] Real-time multiplayer with WebSocket connections
- [ ] LMS integration (Moodle, Canvas) for institutional deployment
- [ ] CME/CPD certification tracking
- [ ] Mobile-native app (React Native)
- [ ] Offline mode for low-connectivity regions

---

## 👥 Team

| Name                       | Role                      |
|----------------------------|---------------------------|
| Oluwasola Victor           | Founder / CMO             |
| Ojih Charles               | Product & Evaluation      |
| Ogunka Favour              | Strategy & Operations     |
| Obata Onyelukachukwu       | Technical Lead            |

Affiliated with **Harvard T.H. Chan School of Public Health** and **Babcock University**.

---

## 📄 License

This project was built for the Harvard T.H. Chan School of Public Health Hackathon 2026. All rights reserved by the Vivara team.

---

<p align="center">
  <strong>Vivara MedSim</strong> — Because every clinician deserves to be ready for their first patient.
</p>
