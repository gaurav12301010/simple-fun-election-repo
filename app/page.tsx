"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DoodleBackground from "@/components/DoodleBackground";
import CandidateCard from "@/components/CandidateCard";
import { FiUserPlus, FiRefreshCw } from "react-icons/fi";

interface Candidate {
  id: string;
  name: string;
  short_form?: string;
  party: string;
  agenda: string;
  logo_url: string;
}

export default function HomePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/candidates?status=all");
      const data = await res.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  return (
    <div className="page-bg" style={{ minHeight: "100vh", position: "relative" }}>
      <DoodleBackground />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span
            style={{
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 13,
              color: "#60a5fa",
              fontWeight: 600,
              letterSpacing: 1,
              display: "inline-block",
              marginBottom: 16,
            }}
          >
            🗳️ ELECTION 2026
          </span>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 12 }}>
            Meet the{" "}
            <span className="gradient-text">Candidates</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 17, maxWidth: 500, margin: "0 auto 24px" }}>
            Browse all registered candidates and their manifestos before casting your vote.
          </p>

          {/* Stats bar */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.div
              key={candidates.length}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              style={{
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.3)",
                borderRadius: 12,
                padding: "8px 20px",
                fontSize: 15,
                color: "#a78bfa",
                fontWeight: 700,
              }}
            >
              {candidates.length} Candidate{candidates.length !== 1 ? "s" : ""} Registered
            </motion.div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <FiUserPlus /> Nominate Yourself
            </motion.button>
          </Link>
          <motion.button
            onClick={fetchCandidates}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "12px 20px",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <FiRefreshCw size={14} /> Refresh
          </motion.button>
        </div>

        {/* Candidates Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 40,
                height: 40,
                border: "3px solid rgba(59,130,246,0.2)",
                borderTopColor: "#3b82f6",
                borderRadius: "50%",
                margin: "0 auto",
              }}
            />
            <p style={{ color: "#94a3b8", marginTop: 16 }}>Loading candidates...</p>
          </div>
        ) : candidates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "80px 0" }}
          >
            <div style={{ fontSize: 64, marginBottom: 16 }}>🗳️</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No candidates yet</h3>
            <p style={{ color: "#94a3b8" }}>Be the first to nominate yourself!</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            <AnimatePresence>
              {candidates.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <CandidateCard candidate={c} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
