/**
 * Chat Modal Component
 * Full chat interface with message history and input
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ConversationState, SessionData } from '../logic/state';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
  options?: string[];
  showCTA?: boolean;
  ctaText?: string;
  ctaAction?: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentState, setCurrentState] = useState<ConversationState>('WELCOME');
  const [sessionData, setSessionData] = useState<SessionData>({ 
    conversationHistory: [],
    intakeMode: { mode: 'QUALIFICATION', userConsent: null, currentField: null, fieldsCollected: {}, fieldStatusMap: {}, transitionTimestamp: null, intakeStarted: false },
    bootstrapCompleted: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasLoadedMessages = useRef(false);
  
  // Load messages from sessionStorage on mount
  useEffect(() => {
    if (!hasLoadedMessages.current) {
      hasLoadedMessages.current = true;
      try {
        const saved = sessionStorage.getItem('chat_messages');
        if (saved) {
          setMessages(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load messages:', e);
      }
    }
  }, []);
  
  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem('chat_messages', JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to save messages:', e);
      }
    }
  }, [messages]);
  
  // Development kill-switch
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ ChatModal mounted successfully');
    }
  }, []);
  
  // Show greeting only ONCE when chat opens for the first time AND no messages exist
  useEffect(() => {
    if (isOpen && messages.length === 0 && hasLoadedMessages.current) {
      // Get page context
      const path = typeof window !== 'undefined' ? window.location.pathname : '/';
      
      // Natural, conversational greeting
      let greeting = "Hey there! 👋 ";
      
      if (path === '/' || path === '') {
        greeting += "I help businesses get set up and scale. Whether you're thinking about forming an LLC, need compliance help, or just want to know your options - I'm here. What's on your mind?";
      } else if (path.includes('services')) {
        greeting += "Looking at what we offer? I can break down any of our services or help you figure out what makes sense for your business. What are you curious about?";
      } else if (path.includes('starting-a-business')) {
        greeting += "Starting something new? Exciting! I can walk you through formation, registration, compliance - all of it. Where are you in the process?";
      } else if (path.includes('industries')) {
        greeting += "Checking out industry-specific solutions? Tell me about your business and I can show you how we help companies like yours.";
      } else if (path.includes('who-we-serve')) {
        greeting += "Want to know if we're a fit for you? Tell me a bit about your business and I'll let you know how we can help.";
      } else if (path.includes('contact')) {
        greeting += "Ready to talk? I can get you scheduled or answer any questions first. What works better for you?";
      } else {
        greeting += "I'm here to help with business formation, growth, compliance - whatever you need. What brings you here?";
      }
      
      setMessages([{
        role: 'bot',
        content: greeting,
        timestamp: Date.now()
      }]);
    }
  }, [isOpen, messages.length]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    // Add user message to UI
    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          currentState,
          sessionData
        })
      });
      
      const data = await response.json();
      
      console.log('assistant_messages_count:', 1); // Always exactly 1 message per turn
      
      // Add bot response to UI
      const botMessage: Message = {
        role: 'bot',
        content: data.message,
        timestamp: Date.now(),
        options: data.options,
        showCTA: data.showCTA,
        ctaText: data.ctaText,
        ctaAction: data.ctaAction
      };
      
      setMessages(prev => [...prev, botMessage]);
      setCurrentState(data.nextState);
      setSessionData(data.sessionData);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'bot',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  const handleOptionClick = (option: string) => {
    sendMessage(option);
  };
  
  const handleCTAClick = () => {
    sendMessage('Yes, schedule consultation');
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - only on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="bg-black/20 backdrop-blur-sm md:hidden"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              pointerEvents: 'auto'
            }}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              width: '360px',
              maxWidth: 'calc(100vw - 40px)',
              height: '600px',
              maxHeight: 'calc(100vh - 120px)',
              zIndex: 9999,
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
            className="bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Chat with us</div>
                  <div className="text-xs text-white/80">We're here to help</div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            {/* Messages */}
            <div 
              className="overflow-y-scroll p-4 space-y-4 bg-slate-50" 
              style={{ 
                flex: '1 1 0',
                minHeight: 0,
                overflowY: 'scroll',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}-${message.timestamp}`}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-900 shadow-sm'
                    }`}
                    style={message.role === 'user' ? {
                      backgroundColor: '#2563eb',
                      color: '#ffffff'
                    } : {}}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={message.role === 'user' ? {color: '#ffffff'} : {}}>{message.content}</p>
                    
                    {/* Quick reply options */}
                    {message.options && message.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.options.map((option, optIndex) => (
                          <button
                            key={optIndex}
                            onClick={() => handleOptionClick(option)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* CTA button */}
                    {message.showCTA && message.ctaText && (
                      <button
                        onClick={handleCTAClick}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {message.ctaText}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
              <p className="text-xs text-slate-500 mt-2 text-center">
                We don't provide legal or tax advice
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
