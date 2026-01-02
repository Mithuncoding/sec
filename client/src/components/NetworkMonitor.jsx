import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Globe,
  Activity,
  Zap,
  Ban,
  CheckCircle,
  Radio,
} from "lucide-react";

const attackTypes = [
  {
    type: "DDoS Attack",
    severity: "CRITICAL",
    color: "text-danger",
    icon: Zap,
  },
  {
    type: "SQL Injection",
    severity: "HIGH",
    color: "text-warning",
    icon: AlertTriangle,
  },
  {
    type: "Brute Force",
    severity: "MEDIUM",
    color: "text-warning",
    icon: Activity,
  },
  { type: "Port Scan", severity: "LOW", color: "text-secondary", icon: Radio },
  {
    type: "XSS Attempt",
    severity: "HIGH",
    color: "text-warning",
    icon: AlertTriangle,
  },
  {
    type: "Malware Detected",
    severity: "CRITICAL",
    color: "text-danger",
    icon: Ban,
  },
  {
    type: "Phishing Link",
    severity: "MEDIUM",
    color: "text-warning",
    icon: AlertTriangle,
  },
  {
    type: "Unauthorized Access",
    severity: "HIGH",
    color: "text-danger",
    icon: Shield,
  },
];

const countries = [
  { name: "Russia", code: "RU", lat: 55.75, lng: 37.62 },
  { name: "China", code: "CN", lat: 39.9, lng: 116.4 },
  { name: "North Korea", code: "KP", lat: 39.03, lng: 125.75 },
  { name: "Iran", code: "IR", lat: 35.69, lng: 51.39 },
  { name: "Unknown", code: "??", lat: 0, lng: 0 },
  { name: "Brazil", code: "BR", lat: -15.78, lng: -47.93 },
  { name: "Vietnam", code: "VN", lat: 21.03, lng: 105.85 },
];

const NetworkMonitor = () => {
  const [attacks, setAttacks] = useState([]);
  const [stats, setStats] = useState({
    blocked: 0,
    allowed: 0,
    threats: 0,
    securityScore: 98,
  });

  // Generate random attacks
  useEffect(() => {
    const generateAttack = () => {
      const attack =
        attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const origin = countries[Math.floor(Math.random() * countries.length)];
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(
        Math.random() * 255
      )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

      const newAttack = {
        id: Date.now() + Math.random(),
        ...attack,
        origin,
        ip,
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        status: Math.random() > 0.1 ? "BLOCKED" : "MONITORING",
      };

      setAttacks((prev) => [newAttack, ...prev.slice(0, 14)]);

      setStats((prev) => ({
        blocked: prev.blocked + (newAttack.status === "BLOCKED" ? 1 : 0),
        allowed: prev.allowed + (newAttack.status === "MONITORING" ? 1 : 0),
        threats: prev.threats + 1,
        securityScore: Math.max(
          85,
          Math.min(
            100,
            prev.securityScore + (newAttack.status === "BLOCKED" ? 0.1 : -0.5)
          )
        ),
      }));
    };

    // Initial attacks
    for (let i = 0; i < 5; i++) {
      setTimeout(generateAttack, i * 200);
    }

    const interval = setInterval(generateAttack, 2000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-hidden font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-border-strong pb-4">
        <h2 className="text-2xl font-bold text-primary tracking-widest uppercase flex items-center gap-3">
          <Shield className="w-6 h-6 animate-pulse" />
          Network_Intrusion_Detection
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-ping"></span>
            <span className="text-success">FIREWALL_ACTIVE</span>
          </div>
          <div className="text-text-muted">MONITORING: 24/7</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-bg-surface border border-border-strong p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-danger"></div>
          <div className="text-xs text-text-muted mb-1">THREATS DETECTED</div>
          <div className="text-3xl font-bold text-danger">{stats.threats}</div>
        </div>
        <div className="bg-bg-surface border border-border-strong p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-success"></div>
          <div className="text-xs text-text-muted mb-1">ATTACKS BLOCKED</div>
          <div className="text-3xl font-bold text-success">{stats.blocked}</div>
        </div>
        <div className="bg-bg-surface border border-border-strong p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-warning"></div>
          <div className="text-xs text-text-muted mb-1">UNDER MONITORING</div>
          <div className="text-3xl font-bold text-warning">{stats.allowed}</div>
        </div>
        <div className="bg-bg-surface border border-border-strong p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div className="text-xs text-text-muted mb-1">SECURITY SCORE</div>
          <div className="text-3xl font-bold text-primary">
            {stats.securityScore.toFixed(1)}%
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg-input">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${stats.securityScore}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Attack Feed */}
      <div className="flex-1 bg-bg-surface border border-border-strong overflow-hidden relative">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 p-3 border-b border-border-strong text-[10px] text-text-muted uppercase tracking-widest bg-bg-input">
          <div className="col-span-2">TIME</div>
          <div className="col-span-3">ATTACK TYPE</div>
          <div className="col-span-2">SEVERITY</div>
          <div className="col-span-2">ORIGIN</div>
          <div className="col-span-2">IP ADDRESS</div>
          <div className="col-span-1">STATUS</div>
        </div>

        {/* Attack List */}
        <div className="overflow-y-auto h-[calc(100%-40px)]">
          <AnimatePresence>
            {attacks.map((attack, index) => {
              const IconComponent = attack.icon;
              return (
                <motion.div
                  key={attack.id}
                  initial={{
                    opacity: 0,
                    x: -50,
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                  }}
                  animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`grid grid-cols-12 gap-2 p-3 border-b border-border-strong/50 text-xs hover:bg-bg-input/50 transition-colors ${
                    index === 0 ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="col-span-2 text-text-muted font-mono">
                    {attack.timestamp}
                  </div>
                  <div
                    className={`col-span-3 flex items-center gap-2 ${attack.color} font-bold`}
                  >
                    <IconComponent size={14} />
                    {attack.type}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] border ${
                        attack.severity === "CRITICAL"
                          ? "border-danger text-danger bg-danger/10"
                          : attack.severity === "HIGH"
                          ? "border-warning text-warning bg-warning/10"
                          : attack.severity === "MEDIUM"
                          ? "border-warning text-warning bg-warning/10"
                          : "border-secondary text-secondary bg-secondary/10"
                      }`}
                    >
                      {attack.severity}
                    </span>
                  </div>
                  <div className="col-span-2 text-text-muted flex items-center gap-1">
                    <Globe size={12} />
                    {attack.origin.name}
                  </div>
                  <div className="col-span-2 text-primary font-mono">
                    {attack.ip}
                  </div>
                  <div className="col-span-1">
                    {attack.status === "BLOCKED" ? (
                      <span className="flex items-center gap-1 text-success">
                        <CheckCircle size={12} />
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-warning animate-pulse">
                        <Activity size={12} />
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Scanning overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute left-0 right-0 h-8 bg-gradient-to-b from-primary/10 to-transparent"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between text-[10px] text-text-muted uppercase">
        <span>NEXT_GEN_FIREWALL_v3.2</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          ALL SYSTEMS NOMINAL
        </span>
      </div>
    </div>
  );
};

export default NetworkMonitor;
