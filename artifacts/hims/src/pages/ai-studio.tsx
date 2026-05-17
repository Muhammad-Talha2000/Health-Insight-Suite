import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Sparkles, Search, Mic, Brain, AlertCircle, FileText,
  Shield, MessageSquare, ArrowLeft
} from "lucide-react";

const C = {
  teal:  "#0d9488",
  navy:  "#0f2027",
  body:  "#4b5563",
  muted: "#9ca3af",
  border:"#e2e8f0",
  bg:    "#f8fafc",
  white: "#ffffff",
};

const AI_FEATURES = [
  {
    id: 1,
    title: "Smart Patient Lookup",
    description: "Free-text semantic search",
    icon: Search,
    enabled: true,
    iconColor: "#3b82f6",
    iconBg: "#eff6ff",
    path: "/ai-studio/smart-lookup",
  },
  {
    id: 2,
    title: "ICD-10 Auto-Coding",
    description: "Suggest codes from notes",
    icon: Brain,
    enabled: true,
    iconColor: "#7c3aed",
    iconBg: "#f5f3ff",
    path: null,
  },
  {
    id: 3,
    title: "Voice-to-Text Notes",
    description: "Whisper-powered SOAP",
    icon: Mic,
    enabled: true,
    iconColor: "#ea580c",
    iconBg: "#fff7ed",
    path: null,
  },
  {
    id: 4,
    title: "Drug Interaction Deep Analysis",
    description: "OpenAI explains interactions",
    icon: AlertCircle,
    enabled: true,
    iconColor: "#dc2626",
    iconBg: "#fef2f2",
    path: null,
  },
  {
    id: 5,
    title: "AI Triage Suggestion",
    description: "Manchester scale assistant",
    icon: Sparkles,
    enabled: true,
    iconColor: "#ca8a04",
    iconBg: "#fefce8",
    path: "/ai-studio/triage",
  },
  {
    id: 6,
    title: "Discharge Summary Generator",
    description: "Drafts from MAR + notes",
    icon: FileText,
    enabled: true,
    iconColor: "#22c55e",
    iconBg: "#ecfdf5",
    path: "/ai-studio/discharge",
  },
  {
    id: 7,
    title: "Insurance Pre-Audit",
    description: "Flags missing items",
    icon: Shield,
    enabled: true,
    iconColor: C.teal,
    iconBg: "#f0fdf9",
    path: null,
  },
  {
    id: 8,
    title: "Executive Q&A",
    description: "NL reporting",
    icon: MessageSquare,
    enabled: true,
    iconColor: "#06b6d4",
    iconBg: "#ecf8fb",
    path: null,
  },
];

export default function AIStudio() {
  const [toggledFeatures, setToggledFeatures] = useState<Record<number, boolean>>(
    AI_FEATURES.reduce((acc, feature) => ({ ...acc, [feature.id]: feature.enabled }), {})
  );
  const [, setLocation] = useLocation();

  const toggleFeature = (id: number) => {
    setToggledFeatures(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFeatureClick = (path: string | null, enabled: boolean) => {
    if (path && enabled) {
      setLocation(path);
    }
  };

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", minHeight: "100%" }}>

      {/* Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Sparkles size={24} color={C.teal} />
            <h1 style={{ fontSize: "1.25rem", fontWeight: 900, color: C.navy, margin: 0 }}>
              AI Studio
            </h1>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.5rem",
              height: "1.5rem",
              background: "#f0fdf9",
              color: C.teal,
              borderRadius: "9999px",
              fontSize: "0.65rem",
              fontWeight: 700,
              border: `1px solid #ccfbf1`,
            }}>
              AI
            </span>
          </div>
          <p style={{ fontSize: "0.82rem", color: C.muted, margin: 0, marginTop: "0.25rem" }}>
            Toggle AI features and tune prompts
          </p>
        </motion.div>
      </div>

      {/* Feature Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
      }}>
        {AI_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          const isEnabled = toggledFeatures[feature.id];
          const hasPage = feature.path !== null;

          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => handleFeatureClick(feature.path, isEnabled)}
            >
              <div style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: "0.875rem",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 4px rgba(15,32,39,0.05)",
                cursor: hasPage && isEnabled ? "pointer" : "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(15,32,39,0.09)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(15,32,39,0.05)";
              }}
              >
                {/* Top section with icon and toggle */}
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "0.875rem",
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "0.625rem",
                    background: feature.iconBg,
                  }}>
                    <Icon size={18} color={feature.iconColor} />
                  </div>

                  {/* Toggle switch */}
                  <button
                    onClick={() => toggleFeature(feature.id)}
                    style={{
                      width: "3.25rem",
                      height: "1.5rem",
                      borderRadius: "9999px",
                      border: "none",
                      background: isEnabled ? C.teal : C.border,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      padding: "0.25rem",
                      transition: "background 0.3s ease",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (!isEnabled) {
                        (e.currentTarget as HTMLButtonElement).style.background = "#d1d5db";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = isEnabled ? C.teal : C.border;
                    }}
                  >
                    <div style={{
                      width: "1rem",
                      height: "1rem",
                      borderRadius: "50%",
                      background: C.white,
                      transition: "transform 0.3s ease",
                      transform: isEnabled ? "translateX(1.75rem)" : "translateX(0)",
                    }} />
                  </button>
                </div>

                {/* Title and description */}
                <div style={{ flex: 1, marginBottom: "0.875rem" }}>
                  <h3 style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: C.navy,
                    margin: "0 0 0.3rem 0",
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: "0.78rem",
                    color: C.muted,
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    {feature.description}
                  </p>
                </div>

                {/* Footer CTA */}
                {isEnabled ? (
                  <button 
                    onClick={() => handleFeatureClick(feature.path, isEnabled)}
                    style={{
                      width: "100%",
                      padding: "0.625rem 1rem",
                      background: C.teal,
                      color: C.white,
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: hasPage ? "pointer" : "default",
                      transition: "all 0.2s ease",
                      opacity: hasPage ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => {
                      if (hasPage) {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(13, 148, 136, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                    }}
                  >
                    {hasPage ? "Launch Feature" : "Coming Soon"}
                  </button>
                ) : (
                  <button style={{
                    width: "100%",
                    padding: "0.625rem 1rem",
                    background: C.bg,
                    color: C.muted,
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.5rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "not-allowed",
                    transition: "all 0.2s ease",
                  }}>
                    Coming Soon
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
