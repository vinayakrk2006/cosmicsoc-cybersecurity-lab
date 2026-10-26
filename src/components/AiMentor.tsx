import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Terminal,
  RotateCcw,
  User,
  ShieldAlert,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const AiMentor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-01',
      role: 'model',
      content:
        'Greetings, Trainee. I am **Sentinel**, your AI SOC Lead & Cyber Mentor at CosmicSOC. I can explain attack mechanisms (MITRE ATT&CK, OWASP), analyze CVE vulnerabilities, review defensive playbooks, and provide guided hints for any of our CTF labs. What security vector shall we examine today?',
      timestamp: '21:34 UTC',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Understood. What further security questions do you have?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, modelMsg]);
      sound.playSuccess();
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          content:
            'Connection to Sentinel telemetry was interrupted. In defensive cybersecurity, always ensure least-privilege access, sanitize user inputs via prepared statements, and inspect mail headers for SPF/DKIM validation.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterPrompts = [
    'Explain the Log4j CVE-2021-44228 JNDI exploit',
    'How do SYN cookies protect against SYN Flood attacks?',
    'Why are prepared statements immune to SQL Injection?',
    'What is the difference between Reflected and Stored XSS?',
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Title block */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1b2b40] shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              Sentinel — AI Cyber Mentor
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            24/7 technical coach for threat triage, vulnerability mechanics, and defensive playbooks.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setMessages([messages[0]]);
          }}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 bg-[#0a111a] border border-[#1b2b40] rounded-xl p-4 overflow-y-auto space-y-4 font-sans text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'model' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-xl p-3.5 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-slate-950 font-medium'
                  : 'bg-[#0e1724] border border-[#1b2b40] text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1 opacity-70">
                <span className="font-bold font-mono">
                  {msg.role === 'user' ? 'TRAINEE' : 'SENTINEL AI'}
                </span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#142234] border border-[#213550] flex items-center justify-center text-slate-300 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Sentinel is analyzing threat intelligence...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips */}
      <div className="flex flex-wrap gap-1.5 shrink-0">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-[#0e1724] hover:bg-[#16253a] border border-[#1e2f47] text-slate-300 hover:text-white transition-colors truncate max-w-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Ask Sentinel about CVEs, exploit mechanics, or defensive containment..."
          className="flex-1 bg-[#080d14] border border-[#1e2f47] focus:border-cyan-500 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputText.trim()}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
