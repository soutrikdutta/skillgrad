import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Sparkles, Send, X, Minimize2, Maximize2, Trash2, 
  Copy, Check, MessageSquare, ChevronDown, Award, Briefcase, 
  Building2, Clock, ShieldCheck, RefreshCw, AlertCircle
} from 'lucide-react';
import { sendChatMessage, SUGGESTED_PROMPTS } from '../services/geminiChatService';

const STORAGE_KEY = 'skillgrad_chat_messages';

export default function SkillGradChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true);
  
  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'initial-greeting',
        role: 'model',
        content: `Hi there! 👋 I'm **GradBot**, your dedicated **SkillGrad AI Assistant** powered by Google Gemini.\n\nHow can I help you today? You can ask me about finding 100% paid internships, tracking application statuses, verifying completion certificates, or employer features!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Persist messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Hide initial tooltip after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (customText = null) => {
    const text = (customText || inputMessage).trim();
    if (!text || isLoading) return;

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
      // Build history for model
      const history = messages
        .filter(m => m.id !== 'initial-greeting')
        .map(m => ({ role: m.role, content: m.content }));

      const botReplyText = await sendChatMessage(history, text);

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
          content: "I ran into a temporary hiccup communicating with Gemini. Please try asking again in a moment!",
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
        content: `Conversation cleared! ✨ How else can I assist your journey on **SkillGrad**?`,
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

  // Simple markdown renderer for bold, lists, and headers
  const renderFormattedContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Headers ###
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-white mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-white mt-2.5 mb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const text = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 my-0.5 leading-relaxed">
            {renderInlineMarkdown(text)}
          </li>
        );
      }
      // Numbered lists e.g. "1. "
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="ml-2 flex items-start gap-1.5 my-1 text-slate-200">
            <span className="text-indigo-400 font-semibold">{numMatch[1]}.</span>
            <span>{renderInlineMarkdown(numMatch[2])}</span>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Regular paragraph
      return (
        <p key={idx} className="my-0.5 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Inline formatting for **bold** and `code`
  const renderInlineMarkdown = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
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

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      
      {/* 1. FLOATING CHAT BUTTON (WHEN CLOSED) */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip Pill */}
          {showTooltip && (
            <div className="absolute -top-12 right-0 bg-slate-900/95 text-white border border-indigo-500/30 shadow-xl px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 whitespace-nowrap animate-bounce-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Ask SkillGrad AI</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
                className="text-slate-400 hover:text-white ml-0.5"
              >
                ×
              </button>
            </div>
          )}

          {/* Glowing Aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-all duration-300 animate-glow-pulse pointer-events-none" />

          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => { setIsOpen(true); setIsMinimized(false); setShowTooltip(false); }}
            className="relative w-14 h-14 rounded-full bg-[#0c101b] border border-indigo-500/50 hover:border-indigo-400 text-white flex items-center justify-center shadow-2xl shadow-indigo-950/80 transition-all duration-200 active:scale-95 cursor-pointer hover:scale-105"
            aria-label="Open SkillGrad AI Chatbot"
          >
            <div className="relative">
              <Bot className="w-7 h-7 text-indigo-300 group-hover:text-white transition-colors" />
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 absolute -top-1.5 -right-1.5 animate-pulse" />
            </div>
          </button>
        </div>
      )}

      {/* 2. CHAT WINDOW (WHEN OPEN) */}
      {isOpen && (
        <div 
          className={`relative bg-[#0c101c]/95 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/80 backdrop-blur-xl transition-all duration-300 overflow-hidden flex flex-col ${
            isMinimized 
              ? 'w-72 h-14 sm:w-80' 
              : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh]'
          }`}
          style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
        >
          {/* Header Ambient Glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500" />

          {/* HEADER */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-white/[0.08] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0c101c] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white font-display leading-none">GradBot</h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30">
                    Gemini 3.6
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <span>SkillGrad Platform AI</span>
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
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

          {/* EXPANDED CONTENT (Only shown when not minimized) */}
          {!isMinimized && (
            <>
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
                        <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5 text-indigo-300">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className={`relative group max-w-[85%] rounded-2xl p-3 sm:p-3.5 transition-all ${
                        isBot 
                          ? 'bg-slate-900/90 border border-white/[0.08] text-slate-200 rounded-tl-sm' 
                          : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-md shadow-indigo-600/20'
                      }`}>
                        {renderFormattedContent(msg.content)}
                        
                        {/* Timestamp & Copy button */}
                        <div className={`flex items-center gap-1.5 mt-1 text-[10px] ${isBot ? 'text-slate-500' : 'text-indigo-200/70'}`}>
                          <span>{msg.timestamp}</span>
                          {isBot && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(msg.content, index)}
                              title="Copy answer"
                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:text-slate-300 cursor-pointer"
                            >
                              {copiedIndex === index ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Thinking / Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 items-start justify-start animate-fadeIn">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-300">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-slate-900/90 border border-white/[0.08] text-slate-400 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[11px] text-slate-400">GradBot is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK SUGGESTIONS CAROUSEL */}
              {messages.length <= 2 && (
                <div className="px-3 py-2 bg-slate-950/60 border-t border-white/[0.04]">
                  <p className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider px-1">
                    Suggested Questions
                  </p>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {SUGGESTED_PROMPTS.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSendMessage(p.text)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.06] hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                      >
                        <span>{p.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* INPUT BAR */}
              <div className="p-3 bg-slate-900/90 border-t border-white/[0.08]">
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
                    placeholder="Ask GradBot about internships, certificates..."
                    disabled={isLoading}
                    className="flex-1 py-2.5 pl-3.5 pr-10 rounded-xl bg-slate-950/80 border border-white/[0.08] focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none transition-all"
                  />
                  
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="absolute right-1.5 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 px-1">
                  <span>Powered by Gemini 3.6 Flash</span>
                  <span>Enter ↵ to send</span>
                </div>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}
