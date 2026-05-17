import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, ChevronRight, Clock, AlertCircle, User, FileText, ArrowLeft } from "lucide-react";

const C = {
  teal:  "#0d9488",
  navy:  "#0f2027",
  body:  "#4b5563",
  muted: "#9ca3af",
  border:"#e2e8f0",
  bg:    "#f8fafc",
  white: "#ffffff",
};

const SEARCH_RESULTS = [
  {
    id: 1,
    mrNumber: "MR-2024-0847",
    name: "Robert Mitchell",
    age: 58,
    status: "Active",
    lastVisit: "3 days ago",
    allergies: ["Penicillin", "Shellfish"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    relevance: 98,
  },
  {
    id: 2,
    mrNumber: "MR-2024-1203",
    name: "Robert Johnson",
    age: 42,
    status: "Active",
    lastVisit: "1 week ago",
    allergies: ["None"],
    conditions: ["Asthma"],
    relevance: 85,
  },
  {
    id: 3,
    mrNumber: "MR-2023-0956",
    name: "John Roberts",
    age: 71,
    status: "Inactive",
    lastVisit: "2 months ago",
    allergies: ["NSAID"],
    conditions: ["COPD", "Hypertension"],
    relevance: 72,
  },
];

export default function SmartPatientLookup() {
  const [searchQuery, setSearchQuery] = useState("Robert");
  const [selectedPatient, setSelectedPatient] = useState<typeof SEARCH_RESULTS[0] | null>(null);
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
            <Search size={24} color={C.teal} />
            <h1 style={{ fontSize: "1.25rem", fontWeight: 900, color: C.navy, margin: 0 }}>
              Smart Patient Lookup
            </h1>
          </div>
          <p style={{ fontSize: "0.82rem", color: C.muted, margin: 0, marginTop: "0.25rem" }}>
            Search across all patient records using natural language queries
          </p>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Left — Search interface */}
        <div>
          <div style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: "0.875rem",
            padding: "1.5rem",
            boxShadow: "0 1px 4px rgba(15,32,39,0.05)",
          }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: C.navy, marginBottom: "0.5rem" }}>
              Patient Search
            </label>
            <div style={{ position: "relative", marginBottom: "1.25rem" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted }} />
              <input
                type="text"
                placeholder="Search by name, MR#, phone, or symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: "0.625rem",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "border-color 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.teal)}
                onBlur={(e) => (e.target.style.borderColor = C.border)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {SEARCH_RESULTS.map((result, i) => (
                <motion.button
                  key={result.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedPatient(result)}
                  style={{
                    background: selectedPatient?.id === result.id ? "#f0fdf9" : C.white,
                    border: `1px solid ${selectedPatient?.id === result.id ? C.teal : C.border}`,
                    borderRadius: "0.625rem",
                    padding: "0.875rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(13,148,136,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.3rem" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: C.navy }}>{result.name}</div>
                      <div style={{ fontSize: "0.75rem", color: C.muted }}>{result.mrNumber}</div>
                    </div>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "1.75rem",
                      height: "1.75rem",
                      background: C.tealLight,
                      color: C.teal,
                      borderRadius: "0.375rem",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}>
                      {result.relevance}%
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem", color: C.muted }}>
                    <span>{result.age} years</span>
                    <span>•</span>
                    <span>{result.status}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Patient Details */}
        {selectedPatient && (
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
              gap: "1.25rem",
            }}
          >
            {/* Patient Header */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: C.tealLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <User size={20} color={C.teal} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: C.navy, fontSize: "0.95rem" }}>{selectedPatient.name}</div>
                  <div style={{ fontSize: "0.75rem", color: C.muted }}>{selectedPatient.mrNumber}</div>
                </div>
              </div>
            </div>

            {/* Key Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ background: C.bg, borderRadius: "0.5rem", padding: "0.625rem" }}>
                <div style={{ fontSize: "0.7rem", color: C.muted, fontWeight: 600, marginBottom: "0.2rem" }}>AGE</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.navy }}>{selectedPatient.age} years</div>
              </div>
              <div style={{ background: C.bg, borderRadius: "0.5rem", padding: "0.625rem" }}>
                <div style={{ fontSize: "0.7rem", color: C.muted, fontWeight: 600, marginBottom: "0.2rem" }}>STATUS</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: selectedPatient.status === "Active" ? "#059669" : C.muted }}>
                  {selectedPatient.status}
                </div>
              </div>
            </div>

            {/* Last Visit */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", background: C.bg, borderRadius: "0.5rem" }}>
              <Clock size={14} color={C.muted} />
              <span style={{ fontSize: "0.8rem", color: C.body }}>Last visit: <span style={{ fontWeight: 600 }}>{selectedPatient.lastVisit}</span></span>
            </div>

            {/* Allergies */}
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: C.navy, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <AlertCircle size={14} color="#dc2626" />
                Allergies
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {selectedPatient.allergies.map((allergy) => (
                  <span key={allergy} style={{
                    display: "inline-block",
                    background: "#fef2f2",
                    color: "#dc2626",
                    padding: "0.3rem 0.625rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    border: "1px solid #fecaca",
                  }}>
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: C.navy, marginBottom: "0.5rem" }}>Chronic Conditions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {selectedPatient.conditions.map((condition) => (
                  <div key={condition} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 0.625rem",
                    background: C.bg,
                    borderRadius: "0.375rem",
                    fontSize: "0.8rem",
                    color: C.body,
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.teal, flexShrink: 0 }} />
                    {condition}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button style={{
              width: "100%",
              padding: "0.75rem",
              background: C.teal,
              color: C.white,
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              marginTop: "0.5rem",
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
              View Full Record
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
