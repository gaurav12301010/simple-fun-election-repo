"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import DoodleBackground from "@/components/DoodleBackground";
import CountdownTimer from "@/components/CountdownTimer";
import CandidateCard from "@/components/CandidateCard";
import { FiLock, FiAward } from "react-icons/fi";

const fallbackResultsTime = "2026-03-24T06:30:00.000Z";
const RESULTS_UNLOCK = new Date(process.env.NEXT_PUBLIC_RESULTS_UNLOCK_DATE || fallbackResultsTime);

interface ResultCandidate {
  id: string;
  name: string;
  short_form?: string;
  party: string;
  agenda: string;
  logo_url: string;
  vote_count: number;
}

export default function ResultsPage() {
  const [now, setNow] = useState(new Date());
  const [results, setResults] = useState<ResultCandidate[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const isUnlocked = now >= RESULTS_UNLOCK;

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isUnlocked) return;
    setLoading(true);
    fetch("/api/results")
      .then(r => r.json())
      .then(d => {
        setResults(d.results || []);
        setTotalVotes(d.totalVotes || 0);
        if ((d.results || []).length > 0) {
          setTimeout(() => setShowConfetti(true), 600);
          setTimeout(() => setShowConfetti(false), 7000);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isUnlocked]);

  const winner = results[0];

  return (
    <div className="page-bg" style={{ minHeight: "100vh", position: "relative" }}>
      <DoodleBackground />
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          colors={["#f59e0b", "#fbbf24", "#3b82f6", "#8b5cf6", "#10b981"]}
        />
      )}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, marginBottom: 10 }}>
            🏆 <span className="gradient-text">Election Results</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16 }}>
            {isUnlocked ? `Results for ${totalVotes} total votes cast.` : "Results will be revealed automatically when the timer expires."}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* Locked state */
            <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
              <div className="glass-strong" style={{ padding: "48px 32px", marginBottom: 24 }}>
                <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <FiLock size={56} color="#f59e0b" style={{ margin: "0 auto 20px" }} />
                </motion.div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Results Not Yet Revealed</h2>
                <p style={{ color: "#94a3b8", marginBottom: 32, fontSize: 14 }}>
                  Check back when the countdown ends.
                </p>
                <CountdownTimer targetDate={RESULTS_UNLOCK} label="RESULTS UNLOCK IN" />
              </div>

              {/* Blurred preview */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ filter: "blur(8px)", pointerEvents: "none", opacity: 0.35 }}
              >
                <div className="glass" style={{ padding: 28, marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 72, height: 72, borderRadius: 16, background: "rgba(245,158,11,0.2)" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 22, background: "rgba(255,255,255,0.1)", borderRadius: 6, marginBottom: 8, width: "40%" }} />
                      <div style={{ height: 16, background: "rgba(255,255,255,0.06)", borderRadius: 6, width: "60%" }} />
                    </div>
                    <div style={{ fontSize: 28 }}>👑</div>
                  </div>
                </div>
                {[1, 2].map(i => (
                  <div key={i} className="glass" style={{ padding: 20, marginBottom: 12 }}>
                    <div style={{ height: 16, background: "rgba(255,255,255,0.08)", borderRadius: 6, width: `${70 - i * 15}%` }} />
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ) : loading ? (
            <div key="loading" style={{ textAlign: "center", padding: "80px 0" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: 40, height: 40, border: "3px solid rgba(245,158,11,0.2)", borderTopColor: "#f59e0b", borderRadius: "50%", margin: "0 auto" }}
              />
            </div>
          ) : results.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
              <h3 style={{ fontSize: 22, fontWeight: 700 }}>No votes have been cast yet.</h3>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* Winner card */}
              {winner && (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ marginBottom: 36 }}
                >
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(139,92,246,0.1))",
                      border: "2px solid rgba(245,158,11,0.5)",
                      borderRadius: 24,
                      padding: 32,
                      textAlign: "center",
                      boxShadow: "0 0 60px rgba(245,158,11,0.2)",
                      position: "relative",
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ fontSize: 48, marginBottom: 8 }}
                    >
                      👑
                    </motion.div>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#f59e0b", marginBottom: 16 }}>
                      WINNER
                    </p>
                    <div style={{ maxWidth: 320, margin: "0 auto" }}>
                      <CandidateCard
                        candidate={winner}
                        isWinner
                        showVoteCount
                        voteCount={winner.vote_count}
                        totalVotes={totalVotes}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* All results */}
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <FiAward color="#8b5cf6" /> All Candidates
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 400 }}>— {totalVotes} total votes</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                {results.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CandidateCard
                      candidate={c}
                      showVoteCount
                      voteCount={c.vote_count}
                      totalVotes={totalVotes}
                      isWinner={i === 0 && c.vote_count > 0}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
