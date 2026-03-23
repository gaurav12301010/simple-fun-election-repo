"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [prevTime, setPrevTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };

    const update = () => {
      setTimeLeft(prev => { setPrevTime(prev); return calc(); });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      {label && (
        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16, letterSpacing: 1 }}>
          {label}
        </p>
      )}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {units.map(({ label: unitLabel, value }) => (
          <div key={unitLabel} style={{ textAlign: "center" }}>
            <div
              className="countdown-digit"
              style={{
                position: "relative",
                overflow: "hidden",
                minWidth: 72,
              }}
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={value}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    display: "block",
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#60a5fa",
                    lineHeight: 1,
                  }}
                >
                  {pad(value)}
                </motion.span>
              </AnimatePresence>
            </div>
            <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 6, letterSpacing: 1, fontWeight: 600 }}>
              {unitLabel.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
