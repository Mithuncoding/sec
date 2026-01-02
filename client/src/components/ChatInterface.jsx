import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Shield, Activity, Users, Lock, Wifi, AlertTriangle, Download, Trash,
  Image, Paperclip, Smile, Reply, Check, CheckCheck, X, Mic, Play, Pause,
  Heart, ThumbsUp, ThumbsDown, Star, Zap, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, push, onValue, set, onDisconnect, serverTimestamp, query, limitToLast, update } from 'firebase/database';
import { database } from '../firebase';
import { playTacticalSound } from '../utils/sound';
import { initializeAI, analyzeThreatLevel } from '../services/ai';
import { decryptMessage, encryptMessage } from '../utils/crypto';
import DecryptedText from './DecryptedText';
import SystemStatus from './SystemStatus';

// Emoji reactions
const REACTIONS = ['❤️', '👍', '👎', '⭐', '🔥', '😂'];

// Simple emoji picker data
const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😁', '😂', '🤣', '😊', '😍', '🥰', '😎', '🤔', '😴', '🤯', '😱'],
  'Gestures': ['👍', '👎', '👏', '🙏', '💪', '🤝', '✌️', '🤟', '👊', '✊'],
  'Symbols': ['❤️', '⭐', '🔥', '💯', '✅', '❌', '⚠️', '🔒', '🛡️', '🎯']
};

const ChatInterface = ({ role, onLogout, apiKey }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState(1);
  const [typingUsers, setTypingUsers] = useState({});
  const [threatLevel, setThreatLevel] = useState(0);
  const [threatAnalysis, setThreatAnalysis] = useState('SYSTEM NORMAL');
  
  // New states for advanced features
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showImageModal, setShowImageModal] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [contextMenu, setContextMenu] = useState(null);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const userRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const recordingIntervalRef = useRef(null);

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
        if (lastMsg.type === 'text') {
          const decrypted = decryptMessage(lastMsg.text);
          if (decrypted && decrypted !== "**DECRYPTION FAILED**") {
            const result = await analyzeThreatLevel(decrypted);
            setThreatLevel(result.score);
            setThreatAnalysis(result.analysis);
          }
        }
      }
    };
    analyzeLastMessage();
  }, [messages, apiKey]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  useEffect(() => {
    // Firebase Presence System
    const connectedRef = ref(database, '.info/connected');
    const presenceRef = ref(database, 'presence');
    const myUserRef = push(presenceRef);
    userRef.current = myUserRef;

    const unsubscribeConnected = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        set(myUserRef, { role, online: true, lastSeen: serverTimestamp() });
        onDisconnect(myUserRef).remove();
      }
    });

    const unsubscribePresence = onValue(presenceRef, (snap) => {
      if (snap.exists()) {
        setActiveUsers(Object.keys(snap.val()).length);
      } else {
        setActiveUsers(0);
      }
    });

    // Firebase Messages
    const messagesRef = query(ref(database, 'messages'), limitToLast(100));
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([key, value]) => ({
          ...value,
          firebaseKey: key
        }));
        setMessages(messageList);
        playTacticalSound('beep');
      } else {
        setMessages([]);
      }
    });

    // Typing Indicators
    const typingRef = ref(database, 'typing');
    const unsubscribeTyping = onValue(typingRef, (snapshot) => {
      const data = snapshot.val() || {};
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
        set(userRef.current, null);
      }
    };
  }, [role]);

  const handleDownloadLogs = () => {
    const logContent = messages.map(msg => {
      if (msg.type === 'image') return `[${msg.timestamp}] ${msg.sender.toUpperCase()}: [IMAGE]`;
      if (msg.type === 'file') return `[${msg.timestamp}] ${msg.sender.toUpperCase()}: [FILE: ${msg.fileName}]`;
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

  const handleClearChat = () => {
    if (window.confirm('WARNING: THIS WILL ERASE ALL MISSION HISTORY. CONFIRM?')) {
      set(ref(database, 'messages'), null);
      playTacticalSound('click');
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    
    if (imagePreview) {
      // Send image message
      const messageData = {
        id: crypto.randomUUID(),
        type: 'image',
        imageData: imagePreview,
        sender: role,
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        fullTimestamp: Date.now(),
        status: 'sent',
        reactions: {},
        replyTo: replyingTo ? { id: replyingTo.id, text: replyingTo.text?.substring(0, 50), sender: replyingTo.sender } : null
      };
      push(ref(database, 'messages'), messageData);
      setImagePreview(null);
      setSelectedImage(null);
      setReplyingTo(null);
      playTacticalSound('send');
      return;
    }
    
    if (inputMessage.trim()) {
      const encryptedText = encryptMessage(inputMessage);
      const messageData = {
        id: crypto.randomUUID(),
        type: 'text',
        text: encryptedText,
        sender: role,
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        fullTimestamp: Date.now(),
        isEncrypted: true,
        status: 'sent',
        reactions: {},
        replyTo: replyingTo ? { id: replyingTo.id, text: decryptMessage(replyingTo.text)?.substring(0, 50), sender: replyingTo.sender } : null
      };
      
      push(ref(database, 'messages'), messageData);
      playTacticalSound('send');
      
      setInputMessage('');
      setReplyingTo(null);
      handleTyping(false);
    }
  };

  const handleTyping = (isTyping) => {
    const myTypingRef = ref(database, `typing/${role}`);
    set(myTypingRef, isTyping);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        set(myTypingRef, false);
      }, 2000);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setSelectedImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo, we'll just show file info (actual file upload would need Firebase Storage)
      const messageData = {
        id: crypto.randomUUID(),
        type: 'file',
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(2) + ' KB',
        fileType: file.type || 'unknown',
        sender: role,
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        fullTimestamp: Date.now(),
        status: 'sent',
        reactions: {}
      };
      push(ref(database, 'messages'), messageData);
      playTacticalSound('send');
    }
  };

  const handleReaction = (msg, emoji) => {
    if (!msg.firebaseKey) return;
    const updatedReactions = { ...(msg.reactions || {}) };
    
    if (updatedReactions[role] === emoji) {
      delete updatedReactions[role];
    } else {
      updatedReactions[role] = emoji;
    }
    
    update(ref(database, `messages/${msg.firebaseKey}`), { reactions: updatedReactions });
    setContextMenu(null);
    playTacticalSound('click');
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(recordingIntervalRef.current);
    // In a real app, we'd send the audio here
    const messageData = {
      id: crypto.randomUUID(),
      type: 'voice',
      duration: recordingTime,
      sender: role,
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      fullTimestamp: Date.now(),
      status: 'sent',
      reactions: {}
    };
    push(ref(database, 'messages'), messageData);
    setRecordingTime(0);
    playTacticalSound('send');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'sent': return <Check size={12} className="text-text-muted" />;
      case 'delivered': return <CheckCheck size={12} className="text-text-muted" />;
      case 'read': return <CheckCheck size={12} className="text-primary" />;
      default: return null;
    }
  };

  const renderMessage = (msg) => {
    const isSelf = msg.sender === role;
    
    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`flex ${isSelf ? 'justify-end' : 'justify-start'} group`}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({ msg, x: e.clientX, y: e.clientY });
        }}
      >
        <div className={`max-w-[75%] ${isSelf ? 'items-end' : 'items-start'} flex flex-col`}>
          {/* Reply Preview */}
          {msg.replyTo && (
            <div className={`text-[10px] px-3 py-1 mb-1 border-l-2 ${isSelf ? 'border-primary bg-primary/5' : 'border-secondary bg-secondary/5'}`}>
              <span className={isSelf ? 'text-primary' : 'text-secondary'}>{msg.replyTo.sender}</span>
              <span className="text-text-muted ml-2">{msg.replyTo.text}...</span>
            </div>
          )}
          
          {/* Sender & Time */}
          <div className="flex items-center gap-2 mb-1 text-[10px] text-text-muted uppercase tracking-wider">
            <span className={isSelf ? 'text-primary' : 'text-secondary'}>
              {isSelf ? 'YOU' : msg.sender}
            </span>
            <span>{msg.timestamp}</span>
            {msg.isEncrypted && <Lock size={8} />}
            {isSelf && getStatusIcon(msg.status)}
          </div>
          
          {/* Message Content */}
          <div 
            className={`relative p-3 border rounded-lg ${
              isSelf 
              ? 'bg-primary/10 border-primary text-text-main shadow-[0_0_15px_rgba(0,255,65,0.15)] rounded-tr-none' 
              : 'bg-bg-surface border-border-strong text-text-main rounded-tl-none'
            }`}
          >
            {msg.type === 'image' && (
              <div className="cursor-pointer" onClick={() => setShowImageModal(msg.imageData)}>
                <img 
                  src={msg.imageData} 
                  alt="Shared" 
                  className="max-w-[300px] max-h-[200px] object-cover rounded border border-border-strong"
                />
              </div>
            )}
            
            {msg.type === 'file' && (
              <div className="flex items-center gap-3 p-2 bg-bg-input border border-border-strong rounded">
                <Paperclip size={24} className="text-secondary" />
                <div>
                  <div className="text-sm font-bold">{msg.fileName}</div>
                  <div className="text-[10px] text-text-muted">{msg.fileSize}</div>
                </div>
              </div>
            )}
            
            {msg.type === 'voice' && (
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center text-secondary">
                  <Play size={18} />
                </button>
                <div className="flex-1 h-1 bg-bg-input rounded-full">
                  <div className="w-0 h-full bg-secondary rounded-full"></div>
                </div>
                <span className="text-xs text-text-muted">{formatTime(msg.duration)}</span>
              </div>
            )}
            
            {msg.type === 'text' && (
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                <DecryptedText text={msg.isEncrypted ? decryptMessage(msg.text) : msg.text} speed={15} />
              </div>
            )}
            
            {/* Reactions Display */}
            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
              <div className={`absolute -bottom-3 ${isSelf ? 'right-2' : 'left-2'} flex gap-1`}>
                {Object.entries(msg.reactions).map(([user, emoji]) => (
                  <span 
                    key={user} 
                    className="text-sm bg-bg-surface border border-border-strong rounded-full px-1.5 py-0.5 shadow-sm"
                    title={user}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Actions on Hover */}
          <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 mt-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
            <button 
              onClick={() => setReplyingTo(msg)}
              className="p-1 text-text-muted hover:text-primary transition-colors"
              title="Reply"
            >
              <Reply size={12} />
            </button>
            {REACTIONS.slice(0, 3).map(emoji => (
              <button 
                key={emoji}
                onClick={() => handleReaction(msg, emoji)}
                className="text-xs hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="flex flex-col h-full font-mono relative">
      {/* Hidden File Inputs */}
      <input type="file" ref={imageInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
      
      {/* Tactical Header */}
      <header className="bg-bg-surface border-b border-border-strong p-3 md:p-4 flex items-center justify-between shadow-hud z-20">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex flex-col">
            <h1 className="text-base md:text-lg font-bold text-primary tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">SECURE_CHANNEL_ALPHA</span>
              <span className="sm:hidden">SEC_CHAN</span>
            </h1>
            <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-[10px] text-text-muted uppercase">
              <span className="flex items-center gap-1">
                <Lock size={8} className="text-success" /> AES-256
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Wifi size={8} className="text-success" /> STRONG
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          {/* AI Analysis */}
          <div className="hidden lg:flex flex-col items-end text-right mr-2">
            <span className="text-[9px] text-text-muted uppercase tracking-widest">AI INTEL</span>
            <span className={`text-[10px] font-bold max-w-[150px] truncate ${threatLevel > 50 ? 'text-danger' : 'text-success'}`}>
              {threatAnalysis}
            </span>
          </div>
          
          {/* Threat Level */}
          <div className={`flex items-center gap-1 md:gap-2 px-2 py-1 border rounded-sm text-[10px] ${
            threatLevel > 50 
            ? 'bg-danger/10 border-danger text-danger animate-pulse' 
            : 'bg-bg-input border-border-strong text-success'
          }`}>
            <AlertTriangle size={12} />
            <span className="font-bold">{threatLevel}%</span>
          </div>

          {/* Active Users */}
          <div className="hidden sm:flex items-center gap-1 md:gap-2 px-2 py-1 bg-bg-input border border-border-strong rounded-sm text-[10px]">
            <Users size={12} className="text-secondary" />
            <span className="font-bold text-secondary">{activeUsers}</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-secondary"></span>
            </span>
          </div>

          <button 
            onClick={handleDownloadLogs}
            className="p-1.5 md:p-2 text-primary hover:bg-primary/10 border border-primary/50 transition-colors"
            title="Download Logs"
          >
            <Download size={14} />
          </button>

          <button 
            onClick={handleClearChat}
            className="p-1.5 md:p-2 text-danger hover:bg-danger/10 border border-danger/50 transition-colors"
            title="Clear Chat"
          >
            <Trash size={14} />
          </button>

          <button 
            onClick={onLogout}
            className="text-[10px] text-danger border border-danger/50 px-2 py-1.5 hover:bg-danger/10 transition-colors hidden sm:block"
          >
            EXIT
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Shield size={250} />
            </div>

            <AnimatePresence>
              {messages.map(msg => renderMessage(msg))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {Object.keys(typingUsers).length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-xs text-secondary"
              >
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span>{Object.keys(typingUsers).join(', ')} is typing...</span>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Preview */}
          <AnimatePresence>
            {replyingTo && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 py-2 bg-bg-surface border-t border-border-strong"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Reply size={14} className="text-primary" />
                    <span className="text-primary">Replying to {replyingTo.sender}</span>
                    <span className="text-text-muted truncate max-w-[200px]">
                      {replyingTo.type === 'text' ? decryptMessage(replyingTo.text) : `[${replyingTo.type}]`}
                    </span>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-bg-input rounded">
                    <X size={14} className="text-text-muted" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image Preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 py-2 bg-bg-surface border-t border-border-strong"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded border border-border-strong" />
                    <button 
                      onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-danger rounded-full flex items-center justify-center"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                  <span className="text-xs text-text-muted">Image ready to send</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="p-3 md:p-4 bg-bg-surface border-t border-border-strong z-20">
            {isRecording ? (
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-3 h-3 bg-danger rounded-full animate-pulse"></div>
                  <span className="text-danger font-bold">{formatTime(recordingTime)}</span>
                  <div className="flex-1 h-1 bg-bg-input rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-danger"
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                </div>
                <button
                  onClick={stopRecording}
                  className="h-12 px-6 bg-danger/10 border border-danger text-danger hover:bg-danger hover:text-white transition-all"
                >
                  STOP & SEND
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3 items-end">
                {/* Attachment Buttons */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="p-2 md:p-3 text-text-muted hover:text-secondary hover:bg-secondary/10 border border-border-strong transition-all"
                    title="Send Image"
                  >
                    <Image size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="hidden md:block p-2 md:p-3 text-text-muted hover:text-secondary hover:bg-secondary/10 border border-border-strong transition-all"
                    title="Send File"
                  >
                    <Paperclip size={18} />
                  </button>
                </div>
                
                {/* Message Input */}
                <div className="flex-1 relative">
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
                    placeholder="Type a secure message..."
                    className="w-full bg-bg-input border border-border-strong p-3 pr-12 text-text-main placeholder-text-muted focus:outline-none focus:border-primary transition-all text-sm resize-none h-[50px] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                  >
                    <Smile size={18} />
                  </button>
                  
                  {/* Emoji Picker */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full right-0 mb-2 bg-bg-surface border border-border-strong rounded-lg p-3 shadow-xl z-50 w-64"
                      >
                        {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                          <div key={category} className="mb-2">
                            <div className="text-[10px] text-text-muted uppercase mb-1">{category}</div>
                            <div className="flex flex-wrap gap-1">
                              {emojis.map(emoji => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    setInputMessage(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  className="text-lg hover:scale-125 hover:bg-bg-input p-1 rounded transition-all"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Voice / Send Button */}
                {inputMessage.trim() || imagePreview ? (
                  <button
                    type="submit"
                    className="h-[50px] px-4 md:px-6 bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-bg-main transition-all flex items-center justify-center gap-2 rounded-lg"
                  >
                    <Send size={18} />
                    <span className="hidden md:inline text-xs font-bold">SEND</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="h-[50px] px-4 md:px-6 bg-secondary/10 border border-secondary text-secondary hover:bg-secondary hover:text-bg-main transition-all flex items-center justify-center gap-2 rounded-lg"
                  >
                    <Mic size={18} />
                    <span className="hidden md:inline text-xs font-bold">VOICE</span>
                  </button>
                )}
              </form>
            )}
          </div>
        </div>

        {/* System Status Sidebar (Desktop Only) */}
        <div className="hidden lg:block h-full">
          <SystemStatus />
        </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-50 bg-bg-surface border border-border-strong rounded-lg shadow-xl p-2"
              style={{ left: contextMenu.x, top: contextMenu.y }}
            >
              <div className="flex gap-1 p-1">
                {REACTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(contextMenu.msg, emoji)}
                    className="text-xl p-1 hover:scale-125 hover:bg-bg-input rounded transition-all"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setReplyingTo(contextMenu.msg); setContextMenu(null); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-main hover:bg-bg-input transition-colors"
              >
                <Reply size={14} />
                Reply
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={showImageModal}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 p-2 bg-bg-surface rounded-full"
              onClick={() => setShowImageModal(null)}
            >
              <X size={24} className="text-text-main" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInterface;
