import React from 'react';
import {
  LayoutDashboard,
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
} from 'lucide-react';
import { NavSection } from '../types';
import { sound } from '../utils/audio';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  activeAttackCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  activeAttackCount = 2,
}) => {
  const handleNav = (sec: NavSection) => {
    sound.playClick();
    onSelectSection(sec);
  };

  return (
    <aside className="w-64 shrink-0 bg-[#090f17] border-r border-[#1a273b] p-3 flex flex-col gap-5 text-sm select-none overflow-y-auto">
      {/* Primary Dashboard Link */}
      <button
        onClick={() => handleNav('dashboard')}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium transition-all text-left ${
          currentSection === 'dashboard'
            ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
            : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </div>
        <span
          className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
            currentSection === 'dashboard'
              ? 'bg-amber-600/30 text-amber-950 font-extrabold'
              : 'bg-[#142336] text-slate-400'
          }`}
        >
          SOC
        </span>
      </button>

      {/* Section: Live Attack Simulation */}
      <div>
        <div className="px-3 mb-1.5 text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-semibold">
          LIVE SIMULATION
        </div>
        <button
          onClick={() => handleNav('war-room')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
            currentSection === 'war-room'
              ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 font-semibold shadow-sm shadow-cyan-950'
              : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Attack War Room</span>
          </div>
          {activeAttackCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800 text-rose-300">
              {activeAttackCount} LIVE
            </span>
          )}
        </button>
      </div>

      {/* Section: Core Defensive Tools */}
      <div>
        <div className="px-3 mb-1.5 text-[11px] font-mono tracking-wider uppercase text-slate-400 font-medium">
          DEFENSIVE LABS
        </div>
        <div className="space-y-1">
          <button
            onClick={() => handleNav('password-lab')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              currentSection === 'password-lab'
                ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span className="truncate">Password Entropy Lab</span>
          </button>

          <button
            onClick={() => handleNav('phishing-lab')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              currentSection === 'phishing-lab'
                ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <MailWarning className="w-4 h-4 text-amber-400" />
            <span className="truncate">Phishing Threat Triage</span>
          </button>
        </div>
      </div>

      {/* Section: Offensive & CTF Exploitation */}
      <div>
        <div className="px-3 mb-1.5 text-[11px] font-mono tracking-wider uppercase text-slate-400 font-medium">
          HANDS-ON CTF SANDBOXES
        </div>
        <div className="space-y-1">
          <button
            onClick={() => handleNav('sqli-lab')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              currentSection === 'sqli-lab'
                ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="truncate">SQL Injection Lab</span>
          </button>

          <button
            onClick={() => handleNav('xss-lab')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              currentSection === 'xss-lab'
                ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4 text-sky-400" />
            <span className="truncate">XSS Playground</span>
          </button>

          <button
            onClick={() => handleNav('recon-lab')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              currentSection === 'recon-lab'
                ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 text-purple-400" />
            <span className="truncate">Port Recon & Nmap</span>
          </button>

          <button
            onClick={() => handleNav('crypto-lab')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              currentSection === 'crypto-lab'
                ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <Binary className="w-4 h-4 text-indigo-400" />
            <span className="truncate">Cipher & Hash Cracker</span>
          </button>
        </div>
      </div>

      {/* Section: Learning Paths & AI Mentor */}
      <div>
        <div className="px-3 mb-1.5 text-[11px] font-mono tracking-wider uppercase text-slate-400 font-medium">
          CURRICULUM & ADVISOR
        </div>
        <div className="space-y-1">
          <button
            onClick={() => handleNav('learning-paths')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              currentSection === 'learning-paths'
                ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-teal-400" />
            <span className="truncate">Learning Paths & Quizzes</span>
          </button>

          <button
            onClick={() => handleNav('ai-mentor')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              currentSection === 'ai-mentor'
                ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <div className="flex items-center gap-1.5">
              <span>AI SOC Sentinel</span>
              <span className="text-[9px] font-mono bg-cyan-900/60 text-cyan-300 px-1 py-0.5 rounded">
                AI
              </span>
            </div>
          </button>

          <button
            onClick={() => handleNav('certificates')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
              currentSection === 'certificates'
                ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="truncate">Badges & Certificate</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
