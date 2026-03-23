"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FiHome, FiCheckSquare, FiBarChart2, FiLogIn, FiUser } from "react-icons/fi";

const baseNavLinks = [
  { href: "/", label: "Candidates", icon: FiHome },
  { href: "/vote", label: "Vote", icon: FiCheckSquare },
  { href: "/results", label: "Results", icon: FiBarChart2 },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname]);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10, 10, 20, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 22, fontWeight: 800 }} className="gradient-text">
              ElectX
            </span>
            <span
              style={{
                fontSize: 10,
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "white",
                padding: "2px 8px",
                borderRadius: 20,
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              LIVE
            </span>
          </motion.div>
        </Link>

        {/* Links */}
        <div style={{ display: "flex", gap: 4 }}>
          {baseNavLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: 10,
                    color: isActive ? "#60a5fa" : "#94a3b8",
                    background: isActive ? "rgba(59,130,246,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent",
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{label}</span>
                </motion.div>
              </Link>
            );
          })}
          
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)", margin: "0 8px" }} />
          
          {/* Auth Link */}
          <Link href={user ? "/profile" : "/login"} style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 10,
                color: user ? "#10b981" : "#8b5cf6",
                background: user ? "rgba(16,185,129,0.12)" : "rgba(139,92,246,0.12)",
                border: user ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(139,92,246,0.25)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {user ? <FiUser size={15} /> : <FiLogIn size={15} />}
              <span className="hidden sm:inline">{user ? user.username : "Log In"}</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
