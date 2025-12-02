import React, { useState, useEffect } from 'react';
import { Shield, User, Lock, ChevronRight, Terminal, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';

const TypewriterText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(text.substring(0, i + 1));
        i++;
        if (i === text.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span>{displayText}</span>;
};

const LoginScreen = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState(null);

    const handleLogin = () => {
        if (selectedRole) {
            onLogin(selectedRole);
        }
    };

    return (
        <div className="h-screen w-full bg-bg-main flex items-center justify-center p-4 relative overflow-hidden font-mono">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(var(--border-strong)_1px,transparent_1px),linear-gradient(90deg,var(--border-strong)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
            
            {/* Animated Scanline */}
            <div className="scanline"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-5xl w-full bg-bg-surface border border-border-strong shadow-hud relative z-10 flex flex-col md:flex-row overflow-hidden hud-panel"
            >
                {/* HUD Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>

                {/* Left Side: Terminal Output */}
                <div className="md:w-2/5 bg-bg-input p-8 flex flex-col justify-between border-r border-border-strong relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8 text-primary animate-pulse">
                            <Shield className="w-8 h-8" />
                            <span className="font-bold text-xl tracking-widest">US_CYBER_CMD</span>
                        </div>
                        
                        <div className="space-y-2 text-xs text-text-muted font-mono">
                            <div className="flex gap-2">
                                <span className="text-primary">{'>'}</span>
                                <TypewriterText text="INITIALIZING SECURE UPLINK..." delay={0} />
                            </div>
                            <div className="flex gap-2">
                                <span className="text-primary">{'>'}</span>
                                <TypewriterText text="VERIFYING ENCRYPTION PROTOCOLS..." delay={1500} />
                            </div>
                            <div className="flex gap-2">
                                <span className="text-primary">{'>'}</span>
                                <TypewriterText text="ESTABLISHING HANDSHAKE..." delay={3000} />
                            </div>
                            <div className="flex gap-2">
                                <span className="text-success">{'>'}</span>
                                <TypewriterText text="ACCESS GRANTED. WAITING FOR INPUT." delay={4500} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-border-strong">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">
                            <Terminal size={12} /> SYSTEM_STATUS: ONLINE
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-text-muted">
                            <div>LAT: 34.0522 N</div>
                            <div>LON: 118.2437 W</div>
                            <div>UPTIME: 48:12:09</div>
                            <div>SEC_LEVEL: ALPHA</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Controls */}
                <div className="md:w-3/5 p-10 flex flex-col justify-center relative bg-bg-surface">
                    <div className="absolute top-4 right-4 text-xs text-text-muted flex items-center gap-1">
                        <Lock size={12} />
                        <span>ENCRYPTED_CONNECTION</span>
                    </div>

                    <h2 className="text-2xl font-bold text-text-main mb-2 tracking-wide flex items-center gap-3">
                        IDENTITY_VERIFICATION
                    </h2>
                    <p className="text-text-muted text-sm mb-10 border-l-2 border-primary pl-3">
                        Select your clearance level to proceed.
                    </p>
                    
                    <div className="space-y-4 mb-10">
                        <button
                            onClick={() => setSelectedRole('COMMANDER')}
                            className={`w-full p-4 border transition-all flex items-center gap-4 group relative overflow-hidden ${
                                selectedRole === 'COMMANDER'
                                ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,255,65,0.1)]'
                                : 'bg-transparent border-border-strong hover:border-primary/50 hover:bg-primary/5'
                            }`}
                        >
                            <div className={`p-2 border ${selectedRole === 'COMMANDER' ? 'border-primary text-primary' : 'border-text-muted text-text-muted group-hover:border-primary group-hover:text-primary'} transition-colors`}>
                                <Shield className="w-6 h-6" />
                            </div>
                            <div className="text-left flex-1">
                                <div className={`font-bold tracking-wider ${selectedRole === 'COMMANDER' ? 'text-primary' : 'text-text-main'}`}>COMMANDER</div>
                                <div className="text-[10px] text-text-muted uppercase">Clearance: Level 5 • Full Access</div>
                            </div>
                            {selectedRole === 'COMMANDER' && <Crosshair className="w-5 h-5 text-primary animate-spin-slow" />}
                        </button>

                        <button
                            onClick={() => setSelectedRole('FIELD AGENT')}
                            className={`w-full p-4 border transition-all flex items-center gap-4 group relative overflow-hidden ${
                                selectedRole === 'FIELD AGENT'
                                ? 'bg-secondary/10 border-secondary shadow-[0_0_15px_rgba(14,165,233,0.1)]'
                                : 'bg-transparent border-border-strong hover:border-secondary/50 hover:bg-secondary/5'
                            }`}
                        >
                            <div className={`p-2 border ${selectedRole === 'FIELD AGENT' ? 'border-secondary text-secondary' : 'border-text-muted text-text-muted group-hover:border-secondary group-hover:text-secondary'} transition-colors`}>
                                <User className="w-6 h-6" />
                            </div>
                            <div className="text-left flex-1">
                                <div className={`font-bold tracking-wider ${selectedRole === 'FIELD AGENT' ? 'text-secondary' : 'text-text-main'}`}>FIELD AGENT</div>
                                <div className="text-[10px] text-text-muted uppercase">Clearance: Level 3 • Restricted</div>
                            </div>
                            {selectedRole === 'FIELD AGENT' && <Crosshair className="w-5 h-5 text-secondary animate-spin-slow" />}
                        </button>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={!selectedRole}
                        className={`w-full py-4 font-bold tracking-widest flex items-center justify-center gap-3 transition-all uppercase text-sm border ${
                            selectedRole
                            ? (selectedRole === 'COMMANDER' ? 'bg-primary text-bg-main border-primary hover:bg-primary-hover' : 'bg-secondary text-white border-secondary hover:bg-secondary/90')
                            : 'bg-transparent text-text-muted border-border-strong cursor-not-allowed'
                        }`}
                    >
                        Initialize Uplink
                        <ChevronRight className={`w-4 h-4 ${selectedRole ? 'animate-pulse' : ''}`} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginScreen;
