import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AESVisualizer = () => {
    const [step, setStep] = useState(0);
    const steps = [
        { name: "Plaintext", desc: "Input data block (128-bit)" },
        { name: "AddRoundKey", desc: "XOR with Initial Key" },
        { name: "SubBytes", desc: "Non-linear substitution (S-Box)" },
        { name: "ShiftRows", desc: "Cyclic shift of rows" },
        { name: "MixColumns", desc: "Mixing data within columns" },
        { name: "Ciphertext", desc: "Final Encrypted Output" }
    ];

    const [gridData] = useState(() => Array.from({ length: 16 }).map(() => Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0')));

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % steps.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [steps.length]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center font-mono">
            <h3 className="text-xl font-bold text-primary mb-8 tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-primary animate-pulse"></span>
                AES-256 SCHEMATIC
            </h3>
            
            <div className="relative w-64 h-64">
                {/* Grid Representation of State Matrix */}
                <div className="grid grid-cols-4 gap-1 w-full h-full">
                    {gridData.map((val, i) => (
                        <motion.div
                            key={i}
                            className="bg-bg-input border border-border-strong flex items-center justify-center text-xs font-mono text-primary font-bold relative overflow-hidden"
                            animate={{
                                scale: [1, 0.9, 1],
                                backgroundColor: step === 2 ? 'rgba(0, 255, 65, 0.2)' : 'rgba(30, 41, 59, 1)', // Highlight for SubBytes
                                borderColor: step === 2 ? '#00ff41' : '#334155',
                                x: step === 3 ? (i % 4 === 1 ? -10 : i % 4 === 2 ? -20 : i % 4 === 3 ? -30 : 0) : 0, // ShiftRows simulation
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="relative z-10">{val}</span>
                            {/* Grid lines effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,var(--bg-input)_1px),linear-gradient(90deg,transparent_1px,var(--bg-input)_1px)] bg-[size:4px_4px] opacity-20"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Step Indicator Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-bg-surface/90 backdrop-blur px-6 py-3 border border-primary shadow-[0_0_15px_rgba(0,255,65,0.2)] text-center relative"
                    >
                         {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-1 h-1 bg-primary"></div>
                        <div className="absolute top-0 right-0 w-1 h-1 bg-primary"></div>
                        <div className="absolute bottom-0 left-0 w-1 h-1 bg-primary"></div>
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-primary"></div>

                        <div className="text-primary font-bold text-lg tracking-wider uppercase">{steps[step].name}</div>
                        <div className="text-[10px] text-text-muted uppercase tracking-widest">{steps[step].desc}</div>
                    </motion.div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mt-8 flex gap-1">
                {steps.map((s, i) => (
                    <div 
                        key={i} 
                        className={`h-1 flex-1 transition-all ${i === step ? 'bg-primary shadow-[0_0_10px_rgba(0,255,65,0.5)]' : 'bg-border-strong'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default AESVisualizer;
