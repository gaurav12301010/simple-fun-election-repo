"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DoodleBackground from "@/components/DoodleBackground";
import { FiUpload, FiUser, FiFlag, FiFileText, FiCheck } from "react-icons/fi";
import Image from "next/image";

interface FormData {
  name: string;
  short_form: string;
  party: string;
  agenda: string;
  logo: File | null;
  logoPreview: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormData>({ name: "", short_form: "", party: "", agenda: "", logo: null, logoPreview: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.short_form.trim()) e.short_form = "Short form is required.";
    if (!form.party.trim()) e.party = "Party name is required.";
    if (!form.agenda.trim()) e.agenda = "Agenda is required.";
    else if (form.agenda.length < 20) e.agenda = "Agenda should be at least 20 characters.";
    if (!form.logo) e.logo = "Party logo is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, logo: file, logoPreview: preview }));
    setErrors(prev => ({ ...prev, logo: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("short_form", form.short_form);
      fd.append("party", form.party);
      fd.append("agenda", form.agenda);
      fd.append("logo", form.logo as File);

      const res = await fetch("/api/candidates", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to register.");

      setSubmitted(true);
      toast.success("🎉 Nomination submitted!");
      setTimeout(() => router.push("/"), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg" style={{ minHeight: "100vh", position: "relative" }}>
      <DoodleBackground />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, marginBottom: 10 }}>
            📝 <span className="gradient-text">Nominate Yourself</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16 }}>Fill in your details to enter the election race.</p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-strong"
            style={{ padding: 48, textAlign: "center", maxWidth: 480, margin: "0 auto" }}
          >
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Nomination Submitted!</h2>
            <p style={{ color: "#94a3b8" }}>Redirecting you to the candidates page...</p>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="glass-strong"
              style={{ padding: 32 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
                {/* Full Name */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <FiUser size={13} /> Full Name
                  </label>
                  <input
                    className="input-field"
                    placeholder="e.g. Rahul Kumar"
                    value={form.name}
                    onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: "" })); }}
                  />
                  {errors.name && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                </div>

                {/* Short Form */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <FiUser size={13} /> Short Form
                  </label>
                  <input
                    className="input-field"
                    placeholder="e.g. PA"
                    value={form.short_form}
                    onChange={e => { setForm(p => ({ ...p, short_form: e.target.value.toUpperCase() })); setErrors(p => ({ ...p, short_form: "" })); }}
                    style={{ textTransform: "uppercase" }}
                  />
                  {errors.short_form && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.short_form}</p>}
                </div>
              </div>

              {/* Party Name */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <FiFlag size={13} /> Party Name
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Progressive Alliance"
                  value={form.party}
                  onChange={e => { setForm(p => ({ ...p, party: e.target.value })); setErrors(p => ({ ...p, party: "" })); }}
                />
                {errors.party && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.party}</p>}
              </div>

              {/* Agenda */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <FiFileText size={13} /> Agenda / Manifesto
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Describe your goals and vision..."
                  value={form.agenda}
                  onChange={e => { setForm(p => ({ ...p, agenda: e.target.value })); setErrors(p => ({ ...p, agenda: "" })); }}
                  style={{ resize: "vertical" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  {errors.agenda
                    ? <p style={{ color: "#ef4444", fontSize: 12 }}>{errors.agenda}</p>
                    : <span />}
                  <span style={{ fontSize: 11, color: "#64748b" }}>{form.agenda.length} chars</span>
                </div>
              </div>

              {/* Logo Upload */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <FiUpload size={13} /> Party Logo
                </label>
                <motion.div
                  whileHover={{ borderColor: "rgba(59,130,246,0.5)" }}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `2px dashed ${errors.logo ? "#ef4444" : "rgba(255,255,255,0.15)"}`,
                    borderRadius: 12,
                    padding: "24px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "border 0.2s",
                  }}
                >
                  {form.logoPreview ? (
                    <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 8px" }}>
                      <Image src={form.logoPreview} alt="preview" fill style={{ objectFit: "cover", borderRadius: 10 }} />
                    </div>
                  ) : (
                    <FiUpload size={28} color="#64748b" style={{ margin: "0 auto 8px" }} />
                  )}
                  <p style={{ color: "#64748b", fontSize: 13 }}>
                    {form.logo ? form.logo.name : "Click to upload logo"}
                  </p>
                </motion.div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => handleFile(e.target.files?.[0] || null)} />
                {errors.logo && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.logo}</p>}
              </div>

              <motion.button
                type="submit"
                className="btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {loading ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>⟳</motion.span>
                ) : (
                  <><FiCheck /> Submit Nomination</>
                )}
              </motion.button>
            </motion.form>

            {/* Preview Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 16, letterSpacing: 1 }}>
                LIVE PREVIEW
              </p>
              <AnimatePresence mode="wait">
                {form.name || form.party || form.agenda || form.logoPreview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 20,
                        padding: 28,
                      }}
                    >
                      {form.logoPreview && (
                        <div style={{ position: "relative", width: 72, height: 72, borderRadius: 16, overflow: "hidden", marginBottom: 16, border: "2px solid rgba(255,255,255,0.1)" }}>
                          <Image src={form.logoPreview} alt="logo" fill style={{ objectFit: "cover" }} />
                        </div>
                      )}
                      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                        {form.name || "Candidate Name"} {form.short_form && <span style={{ color: "#60a5fa", fontSize: 16 }}>({form.short_form})</span>}
                      </h3>
                      <p style={{ fontSize: 13, color: "#8b5cf6", fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                        <FiFlag size={11} /> {form.party || "Party Name"}
                      </p>
                      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{form.agenda || "Your agenda will appear here..."}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px dashed rgba(255,255,255,0.08)",
                      borderRadius: 20,
                      padding: 48,
                      textAlign: "center",
                      color: "#475569",
                    }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 12 }}>👀</div>
                    <p style={{ fontSize: 14 }}>Fill in the form to see your preview</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
