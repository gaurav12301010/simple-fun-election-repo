"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import DoodleBackground from "@/components/DoodleBackground";

// --- Types ---
interface FormData {
  name: string; dob: string; username: string; password: string;
  gender: string; address: string; height: string; blood_group: string;
  eye_color: string; favorite_subject: string; trust_reason: string;
  child_income: string; partner_name: string; crush_count: string;
  mobile_usage: string; early_riser: string; photo_url: string; signature_url: string;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown (probably rare)"];
const EYE_COLORS = ["Black", "Brown", "Hazel", "Blue", "Green", "Red (suspicious)", "Other"];
const SUBJECTS = ["Mathematics", "Science", "English", "Hindi", "Social Studies", "Recess 😄", "None (I skipped school)"];

// --- Live ID Card Preview ---
function IDCardPreview({ form, step }: { form: FormData; step: number }) {
  const getInitials = (name: string) =>
    name.trim().split(" ").map(w => w[0]?.toUpperCase() || "").join("").slice(0, 2) || "?";

  return (
    <motion.div
      whileHover={{ rotateY: 3, rotateX: -2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
      style={{
        width: "100%", maxWidth: 380, perspective: 1000,
        background: "linear-gradient(135deg, #fffdf5 0%, #f0f4ff 100%)",
        borderRadius: 18, border: "2px solid #c8d4f0",
        boxShadow: "0 20px 60px rgba(0,0,50,0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
        overflow: "hidden", position: "relative", color: "#1a2340", userSelect: "none",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Watermark */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", zIndex: 0,
      }}>
        <span style={{
          fontSize: 72, fontWeight: 900, color: "rgba(59,130,246,0.07)",
          transform: "rotate(-30deg)", whiteSpace: "nowrap", letterSpacing: 4, userSelect: "none"
        }}>ELECTX GOVT</span>
      </div>

      {/* Header band */}
      <div style={{
        background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
        padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1
      }}>
        <div style={{ fontSize: 28 }}>🏛️</div>
        <div>
          <div style={{ color: "white", fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>
            Republic of ElectX
          </div>
          <div style={{ color: "#93c5fd", fontSize: 10, letterSpacing: 1 }}>
            National Voter Registration Authority
          </div>
        </div>
        <div style={{ marginLeft: "auto", color: "#93c5fd", fontSize: 10, textAlign: "right" }}>
          <div>VOTER ID</div>
          <div style={{ color: "white", fontWeight: 700, fontFamily: "monospace", fontSize: 11 }}>
            {form.username ? `IND-2026-????` : "IND-2026-XXXX"}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: "16px 20px", position: "relative", zIndex: 1, display: "flex", gap: 16 }}>
        {/* Photo box */}
        <div style={{ flexShrink: 0 }}>
          {form.photo_url ? (
            <img src={form.photo_url} alt="photo" style={{ width: 80, height: 95, objectFit: "cover", border: "2px solid #2563eb", borderRadius: 6 }} />
          ) : (
            <div style={{
              width: 80, height: 95, border: "2px dashed #93c5fd", borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(219,234,254,0.4)", flexDirection: "column", gap: 4
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#2563eb" }}>{getInitials(form.name)}</div>
              <div style={{ fontSize: 9, color: "#93c5fd", textAlign: "center" }}>PHOTO</div>
            </div>
          )}
          <div style={{
            marginTop: 8, fontSize: 9, color: "#4b5563", textAlign: "center",
            borderTop: "1px solid #cbd5e1", paddingTop: 6, letterSpacing: 1
          }}>SIGNATURE</div>
          <div style={{ height: 20, position: "relative", marginTop: 2, borderBottom: "1px solid #1e3a8a" }}>
            {form.signature_url && <img src={form.signature_url} alt="sig" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />}
          </div>
        </div>

        {/* Details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, fontSize: 11 }}>
          {[
            { label: "NAME", value: form.name || "—" },
            { label: "DOB", value: form.dob || "—" },
            { label: "GENDER", value: form.gender || "—" },
            { label: "USERNAME", value: form.username ? `@${form.username}` : "—" },
            { label: "BLOOD", value: form.blood_group || "—" },
            { label: "HEIGHT", value: form.height || "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 8, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontWeight: 600, color: "#1e3a8a", fontSize: 12, fontFamily: "monospace" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status stamp */}
      <div style={{ padding: "0 20px 16px", position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 9, color: "#6b7280" }}>
          <div>ISSUE DATE: {new Date().toLocaleDateString("en-IN")}</div>
          <div>VALID: ELECTION DAY ONLY 😄</div>
        </div>
        <div style={{
          border: "3px solid #f59e0b", borderRadius: 6, padding: "4px 10px",
          color: "#f59e0b", fontWeight: 900, fontSize: 14, letterSpacing: 3,
          transform: "rotate(-8deg)", opacity: 0.9
        }}>
          PENDING
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{
        background: "linear-gradient(90deg, #1e3a8a, #2563eb)", padding: "6px 20px",
        fontFamily: "monospace", fontSize: 9, color: "#93c5fd", letterSpacing: 2, position: "relative", zIndex: 1
      }}>
        {form.username
          ? `<<${(form.name || "HOLDER").toUpperCase().replace(/ /g, "<")}<IND<${form.username.toUpperCase()}<<<<<`
          : "<<NATIONAL VOTER CARD REPUBLIC OF ELECTX<<<<<<"}
      </div>
    </motion.div>
  );
}

// --- Field Row component ---
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", letterSpacing: 0.5 }}>{label}</label>
      {children}
    </div>
  );
}

// Input styles
const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10, padding: "10px 14px", color: "white", fontSize: 14, outline: "none", width: "100%",
};
const selectStyle: React.CSSProperties = { ...inputStyle };

// --- Main Page ---
export default function RegisterVoterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    name: "", dob: "", username: "", password: "",
    gender: "", address: "", height: "", blood_group: "",
    eye_color: "", favorite_subject: "", trust_reason: "",
    child_income: "", partner_name: "", crush_count: "",
    mobile_usage: "", early_riser: "", photo_url: "", signature_url: "",
  });

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) return toast.error("Photo must be under 500KB");
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, photo_url: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 300 * 1024) return toast.error("Signature image must be under 300KB");
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, signature_url: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const validateFunny = () => {
    if (form.partner_name && form.partner_name.toLowerCase() === "none") {
      toast("BF/GF name cannot be 'None'... or can it? 😏", { icon: "❤️" });
    }
    if (form.child_income && parseInt(form.child_income) > 50000) {
      toast("Child income seems suspicious 🤨 FBI has been notified.", { icon: "🚨" });
    }
    if (form.crush_count && parseInt(form.crush_count) > 20) {
      toast("That's... a lot of crushes. Respect. 😂", { icon: "😤" });
    }
    if (form.early_riser === "No" && form.mobile_usage && parseInt(form.mobile_usage) > 8) {
      toast("8+ hours of phone and sleeps late? Peak Indian student 🙏", { icon: "📱" });
    }
  };

  const canProceed = () => {
    if (step === 0) return form.name && form.dob && form.username && form.password && form.gender;
    return true;
  };

  const handleSubmit = async () => {
    if (!form.name || !form.dob || !form.username || !form.password) {
      return toast.error("Please fill required fields (Step 1)");
    }
    validateFunny();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success(`🪪 Voter ID issued! Welcome, ${form.name.split(" ")[0]}!`);
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "📋 Basic Details",
      subtitle: "Officially mandatory (unfortunately)",
      fields: (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="🧑 Full Name *">
            <input style={inputStyle} placeholder="As on your Aadhaar (or just make it up)" value={form.name} onChange={set("name")} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="🎂 Date of Birth *">
              <input type="date" style={inputStyle} value={form.dob} onChange={set("dob")} />
            </Field>
            <Field label="⚧️ Gender *">
              <select style={selectStyle} value={form.gender} onChange={set("gender")}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
                <option>My form doesn't have this option</option>
              </select>
            </Field>
          </div>
          <Field label="🏠 Address">
            <input style={inputStyle} placeholder="Your secret location (we won't tell)" value={form.address} onChange={set("address")} />
          </Field>
          <Field label="🪲 Username *">
            <input style={inputStyle} placeholder="coolvoter99 (be original, please)" value={form.username} onChange={set("username")} />
          </Field>
          <Field label="🔒 Password *">
            <input type="password" style={inputStyle} placeholder="Not 'password123' please" value={form.password} onChange={set("password")} />
          </Field>
          <Field label="📸 Profile Photo">
            <div onClick={() => fileInputRef.current?.click()} style={{ ...inputStyle, cursor: "pointer", textAlign: "center", color: "#94a3b8", border: "1px dashed rgba(255,255,255,0.2)" }}>
              {form.photo_url ? "✅ Photo uploaded! Click to change" : "Click to upload photo (max 500KB)"}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
          </Field>
          <Field label="✍️ Signature (upload or scan)">
            <div onClick={() => sigInputRef.current?.click()} style={{ ...inputStyle, cursor: "pointer", textAlign: "center", color: "#94a3b8", border: "1px dashed rgba(255,255,255,0.2)" }}>
              {form.signature_url ? "✅ Signature uploaded! Click to change" : "Click to upload signature image (max 300KB)"}
            </div>
            <input ref={sigInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleSignature} />
          </Field>
        </div>
      ),
    },
    {
      title: "📐 Physical Details",
      subtitle: "For official government records. We're serious.",
      fields: (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="📏 Height">
              <input style={inputStyle} placeholder="e.g. 5'8'' or 173cm" value={form.height} onChange={set("height")} />
            </Field>
            <Field label="🩸 Blood Group">
              <select style={selectStyle} value={form.blood_group} onChange={set("blood_group")}>
                <option value="">Select</option>
                {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
              </select>
            </Field>
          </div>
          <Field label="👁️ Eye Color (optional)">
            <select style={selectStyle} value={form.eye_color} onChange={set("eye_color")}>
              <option value="">Select</option>
              {EYE_COLORS.map(e => <option key={e}>{e}</option>)}
            </select>
          </Field>
          <div style={{ padding: 16, borderRadius: 12, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <p style={{ color: "#60a5fa", fontSize: 13, margin: 0 }}>
              💡 <strong>Why do we need physical details?</strong><br />
              <span style={{ color: "#94a3b8" }}>We don't. But it makes the ID card look more official. 😌</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "🎭 The Fun Stuff",
      subtitle: "100% mandatory. Legally. (Not really.)",
      fields: (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="❤️ GF/BF Name (optional, but we'll find out anyway)">
            <input style={inputStyle} placeholder="Leave empty if you're 'focused on career'" value={form.partner_name} onChange={set("partner_name")} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="😏 Number of Crushes (lifetime)">
              <input type="number" style={inputStyle} placeholder="Be honest" min="0" value={form.crush_count} onChange={set("crush_count")} />
            </Field>
            <Field label="📱 Daily Mobile Usage (hrs)">
              <input type="number" style={inputStyle} placeholder="Average daily screen time" min="0" max="24" value={form.mobile_usage} onChange={set("mobile_usage")} />
            </Field>
          </div>
          <Field label="💸 Child's Monthly Income (₹)">
            <input type="number" style={inputStyle} placeholder="Yes, your child's income. 0 is fine." value={form.child_income} onChange={set("child_income")} />
          </Field>
          <Field label="📚 Favorite Subject in School">
            <select style={selectStyle} value={form.favorite_subject} onChange={set("favorite_subject")}>
              <option value="">Select (or admit you had none)</option>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="⏰ Do you wake up before 10 AM?">
            <select style={selectStyle} value={form.early_riser} onChange={set("early_riser")}>
              <option value="">Select</option>
              <option value="Yes">Yes (liar)</option>
              <option value="No">No (honest)</option>
              <option value="Depends">Depends on the WiFi 😂</option>
            </select>
          </Field>
          <Field label="🤔 Why should we trust you? (Mandatory Essay)">
            <textarea
              style={{ ...inputStyle, height: 80, resize: "vertical" }}
              placeholder="Minimum 0 words. Maximum also 0. (just kidding, write something)"
              value={form.trust_reason}
              onChange={set("trust_reason")}
            />
          </Field>
        </div>
      ),
    },
  ];

  return (
    <div className="page-bg" style={{ minHeight: "100vh", position: "relative", padding: "40px 16px" }}>
      <DoodleBackground />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 13, letterSpacing: 3, color: "#94a3b8", textTransform: "uppercase", marginBottom: 8 }}>
            🏛️ Republic of ElectX — Official Portal
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, margin: 0 }}>
            <span className="gradient-text">National Voter Registration</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 8 }}>
            Fill out the form to receive your Digital Voter ID. This process is 100% official. Probably.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "clamp(260px, 35%, 380px) 1fr", gap: 32, alignItems: "start" }}>

          {/* LEFT: Live ID Card */}
          <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <IDCardPreview form={form} step={step} />
            <p style={{ color: "#64748b", fontSize: 12, textAlign: "center", margin: 0 }}>
              ✨ Card updates live as you type
            </p>
          </div>

          {/* RIGHT: Form */}
          <motion.div className="glass-strong" style={{ padding: 32 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            
            {/* Step progress */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              {steps.map((s, i) => (
                <div
                  key={i}
                  onClick={() => i < step + 1 && setStep(i)}
                  style={{
                    flex: 1, height: 4, borderRadius: 4, cursor: i <= step ? "pointer" : "default",
                    background: i <= step ? "#3b82f6" : "rgba(255,255,255,0.1)",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", margin: "0 0 4px" }}>{steps[step].title}</h3>
                <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>{steps[step].subtitle}</p>
                {steps[step].fields}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  style={{ padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#94a3b8", cursor: "pointer", fontWeight: 600 }}
                >
                  ← Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { if (canProceed()) setStep(s => s + 1); else toast.error("Fill required fields first ✏️"); }}
                  className="btn-primary"
                  style={{ flex: 1, padding: "14px", fontSize: 15, fontWeight: 700 }}
                >
                  Next Section →
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary"
                  style={{ flex: 1, padding: "14px", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  {loading ? "Issuing ID..." : "🪪 Issue Voter ID"}
                </motion.button>
              )}
            </div>

            <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, marginTop: 20 }}>
              Already registered?{" "}
              <Link href="/login" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>Log In</Link>
            </p>
          </motion.div>
        </div>

        {/* Mobile disclaimer */}
        <p style={{ textAlign: "center", color: "#374151", fontSize: 11, marginTop: 24, letterSpacing: 1 }}>
          ELECTX VOTER AUTHORITY • DEPT. OF COMPLETELY SERIOUS ELECTIONS • EST. 2026
        </p>
      </div>
    </div>
  );
}
