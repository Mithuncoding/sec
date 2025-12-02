import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import LoginScreen from './components/LoginScreen';
import CryptoLab from './components/CryptoLab';
import SettingsModal from './components/SettingsModal';
import Geolocator from './components/Geolocator';
import { MessageSquare, Cpu, Settings, Globe } from 'lucide-react';
import { playTacticalSound } from './utils/sound';

function App() {
  const [userRole, setUserRole] = useState(null); // 'COMMANDER' or 'AGENT'
  const [view, setView] = useState('chat'); // 'chat' or 'lab'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Global click sound listener
    const handleGlobalClick = () => {
      playTacticalSound('click');
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (!userRole) {
    return (
      <>
        <LoginScreen onLogin={(role) => setUserRole(role)} />
        {/* Settings Button on Login Screen */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="fixed top-4 right-4 p-2 text-text-muted hover:text-primary transition-colors z-50"
        >
          <Settings className="w-6 h-6" />
        </button>
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      </>
    );
  }

  return (
    <div className="App h-screen flex flex-col bg-bg-main text-text-main overflow-hidden relative">
      {/* Scanline Effect */}
      <div className="scanline"></div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-3 z-20 bg-bg-surface border-b border-border-strong shadow-hud">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary animate-pulse"></div>
          <span className="font-mono font-bold text-primary tracking-wider">SECURE_UPLINK_v2</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('chat')}
            className={`flex items-center gap-2 px-4 py-1.5 border transition-all font-mono text-sm ${
              view === 'chat' 
              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]' 
              : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <MessageSquare size={16} />
            <span>COMM_LINK</span>
          </button>
          <button 
            onClick={() => setView('lab')}
            className={`flex items-center gap-2 px-4 py-1.5 border transition-all font-mono text-sm ${
              view === 'lab' 
              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]' 
              : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <Cpu size={16} />
            <span>CRYPTO_LAB</span>
          </button>
          <button 
            onClick={() => setView('geo')}
            className={`flex items-center gap-2 px-4 py-1.5 border transition-all font-mono text-sm ${
              view === 'geo' 
              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]' 
              : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <Globe size={16} />
            <span>GEOLOCATOR</span>
          </button>
        </div>

        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-text-muted hover:text-primary transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-hidden bg-bg-main p-4">
        <div className="h-full w-full max-w-7xl mx-auto border-x border-border-strong/20 bg-bg-main/50 relative">
           {/* Grid Background */}
           <div className="absolute inset-0 bg-[linear-gradient(var(--border-strong)_1px,transparent_1px),linear-gradient(90deg,var(--border-strong)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none"></div>
           
           {view === 'chat' ? (
            <ChatInterface role={userRole} onLogout={() => setUserRole(null)} />
          ) : view === 'lab' ? (
            <CryptoLab />
          ) : (
            <Geolocator />
          )}
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    </div>
  );
}

export default App;
