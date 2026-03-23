"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiUser, FiFlag } from "react-icons/fi";

interface Candidate {
  id: string;
  name: string;
  short_form?: string;
  party: string;
  agenda: string;
  logo_url: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  selected?: boolean;
  selectable?: boolean;
  onClick?: () => void;
  showVoteCount?: boolean;
  voteCount?: number;
  totalVotes?: number;
  isWinner?: boolean;
}

export default function CandidateCard({
  candidate,
  selected,
  selectable,
  onClick,
  showVoteCount,
  voteCount = 0,
  totalVotes = 0,
  isWinner,
}: CandidateCardProps) {
  const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

  return (
    <motion.div
      onClick={selectable ? onClick : undefined}
      layout
      whileHover={selectable || !showVoteCount ? { y: -6, scale: 1.02 } : {}}
      whileTap={selectable ? { scale: 0.97 } : {}}
      style={{
        background: selected
          ? "rgba(59,130,246,0.15)"
          : isWinner
          ? "rgba(245,158,11,0.12)"
          : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        border: selected
          ? "2px solid rgba(59,130,246,0.6)"
          : isWinner
          ? "2px solid rgba(245,158,11,0.6)"
          : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: 24,
        cursor: selectable ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        transition: "border 0.2s ease",
        boxShadow: selected
          ? "0 0 25px rgba(59,130,246,0.2)"
          : isWinner
          ? "0 0 35px rgba(245,158,11,0.25)"
          : "none",
      }}
    >
      {/* Winner crown */}
      {isWinner && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontSize: 24,
          }}
        >
          👑
        </motion.div>
      )}

      {/* Selected indicator */}
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 12,
          }}
        >
          ✓
        </div>
      )}

      {/* Logo */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 16,
          border: "2px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)",
          position: "relative",
          boxShadow: isWinner ? "0 0 20px rgba(245,158,11,0.3)" : "none",
        }}
      >
        <Image
          src={candidate.logo_url}
          alt={candidate.party}
          fill
          style={{ objectFit: "cover" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {!candidate.logo_url && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <FiFlag size={28} color="#8b5cf6" />
          </div>
        )}
      </div>

      {/* Info */}
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>
        {candidate.name} {candidate.short_form && <span style={{ color: "#60a5fa", fontSize: 14 }}>({candidate.short_form})</span>}
      </h3>
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#8b5cf6",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <FiFlag size={11} />
        {candidate.party}
      </p>
      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
        {candidate.agenda.length > 90
          ? candidate.agenda.slice(0, 90) + "..."
          : candidate.agenda}
      </p>

      {/* Vote count bar */}
      {showVoteCount && (
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "#94a3b8",
              marginBottom: 6,
            }}
          >
            <span>{voteCount} votes</span>
            <span>{percent}%</span>
          </div>
          <div
            style={{
              height: 6,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                height: "100%",
                background: isWinner
                  ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                  : "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
