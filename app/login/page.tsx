"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiLogIn, FiUser } from "react-icons/fi";
import DoodleBackground from "@/components/DoodleBackground";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return toast.error("Please fill in all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      toast.success("Welcome back!");
      router.push("/");
      router.refresh(); // to update Navbar session state if needed
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg" style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <DoodleBackground />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400, padding: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong" style={{ padding: 32 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}><span className="gradient-text">Log In</span></h1>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>Access your voter profile</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <FiUser size={13} /> Username
              </label>
              <input
                className="input-field"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <FiLogIn size={13} /> Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <motion.button
              type="submit"
              className="btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              style={{ marginTop: 16, width: "100%", padding: 14, fontSize: 16 }}
            >
              {loading ? "Logging in..." : "Log In"}
            </motion.button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Don't have a voter card?{" "}
              <Link href="/register-voter" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>
                Apply Here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
