import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, Cpu, ChevronRight, Terminal } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
  const [text, setText] = useState('');
  const fullText = "INITIALIZING SECURE CONNECTION...";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const teamMembers = ["Mahesh", "Radhika", "Suresh", "Vaishnavi"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff41] font-mono flex flex-col relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[length:50px_50px] pointer-events-none"></div>
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Shield size={64} className="animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white drop-shadow-[0_0_15px_rgba(0,255,65,0.5)]">
            IND_CYBER_CMD
          </h1>
          <p className="text-xl md:text-2xl text-[#00ff41]/80 tracking-widest uppercase">
            Secure Communication Portal
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-16">
          {[
            { icon: Lock, title: "AES-256 ENCRYPTION", desc: "Military-grade end-to-end security" },
            { icon: Cpu, title: "AI THREAT DETECTION", desc: "Real-time Gemini intelligence analysis" },
            { icon: Globe, title: "GLOBAL TRACKING", desc: "Live geospatial agent monitoring" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.2 }}
              className="bg-[#111] border border-[#333] p-6 hover:border-[#00ff41] transition-colors group"
            >
              <feature.icon className="w-10 h-10 mb-4 text-[#00ff41] group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Enter Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onEnter}
          className="group relative px-8 py-4 bg-[#00ff41]/10 border border-[#00ff41] text-[#00ff41] font-bold text-xl tracking-widest hover:bg-[#00ff41] hover:text-black transition-all overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            ENTER SYSTEM <ChevronRight />
          </span>
          <div className="absolute inset-0 bg-[#00ff41] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        </motion.button>

        {/* Typing Effect */}
        <div className="mt-8 h-6 text-sm text-[#00ff41]/60">
          <span className="mr-2">{'>'}</span>
          {text}
          <span className="animate-pulse">_</span>
        </div>
      </div>

      {/* Footer / Team */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="relative z-10 border-t border-[#333] bg-[#050505] p-8"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Terminal size={16} />
            <span>SYSTEM VERSION 2.0.4</span>
          </div>
          
          <div className="text-center">
            <h4 className="text-xs text-[#00ff41] uppercase tracking-widest mb-2">Architected By</h4>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {teamMembers.map((member, i) => (
                <span key={i} className="text-white font-bold hover:text-[#00ff41] transition-colors cursor-default">
                  {member}
                </span>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-600">
            © 2025 IND_CYBER_CMD. CLASSIFIED.
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
