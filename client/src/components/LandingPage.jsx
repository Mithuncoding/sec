import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, Cpu, ChevronRight, Terminal, Zap, Eye, Network, Key, Users, Award } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
  const [text, setText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const fullText = "ESTABLISHING QUANTUM-ENCRYPTED CHANNEL...";

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 65, ${p.opacity})`;
        ctx.fill();
        
        // Connect nearby particles
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 65, ${0.1 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Typing effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowContent(true), 500);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for glow effect
  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const features = [
    { icon: Lock, title: "AES-256", subtitle: "MILITARY ENCRYPTION", desc: "Bank-grade end-to-end security", color: "#00ff41" },
    { icon: Cpu, title: "GEMINI AI", subtitle: "THREAT DETECTION", desc: "Real-time intelligence analysis", color: "#00d4ff" },
    { icon: Globe, title: "GLOBAL OPS", subtitle: "AGENT TRACKING", desc: "Live geospatial monitoring", color: "#ff6b35" },
    { icon: Network, title: "LIVE IDS", subtitle: "INTRUSION DETECTION", desc: "Network attack simulation", color: "#a855f7" },
    { icon: Key, title: "CRYPTO LAB", subtitle: "6 ALGORITHMS", desc: "Interactive encryption demos", color: "#eab308" },
    { icon: Eye, title: "PASSWORD", subtitle: "NIST ANALYZER", desc: "Strength & crack time", color: "#ef4444" }
  ];

  const stats = [
    { value: "256", label: "BIT ENCRYPTION" },
    { value: "6", label: "CRYPTO ALGORITHMS" },
    { value: "99.9%", label: "UPTIME" },
    { value: "<1ms", label: "LATENCY" }
  ];

  const teamMembers = [
    { name: "Mahesh", role: "LEAD" },
    { name: "Radhika", role: "UI/UX" },
    { name: "Suresh", role: "SECURITY" },
    { name: "Vaishnavi", role: "QA" }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white font-mono relative overflow-x-hidden overflow-y-auto">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
      
      {/* Mouse Glow Effect */}
      <div 
        className="pointer-events-none fixed w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,65,0.3) 0%, transparent 70%)',
          left: mousePos.x - 192,
          top: mousePos.y - 192
        }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)'
        }}
      />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo & Title */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-8"
        >
          {/* Animated Shield Logo */}
          <div className="relative inline-block mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-32 h-32 border-2 border-dashed border-[#00ff41]/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 w-28 h-28 border border-[#00ff41]/20 rounded-full"
            />
            <div className="relative w-32 h-32 flex items-center justify-center">
              <Shield size={64} className="text-[#00ff41] drop-shadow-[0_0_30px_rgba(0,255,65,0.8)]" />
            </div>
          </div>

          {/* Glitch Title */}
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-2 relative">
            <span className="relative inline-block">
              <span className="absolute inset-0 text-[#ff0040] animate-pulse opacity-30 blur-sm" style={{ transform: 'translateX(-2px)' }}>
                SECURE_LINK
              </span>
              <span className="absolute inset-0 text-[#00d4ff] animate-pulse opacity-30 blur-sm" style={{ transform: 'translateX(2px)' }}>
                SECURE_LINK
              </span>
              <span className="relative text-white drop-shadow-[0_0_40px_rgba(0,255,65,0.6)]">
                SECURE_LINK
              </span>
            </span>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-2xl text-[#00ff41] tracking-[0.3em] uppercase font-light"
          >
            Encrypted Communication Portal
          </motion.p>

          {/* Version Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-1 bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] text-xs"
          >
            <Zap size={12} />
            <span>VERSION 3.0 • QUANTUM READY</span>
          </motion.div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-[#00ff41] drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]">
                {stat.value}
              </div>
              <div className="text-[10px] text-gray-500 tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={showContent ? { opacity: 1 } : {}}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl w-full mb-12"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative bg-[#0a0a0a] border border-gray-800 p-4 hover:border-[#00ff41]/50 transition-all cursor-pointer overflow-hidden"
            >
              {/* Hover Glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(circle at center, ${feature.color}10 0%, transparent 70%)` }}
              />
              
              <feature.icon 
                className="w-8 h-8 mb-3 transition-all group-hover:scale-110" 
                style={{ color: feature.color, filter: `drop-shadow(0 0 10px ${feature.color}50)` }}
              />
              <h3 className="text-sm font-black text-white mb-0.5">{feature.title}</h3>
              <p className="text-[8px] tracking-widest mb-1" style={{ color: feature.color }}>{feature.subtitle}</p>
              <p className="text-[10px] text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Enter Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showContent ? { opacity: 1, scale: 1 } : {}}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="group relative px-12 py-5 bg-[#00ff41] text-black font-black text-xl tracking-widest overflow-hidden shadow-[0_0_40px_rgba(0,255,65,0.4)] hover:shadow-[0_0_60px_rgba(0,255,65,0.6)] transition-all"
        >
          <span className="relative z-10 flex items-center gap-3">
            INITIALIZE SYSTEM
            <ChevronRight className="group-hover:translate-x-2 transition-transform" />
          </span>
          
          {/* Moving gradient */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>

        {/* Typing Effect */}
        <div className="mt-8 h-6 text-sm text-[#00ff41]/60 font-mono">
          <span className="text-[#00ff41]">{'>'}</span> {text}
          <span className="animate-pulse">█</span>
        </div>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="relative z-10 border-t border-gray-800 bg-[#020202] py-8 px-6"
      >
        <div className="max-w-6xl mx-auto">
          {/* Team Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <Terminal size={14} className="text-[#00ff41]" />
              <span>BUILD 3.0.0 • CLASSIFIED</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Award size={16} className="text-[#00ff41]" />
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mr-4">Development Team</span>
              <div className="flex gap-4">
                {teamMembers.map((member, i) => (
                  <div key={i} className="text-center group cursor-default">
                    <div className="text-white font-bold text-sm group-hover:text-[#00ff41] transition-colors">
                      {member.name}
                    </div>
                    <div className="text-[8px] text-gray-600">{member.role}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-gray-700">
              © 2025 SECURE_LINK
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
