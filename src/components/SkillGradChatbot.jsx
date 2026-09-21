import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Sparkles, Send, X, Minimize2, Maximize2, Trash2, 
  Copy, Check, GripVertical, Award, Briefcase, 
  Building2, Clock, ShieldCheck, Volume2, VolumeX, ExternalLink,
  ChevronRight, Compass, ArrowRight, UserCheck
} from 'lucide-react';
import { sendChatMessage, SUGGESTED_PROMPTS } from '../services/geminiChatService';

const STORAGE_KEY = 'skillgrad_chat_messages';
const POS_STORAGE_KEY = 'skillgrad_bot_drag_position';
const SOUND_STORAGE_KEY = 'skillgrad_bot_sound_enabled';

// Subtle Web Audio API sound generator
function playChatChime(type = 'receive') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'send') {
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else {
      osc.frequency.setValueAtTime(560, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    }
  } catch (e) {}
}

export default function SkillGradChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem(SOUND_STORAGE_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  // Position state (Draggable anywhere on screen)
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem(POS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return {
            x: Math.max(12, Math.min(window.innerWidth - 72, parsed.x)),
            y: Math.max(12, Math.min(window.innerHeight - 76, parsed.y))
          };
        }
      }
    } catch (e) {}

    const defaultX = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - 76) : 320;
    const defaultY = typeof window !== 'undefined' ? Math.max(16, window.innerHeight - 84) : 560;
    return { x: defaultX, y: defaultY };
  });

  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'initial-greeting',
        role: 'model',
        content: `👋 Hi! I'm **GradBot**, your dedicated **SkillGrad AI Assistant** powered by Google Gemini.\n\nI can help you explore [100% Paid Internships](#opportunities), authenticate credentials in [Certificate Verification](#certifications), or guide companies on posting roles in [Hiring Partner Portal](#employer).\n\nWhat can I assist you with today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const dragInfoRef = useRef({ startX: 0, startY: 0, initX: 0, initY: 0, hasMoved: false });

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.max(12, Math.min(window.innerWidth - 72, prev.x)),
        y: Math.max(12, Math.min(window.innerHeight - 76, prev.y))
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persist messages & sound preference
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, soundEnabled.toString());
    } catch (e) {}
  }, [soundEnabled]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Hide initial tooltip
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // DRAGGING ENGINE FOR FLOATING BOT BUTTON
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: position.x,
      initY: position.y,
      hasMoved: false
    };

    const handlePointerMove = (moveEvt) => {
      const dx = moveEvt.clientX - dragInfoRef.current.startX;
      const dy = moveEvt.clientY - dragInfoRef.current.startY;

      if (Math.hypot(dx, dy) > 4) {
        dragInfoRef.current.hasMoved = true;
        setIsDragging(true);
      }

      const nextX = Math.max(12, Math.min(window.innerWidth - 72, dragInfoRef.current.initX + dx));
      const nextY = Math.max(12, Math.min(window.innerHeight - 76, dragInfoRef.current.initY + dy));

      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      setTimeout(() => setIsDragging(false), 50);

      if (!dragInfoRef.current.hasMoved) {
        setIsOpen(true);
        setIsMinimized(false);
        setShowTooltip(false);
      } else {
        setPosition(finalPos => {
          try {
            localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(finalPos));
          } catch (e) {}
          return finalPos;
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // DRAGGING ENGINE FOR CHAT WINDOW HEADER
  const handleHeaderPointerDown = (e) => {
    if (e.target.closest('button')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: position.x,
      initY: position.y,
      hasMoved: false
    };

    const handleHeaderMove = (moveEvt) => {
      const dx = moveEvt.clientX - dragInfoRef.current.startX;
      const dy = moveEvt.clientY - dragInfoRef.current.startY;

      if (Math.hypot(dx, dy) > 4) {
        dragInfoRef.current.hasMoved = true;
        setIsDragging(true);
      }

      const nextX = Math.max(12, Math.min(window.innerWidth - 72, dragInfoRef.current.initX + dx));
      const nextY = Math.max(12, Math.min(window.innerHeight - 76, dragInfoRef.current.initY + dy));

      setPosition({ x: nextX, y: nextY });
    };

    const handleHeaderUp = () => {
      window.removeEventListener('pointermove', handleHeaderMove);
      window.removeEventListener('pointerup', handleHeaderUp);
      setIsDragging(false);

      if (dragInfoRef.current.hasMoved) {
        setPosition(finalPos => {
          try {
            localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(finalPos));
          } catch (e) {}
          return finalPos;
        });
      }
    };

    window.addEventListener('pointermove', handleHeaderMove);
    window.addEventListener('pointerup', handleHeaderUp);
  };

  // Smooth Navigation Trigger for Markdown Links
  const handleNavClick = (href) => {
    if (!href) return;
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSendMessage = async (customText = null) => {
    const text = (customText || inputMessage).trim();
    if (!text || isLoading) return;

    if (soundEnabled) playChatChime('send');

    const userMsg = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'initial-greeting')
        .map(m => ({ role: m.role, content: m.content }));

      const botReplyText = await sendChatMessage(history, text);

      if (soundEnabled) playChatChime('receive');

      const botMsg = {
        id: 'bot-' + Date.now(),
        role: 'model',
        content: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'model',
          content: "I ran into a temporary hiccup connecting with Gemini. Try asking me again!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    const defaultMsg = [
      {
        id: 'initial-greeting',
        role: 'model',
        content: `Conversation refreshed! ✨ How else can I assist your journey on **SkillGrad**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(defaultMsg);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Rich Markdown Renderer with Interactive Action Buttons
  const renderFormattedContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-white mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-white mt-2.5 mb-1">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx} className="ml-4 list-disc text-slate-200 my-1 leading-relaxed">{renderInlineMarkdown(line.substring(2))}</li>;
      }
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="ml-2 flex items-start gap-1.5 my-1 text-slate-200">
            <span className="text-indigo-400 font-bold">{numMatch[1]}.</span>
            <span>{renderInlineMarkdown(numMatch[2])}</span>
          </div>
        );
      }
      if (!line.trim()) return <div key={idx} className="h-1.5" />;
      return <p key={idx} className="my-1 leading-relaxed">{renderInlineMarkdown(line)}</p>;
    });
  };

  const renderInlineMarkdown = (text) => {
    // Detect links [Title](#href) and bold **bold** and `code`
    const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|`.*?`)/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      // Interactive Button Link
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const title = linkMatch[1];
        const href = linkMatch[2];
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleNavClick(href)}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 my-0.5 mx-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-500/35 text-indigo-300 hover:text-white text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <span>{title}</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
          </button>
        );
      }

      // Bold
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }

      // Inline code
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }

      return part;
    });
  };

  // Dimensions & Window positioning
  const winWidth = typeof window !== 'undefined' ? Math.min(430, window.innerWidth * 0.94) : 430;
  const winHeight = isMinimized ? 56 : 590;
  
  let computedWinX = position.x - winWidth + 60;
  let computedWinY = position.y - winHeight + 60;

  if (typeof window !== 'undefined') {
    if (computedWinX < 12) computedWinX = Math.max(12, position.x);
    if (computedWinX + winWidth > window.innerWidth - 12) {
      computedWinX = window.innerWidth - winWidth - 12;
    }
    if (computedWinY < 12) computedWinY = Math.max(12, position.y + 68);
    if (computedWinY + winHeight > window.innerHeight - 12) {
      computedWinY = window.innerHeight - winHeight - 12;
    }
  }

  const filteredPrompts = activeCategory === 'All' 
    ? SUGGESTED_PROMPTS 
    : SUGGESTED_PROMPTS.filter(p => p.category === activeCategory);

  return (
    <>
      {/* 1. FLOATING CHAT BUTTON (WHEN CLOSED) */}
      {!isOpen && (
        <div 
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 9999,
            touchAction: 'none'
          }}
          className="select-none"
        >
          <div className="relative group">
            {/* Tooltip Pill */}
            {showTooltip && (
              <div className="absolute -top-12 right-0 bg-slate-900/95 text-white border border-indigo-500/30 shadow-xl px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 whitespace-nowrap animate-bounce-in pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Drag anywhere • Click to ask GradBot AI</span>
              </div>
            )}

            {/* Glowing Aura */}
            <div className={`absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full blur-md transition-all duration-300 pointer-events-none ${
              isDragging ? 'opacity-100 scale-110' : 'opacity-70 group-hover:opacity-100 animate-glow-pulse'
            }`} />

            {/* Draggable Trigger Button */}
            <div
              onPointerDown={handlePointerDown}
              className={`relative w-14 h-14 rounded-full bg-[#0c101b] border border-indigo-500/50 hover:border-indigo-400 text-white flex items-center justify-center shadow-2xl shadow-indigo-950/80 transition-transform select-none ${
                isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-105 active:scale-95'
              }`}
              title="Drag and place anywhere, or click to chat with GradBot"
              role="button"
              aria-label="SkillGrad AI Assistant (Draggable)"
            >
              <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-30 group-hover:opacity-70 transition-opacity">
                <GripVertical className="w-2.5 h-2.5 text-slate-400" />
              </div>

              <div className="relative">
                <Bot className="w-7 h-7 text-indigo-300 group-hover:text-white transition-colors" />
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 absolute -top-1.5 -right-1.5 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CHAT WINDOW (WHEN OPEN) */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            left: `${computedWinX}px`,
            top: `${computedWinY}px`,
            width: `${winWidth}px`,
            height: `${winHeight}px`,
            zIndex: 9999,
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden'
          }}
          className="bg-[#0c101c]/98 border border-indigo-500/35 rounded-2xl shadow-2xl shadow-black/90 backdrop-blur-2xl transition-all duration-200 overflow-hidden flex flex-col select-none"
        >
          {/* Top Rainbow Living Beam */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 animate-pulse" />

          {/* DRAGGABLE HEADER */}
          <div 
            onPointerDown={handleHeaderPointerDown}
            className="px-4 py-3 bg-slate-900/90 border-b border-white/[0.08] flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing select-none"
            title="Drag header to move chat window anywhere"
          >
            <div className="flex items-center gap-2.5">
              <GripVertical className="w-3.5 h-3.5 text-slate-500" />
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0c101c] rounded-full animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white font-display leading-none">GradBot AI</h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>SkillGrad Career & Hiring Advisor</span>
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Mute audio chimes" : "Enable audio chimes"}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>

              {!isMinimized && (
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* EXPANDED CONTENT */}
          {!isMinimized && (
            <>
              {/* Quick Navigation Shortcut Strip */}
              <div className="px-3 py-1.5 bg-slate-950/70 border-b border-white/[0.04] flex items-center justify-between text-[11px] overflow-x-auto no-scrollbar gap-2 shrink-0">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider shrink-0">Jump To:</span>
                <button
                  type="button"
                  onClick={() => handleNavClick('#opportunities')}
                  className="text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Briefcase className="w-3 h-3 text-cyan-400" /> Paid Roles
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('#certifications')}
                  className="text-slate-300 hover:text-amber-300 whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Award className="w-3 h-3 text-amber-400" /> Verify Cert
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('#employer')}
                  className="text-slate-300 hover:text-indigo-300 whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Building2 className="w-3 h-3 text-indigo-400" /> Post Job
                </button>
              </div>

              {/* MESSAGES SCROLL AREA */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth text-xs sm:text-[13px]">
                {messages.map((msg, index) => {
                  const isBot = msg.role === 'model';
                  return (
                    <div 
                      key={msg.id || index} 
                      className={`flex gap-2.5 items-start ${isBot ? 'justify-start' : 'justify-end'} animate-slide-up`}
                    >
                      {isBot && (
                        <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5 text-indigo-300 shadow-sm">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className={`relative group max-w-[85%] rounded-2xl p-3 sm:p-3.5 transition-all ${
                        isBot 
                          ? 'bg-slate-900/90 border border-white/[0.08] text-slate-200 rounded-tl-sm shadow-md shadow-black/40' 
                          : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-md shadow-indigo-600/20'
                      }`}>
                        {renderFormattedContent(msg.content)}
                        
                        {/* Timestamp & Copy button */}
                        <div className={`flex items-center justify-between gap-1.5 mt-1.5 pt-1 border-t border-white/[0.04] text-[10px] ${isBot ? 'text-slate-500' : 'text-indigo-200/70'}`}>
                          <span>{msg.timestamp}</span>
                          {isBot && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(msg.content, index)}
                              title="Copy answer"
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-slate-300 cursor-pointer"
                            >
                              {copiedIndex === index ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Thinking Indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 items-start justify-start animate-fadeIn">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-300 shadow-sm">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-slate-900/90 border border-white/[0.08] text-slate-400 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-2 shadow-md">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[11px] text-slate-400">GradBot is thinking live...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK SUGGESTIONS CAROUSEL */}
              {messages.length <= 4 && (
                <div className="px-3 py-2 bg-slate-950/60 border-t border-white/[0.04] shrink-0">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Quick Questions
                    </span>
                    <div className="flex gap-1 text-[10px]">
                      {['All', 'Students', 'Employers'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveCategory(cat)}
                          className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                            activeCategory === cat ? 'text-cyan-300 font-bold bg-white/5' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {filteredPrompts.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSendMessage(p.text)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.06] hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 shadow-sm"
                      >
                        <span>{p.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* INPUT BAR */}
              <div className="p-3 bg-slate-900/90 border-t border-white/[0.08] shrink-0">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex items-center gap-2 relative"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about paid internships, hiring students, certs..."
                    disabled={isLoading}
                    className="flex-1 py-2.5 pl-3.5 pr-10 rounded-xl bg-slate-950/80 border border-white/[0.08] focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none transition-all"
                  />
                  
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="absolute right-1.5 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95 shadow-md shadow-indigo-600/30"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 px-1">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                    <span>Gemini 3.6 Flash</span>
                  </span>
                  <a 
                    href="https://www.linkedin.com/in/soutrik-dutta-245b93372"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] text-slate-400 hover:text-cyan-300 font-mono transition-colors"
                  >
                    made by :- soutrik_2006
                  </a>
                  <span>Press Enter ↵</span>
                </div>
              </div>
            </>
          )}

        </div>
      )}
    </>
  );
}
