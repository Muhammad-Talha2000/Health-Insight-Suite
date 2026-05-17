import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { FileText, Copy, Check, Loader, ArrowLeft } from "lucide-react";

const C = {
  teal:  "#0d9488",
  navy:  "#0f2027",
  body:  "#4b5563",
  muted: "#9ca3af",
  border:"#e2e8f0",
  bg:    "#f8fafc",
  white: "#ffffff",
};

const SAMPLE_CASE = {
  patientName: "Sarah Ahmed",
  mrNumber: "MR-2024-5892",
  admissionDate: "May 10, 2024",
  dischargeDate: "May 16, 2024",
  primaryDiagnosis: "Acute bronchitis",
  secondaryDiagnosis: ["Hypertension (controlled)", "Type 2 Diabetes Mellitus"],
  procedures: ["Chest X-ray", "CBC", "Blood culture"],
  medications: [
    { name: "Amoxicillin", dose: "500mg", frequency: "TID", duration: "7 days" },
    { name: "Albuterol inhaler", dose: "2 puffs", frequency: "Q4H PRN" },
    { name: "Lisinopril", dose: "10mg", frequency: "OD" },
  ],
  followUp: "Follow up with Primary Care Physician in 1 week. Return if symptoms worsen.",
};

const GENERATED_SUMMARY = `DISCHARGE SUMMARY

Patient Name: ${SAMPLE_CASE.patientName}
MR Number: ${SAMPLE_CASE.mrNumber}
Admission Date: ${SAMPLE_CASE.admissionDate}
Discharge Date: ${SAMPLE_CASE.dischargeDate}

PRINCIPAL DIAGNOSIS:
${SAMPLE_CASE.primaryDiagnosis}

SECONDARY DIAGNOSES:
• ${SAMPLE_CASE.secondaryDiagnosis.join('\n• ')}

HOSPITAL COURSE:
Patient admitted with productive cough, fever, and dyspnea. Imaging and laboratory workup consistent with acute bacterial bronchitis. Patient was treated with empiric antibiotics and supportive care. Clinical improvement noted over hospital stay.

PROCEDURES PERFORMED:
${SAMPLE_CASE.procedures.map(p => `• ${p}`).join('\n')}

DISCHARGE MEDICATIONS:
${SAMPLE_CASE.medications.map(m => `• ${m.name} ${m.dose} - ${m.frequency} x ${m.duration}`).join('\n')}

FOLLOW-UP:
${SAMPLE_CASE.followUp}

Discharge status: Home with medication regimen.`;

export default function DischargeSummaryGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [copied, setCopied] = useState(false);
  const [, setLocation] = useLocation();

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowSummary(true);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(GENERATED_SUMMARY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <FileText size={24} color={C.teal} />
            <h1 style={{ fontSize: "1.25rem", fontWeight: 900, color: C.navy, margin: 0 }}>
              Discharge Summary Generator
            </h1>
          </div>
          <p style={{ fontSize: "0.82rem", color: C.muted, margin: 0, marginTop: "0.25rem" }}>
            AI-powered discharge summaries from MAR, clinical notes, and test results
          </p>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Left — Patient Data */}
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
                  <div style={{ fontSize: "0.7rem", color: C.muted, fontWeight: 600 }}>MR#</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy }}>{SAMPLE_CASE.mrNumber}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                Admission & Discharge
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <div style={{ background: C.bg, padding: "0.625rem", borderRadius: "0.5rem" }}>
                  <div style={{ fontSize: "0.7rem", color: C.muted, fontWeight: 600 }}>ADMITTED</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: C.navy }}>{SAMPLE_CASE.admissionDate}</div>
                </div>
                <div style={{ background: C.bg, padding: "0.625rem", borderRadius: "0.5rem" }}>
                  <div style={{ fontSize: "0.7rem", color: C.muted, fontWeight: 600 }}>DISCHARGED</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: C.navy }}>{SAMPLE_CASE.dischargeDate}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                Primary Diagnosis
              </h3>
              <div style={{ background: "#ecfdf5", border: "1px solid #ccfbf1", padding: "0.75rem", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: C.teal }}>{SAMPLE_CASE.primaryDiagnosis}</div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                Secondary Diagnoses
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {SAMPLE_CASE.secondaryDiagnosis.map((diag) => (
                  <div key={diag} style={{
                    background: C.bg,
                    padding: "0.5rem 0.625rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.8rem",
                    color: C.body,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.teal }} />
                    {diag}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                Discharge Medications
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "200px", overflowY: "auto" }}>
                {SAMPLE_CASE.medications.map((med) => (
                  <div key={med.name} style={{
                    background: C.bg,
                    padding: "0.625rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                  }}>
                    <div style={{ fontWeight: 700, color: C.navy }}>{med.name}</div>
                    <div style={{ color: C.muted, marginTop: "0.2rem" }}>{med.dose} • {med.frequency}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                width: "100%",
                padding: "0.875rem",
                background: isGenerating ? "#d1d5db" : C.teal,
                color: C.white,
                border: "none",
                borderRadius: "0.625rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: isGenerating ? "not-allowed" : "pointer",
                marginTop: "0.5rem",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                if (!isGenerating) {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(13, 148, 136, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              {isGenerating && <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />}
              {isGenerating ? "Generating..." : "Generate Summary"}
            </button>
          </div>
        </div>

        {/* Right — Generated Summary */}
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: "0.875rem",
              padding: "1.5rem",
              boxShadow: "0 1px 4px rgba(15,32,39,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy, margin: 0, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                Generated Summary
              </h3>
              <button
                onClick={handleCopy}
                style={{
                  background: "none",
                  border: `1px solid ${C.border}`,
                  borderRadius: "0.5rem",
                  padding: "0.4rem 0.75rem",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: copied ? "#059669" : C.body,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  transition: "all 0.2s ease",
                }}
              >
                {copied ? (
                  <>
                    <Check size={12} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} /> Copy
                  </>
                )}
              </button>
            </div>

            <div style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: "0.625rem",
              padding: "1rem",
              maxHeight: "500px",
              overflowY: "auto",
              fontFamily: "monospace",
              fontSize: "0.75rem",
              lineHeight: 1.6,
              color: C.body,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {GENERATED_SUMMARY}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button style={{
                flex: 1,
                padding: "0.75rem",
                background: C.teal,
                color: C.white,
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(13, 148, 136, 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
              >
                Add to Record
              </button>
              <button style={{
                flex: 1,
                padding: "0.75rem",
                background: C.white,
                color: C.teal,
                border: `1.5px solid ${C.teal}`,
                borderRadius: "0.5rem",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}>
                Edit
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
