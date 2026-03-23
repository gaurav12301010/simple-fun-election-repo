"use client";

import { motion } from "framer-motion";

export default function DoodleBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: 0.35,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {/* Stars */}
        {[
          [80, 120], [200, 320], [450, 80], [700, 200], [950, 350],
          [1100, 80], [300, 500], [850, 550], [150, 650], [600, 680],
          [1200, 400], [50, 400], [750, 100],
        ].map(([x, y], i) => (
          <motion.text
            key={`star-${i}`}
            x={x} y={y}
            fontSize={i % 3 === 0 ? 22 : 14}
            fill={i % 2 === 0 ? "#3b82f6" : "#8b5cf6"}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
          >
            ✦
          </motion.text>
        ))}

        {/* Ballot box icon doodles */}
        {[[100, 200], [900, 100], [500, 600], [1150, 500]].map(([x, y], i) => (
          <g key={`ballot-${i}`} transform={`translate(${x},${y})`} opacity={0.5}>
            <rect x="0" y="10" width="40" height="35" rx="4" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 2" />
            <rect x="10" y="0" width="20" height="12" rx="2" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="8" y1="22" x2="32" y2="22" stroke="#8b5cf6" strokeWidth="1.5" />
            <line x1="8" y1="30" x2="24" y2="30" stroke="#8b5cf6" strokeWidth="1.5" />
          </g>
        ))}

        {/* Circle doodles */}
        {[[250, 150], [750, 450], [1050, 250], [400, 700]].map(([cx, cy], i) => (
          <motion.circle
            key={`circle-${i}`}
            cx={cx} cy={cy}
            r={i % 2 === 0 ? 40 : 25}
            fill="none"
            stroke={i % 2 === 0 ? "#3b82f6" : "#06b6d4"}
            strokeWidth="1.5"
            strokeDasharray="6 4"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* Flag doodles */}
        {[[600, 150], [1200, 300]].map(([x, y], i) => (
          <g key={`flag-${i}`} transform={`translate(${x},${y})`} opacity={0.5}>
            <line x1="0" y1="0" x2="0" y2="50" stroke="#06b6d4" strokeWidth="2" />
            <polygon points="0,0 30,8 0,16" fill="#06b6d4" opacity={0.6} />
          </g>
        ))}

        {/* Check marks */}
        {[[350, 250], [850, 350], [1100, 600]].map(([x, y], i) => (
          <text key={`check-${i}`} x={x} y={y} fontSize={20} fill="#10b981" opacity={0.5}>✓</text>
        ))}
      </svg>
    </div>
  );
}
