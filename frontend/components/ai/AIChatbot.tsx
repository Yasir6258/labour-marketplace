'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { getAIChatbotResponse } from '@/lib/ai/aiService';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  HelpCircle,
  Zap,
  Minimize2
} from 'lucide-react';

import { useAuth } from '@/lib/context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AIChatbot: React.FC = () => {
  const { language } = useLanguage();
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  
  const isBroker = role === 'broker';

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Update initial welcome message when role or language changes
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'msg_init',
      sender: 'ai',
      text: isBroker
        ? (language === 'bn'
            ? '🤖 **আসসালামু আলাইকুম ব্রোকার! আমি ব্রোকার অপারেশনস এআই অ্যাসিস্ট্যান্ট।**\n\nভেরিফাইড ব্যাজ অর্জন, এডমিন পেমেন্ট রিকোয়েস্ট, শ্রমিক যুক্তকরণ বা ৳৫০০ রিফান্ড সংক্রান্ত যেকোনো প্রশ্ন আমাকে করুন!'
            : '🤖 **Hello Broker! I am your Broker Operations AI Assistant.**\n\nAsk me about unlocking your Verified Badge, submitting payment requests to admin, worker management, or ৳500 refund compliance!')
        : (language === 'bn'
            ? '🤖 **আসসালামু আলাইকুম! আমি লেবার.কম এআই অ্যাসিস্ট্যান্ট।**\n\n৳৫০০ টাকা ১০০% রিফান্ড নীতি, শ্রমিক মজুরি হিসাব বা নিকটস্থ ব্রোকার সম্পর্কিত যেকোনো প্রশ্ন আমাকে করতে পারেন!'
            : '🤖 **Hello! I am Labour.com AI Assistant.**\n\nAsk me anything about our ৳500 100% Refund Policy, labor rate estimates in BDT, or finding verified brokers near you!'),
      time: 'Just now'
    };
    setMessages([welcomeMsg]);
  }, [isBroker, language]);

  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = getAIChatbotResponse(text, language as 'en' | 'bn', role);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const quickPrompts = isBroker
    ? (language === 'bn' ? [
        'ভেরিফাইড ব্যাজ কীভাবে পাব?',
        'এডমিন পেমেন্ট রিকোয়েস্ট কীভাবে পাঠাব?',
        'এজেন্সিতে শ্রমিক কীভাবে যোগ করব?',
        '৳৫০০ রিফান্ড নিয়ম কীভাবে মানতে হবে?'
      ] : [
        'How to unlock Verified Badge?',
        'How to submit Payment Request to Admin?',
        'How to add & manage workers?',
        'How to comply with ৳500 refund rule?'
      ])
    : (language === 'bn' ? [
        '৳৫০০ টাকা রিফান্ড কীভাবে কাজ করে?',
        'ইলেকট্রিশিয়ান বা প্লাম্বারের মজুরি কত?',
        'ঢাকার মিরপুরে ব্রোকার কীভাবে পাব?',
        'এসক্রো পেমেন্ট কীভাবে নিরাপদ?'
      ] : [
        'How does ৳500 refund policy work?',
        'What are daily labor rates in BDT?',
        'Find verified brokers in Dhaka / Mirpur',
        'How does Escrow payment protect me?'
      ]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-extrabold text-xs shadow-2xl shadow-emerald-950 hover:scale-105 transition-all border border-emerald-400/40"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900/60 flex items-center justify-center text-emerald-300">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="block text-[11px] leading-tight font-black">Labour.com AI</span>
            <span className="block text-[9px] text-emerald-200 font-medium">Assistant Online</span>
          </div>
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
        </button>
      )}

      {/* EXPANDABLE CHATBOT WINDOW */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] glass-panel bg-slate-950/95 border border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative backdrop-blur-xl">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>{isBroker ? (language === 'bn' ? 'ব্রোকার এআই অ্যাসিস্ট্যান্ট' : 'Broker Operations AI Assistant') : 'Labour.com AI Assistant'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </h3>
                <p className="text-[10px] text-slate-400">{isBroker ? 'Agency Operations & Verification Help' : 'Bangladesh Local Market AI'}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] p-3 rounded-2xl space-y-1 ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}>
                  <div className="whitespace-pre-line leading-relaxed">
                    {m.text}
                  </div>
                  <span className="block text-[9px] opacity-60 text-right">{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-[11px] bg-slate-900/60 p-2 rounded-xl w-fit border border-slate-800">
                <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>AI is reasoning...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-[10px] whitespace-nowrap font-medium border border-slate-700/80 transition-colors shrink-0"
              >
                💡 {qp}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={language === 'bn' ? 'প্রশ্ন লিখুন (যেমন: ৫০০ টাকা রিফান্ড...)' : 'Type query (e.g., ৳500 refund...)'}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className={`p-2 rounded-xl text-white transition-all ${
                inputMsg.trim() ? 'gradient-bg shadow-md' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
