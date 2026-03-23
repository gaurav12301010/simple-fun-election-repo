"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiEdit2, FiLogOut, FiCheckCircle, FiAlertCircle, FiXCircle, FiClock, FiUser } from "react-icons/fi";
import DoodleBackground from "@/components/DoodleBackground";

// ── Re-usable ID Card (same style as registration preview) ──────────────────
function VoterIDCard({ user }: { user: any }) {
  const getInitials = (name: string) =>
    name?.trim().split(" ").map((w: string) => w[0]?.toUpperCase() || "").join("").slice(0, 2) || "?";

  const stampConfig: Record<string, { color: string; label: string; rotate: string }> = {
    pending:  { color: "#f59e0b", label: "PENDING",  rotate: "-8deg" },
    review:   { color: "#3b82f6", label: "REVIEW",   rotate: "-8deg" },
    verified: { color: "#10b981", label: "VERIFIED", rotate: "-8deg" },
    rejected: { color: "#ef4444", label: "REJECTED", rotate: "-8deg" },
  };
  const stamp = stampConfig[user.status] || stampConfig.pending;

  return (
    <motion.div
      whileHover={{ rotateY: 3, rotateX: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200 }}
      style={{
        width: "100%", maxWidth: 440,
        background: "linear-gradient(135deg, #fffdf5 0%, #f0f4ff 100%)",
        borderRadius: 18, border: "2px solid #c8d4f0",
        boxShadow: "0 20px 60px rgba(0,0,50,0.3), inset 0 1px 0 rgba(255,255,255,0.8)",
        overflow: "hidden", position: "relative", color: "#1a2340", userSelect: "none",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Watermark */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex:0 }}>
        <span style={{ fontSize: 72, fontWeight: 900, color: "rgba(59,130,246,0.07)", transform: "rotate(-30deg)", whiteSpace: "nowrap", letterSpacing: 4 }}>ELECTX GOVT</span>
      </div>

      {/* Header */}
      <div style={{ background: "linear-gradient(90deg, #1e3a8a, #2563eb)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 28 }}>🏛️</div>
        <div>
          <div style={{ color: "white", fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Republic of ElectX</div>
          <div style={{ color: "#93c5fd", fontSize: 10, letterSpacing: 1 }}>National Voter Registration Authority</div>
        </div>
        <div style={{ marginLeft: "auto", color: "#93c5fd", fontSize: 10, textAlign: "right" }}>
          <div>VOTER ID</div>
          <div style={{ color: "white", fontWeight: 700, fontFamily: "monospace", fontSize: 11 }}>{user.voter_id || "IND-2026-????"}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 20px", position: "relative", zIndex: 1, display: "flex", gap: 16 }}>
        {/* Photo + Signature */}
        <div style={{ flexShrink: 0 }}>
          {user.photo_url ? (
            <img src={user.photo_url} alt="photo" style={{ width: 85, height: 100, objectFit: "cover", border: "2px solid #2563eb", borderRadius: 6 }} />
          ) : (
            <div style={{ width: 85, height: 100, border: "2px dashed #93c5fd", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(219,234,254,0.4)", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#2563eb" }}>{getInitials(user.name)}</div>
              <div style={{ fontSize: 9, color: "#93c5fd" }}>PHOTO</div>
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: 9, color: "#4b5563", textAlign: "center", borderTop: "1px solid #cbd5e1", paddingTop: 5, letterSpacing: 1 }}>SIGNATURE</div>
          <div style={{ height: 22, position: "relative", marginTop: 2, borderBottom: "1px solid #1e3a8a" }}>
            {user.signature_url && <img src={user.signature_url} alt="sig" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />}
          </div>
        </div>

        {/* Fields */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, fontSize: 11 }}>
          {[
            { l: "NAME", v: user.name },
            { l: "DOB", v: user.dob },
            { l: "GENDER", v: user.gender },
            { l: "USERNAME", v: user.username ? `@${user.username}` : undefined },
            { l: "BLOOD", v: user.blood_group },
            { l: "HEIGHT", v: user.height },
          ].filter(x => x.v).map(({ l, v }) => (
            <div key={l}>
              <div style={{ fontSize: 8, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
              <div style={{ fontWeight: 600, color: "#1e3a8a", fontFamily: "monospace", fontSize: 12 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stamp + Date */}
      <div style={{ padding: "0 20px 14px", position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 9, color: "#6b7280" }}>
          <div>ISSUE DATE: {new Date().toLocaleDateString("en-IN")}</div>
          <div>VALID: ELECTION DAY ONLY 😄</div>
        </div>
        <div style={{ border: `3px solid ${stamp.color}`, borderRadius: 6, padding: "4px 10px", color: stamp.color, fontWeight: 900, fontSize: 14, letterSpacing: 3, transform: `rotate(${stamp.rotate})`, opacity: 0.9 }}>
          {stamp.label}
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ background: "linear-gradient(90deg, #1e3a8a, #2563eb)", padding: "6px 20px", fontFamily: "monospace", fontSize: 9, color: "#93c5fd", letterSpacing: 2, position: "relative", zIndex: 1 }}>
        {`<<${(user.name || "HOLDER").toUpperCase().replace(/ /g, "<")}<IND<${(user.username || "").toUpperCase()}<<<<<`}
      </div>
    </motion.div>
  );
}

function CandidateIDCard({ candidate, user }: { candidate: any, user: any }) {
  const stampConfig: Record<string, { color: string; label: string; rotate: string }> = {
    pending:  { color: "#f59e0b", label: "PENDING",  rotate: "-8deg" },
    approved: { color: "#10b981", label: "APPROVED", rotate: "-8deg" },
    rejected: { color: "#ef4444", label: "REJECTED", rotate: "-8deg" },
  };
  const stamp = stampConfig[candidate.status] || stampConfig.pending;

  return (
    <motion.div
      whileHover={{ rotateY: 3, rotateX: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200 }}
      style={{
        width: "100%", maxWidth: 440,
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
        borderRadius: 18, border: "2px solid #6366f1",
        boxShadow: "0 20px 60px rgba(0,0,50,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
        overflow: "hidden", position: "relative", color: "white", userSelect: "none",
        fontFamily: "'Georgia', serif",
      }}
    >
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex:0 }}>
        <span style={{ fontSize: 72, fontWeight: 900, color: "rgba(255,255,255,0.03)", transform: "rotate(-30deg)", whiteSpace: "nowrap", letterSpacing: 4 }}>CANDIDATE</span>
      </div>

      <div style={{ background: "linear-gradient(90deg, #4338ca, #6366f1)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 28 }}>🗳️</div>
        <div>
          <div style={{ color: "white", fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Electoral Commission</div>
          <div style={{ color: "#c7d2fe", fontSize: 10, letterSpacing: 1 }}>Official Candidate Registration</div>
        </div>
        <div style={{ marginLeft: "auto", color: "#c7d2fe", fontSize: 10, textAlign: "right" }}>
          <div>PARTY CODE</div>
          <div style={{ color: "white", fontWeight: 700, fontFamily: "monospace", fontSize: 11 }}>{candidate.short_form || "N/A"}</div>
        </div>
      </div>

      <div style={{ padding: "16px 20px", position: "relative", zIndex: 1, display: "flex", gap: 16 }}>
        <div style={{ flexShrink: 0 }}>
          {candidate.logo_url ? (
            <img src={candidate.logo_url} alt="logo" style={{ width: 85, height: 85, objectFit: "cover", border: "2px solid #818cf8", borderRadius: 6, backgroundColor: "white" }} />
          ) : (
            <div style={{ width: 85, height: 85, border: "2px dashed #6366f1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(99,102,241,0.2)" }}>
              <FiUser size={32} color="#818cf8" />
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: 9, color: "#a5b4fc", textAlign: "center", borderTop: "1px solid #4f46e5", paddingTop: 5, letterSpacing: 1 }}>PARTY LOGO</div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, fontSize: 11 }}>
          {[
            { l: "NOMINEE NAME", v: candidate.name },
            { l: "PARTY AFFILIATION", v: candidate.party },
            { l: "LINKED VOTER ID", v: user.voter_id || "PENDING" },
            { l: "AGENDA", v: candidate.agenda && candidate.agenda.length > 40 ? candidate.agenda.substring(0, 40) + "..." : candidate.agenda },
          ].map(({ l, v }) => (
            <div key={l}>
              <div style={{ fontSize: 8, color: "#a5b4fc", letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
              <div style={{ fontWeight: 600, color: "white", fontFamily: "monospace", fontSize: 12 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px 14px", position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 9, color: "#94a3b8", maxWidth: "60%" }}>
           {candidate.admin_message ? (
             <div><span style={{color: "#fca5a5"}}>Note:</span> {candidate.admin_message}</div>
           ) : (
             <div>ISSUE DATE: {new Date(candidate.created_at || Date.now()).toLocaleDateString("en-IN")}</div>
           )}
        </div>
        <div style={{ border: `3px solid ${stamp.color}`, borderRadius: 6, padding: "4px 10px", color: stamp.color, fontWeight: 900, fontSize: 14, letterSpacing: 3, transform: `rotate(${stamp.rotate})`, opacity: 0.9 }}>
          {stamp.label}
        </div>
      </div>

      <div style={{ background: "linear-gradient(90deg, #4338ca, #6366f1)", padding: "6px 20px", fontFamily: "monospace", fontSize: 9, color: "#c7d2fe", letterSpacing: 2, position: "relative", zIndex: 1 }}>
        {`<<CANDIDATE<${candidate.short_form || "IND"}<<<<<<<<<<<<<<<<<<`}
      </div>
    </motion.div>
  );
}

// ── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  pending:  { color: "#f59e0b", icon: FiClock,        text: "Pending Verification",  bg: "rgba(245,158,11,0.1)" },
  review:   { color: "#3b82f6", icon: FiAlertCircle,  text: "Action Required",       bg: "rgba(59,130,246,0.1)" },
  verified: { color: "#10b981", icon: FiCheckCircle,  text: "Verified Voter ✅",      bg: "rgba(16,185,129,0.1)" },
  rejected: { color: "#ef4444", icon: FiXCircle,      text: "Application Rejected",  bg: "rgba(239,68,68,0.1)" },
} as const;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const sigRef   = useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({
    name: "", dob: "", gender: "", address: "", height: "", blood_group: "",
    eye_color: "", favorite_subject: "", trust_reason: "", child_income: "",
    partner_name: "", crush_count: "", mobile_usage: "", early_riser: "",
    photo_url: "", signature_url: ""
  });
  const [activeTab, setActiveTab] = useState<"card" | "details" | "candidate">("card");

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (!d.user) { router.push("/login"); return; }
        setUser(d.user);
        setEditForm({
          name: d.user.name || "", dob: d.user.dob || "",
          gender: d.user.gender || "", address: d.user.address || "",
          height: d.user.height || "", blood_group: d.user.blood_group || "",
          eye_color: d.user.eye_color || "",
          favorite_subject: d.user.favorite_subject || "",
          trust_reason: d.user.trust_reason || "",
          child_income: d.user.child_income || "",
          partner_name: d.user.partner_name || "",
          crush_count: d.user.crush_count || "",
          mobile_usage: d.user.mobile_usage || "",
          early_riser: d.user.early_riser || "",
          photo_url: d.user.photo_url || "",
          signature_url: d.user.signature_url || "",
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      toast.success("Re-submitted for review!");
      setUser({ ...user, ...editForm, status: "pending", admin_message: null });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleFile = (key: "photo_url" | "signature_url", maxKB: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > maxKB * 1024) return toast.error(`File must be under ${maxKB}KB`);
      const reader = new FileReader();
      reader.onload = () => setEditForm(f => ({ ...f, [key]: reader.result as string }));
      reader.readAsDataURL(file);
    };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  if (loading) return <div className="page-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><DoodleBackground /><p style={{ color: "#94a3b8", zIndex: 1, position: "relative" }}>Loading...</p></div>;
  if (!user) return null;

  const statusCfg = STATUS[user.status as keyof typeof STATUS] || STATUS.pending;
  const StatusIcon = statusCfg.icon;
  const isReview = user.status === "review";

  const funnyFields = [
    { label: "📏 Height", val: user.height },
    { label: "🩸 Blood Group", val: user.blood_group },
    { label: "👁️ Eye Color", val: user.eye_color },
    { label: "🏠 Address", val: user.address },
    { label: "⚧️ Gender", val: user.gender },
    { label: "❤️ GF/BF Name", val: user.partner_name },
    { label: "😏 Number of Crushes", val: user.crush_count },
    { label: "📱 Daily Mobile Usage", val: user.mobile_usage ? `${user.mobile_usage} hrs/day` : null },
    { label: "💸 Child's Income", val: user.child_income ? `₹${user.child_income}` : null },
    { label: "📚 Fav Subject", val: user.favorite_subject },
    { label: "⏰ Early Riser?", val: user.early_riser },
    { label: "🤔 Why Trust You?", val: user.trust_reason },
  ].filter(f => f.val);

  return (
    <div className="page-bg" style={{ minHeight: "100vh", position: "relative", padding: "40px 16px" }}>
      <DoodleBackground />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, margin: 0 }}><span className="gradient-text">My Voter Profile</span></h1>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Voter ID: <span style={{ color: "#60a5fa", fontWeight: 700 }}>{user.voter_id || "Not assigned yet"}</span></p>
          </div>
          <motion.button onClick={handleLogout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", padding: "10px 18px", display: "flex", alignItems: "center", gap: 6 }}>
            <FiLogOut size={14} /> Logout
          </motion.button>
        </div>

        {/* Status bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: statusCfg.bg, border: `1px solid ${statusCfg.color}40`, borderRadius: 14, padding: "16px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: `${statusCfg.color}20`, color: statusCfg.color, padding: 10, borderRadius: "50%" }}>
            <StatusIcon size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "white", fontSize: 16 }}>{statusCfg.text}</div>
            {user.admin_message && <div style={{ color: "#fca5a5", fontSize: 13, marginTop: 4 }}>Admin: {user.admin_message}</div>}
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {["card", "details", ...(user.candidate ? ["candidate"] : [])].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} style={{ padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", border: "1px solid", transition: "all 0.2s", background: activeTab === t ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)", color: activeTab === t ? "#60a5fa" : "#94a3b8", borderColor: activeTab === t ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.1)" }}>
              {t === "card" ? "🪪 My ID Card" : t === "details" ? "📋 My Details" : "⭐ My Candidacy"}
            </button>
          ))}
        </div>

        {activeTab === "card" ? (
          <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", justifyContent: "center" }}>
            <VoterIDCard user={user} />
          </motion.div>
        ) : activeTab === "candidate" && user.candidate ? (
          <motion.div key="candidate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", justifyContent: "center" }}>
            <CandidateIDCard candidate={user.candidate} user={user} />
          </motion.div>
        ) : (
          <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {isReview ? (
              <div className="glass-strong" style={{ padding: 32 }}>
                <div style={{ marginBottom: 24, padding: "12px 16px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 10 }}>
                  <p style={{ color: "#60a5fa", fontSize: 13, margin: 0 }}>✏️ <strong>Update required.</strong> Please review and correct all details below, then resubmit.</p>
                  {user.admin_message && <p style={{ color: "#fca5a5", fontSize: 13, marginTop: 8, margin: 0 }}>Admin note: <em>{user.admin_message}</em></p>}
                </div>

                <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {/* ── Section 1: Basic ── */}
                  <section>
                    <h4 style={{ color: "#94a3b8", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>📋 Basic Details</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[{k:"name",l:"Full Name *",t:"text"},{k:"dob",l:"Date of Birth *",t:"date"},{k:"address",l:"Address",t:"text"}].map(({k,l,t}) => (
                        <div key={k} style={k==="address" ? {gridColumn:"1/-1"} : {}}>
                          <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>{l}</label>
                          <input type={t} className="input-field" value={editForm[k]} onChange={e=>setEditForm(f=>({...f,[k]:e.target.value}))} style={{marginTop:6,width:"100%"}} />
                        </div>
                      ))}
                      <div>
                        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>Gender</label>
                        <select className="input-field" value={editForm.gender} onChange={e=>setEditForm(f=>({...f,gender:e.target.value}))} style={{marginTop:6,width:"100%"}}>
                          <option value="">Select</option>
                          {["Male","Female","Prefer not to say","My form doesn't have this option"].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* ── Section 2: Physical ── */}
                  <section>
                    <h4 style={{ color: "#94a3b8", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>📐 Physical Details</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>Height</label>
                        <input className="input-field" placeholder="e.g. 5'8''" value={editForm.height} onChange={e=>setEditForm(f=>({...f,height:e.target.value}))} style={{marginTop:6,width:"100%"}} />
                      </div>
                      <div>
                        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>Blood Group</label>
                        <select className="input-field" value={editForm.blood_group} onChange={e=>setEditForm(f=>({...f,blood_group:e.target.value}))} style={{marginTop:6,width:"100%"}}>
                          <option value="">Select</option>
                          {["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown (probably rare)"].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>Eye Color</label>
                        <select className="input-field" value={editForm.eye_color} onChange={e=>setEditForm(f=>({...f,eye_color:e.target.value}))} style={{marginTop:6,width:"100%"}}>
                          <option value="">Select</option>
                          {["Black","Brown","Hazel","Blue","Green","Red (suspicious)","Other"].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* ── Section 3: Fun Stuff ── */}
                  <section>
                    <h4 style={{ color: "#94a3b8", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>🎭 The Fun Stuff</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>❤️ GF/BF Name</label>
                        <input className="input-field" value={editForm.partner_name} onChange={e=>setEditForm(f=>({...f,partner_name:e.target.value}))} style={{marginTop:6,width:"100%"}} />
                      </div>
                      <div>
                        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>😏 Number of Crushes</label>
                        <input type="number" className="input-field" value={editForm.crush_count} onChange={e=>setEditForm(f=>({...f,crush_count:e.target.value}))} style={{marginTop:6,width:"100%"}} />
                      </div>
                      <div>
                        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>📱 Daily Mobile Usage (hrs)</label>
                        <input type="number" className="input-field" value={editForm.mobile_usage} onChange={e=>setEditForm(f=>({...f,mobile_usage:e.target.value}))} style={{marginTop:6,width:"100%"}} />
                      </div>
                      <div>
                        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>💸 Child's Monthly Income (₹)</label>
                        <input type="number" className="input-field" value={editForm.child_income} onChange={e=>setEditForm(f=>({...f,child_income:e.target.value}))} style={{marginTop:6,width:"100%"}} />
                      </div>
                      <div>
                        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>📚 Favourite Subject</label>
                        <select className="input-field" value={editForm.favorite_subject} onChange={e=>setEditForm(f=>({...f,favorite_subject:e.target.value}))} style={{marginTop:6,width:"100%"}}>
                          <option value="">Select</option>
                          {["Mathematics","Science","English","Hindi","Social Studies","Recess 😄","None (I skipped school)"].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>⏰ Wake before 10 AM?</label>
                        <select className="input-field" value={editForm.early_riser} onChange={e=>setEditForm(f=>({...f,early_riser:e.target.value}))} style={{marginTop:6,width:"100%"}}>
                          <option value="">Select</option>
                          <option value="Yes">Yes (liar)</option>
                          <option value="No">No (honest)</option>
                          <option value="Depends">Depends on the WiFi 😂</option>
                        </select>
                      </div>
                      <div style={{gridColumn:"1/-1"}}>
                        <label style={{fontSize:12,color:"#64748b",fontWeight:600}}>🤔 Why should we trust you?</label>
                        <textarea className="input-field" value={editForm.trust_reason} onChange={e=>setEditForm(f=>({...f,trust_reason:e.target.value}))} style={{marginTop:6,width:"100%",height:70,resize:"vertical"}} />
                      </div>
                    </div>
                  </section>

                  {/* ── Section 4: Photos & Signature ── */}
                  <section>
                    <h4 style={{ color: "#94a3b8", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>📸 Photos &amp; Signature</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {/* Photo */}
                      <div>
                        <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Profile Photo (max 500KB)</label>
                        <div onClick={() => photoRef.current?.click()} style={{ marginTop: 6, cursor: "pointer", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 10, padding: 12, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                          {editForm.photo_url ? "✅ Photo selected — click to change" : "Click to upload photo"}
                        </div>
                        <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile("photo_url", 500)} />
                        {editForm.photo_url && (
                          <img src={editForm.photo_url} alt="preview" style={{ marginTop: 8, width: 70, height: 85, objectFit: "cover", borderRadius: 6, border: "2px solid #3b82f6" }} />
                        )}
                      </div>
                      {/* Signature */}
                      <div>
                        <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Signature (max 300KB)</label>
                        <div onClick={() => sigRef.current?.click()} style={{ marginTop: 6, cursor: "pointer", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 10, padding: 12, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                          {editForm.signature_url ? "✅ Signature selected — click to change" : "Click to upload signature"}
                        </div>
                        <input ref={sigRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile("signature_url", 300)} />
                        {editForm.signature_url && (
                          <div style={{ marginTop: 8, background: "white", padding: 8, borderRadius: 6, display: "inline-block", border: "2px solid #3b82f6" }}>
                            <img src={editForm.signature_url} alt="sig preview" style={{ height: 50, maxWidth: 140, objectFit: "contain" }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  <motion.button type="submit" className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={updating} style={{ padding: 14, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <FiEdit2 /> {updating ? "Submitting..." : "✅ Update All & Resubmit"}
                  </motion.button>
                </form>
              </div>
            ) : (
              <div className="glass-strong" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "white", marginBottom: 20 }}>🧾 Submitted Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                  {[
                    { label: "Full Name", val: user.name },
                    { label: "Username", val: `@${user.username}` },
                    { label: "Date of Birth", val: user.dob },
                    { label: "Voter ID", val: user.voter_id },
                    ...funnyFields.map(f => ({ label: f.label, val: f.val }))
                  ].map(({ label, val }) => val ? (
                    <div key={label} style={{ background: "rgba(255,255,255,0.04)", padding: "12px 14px", borderRadius: 10 }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{label}</div>
                      <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{val}</div>
                    </div>
                  ) : null)}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
