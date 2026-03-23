"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiUsers, FiAward, FiBarChart2, FiLock, FiCheck, FiX, FiRefreshCcw } from "react-icons/fi";
import DoodleBackground from "@/components/DoodleBackground";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("voters"); // voters, candidates, insights
  
  const [users, setUsers] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [insights, setInsights] = useState<{ summary: any[]; auditLog: any[] }>({ summary: [], auditLog: [] });
  const [loading, setLoading] = useState(false);

  // For review message modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [reviewActionType, setReviewActionType] = useState<"review" | "rejected">("review");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setAuthenticated(true);
          fetchData();
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
        fetchData();
        toast.success("Admin authorized");
      } else {
        toast.error("Invalid credentials.");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, cRes, iRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/candidates"),
        fetch("/api/admin/insights")
      ]);
      const uData = await uRes.json();
      const cData = await cRes.json();
      const iData = await iRes.json();
      
      if (!uRes.ok) toast.error(`Users API: ${uData.error || 'Failed'}`);
      if (!cRes.ok) toast.error(`Candidates API: ${cData.error || 'Failed'}`);
      if (!iRes.ok) toast.error(`Insights API: ${iData.error || 'Failed'}`);

      setUsers(Array.isArray(uData) ? uData : []);
      setCandidates(Array.isArray(cData) ? cData : []);
      setInsights(iData?.summary ? iData : { summary: [], auditLog: [] });
    } catch {
      toast.error("Network error loading data");
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: string, message?: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status, admin_message: message }),
      });
      if (res.ok) {
        toast.success(`User marked as ${status}`);
        setUsers(users.map(u => u.id === userId ? { ...u, status, admin_message: message || null } : u));
        setReviewModalOpen(false);
        setReviewMessage("");
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const updateCandidateStatus = async (candidateId: string, status: string, message?: string) => {
    try {
      const res = await fetch("/api/admin/candidates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, status, admin_message: message }),
      });
      if (res.ok) {
        toast.success(`Candidate marked as ${status}`);
        setCandidates(candidates.map(c => c.id === candidateId ? { ...c, status, admin_message: message || null } : c));
        if (status === "rejected") {
          setReviewModalOpen(false);
          setReviewMessage("");
        }
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  if (authLoading) return <div className="page-bg" style={{ minHeight: "100vh" }} />;

  if (!authenticated) {
    return (
      <div className="page-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DoodleBackground />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong" style={{ padding: 40, width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <FiLock size={40} color="#6366f1" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "white" }}>Admin Core</h2>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="password"
              className="input-field"
              placeholder="Enter Master Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: 14 }}>Access Panel</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-bg" style={{ minHeight: "100vh", padding: "40px 24px" }}>
      <DoodleBackground />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900 }}><span className="gradient-text">Control Dashboard</span></h1>
          <button onClick={fetchData} className="btn-primary" style={{ padding: "8px 16px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <FiRefreshCcw size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, overflowX: "auto" }}>
          {[
            { id: "voters", label: "Manage Voters", icon: FiUsers },
            { id: "candidates", label: "Manage Candidates", icon: FiAward },
            { id: "insights", label: "Voting Insights", icon: FiBarChart2 },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, fontSize: 15, fontWeight: 600,
                  background: activeTab === tab.id ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)",
                  color: activeTab === tab.id ? "#60a5fa" : "#94a3b8",
                  border: activeTab === tab.id ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer", transition: "all 0.2s"
                }}
              >
                <Icon /> {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: 40 }}>Loading data...</p>
        ) : (
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong" style={{ padding: 24, overflowX: "auto" }}>
            
            {/* VOTERS TAB */}
            {activeTab === "voters" && (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                     <th style={{ padding: "16px 8px", color: "#94a3b8" }}>Name & Username</th>
                     <th style={{ padding: "16px 8px", color: "#94a3b8" }}>Status</th>
                     <th style={{ padding: "16px 8px", color: "#94a3b8", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(users) ? users : []).map(u => (
                    <>
                    <tr key={u.id} style={{ borderBottom: expandedUserId === u.id ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "16px 8px", color: "white" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {u.photo_url && <img src={u.photo_url} alt="photo" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #3b82f6" }} />}
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                            <div style={{ fontSize: 13, color: "#94a3b8" }}>@{u.username} • DOB: {u.dob} • {u.voter_id || "No ID"}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 8px" }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                          background: (u.status || 'pending') === 'verified' ? 'rgba(16,185,129,0.2)' : (u.status || 'pending') === 'rejected' ? 'rgba(239,68,68,0.2)' : (u.status || 'pending') === 'review' ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)',
                          color: (u.status || 'pending') === 'verified' ? '#10b981' : (u.status || 'pending') === 'rejected' ? '#f87171' : (u.status || 'pending') === 'review' ? '#60a5fa' : '#fbbf24'
                        }}>
                          {(u.status || 'pending').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "16px 8px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                          <button onClick={() => setExpandedUserId(expandedUserId === u.id ? null : u.id)} style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>📋 {expandedUserId === u.id ? "Hide" : "Details"}</button>
                          {u.status !== 'verified' && (<button onClick={() => updateUserStatus(u.id, 'verified')} style={{ background: "rgba(16,185,129,0.2)", color: "#10b981", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><FiCheck /> Approve</button>)}
                          {u.status !== 'rejected' && (<button onClick={() => { setSelectedUserId(u.id); setReviewActionType('rejected'); setReviewModalOpen(true); }} style={{ background: "rgba(239,68,68,0.2)", color: "#f87171", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><FiX /> Reject</button>)}
                          {u.status !== 'review' && (<button onClick={() => { setSelectedUserId(u.id); setReviewActionType('review'); setReviewModalOpen(true); }} style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>Review</button>)}
                        </div>
                      </td>
                    </tr>
                    {expandedUserId === u.id && (
                      <tr key={`${u.id}-details`} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td colSpan={3} style={{ padding: "0 16px 20px" }}>
                          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 20 }}>
                            {/* Photos row */}
                            {(u.photo_url || u.signature_url) && (
                              <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                                {u.photo_url && (
                                  <div>
                                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>📸 Profile Photo</div>
                                    <img src={u.photo_url} alt="photo" style={{ width: 80, height: 95, objectFit: "cover", borderRadius: 8, border: "2px solid #3b82f6" }} />
                                  </div>
                                )}
                                {u.signature_url && (
                                  <div>
                                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>✍️ Signature</div>
                                    <div style={{ background: "white", padding: 8, borderRadius: 8, border: "2px solid #3b82f6" }}>
                                      <img src={u.signature_url} alt="sig" style={{ height: 55, maxWidth: 160, objectFit: "contain" }} />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {/* All fields grid */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12, fontSize: 13 }}>
                              {[
                                { label: "🪪 Voter ID",        val: u.voter_id },
                                { label: "⚧️ Gender",          val: u.gender },
                                { label: "🎂 Date of Birth",   val: u.dob },
                                { label: "🏠 Address",         val: u.address },
                                { label: "🩸 Blood Group",     val: u.blood_group },
                                { label: "📏 Height",          val: u.height },
                                { label: "👁️ Eye Color",       val: u.eye_color },
                                { label: "❤️ GF/BF Name",     val: u.partner_name },
                                { label: "😏 Crushes",         val: u.crush_count },
                                { label: "📱 Mobile Usage",    val: u.mobile_usage ? `${u.mobile_usage} hrs/day` : null },
                                { label: "💸 Child Income",    val: u.child_income ? `₹${u.child_income}` : null },
                                { label: "📚 Fav Subject",     val: u.favorite_subject },
                                { label: "⏰ Early Riser",     val: u.early_riser },
                                { label: "🤔 Why Trust Them",  val: u.trust_reason },
                              ].map(({ label, val }) => val ? (
                                <div key={label} style={{ background: "rgba(255,255,255,0.05)", padding: "10px 12px", borderRadius: 8 }}>
                                  <div style={{ color: "#64748b", fontSize: 11, marginBottom: 3 }}>{label}</div>
                                  <div style={{ color: "white", fontWeight: 600 }}>{val}</div>
                                </div>
                              ) : null)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </>
                  ))}
                </tbody>
              </table>
            )}

            {/* CANDIDATES TAB */}
            {activeTab === "candidates" && (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                     <th style={{ padding: "16px 8px", color: "#94a3b8" }}>Candidate</th>
                     <th style={{ padding: "16px 8px", color: "#94a3b8" }}>Status</th>
                     <th style={{ padding: "16px 8px", color: "#94a3b8", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(candidates) ? candidates : []).map(c => (
                    <>
                    <tr key={c.id} style={{ borderBottom: expandedCandidateId === c.id ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "16px 8px", color: "white" }}>
                        <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 12 }}>
                          {c.logo_url && <img src={c.logo_url} alt="logo" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />}
                          <div>
                            {c.name}
                            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>{c.party} ({c.short_form || c.party_code})</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 8px" }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                          background: c.status === 'approved' ? 'rgba(16,185,129,0.2)' : c.status === 'rejected' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                          color: c.status === 'approved' ? '#10b981' : c.status === 'rejected' ? '#f87171' : '#fbbf24'
                        }}>
                          {(c.status || "approved").toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "16px 8px", textAlign: "right", display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                        <button onClick={() => setExpandedCandidateId(expandedCandidateId === c.id ? null : c.id)} style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>📋 {expandedCandidateId === c.id ? "Hide" : "Details"}</button>
                        {c.status !== 'approved' && (
                          <button onClick={() => updateCandidateStatus(c.id, 'approved')} style={{ background: "rgba(16,185,129,0.2)", color: "#10b981", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><FiCheck /> Approve</button>
                        )}
                        {c.status !== 'rejected' && (
                          <button onClick={() => { setSelectedCandidateId(c.id); setReviewActionType('rejected'); setReviewModalOpen(true); }} style={{ background: "rgba(239,68,68,0.2)", color: "#f87171", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><FiX /> Reject</button>
                        )}
                      </td>
                    </tr>
                    {expandedCandidateId === c.id && (
                      <tr key={`${c.id}-details`} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td colSpan={3} style={{ padding: "0 16px 20px" }}>
                          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 20 }}>
                            <div style={{ display: "flex", gap: 24, flexDirection: "column" }}>
                              {/* Headers and Party Logo */}
                              <div style={{ display: "flex", gap: 20 }}>
                                {c.logo_url && (
                                  <div>
                                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>🪧 Party Logo</div>
                                    <img src={c.logo_url} alt="logo" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "2px solid #6366f1", backgroundColor: "white" }} />
                                  </div>
                                )}
                                <div>
                                  <div style={{ color: "#64748b", fontSize: 11, marginBottom: 3 }}>Party Affiliation</div>
                                  <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>{c.party} ({c.short_form})</div>
                                  <div style={{ color: "#64748b", fontSize: 11, marginBottom: 3, marginTop: 12 }}>Candidate Name</div>
                                  <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                                </div>
                              </div>
                              {/* Agenda */}
                              <div>
                                <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6 }}>📖 Manifesto & Agenda</div>
                                <div style={{ color: "#e2e8f0", background: "rgba(0,0,0,0.2)", padding: 16, borderRadius: 8, whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: 13, border: "1px solid rgba(255,255,255,0.05)" }}>
                                  {c.agenda}
                                </div>
                              </div>
                              {/* Status Msg */}
                              {c.admin_message && (
                                <div>
                                  <div style={{ color: "#fca5a5", fontSize: 11, marginBottom: 3 }}>Admin Rejection Note</div>
                                  <div style={{ color: "#fecaca", fontWeight: 500, fontSize: 13 }}>{c.admin_message}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </>
                  ))}
                </tbody>
              </table>
            )}

            {/* INSIGHTS TAB */}
            {activeTab === "insights" && (
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 16 }}>Vote Summary</h3>
                {insights.summary.length === 0 ? <p style={{ color: "#94a3b8", marginBottom: 32 }}>No votes cast yet.</p> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
                    {insights.summary.map((ins: any) => (
                      <div key={ins.id} style={{ background: "rgba(255,255,255,0.05)", padding: "14px 20px", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 16, color: "white", fontWeight: 600 }}>{ins.name}</span>
                        <span style={{ fontSize: 20, fontWeight: 800, color: "#60a5fa" }}>{ins.votes} <span style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8" }}>votes</span></span>
                      </div>
                    ))}
                  </div>
                )}

                <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 16 }}>🔍 Voter Audit Log</h3>
                {insights.auditLog.length === 0 ? <p style={{ color: "#94a3b8" }}>No votes recorded yet.</p> : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                        <th style={{ padding: "12px 8px", color: "#94a3b8", fontSize: 13 }}>Voter</th>
                        <th style={{ padding: "12px 8px", color: "#94a3b8", fontSize: 13 }}>Voted For</th>
                        <th style={{ padding: "12px 8px", color: "#94a3b8", fontSize: 13 }}>When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {insights.auditLog.map((log: any, i: number) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "12px 8px", color: "white" }}>
                            <div style={{ fontWeight: 600 }}>{log.voter_name}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>@{log.voter_username}</div>
                          </td>
                          <td style={{ padding: "12px 8px" }}>
                            <span style={{ color: "#60a5fa", fontWeight: 600 }}>{log.candidate_name}</span>
                          </td>
                          <td style={{ padding: "12px 8px", color: "#64748b", fontSize: 13 }}>
                            {new Date(log.voted_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Review/Reject Modal */}
      <AnimatePresence>
        {reviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-strong" style={{ padding: 32, width: 400, maxWidth: "90%" }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 16 }}>
                {reviewActionType === "review" ? "Send for Review" : "Reject Voter"}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16 }}>Provide a message explaining why.</p>
              <textarea
                className="input-field"
                style={{ width: "100%", height: 100, marginBottom: 16 }}
                placeholder="Reason..."
                value={reviewMessage}
                onChange={e => setReviewMessage(e.target.value)}
              />
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
                  if (activeTab === "voters" && selectedUserId) {
                    updateUserStatus(selectedUserId, reviewActionType, reviewMessage);
                  } else if (activeTab === "candidates" && selectedCandidateId) {
                    updateCandidateStatus(selectedCandidateId, reviewActionType, reviewMessage);
                  }
                }}>Submit</button>
                <button className="btn-primary" style={{ flex: 1, background: "rgba(255,255,255,0.1)" }} onClick={() => setReviewModalOpen(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
