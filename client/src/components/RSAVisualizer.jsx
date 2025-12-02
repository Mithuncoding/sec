import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RSAVisualizer = () => {
    const [step, setStep] = useState(0);
    const steps = [
        { name: "Prime Generation", desc: "Select two large primes (p, q)" },
        { name: "Modulus Calc", desc: "n = p * q (Public Modulus)" },
        { name: "Totient Calc", desc: "φ(n) = (p-1)*(q-1)" },
        { name: "Public Key", desc: "Choose e (coprime to φ(n))" },
        { name: "Private Key", desc: "Calc d (d*e ≡ 1 mod φ(n))" },
        { name: "Key Pair Ready", desc: "Public(n,e) & Private(n,d)" }
    ];

    // Simulated values for visualization
    const [values, setValues] = useState({
        p: '61',
        q: '53',
        n: '3233',
        phi: '3120',
        e: '17',
        d: '2753'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % steps.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [steps.length]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center font-mono">
            <h3 className="text-xl font-bold text-secondary mb-8 tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary animate-pulse"></span>
                RSA_KEYGEN_SCHEMATIC
            </h3>
            
            <div className="relative w-full max-w-sm h-64 flex flex-col items-center justify-center gap-4">
                {/* Nodes */}
                <div className="flex gap-8">
                    <motion.div 
                        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-sm relative ${step >= 0 ? 'border-secondary text-secondary shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 'border-border-strong text-text-muted'}`}
                        animate={{ scale: step === 0 ? 1.1 : 1 }}
                    >
                        <span className="absolute -top-4 text-[10px] uppercase">Prime P</span>
                        {step >= 0 ? values.p : '?'}
                    </motion.div>
                    <motion.div 
                        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-sm relative ${step >= 0 ? 'border-secondary text-secondary shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 'border-border-strong text-text-muted'}`}
                        animate={{ scale: step === 0 ? 1.1 : 1 }}
                    >
                        <span className="absolute -top-4 text-[10px] uppercase">Prime Q</span>
                        {step >= 0 ? values.q : '?'}
                    </motion.div>
                </div>

                {/* Flow Lines */}
                <div className="w-32 h-8 border-l-2 border-r-2 border-b-2 border-border-strong rounded-b-xl relative">
                     <motion.div 
                        className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-secondary origin-bottom"
                        initial={{ height: 0 }}
                        animate={{ height: step >= 1 ? 16 : 0 }}
                     />
                </div>

                {/* Modulus */}
                <motion.div 
                    className={`w-24 h-12 border-2 flex items-center justify-center font-bold text-sm relative bg-bg-input ${step >= 1 ? 'border-success text-success shadow-[0_0_10px_rgba(0,255,65,0.3)]' : 'border-border-strong text-text-muted'}`}
                    animate={{ scale: step === 1 ? 1.1 : 1 }}
                >
                    <span className="absolute -left-12 text-[10px] uppercase text-text-muted">Modulus N</span>
                    {step >= 1 ? values.n : '---'}
                </motion.div>

                {/* Keys */}
                <div className="flex gap-12 mt-4">
                    <motion.div 
                        className={`flex flex-col items-center gap-1 ${step >= 3 ? 'opacity-100' : 'opacity-30'}`}
                        animate={{ y: step === 3 ? -5 : 0 }}
                    >
                        <div className="w-10 h-10 border border-secondary flex items-center justify-center text-secondary font-bold text-xs rounded">
                            {values.e}
                        </div>
                        <span className="text-[10px] uppercase text-secondary">Public</span>
                    </motion.div>

                    <motion.div 
                        className={`flex flex-col items-center gap-1 ${step >= 4 ? 'opacity-100' : 'opacity-30'}`}
                        animate={{ y: step === 4 ? -5 : 0 }}
                    >
                        <div className="w-10 h-10 border border-danger flex items-center justify-center text-danger font-bold text-xs rounded">
                            {values.d}
                        </div>
                        <span className="text-[10px] uppercase text-danger">Private</span>
                    </motion.div>
                </div>

                {/* Step Indicator Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-bg-surface/90 backdrop-blur px-6 py-3 border border-secondary shadow-[0_0_15px_rgba(0,255,255,0.2)] text-center relative z-20 mt-[-100px]"
                    >
                         {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-1 h-1 bg-secondary"></div>
                        <div className="absolute top-0 right-0 w-1 h-1 bg-secondary"></div>
                        <div className="absolute bottom-0 left-0 w-1 h-1 bg-secondary"></div>
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-secondary"></div>

                        <div className="text-secondary font-bold text-lg tracking-wider uppercase">{steps[step].name}</div>
                        <div className="text-[10px] text-text-muted uppercase tracking-widest">{steps[step].desc}</div>
                    </motion.div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mt-8 flex gap-1">
                {steps.map((s, i) => (
                    <div 
                        key={i} 
                        className={`h-1 flex-1 transition-all ${i === step ? 'bg-secondary shadow-[0_0_10px_rgba(0,255,255,0.5)]' : 'bg-border-strong'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default RSAVisualizer;
