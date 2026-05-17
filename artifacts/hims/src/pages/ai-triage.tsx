import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { AlertCircle, Heart, Thermometer, Activity, Check, ChevronRight, ArrowLeft } from "lucide-react";

const C = {
  teal:  "#0d9488",
  navy:  "#0f2027",
  body:  "#4b5563",
  muted: "#9ca3af",
  border:"#e2e8f0",
  bg:    "#f8fafc",
  white: "#ffffff",
};

const TRIAGE_LEVELS = [
  { level: "Immediate", color: "#dc2626", bg: "#fef2f2", time: "Emergency", desc: "Life-threatening" },
  { level: "Very Urgent", color: "#ea580c", bg: "#fff7ed", time: "< 10 min", desc: "Severe symptoms" },
  { level: "Urgent", color: "#ca8a04", bg: "#fefce8", time: "< 1 hour", desc: "Moderate symptoms" },
  { level: "Semi-Urgent", color: "#059669", bg: "#ecfdf5", time: "< 2 hours", desc: "Minor symptoms" },
  { level: "Non-Urgent", color: "#2563eb", bg: "#eff6ff", time: "< 4 hours", desc: "Routine follow-up" },
];

const SAMPLE_CASE = {
  patientName: "James Wilson",
  age: 45,
  chief_complaint: "Chest pain and shortness of breath",
  vitals: {
    bp: "158/92",
    hr: "102",
    rr: "24",
    temp: "37.2°C",
    spo2: "94%",
  },
  symptoms: ["Chest pain", "Dyspnea", "Diaphoresis", "Palpitations"],
  medical_history: ["Hypertension", "Smoking"],
  aiAssessment: "Very Urgent",
  confidence: 96,
  reasoning: [
    "Hemodynamically unstable (BP 158/92, HR 102)",
    "Respiratory distress (RR 24, SpO2 94%)",
    "Classic acute coronary syndrome presentation",
    "Risk factors: Age, hypertension, smoking",
    "Immediate ECG and cardiac markers required",
  ],
};

export default function AITriageSuggestion() {
  const [selectedLevel, setSelectedLevel] = useState(SAMPLE_CASE.aiAssessment);
  const [, setLocation] = useLocation();

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", minHeight: "100%" }}>
      {/* Header with back button */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
        <button
          onClick={() => setLocation("/ai-studio")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.teal,
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            fontWeight: 600,
            fontSize: "0.85rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#0f766e")}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.teal)}
        >
          <ArrowLeft size={16} />
          Back to AI Studio
        </button>
      </div>
      {/* Header */}
      <div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <AlertCircle size={24} color={C.teal} />
            <h1 style={{ fontSize: "1.25rem", fontWeight: 900, color: C.navy, margin: 0 }}>
              AI Triage Suggestion
            </h1>
          </div>
          <p style={{ fontSize: "0.82rem", color: C.muted, margin: 0, marginTop: "0.25rem" }}>
            Manchester 5-level triage with AI-powered clinical assessment
          </p>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Left — Patient Assessment */}
        <div>
          <div style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: "0.875rem",
            padding: "1.5rem",
            boxShadow: "0 1px 4px rgba(15,32,39,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}>
            {/* Patient Info */}
            <div>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy, marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                Patient Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <div style={{ background: C.bg, padding: "0.625rem", borderRadius: "0.5rem" }}>
                  <div style={{ fontSize: "0.7rem", color: C.muted, fontWeight: 600 }}>NAME</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy }}>{SAMPLE_CASE.patientName}</div>
                </div>
                <div style={{ background: C.bg, padding: "0.625rem", borderRadius: "0.5rem" }}>
                  <div style={{ fontSize: "0.7rem", color: C.muted, fontWeight: 600 }}>AGE</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy }}>{SAMPLE_CASE.age} years</div>
                </div>
              </div>
            </div>

            {/* Chief Complaint */}
            <div>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy, marginBottom: "0.5rem" }}>Chief Complaint</h3>
              <div style={{
                background: C.bg,
                padding: "0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                color: C.body,
                lineHeight: 1.5,
                fontWeight: 500,
              }}>
                {SAMPLE_CASE.chief_complaint}
              </div>
            </div>

            {/* Vitals */}
            <div>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy, marginBottom: "0.75rem" }}>Vital Signs</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                <div style={{ background: "#fef2f2", padding: "0.625rem", borderRadius: "0.5rem", border: "1px solid #fecaca" }}>
                  <div style={{ fontSize: "0.7rem", color: "#dc2626", fontWeight: 600 }}>BP</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#dc2626" }}>{SAMPLE_CASE.vitals.bp}</div>
                </div>
                <div style={{ background: "#fff7ed", padding: "0.625rem", borderRadius: "0.5rem", border: "1px solid #fed7aa" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ea580c", fontWeight: 600 }}>HR</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ea580c" }}>{SAMPLE_CASE.vitals.hr} bpm</div>
                </div>
                <div style={{ background: "#fefce8", padding: "0.625rem", borderRadius: "0.5rem", border: "1px solid #fef08a" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ca8a04", fontWeight: 600 }}>RR</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ca8a04" }}>{SAMPLE_CASE.vitals.rr}/min</div>
                </div>
                <div style={{ background: "#ecfdf5", padding: "0.625rem", borderRadius: "0.5rem", border: "1px solid #ccfbf1" }}>
                  <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 600 }}>SpO2</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#059669" }}>{SAMPLE_CASE.vitals.spo2}</div>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy, marginBottom: "0.5rem" }}>Presenting Symptoms</h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {SAMPLE_CASE.symptoms.map((symptom) => (
                  <span key={symptom} style={{
                    display: "inline-block",
                    background: C.tealLight,
                    color: C.teal,
                    padding: "0.3rem 0.625rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}>
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — AI Assessment */}
        <div>
          {/* Triage Level Selector */}
          <div style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: "0.875rem",
            padding: "1.5rem",
            boxShadow: "0 1px 4px rgba(15,32,39,0.05)",
            marginBottom: "1rem",
          }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy, marginBottom: "0.875rem", textTransform: "uppercase", letterSpacing: "0.02em" }}>
              Manchester Triage Levels
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {TRIAGE_LEVELS.map((level) => (
                <button
                  key={level.level}
                  onClick={() => setSelectedLevel(level.level)}
                  style={{
                    background: selectedLevel === level.level ? level.bg : C.white,
                    border: `1.5px solid ${selectedLevel === level.level ? level.color : C.border}`,
                    borderRadius: "0.625rem",
                    padding: "0.75rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: level.color,
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: level.color }}>{level.level}</div>
                    <div style={{ fontSize: "0.7rem", color: C.muted, marginTop: "0.1rem" }}>{level.desc} · {level.time}</div>
                  </div>
                  {level.level === SAMPLE_CASE.aiAssessment && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Check size={14} color={C.teal} />
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: C.teal }}>AI Recommendation</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* AI Assessment Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: TRIAGE_LEVELS.find(l => l.level === SAMPLE_CASE.aiAssessment)?.bg || C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: "0.875rem",
              padding: "1.5rem",
              boxShadow: "0 1px 4px rgba(15,32,39,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy, margin: 0, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                AI Assessment
              </h3>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "0.5rem",
                background: TRIAGE_LEVELS.find(l => l.level === SAMPLE_CASE.aiAssessment)?.bg,
                color: TRIAGE_LEVELS.find(l => l.level === SAMPLE_CASE.aiAssessment)?.color,
                fontSize: "0.75rem",
                fontWeight: 700,
              }}>
                {SAMPLE_CASE.confidence}%
              </div>
            </div>

            <div style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: "0.625rem",
              padding: "0.875rem",
              marginBottom: "1rem",
            }}>
              <div style={{ fontSize: "0.7rem", color: C.muted, fontWeight: 600, marginBottom: "0.3rem" }}>RECOMMENDED TRIAGE LEVEL</div>
              <div style={{
                fontSize: "1.25rem",
                fontWeight: 900,
                color: TRIAGE_LEVELS.find(l => l.level === SAMPLE_CASE.aiAssessment)?.color,
              }}>
                {SAMPLE_CASE.aiAssessment}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: C.navy, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.01em" }}>
                Clinical Reasoning
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {SAMPLE_CASE.reasoning.map((reason, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      fontSize: "0.8rem",
                      color: C.body,
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ color: TRIAGE_LEVELS.find(l => l.level === SAMPLE_CASE.aiAssessment)?.color, fontWeight: 700, flexShrink: 0 }}>•</span>
                    <span>{reason}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <button style={{
              width: "100%",
              padding: "0.75rem",
              background: TRIAGE_LEVELS.find(l => l.level === SAMPLE_CASE.aiAssessment)?.color,
              color: C.white,
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              marginTop: "1rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
            >
              Confirm Triage & Route to Queue
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
