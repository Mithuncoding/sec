import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, ChevronRight, Sparkles, Shield, Lock, Globe, Network, Key, FileCode } from 'lucide-react';

const features = [
  {
    id: 'chat',
    title: 'Encrypted Chat',
    icon: Lock,
    summary: 'End-to-end encrypted messaging using AES-256',
    details: [
      'Real AES-256-CBC encryption using CryptoJS',
      'Messages encrypted before leaving device',
      'Firebase Realtime Database for instant sync',
      'AI-powered threat analysis on messages'
    ],
    techStack: ['AES-256', 'Firebase', 'Gemini AI']
  },
  {
    id: 'network',
    title: 'Network Monitor',
    icon: Network,
    summary: 'Live intrusion detection simulation',
    details: [
      'Simulates real-world cyber attacks',
      'Real-time threat feed with geo-location',
      'Security score calculation',
      'Attack classification by severity'
    ],
    techStack: ['React', 'Framer Motion', 'Real-time Updates']
  },
  {
    id: 'crypto',
    title: 'Crypto Lab',
    icon: FileCode,
    summary: 'Interactive cryptography education',
    details: [
      'Visual AES encryption step-by-step',
      'RSA key generation visualization',
      'Caesar, Vigenère cipher demos',
      'Crack time estimation'
    ],
    techStack: ['AES', 'RSA', 'Classical Ciphers']
  },
  {
    id: 'password',
    title: 'Password Analyzer',
    icon: Key,
    summary: 'NIST-compliant password strength checker',
    details: [
      'Real-time entropy calculation',
      'GPU crack time estimation (10B guesses/sec)',
      'Multiple security criteria checks',
      'Educational feedback'
    ],
    techStack: ['Entropy Analysis', 'NIST Guidelines']
  },
  {
    id: 'geo',
    title: 'Geolocator',
    icon: Globe,
    summary: 'Global agent tracking visualization',
    details: [
      'Interactive world map with dark theme',
      'Real-time agent status indicators',
      'Multiple agent locations worldwide',
      'Leaflet.js for mapping'
    ],
    techStack: ['Leaflet.js', 'OpenStreetMap']
  },
  {
    id: 'encrypt',
    title: 'Encryption Compare',
    icon: Shield,
    summary: 'Side-by-side algorithm comparison',
    details: [
      'Real AES-256 encryption demo',
      'SHA-256 hashing with timing',
      'Performance benchmarking',
      'Copy encrypted output'
    ],
    techStack: ['CryptoJS', 'Performance API']
  }
];

const JudgeGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,65,0.4)] border-2 border-primary/50"
      >
        <Sparkles className="w-6 h-6 text-bg-main" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsOpen(false); setSelectedFeature(null); }}
              className="fixed inset-0 bg-bg-main/80 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-bg-surface border-l border-border-strong z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border-strong bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <div>
                      <h2 className="text-xl font-bold text-primary tracking-wider">FOR JUDGES</h2>
                      <p className="text-xs text-text-muted">Feature Guide & Technical Overview</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsOpen(false); setSelectedFeature(null); }}
                    className="p-2 hover:bg-bg-input rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-text-muted" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {!selectedFeature ? (
                  <>
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-text-main mb-2">PROJECT HIGHLIGHTS</h3>
                      <div className="p-4 bg-primary/5 border border-primary/30 text-sm">
                        <ul className="space-y-2 text-text-muted">
                          <li className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span><strong className="text-primary">Real Encryption:</strong> Uses actual AES-256 and SHA-256</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span><strong className="text-primary">AI Integration:</strong> Gemini AI for threat analysis</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span><strong className="text-primary">Real-time:</strong> Firebase for instant message sync</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span><strong className="text-primary">Educational:</strong> Visualizes complex crypto concepts</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-text-main mb-4">FEATURES</h3>
                    <div className="space-y-3">
                      {features.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                          <motion.button
                            key={feature.id}
                            whileHover={{ x: 5 }}
                            onClick={() => setSelectedFeature(feature)}
                            className="w-full p-4 bg-bg-input border border-border-strong hover:border-primary/50 transition-colors text-left flex items-center gap-4"
                          >
                            <div className="w-10 h-10 border border-primary/50 flex items-center justify-center text-primary">
                              <IconComponent size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-text-main">{feature.title}</div>
                              <div className="text-xs text-text-muted">{feature.summary}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-text-muted" />
                          </motion.button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <button
                      onClick={() => setSelectedFeature(null)}
                      className="flex items-center gap-2 text-sm text-primary mb-6 hover:underline"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Back to Features
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 border-2 border-primary flex items-center justify-center text-primary">
                        <selectedFeature.icon size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary">{selectedFeature.title}</h3>
                        <p className="text-sm text-text-muted">{selectedFeature.summary}</p>
                      </div>
                    </div>

                    <h4 className="text-xs text-text-muted uppercase tracking-widest mb-3">Key Features</h4>
                    <ul className="space-y-2 mb-6">
                      {selectedFeature.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-text-main">{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-xs text-text-muted uppercase tracking-widest mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeature.techStack.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-secondary/10 border border-secondary/30 text-secondary text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border-strong bg-bg-input text-center text-xs text-text-muted">
                Built with ❤️ by Mahesh, Radhika, Suresh, Vaishnavi
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default JudgeGuide;
