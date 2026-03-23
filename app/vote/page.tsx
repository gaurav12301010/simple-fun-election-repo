"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import toast from "react-hot-toast";
import Link from "next/link";
import DoodleBackground from "@/components/DoodleBackground";
import CountdownTimer from "@/components/CountdownTimer";
import CandidateCard from "@/components/CandidateCard";
import { FiLock, FiUser, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

const fallbackVotingTime = "2026-03-23T15:30:00.000Z";
const VOTING_OPENS = new Date(process.env.NEXT_PUBLIC_VOTING_OPENS_DATE || fallbackVotingTime);

const FUNNY_WARNINGS = [
  "Are you sure? 🤨",
  "Think twice...",
  "Vote the right person 😏",
  "mt kr lala 😭",
  "esa mt kro meri jaan 💔",
  "na mane? 😤",
  "last chance... 👀",
  "I'm warning you... ⚠️",
  "Bro please 🤦‍♂️",
  "You're making a mistake 📉",
  "System error: Wrong candidate chosen 🦠",
  "Wait, let's talk about this 🗣️",
  "Don't click Yes again 🛑",
  "I will literally cry 😢",
  "Is your finger slipping? 👆",
  "Are you blind? 🙈",
  "Take a deep breath 🧘‍♂️",
  "Final warning... probably 🤷‍♂️",
  "Okay fine, but you'll regret it 🙄",
  "Whatever, casting vote... 😒"
];

interface Candidate {
  id: string;
  name: string;
  short_form?: string;
  party_code?: string;
  party: string;
  agenda: string;
  logo_url: string;
  status?: string;
}

export default function VotePage() {
  const [now, setNow] = useState(new Date());
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [user, setUser] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const [warningStep, setWarningStep] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [shakeButton, setShakeButton] = useState(false);

  const isOpen = now >= VOTING_OPENS;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Check vote status from DB (not localStorage)
    fetch("/api/votes/check")
      .then(r => r.json())
      .then(d => { if (d.voted) setVoted(true); })
      .catch(() => {});
    
    // Fetch user session
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => setUser(d.user))
      .catch(() => {});

    // Fetch approved candidates
    fetch("/api/candidates")
      .then(r => r.json())
      .then(d => setCandidates(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const finalSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: selectedId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Vote failed.");

      setVoted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
      toast.success("🗳️ Vote cast successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
      setShowWarningModal(false);
    }
  };

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return toast.error("Please select a candidate.");

    const grantTarget = (process.env.NEXT_PUBLIC_GRANT || "PA").trim().toUpperCase();
    const targetCandidate = candidates.find(c => c.id === selectedId);
    const targetShortForm = (targetCandidate?.party_code || targetCandidate?.short_form || "").trim().toUpperCase();
    
    if (targetCandidate && targetShortForm !== grantTarget) {
      if (warningStep < FUNNY_WARNINGS.length - 1) {
        setShowWarningModal(true);
        return;
      }
    }

    await finalSubmit();
  };

  return (
    <div className="page-bg" style={{ minHeight: "100vh", position: "relative" }}>
      <DoodleBackground />
      {showConfetti && <ReactConfetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={350} gravity={0.25} colors={["#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b"]} />}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, marginBottom: 10 }}>
            🗳️ <span className="gradient-text">Cast Your Vote</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16 }}>
            {isOpen ? "Voting is now open! Select your candidate below." : "Voting will open soon. Stay tuned!"}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {voted ? (
            <motion.div
              key="voted"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-strong"
              style={{ padding: 56, textAlign: "center" }}
            >
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                <FiCheckCircle size={72} color="#10b981" style={{ margin: "0 auto 20px" }} />
              </motion.div>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Your Vote is Counted!</h2>
              <p style={{ color: "#94a3b8", fontSize: 15 }}>
                Thank you for participating. Results will be revealed automatically when the countdown ends.
              </p>
            </motion.div>
          ) : !isOpen ? (
            <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
              <motion.div
                className="glass-strong"
                style={{ padding: "48px 32px", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(0px)", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FiLock size={52} color="#8b5cf6" style={{ margin: "0 auto 20px" }} />
                  </motion.div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Voting Not Yet Open</h2>
                  <p style={{ color: "#94a3b8", marginBottom: 32, fontSize: 14 }}>
                    Voting opens dynamically when the timer ends.
                  </p>
                  <CountdownTimer targetDate={VOTING_OPENS} label="VOTING OPENS IN" />
                </div>
              </motion.div>
            </motion.div>
          ) : !user ? (
            <motion.div key="nouser" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-strong" style={{ padding: 48, textAlign: "center" }}>
              <FiUser size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "white" }}>Authentication Required</h2>
              <p style={{ color: "#94a3b8", marginBottom: 24 }}>You must be logged in to cast your vote.</p>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ padding: "12px 24px" }}>Go to Login</button>
              </Link>
            </motion.div>
          ) : user.status !== 'verified' ? (
            <motion.div key="unverified" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-strong" style={{ padding: 48, textAlign: "center" }}>
              <FiAlertTriangle size={48} color="#f59e0b" style={{ margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "white" }}>Account Not Verified</h2>
              <p style={{ color: "#94a3b8", marginBottom: 24 }}>Your voter application is currently <strong>{user.status}</strong>. Only verified voters can participate.</p>
              <Link href="/profile" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ padding: "12px 24px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                  Check Profile
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <form onSubmit={handleVote}>
                <div className="glass-strong" style={{ padding: 24, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Voting as</p>
                    <p style={{ fontSize: 18, color: "white", fontWeight: 700 }}>{user.name} (@{user.username})</p>
                  </div>
                  <div style={{ background: "rgba(16,185,129,0.2)", color: "#10b981", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                    VERIFIED
                  </div>
                </div>

                {/* Candidate Selection */}
                <div className="glass-strong" style={{ padding: 32, marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "#60a5fa" }}>
                    Select Your Candidate
                  </h3>
                  {candidates.length === 0 ? (
                    <p style={{ color: "#64748b", textAlign: "center", padding: "20px 0" }}>No candidates registered yet.</p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                      {candidates.map(c => (
                        <CandidateCard
                          key={c.id}
                          candidate={c}
                          selected={selectedId === c.id}
                          selectable
                          onClick={() => setSelectedId(c.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  style={{ width: "100%", fontSize: 17, padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  {loading ? "Submitting..." : "🗳️ Cast My Vote"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showWarningModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(10px)" }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }}
              className="glass-strong"
              style={{ padding: "40px", maxWidth: "400px", width: "90%", textAlign: "center", border: "2px solid rgba(239, 68, 68, 0.4)", boxShadow: "0 0 50px rgba(239, 68, 68, 0.2)" }}
            >
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, color: "#f87171" }}>
                {FUNNY_WARNINGS[warningStep]}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => { setShowWarningModal(false); setWarningStep(0); setSelectedId(""); }}
                  style={{ background: "#3b82f6" }}
                >
                  Okay, I'll change my vote 😅
                </button>
                <motion.button
                  type="button"
                  onClick={() => {
                    if (warningStep < FUNNY_WARNINGS.length - 2) {
                      setWarningStep(s => s + 1);
                      setShakeButton(true);
                      setTimeout(() => setShakeButton(false), 500);
                    } else {
                      finalSubmit();
                    }
                  }}
                  animate={shakeButton ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="btn-primary"
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
                >
                  Yes, I'm sure
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
