import React, { useState, useEffect } from 'react';
import {
  Search,
  Flame,
  KeyRound,
  MailWarning,
  Database,
  Code2,
  Radio,
  Binary,
  GraduationCap,
  Bot,
  Award,
  Trophy,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';
import { NavSection } from '../types';
import { sound } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (section: NavSection) => void;
}

interface PaletteItem {
  id: NavSection;
  title: string;
  category: string;
  keywords: string;
  icon: React.ElementType;
}

const ITEMS: PaletteItem[] = [
  { id: 'dashboard', title: 'Dashboard & Progress Overview', category: 'Navigation', keywords: 'home overview stats xp', icon: LayoutDashboard },
  { id: 'war-room', title: 'Real-Time Attack Simulation War Room', category: 'Live Simulation', keywords: 'ddos syn flood ransomware incident c2', icon: Flame },
  { id: 'password-lab', title: 'Password Entropy & Offline Cracking Lab', category: 'Defensive Labs', keywords: 'hashcat brute force diceware shannon bits', icon: KeyRound },
  { id: 'phishing-lab', title: 'Phishing Threat Triage & Email Sandbox', category: 'Defensive Labs', keywords: 'spf dkim dmarc header spoof email lure', icon: MailWarning },
  { id: 'sqli-lab', title: 'SQL Injection & Prepared Statements Sandbox', category: 'CTF Sandboxes', keywords: 'database auth bypass tautology or 1=1 union', icon: Database },
  { id: 'xss-lab', title: 'Cross-Site Scripting (XSS) Playground', category: 'CTF Sandboxes', keywords: 'dom script cookie injection reflected stored', icon: Code2 },
  { id: 'recon-lab', title: 'Port Recon & Nmap Network Scanner', category: 'CTF Sandboxes', keywords: 'terminal nmap stealth scan syn port 21 22 23', icon: Radio },
  { id: 'crypto-lab', title: 'Cryptography, Rainbow Tables & Caesar Cipher', category: 'CTF Sandboxes', keywords: 'sha256 hash rainbow salt rot13 base64', icon: Binary },
  { id: 'learning-paths', title: 'Curriculum & Interactive Quizzes', category: 'Curriculum', keywords: 'lessons modules test mcq questions study', icon: GraduationCap },
  { id: 'leaderboard', title: 'Student Cohort Leaderboard & Rankings', category: 'Community', keywords: 'rank score top students podium competition', icon: Trophy },
  { id: 'ai-mentor', title: 'Sentinel — 24/7 AI Cyber Mentor', category: 'AI Intelligence', keywords: 'gemini chat question cve guidance advice', icon: Bot },
  { id: 'certificates', title: 'Badges & Level 1 SOC Certificate', category: 'Achievements', keywords: 'certification print award verified badge', icon: Award },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filtered = ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.keywords.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#0c1420] border border-[#1f314a] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-[#18273b] flex items-center gap-3">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a lab name, CVE, or keyword to jump directly..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd
            onClick={onClose}
            className="cursor-pointer font-mono text-[10px] bg-[#142336] hover:bg-[#1a2d44] text-slate-400 px-2 py-0.5 rounded border border-[#1e324a]"
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    onSelect(item.id);
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#142234] text-slate-300 hover:text-white flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#111c2a] border border-[#1e2f47] group-hover:border-cyan-500/40 flex items-center justify-center text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching cybersecurity labs or topics found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 px-4 bg-[#090f18] border-t border-[#18273b] text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>Tip: Navigate directly to active labs</span>
          <span>CosmicSOC LMS</span>
        </div>
      </div>
    </div>
  );
};
