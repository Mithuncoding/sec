import React from 'react';
import { X, Sun, Moon, Shield, RefreshCw } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, isDarkMode, toggleTheme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-bg-surface border border-border-strong shadow-glow p-6 relative hud-corner">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-border-strong pb-4">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="w-5 h-5" />
            <h2 className="text-lg font-mono font-bold tracking-wider">SYSTEM CONFIG</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-primary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-muted uppercase tracking-widest">Interface Theme</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => !isDarkMode && toggleTheme()}
                className={`flex items-center justify-center gap-2 p-3 border transition-all ${
                  isDarkMode 
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]' 
                  : 'border-border-strong text-text-muted hover:border-primary/50'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="font-mono text-sm font-bold">NIGHT OPS</span>
              </button>
              <button
                onClick={() => isDarkMode && toggleTheme()}
                className={`flex items-center justify-center gap-2 p-3 border transition-all ${
                  !isDarkMode 
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]' 
                  : 'border-border-strong text-text-muted hover:border-primary/50'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="font-mono text-sm font-bold">DAY REPORT</span>
              </button>
            </div>
          </div>

          {/* Simulation Settings (Placeholder) */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-muted uppercase tracking-widest">Encryption Simulation</label>
            <div className="p-3 border border-border-strong bg-bg-input text-text-muted font-mono text-xs">
              <div className="flex justify-between mb-1">
                <span>AES-256</span>
                <span className="text-success">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>RSA-2048</span>
                <span className="text-success">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* System Reset */}
          <button className="w-full py-3 border border-danger/50 text-danger font-mono font-bold hover:bg-danger/10 transition-colors flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            RESET SYSTEM CACHE
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border-strong text-center">
          <p className="text-[10px] font-mono text-text-muted">
            SECURE TERMINAL v2.0.4 • AUTHORIZED USE ONLY
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
