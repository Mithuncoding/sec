import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Shield, AlertTriangle, CheckCircle, RefreshCw, Terminal, Activity } from 'lucide-react';
import AESVisualizer from './AESVisualizer';
import RSAVisualizer from './RSAVisualizer';
import DecryptedText from './DecryptedText';
import { playTacticalSound } from '../utils/sound';

const algorithms = [
    {
        id: 'caesar',
        name: 'Caesar Cipher',
        desc: 'Simple substitution. Shifts letters by a fixed number.',
        security: 'WEAK',
        color: 'text-danger',
        crackTime: '< 1 Second',
        crackMethod: 'Brute Force (Try all 25 shifts)'
    },
    {
        id: 'vigenere',
        name: 'Vigenère Cipher',
        desc: 'Polyalphabetic substitution using a keyword.',
        security: 'MODERATE',
        color: 'text-warning',
        crackTime: 'Minutes',
        crackMethod: 'Frequency Analysis'
    },
    {
        id: 'des',
        name: 'DES (Data Encryption Standard)',
        desc: 'Obsolete 56-bit symmetric key block cipher.',
        security: 'WEAK',
        color: 'text-danger',
        crackTime: '< 24 Hours',
        crackMethod: 'Distributed Brute Force'
    },
    {
        id: 'aes',
        name: 'AES-256 (Advanced Encryption Standard)',
        desc: 'The global standard. 256-bit key size.',
        security: 'UNBREAKABLE',
        color: 'text-success',
        crackTime: 'Billions of Years',
        crackMethod: 'Quantum Computing (Theoretical)'
    },
    {
        id: 'rsa',
        name: 'RSA (Rivest–Shamir–Adleman)',
        desc: 'Public-key cryptosystem for secure data transmission.',
        security: 'STRONG',
        color: 'text-secondary',
        crackTime: 'Years (for large keys)',
        crackMethod: 'Integer Factorization'
    }
];

const CryptoLab = () => {
    const [activeTab, setActiveTab] = useState('aes');
    const [inputText, setInputText] = useState('TOP SECRET DATA');
    const [isCracking, setIsCracking] = useState(false);
    const [crackResult, setCrackResult] = useState(null);

    const handleCrack = () => {
        setIsCracking(true);
        setCrackResult(null);
        playTacticalSound('click');
        
        // Simulate cracking time based on algorithm
        const algo = algorithms.find(a => a.id === activeTab);
        const time = algo.security === 'WEAK' ? 1500 : algo.security === 'MODERATE' ? 3000 : 5000;

        setTimeout(() => {
            setIsCracking(false);
            if (algo.security === 'UNBREAKABLE') {
                setCrackResult({ success: false, message: "CRACK FAILED. AES-256 is too strong." });
                playTacticalSound('error');
            } else {
                setCrackResult({ success: true, message: `CRACKED! Method: ${algo.crackMethod}` });
                playTacticalSound('success');
            }
        }, time);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto bg-bg-main font-mono">
            <div className="flex items-center gap-3 mb-2 text-primary animate-pulse">
                <Terminal className="w-8 h-8" />
                <h2 className="text-3xl font-bold tracking-widest">
                    DECRYPTION_SUITE
                </h2>
            </div>
            <p className="text-text-muted mb-8 border-l-2 border-primary pl-4 text-sm">
                Interactive module for analyzing and breaking encryption algorithms.
            </p>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {algorithms.map((algo) => (
                    <button
                        key={algo.id}
                        onClick={() => { 
                            setActiveTab(algo.id); 
                            setCrackResult(null); 
                            playTacticalSound('click');
                        }}
                        className={`px-4 py-2 border transition-all uppercase text-xs font-bold tracking-wider ${
                            activeTab === algo.id 
                            ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(0,255,65,0.1)]' 
                            : 'bg-transparent border-border-strong text-text-muted hover:border-primary/50 hover:text-primary'
                        }`}
                    >
                        {algo.name.split(' ')[0]}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Info & Interactive */}
                <div className="space-y-6">
                    <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-bg-surface border border-border-strong p-6 relative hud-panel"
                    >
                        {/* HUD Corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-primary tracking-wide uppercase">{algorithms.find(a => a.id === activeTab).name}</h3>
                            <span className={`px-2 py-1 text-[10px] font-bold border uppercase tracking-widest ${
                                algorithms.find(a => a.id === activeTab).security === 'UNBREAKABLE' ? 'border-success text-success bg-success/10' : 
                                algorithms.find(a => a.id === activeTab).security === 'WEAK' ? 'border-danger text-danger bg-danger/10' : 
                                'border-warning text-warning bg-warning/10'
                            }`}>
                                {algorithms.find(a => a.id === activeTab).security}
                            </span>
                        </div>
                        <p className="text-text-muted mb-6 leading-relaxed text-sm">{algorithms.find(a => a.id === activeTab).desc}</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-primary font-bold uppercase mb-1 block tracking-widest">Target Data Stream</label>
                                <input 
                                    type="text" 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="w-full p-3 bg-bg-input border border-border-strong text-text-main focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.1)] outline-none transition-all font-mono text-sm"
                                />
                            </div>
                            
                            <div className="p-4 bg-bg-input border border-border-strong relative">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                                <div className="flex justify-between text-xs mb-4">
                                    <span className="text-text-muted uppercase">Est. Crack Time:</span>
                                    <span className="font-bold text-text-main">{algorithms.find(a => a.id === activeTab).crackTime}</span>
                                </div>
                                <button 
                                    onClick={handleCrack}
                                    disabled={isCracking}
                                    className="w-full py-3 bg-transparent border border-danger text-danger hover:bg-danger hover:text-white transition-all font-bold flex items-center justify-center gap-2 uppercase tracking-widest text-xs group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-danger/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <span className="relative flex items-center gap-2">
                                        {isCracking ? <RefreshCw className="animate-spin w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                        {isCracking ? 'RUNNING BRUTE FORCE...' : 'INITIATE CRACK SEQUENCE'}
                                    </span>
                                </button>
                            </div>

                            <AnimatePresence>
                                {crackResult && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className={`p-4 border relative overflow-hidden ${crackResult.success ? 'bg-success/5 border-success text-success' : 'bg-danger/5 border-danger text-danger'}`}
                                    >
                                        <div className="flex items-center gap-3 relative z-10">
                                            {crackResult.success ? <AlertTriangle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                            <span className="font-bold text-sm tracking-wide">
                                                <DecryptedText text={crackResult.message} speed={30} />
                                            </span>
                                        </div>
                                        {/* Scanline for result */}
                                        <div className={`absolute inset-0 opacity-10 ${crackResult.success ? 'bg-success' : 'bg-danger'}`}></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Visualizer */}
                <div className="bg-bg-surface border border-border-strong p-6 relative hud-panel flex flex-col items-center justify-center min-h-[400px] overflow-hidden">
                    {/* HUD Corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                    {activeTab === 'aes' ? (
                        <AESVisualizer />
                    ) : activeTab === 'rsa' ? (
                        <RSAVisualizer />
                    ) : (
                        <div className="text-center text-text-muted">
                            <Lock className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="font-medium uppercase tracking-widest text-sm">Visualizer Offline</p>
                            <p className="text-[10px] mt-2 text-primary/50">ONLY AVAILABLE FOR AES-256 & RSA PROTOCOLS</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CryptoLab;
