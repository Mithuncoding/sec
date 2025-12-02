import React, { useState, useEffect, useRef } from 'react';
import { Send, Shield, Activity, Users, Lock, Wifi, AlertTriangle, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, push, onValue, set, onDisconnect, serverTimestamp, query, limitToLast } from 'firebase/database';
import { database } from '../firebase';
import { playTacticalSound } from '../utils/sound';
import { initializeAI, analyzeThreatLevel } from '../services/ai';
import { decryptMessage, encryptMessage } from '../utils/crypto';
import DecryptedText from './DecryptedText';

const ChatInterface = ({ role, onLogout, apiKey }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState(1);
  const [typingUsers, setTypingUsers] = useState({});
  const [threatLevel, setThreatLevel] = useState(0);
  const [threatAnalysis, setThreatAnalysis] = useState('SYSTEM NORMAL');
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const userRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (apiKey) {
      initializeAI(apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    const analyzeLastMessage = async () => {
      if (messages.length > 0 && apiKey) {
        const lastMsg = messages[messages.length - 1];
        const decrypted = decryptMessage(lastMsg.text);
        
        if (decrypted && decrypted !== "**DECRYPTION FAILED**") {
          const result = await analyzeThreatLevel(decrypted);
          setThreatLevel(result.score);
          setThreatAnalysis(result.analysis);
        }
      }
    };
    
    analyzeLastMessage();
  }, [messages, apiKey]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  useEffect(() => {
    // --- Firebase Presence System ---
    const connectedRef = ref(database, '.info/connected');
    const presenceRef = ref(database, 'presence');
    
    // Create a unique reference for this user
    const myUserRef = push(presenceRef);
    userRef.current = myUserRef;

    const unsubscribeConnected = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // We're connected (or reconnected)!
        // Set our presence to true
        set(myUserRef, { role, online: true, lastSeen: serverTimestamp() });
        // When I disconnect, remove this node
        onDisconnect(myUserRef).remove();
      }
    });

    // Listen for active users count
    const unsubscribePresence = onValue(presenceRef, (snap) => {
      if (snap.exists()) {
        setActiveUsers(Object.keys(snap.val()).length);
      } else {
        setActiveUsers(0);
      }
    });

    // --- Firebase Messages ---
    const messagesRef = query(ref(database, 'messages'), limitToLast(50));
    
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array
        const messageList = Object.values(data);
        setMessages(messageList);
        playTacticalSound('beep');
      } else {
        setMessages([]);
      }
    });

    // --- Firebase Typing Indicators ---
    const typingRef = ref(database, 'typing');
    const unsubscribeTyping = onValue(typingRef, (snapshot) => {
      const data = snapshot.val() || {};
      // Filter out self and false values
      const othersTyping = {};
      Object.entries(data).forEach(([key, value]) => {
        if (key !== role && value === true) {
          othersTyping[key] = true;
        }
      });
      setTypingUsers(othersTyping);
    });

    return () => {
      unsubscribeConnected();
      unsubscribePresence();
      unsubscribeMessages();
      unsubscribeTyping();
      if (userRef.current) {
        set(userRef.current, null); // Remove self on unmount
      }
    };
  }, [role]);

  const handleDownloadLogs = () => {
    const logContent = messages.map(msg => {
      const decrypted = decryptMessage(msg.text);
      const content = decrypted === "**DECRYPTION FAILED**" ? "[ENCRYPTED DATA]" : decrypted;
      return `[${msg.timestamp}] ${msg.sender.toUpperCase()}: ${content}`;
    }).join('\n');

    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MISSION_LOG_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playTacticalSound('click');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      // Encrypt the message
      const encryptedText = encryptMessage(inputMessage);

      const messageData = {
        id: crypto.randomUUID(),
        text: encryptedText,
        sender: role,
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        isEncrypted: true,
      };
      
      // Push to Firebase
      push(ref(database, 'messages'), messageData);
      playTacticalSound('send');
      
      setInputMessage('');
      handleTyping(false);
    }
  };

  const handleTyping = (isTyping) => {
    // Update typing status in Firebase
    const myTypingRef = ref(database, `typing/${role}`);
    set(myTypingRef, isTyping);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        set(myTypingRef, false);
      }, 2000);
    }
  };
  
  // Wait, I need to fix handleSendMessage to actually encrypt.
  // The previous code didn't encrypt in handleSendMessage?
  // Let me check the previous file content again.
  // Line 99: text: inputMessage,
  // It was sending PLAIN TEXT! The "simulated" encryption was just visual in DecryptedText?
  // No, DecryptedText takes "text" prop.
  // Let's look at DecryptedText.jsx later.
  // But for REAL encryption, I MUST encrypt here.
  
  // So I will update handleSendMessage as well.
  
  return (
    <div className="flex flex-col h-full font-mono relative">
      {/* Tactical Header */}
      <header className="bg-bg-surface border-b border-border-strong p-4 flex items-center justify-between shadow-hud z-20">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-primary tracking-wider flex items-center gap-2">
              <Shield className="w-5 h-5" />
              SECURE_CHANNEL_ALPHA
            </h1>
            <div className="flex items-center gap-4 text-[10px] text-text-muted uppercase">
              <span className="flex items-center gap-1">
                <Lock size={10} className="text-success" /> ENCRYPTION: AES-256
              </span>
              <span className="flex items-center gap-1">
                <Wifi size={10} className="text-success" /> SIGNAL: STRONG
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Threat Level Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1 border rounded-sm transition-colors ${
            threatLevel > 50 
            ? 'bg-danger/10 border-danger text-danger animate-pulse' 
            : 'bg-bg-input border-border-strong text-success'
          }`} title={threatAnalysis}>
            <AlertTriangle size={14} />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold">THREAT_LEVEL</span>
              <span className="text-xs font-bold">{threatLevel}%</span>
            </div>
          </div>

          {/* Active Users Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 bg-bg-input border border-border-strong rounded-sm">
            <Users size={14} className="text-secondary" />
            <span className="text-xs font-bold text-secondary">{activeUsers} AGENTS</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
          </div>

          <button 
            onClick={handleDownloadLogs}
            className="text-xs text-primary hover:text-white border border-primary/50 px-3 py-1 hover:bg-primary/10 transition-colors uppercase tracking-widest flex items-center gap-2"
            title="Download Mission Logs"
          >
            <Download size={14} />
            <span className="hidden sm:inline">LOGS</span>
          </button>

          <button 
            onClick={onLogout}
            className="text-xs text-danger hover:text-red-400 border border-danger/50 px-3 py-1 hover:bg-danger/10 transition-colors uppercase tracking-widest"
          >
            [ Terminate ]
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Shield size={300} />
        </div>

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === role ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.sender === role ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${msg.sender === role ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className="flex items-center gap-2 mb-1 text-[10px] text-text-muted uppercase tracking-wider">
                  <span className={msg.sender === role ? 'text-primary' : 'text-secondary'}>
                    {msg.sender === role ? 'YOU' : msg.sender}
                  </span>
                  <span>{msg.timestamp}</span>
                  {msg.isEncrypted && <Lock size={8} />}
                </div>
                
                <div 
                  className={`p-3 border ${
                    msg.sender === role 
                    ? 'bg-primary/10 border-primary text-text-main shadow-[0_0_10px_rgba(0,255,65,0.1)]' 
                    : 'bg-bg-surface border-border-strong text-text-main'
                  } relative group`}
                >
                  {/* Corner Accents */}
                  <div className={`absolute top-0 w-2 h-2 border-t border-${msg.sender === role ? 'primary' : 'secondary'} ${msg.sender === role ? 'right-0 border-r' : 'left-0 border-l'}`}></div>
                  <div className={`absolute bottom-0 w-2 h-2 border-b border-${msg.sender === role ? 'primary' : 'secondary'} ${msg.sender === role ? 'left-0 border-l' : 'right-0 border-r'}`}></div>
                  
                  <div className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    <DecryptedText text={decryptMessage(msg.text)} speed={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {Object.keys(typingUsers).length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-secondary font-mono animate-pulse"
          >
            <Activity size={12} />
            <span>
              {Object.keys(typingUsers).join(', ')} IS TRANSMITTING DATA...
            </span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-bg-surface border-t border-border-strong z-20">
        <form onSubmit={handleSendMessage} className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <div className="absolute -top-3 left-2 text-[10px] bg-bg-surface px-1 text-primary uppercase tracking-widest">
              Message_Input
            </div>
            <textarea
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                handleTyping(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="ENTER SECURE MESSAGE..."
              className="w-full bg-bg-input border border-border-strong p-3 text-text-main placeholder-text-muted focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.1)] transition-all font-mono text-sm resize-none h-[60px]"
            />
          </div>
          
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="h-[60px] px-6 bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-bg-main transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1 group"
          >
            <Send size={18} className="group-hover:-translate-y-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">SEND</span>
          </button>
        </form>
        
        <div className="mt-2 flex justify-between text-[10px] text-text-muted uppercase">
          <span>SECURE_LINK_ESTABLISHED</span>
          <span>V2.0.4 BUILD 8921</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
