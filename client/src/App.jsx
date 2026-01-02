import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import LoginScreen from './components/LoginScreen';
import CryptoLab from './components/CryptoLab';
import SettingsModal from './components/SettingsModal';
import Geolocator from './components/Geolocator';
import LandingPage from './components/LandingPage';
import NetworkMonitor from './components/NetworkMonitor';
import PasswordAnalyzer from './components/PasswordAnalyzer';
import EncryptionCompare from './components/EncryptionCompare';
import JudgeGuide from './components/JudgeGuide';
import TeamPage from './components/TeamPage';
import { MessageSquare, Cpu, Settings, Globe, Shield, Key, Lock, Users } from 'lucide-react';
import { playTacticalSound } from './utils/sound';

function App() {
  const [userRole, setUserRole] = useState(null); // 'COMMANDER' or 'AGENT'
  const [view, setView] = useState('chat'); // 'chat' or 'lab'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '');

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    }
  }, [apiKey]);

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

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

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
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
        />
      </>
    );
  }

  return (
    <div className="App h-screen flex flex-col bg-bg-main text-text-main overflow-hidden relative">
      {/* Scanline Effect */}
      <div className="scanline"></div>

      {/* Navigation */}
      {/* Navigation (Desktop) */}
      <nav className="hidden md:flex items-center justify-between px-6 py-3 z-20 bg-bg-surface border-b border-border-strong shadow-hud">
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
            <span>COMM</span>
          </button>
          <button 
            onClick={() => setView('network')}
            className={`flex items-center gap-2 px-4 py-1.5 border transition-all font-mono text-sm ${
              view === 'network' 
              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]' 
              : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <Shield size={16} />
            <span>IDS</span>
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
            <span>CRYPTO</span>
          </button>
          <button 
            onClick={() => setView('password')}
            className={`flex items-center gap-2 px-4 py-1.5 border transition-all font-mono text-sm ${
              view === 'password' 
              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]' 
              : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <Key size={16} />
            <span>PWD</span>
          </button>
          <button 
            onClick={() => setView('encrypt')}
            className={`flex items-center gap-2 px-4 py-1.5 border transition-all font-mono text-sm ${
              view === 'encrypt' 
              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]' 
              : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <Lock size={16} />
            <span>ENCRYPT</span>
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
            <span>GEO</span>
          </button>
          <button 
            onClick={() => setView('team')}
            className={`flex items-center gap-2 px-4 py-1.5 border transition-all font-mono text-sm ${
              view === 'team' 
              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]' 
              : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <Users size={16} />
            <span>TEAM</span>
          </button>
        </div>

        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-text-muted hover:text-primary transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </nav>

      {/* Navigation (Mobile Header - Just Title & Settings) */}
      <nav className="flex md:hidden items-center justify-between px-4 py-3 z-20 bg-bg-surface border-b border-border-strong shadow-hud">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary animate-pulse"></div>
          <span className="font-mono font-bold text-primary tracking-wider text-sm">SECURE_UPLINK</span>
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
            <ChatInterface role={userRole} onLogout={() => setUserRole(null)} apiKey={apiKey} />
          ) : view === 'network' ? (
            <NetworkMonitor />
          ) : view === 'lab' ? (
            <CryptoLab />
          ) : view === 'password' ? (
            <PasswordAnalyzer />
          ) : view === 'encrypt' ? (
            <EncryptionCompare />
          ) : view === 'geo' ? (
            <Geolocator />
          ) : view === 'team' ? (
            <TeamPage />
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
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
      />

      {/* Copyright Footer (Desktop Only) */}
      <div className="hidden md:block absolute bottom-1 right-4 z-50 text-[10px] text-text-muted font-mono opacity-50 hover:opacity-100 transition-opacity">
        BUILT BY: Mahesh, Radhika, Suresh, Vaishnavi
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex items-center justify-around bg-bg-surface border-t border-border-strong p-2 z-50 pb-safe">
        <button 
          onClick={() => setView('chat')}
          className={`flex flex-col items-center gap-1 p-1 transition-all ${
            view === 'chat' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <MessageSquare size={18} />
          <span className="text-[8px] font-mono font-bold">CHAT</span>
        </button>
        <button 
          onClick={() => setView('network')}
          className={`flex flex-col items-center gap-1 p-1 transition-all ${
            view === 'network' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <Shield size={18} />
          <span className="text-[8px] font-mono font-bold">IDS</span>
        </button>
        <button 
          onClick={() => setView('lab')}
          className={`flex flex-col items-center gap-1 p-1 transition-all ${
            view === 'lab' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <Cpu size={18} />
          <span className="text-[8px] font-mono font-bold">CRYPTO</span>
        </button>
        <button 
          onClick={() => setView('password')}
          className={`flex flex-col items-center gap-1 p-1 transition-all ${
            view === 'password' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <Key size={18} />
          <span className="text-[8px] font-mono font-bold">PWD</span>
        </button>
        <button 
          onClick={() => setView('encrypt')}
          className={`flex flex-col items-center gap-1 p-1 transition-all ${
            view === 'encrypt' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <Lock size={18} />
          <span className="text-[8px] font-mono font-bold">ENCRYPT</span>
        </button>
        <button 
          onClick={() => setView('geo')}
          className={`flex flex-col items-center gap-1 p-1 transition-all ${
            view === 'geo' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <Globe size={18} />
          <span className="text-[8px] font-mono font-bold">GEO</span>
        </button>
        <button 
          onClick={() => setView('team')}
          className={`flex flex-col items-center gap-1 p-1 transition-all ${
            view === 'team' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <Users size={18} />
          <span className="text-[8px] font-mono font-bold">TEAM</span>
        </button>
      </div>

      {/* Judge Guide Floating Button */}
      <JudgeGuide />
    </div>
  );
}

export default App;
