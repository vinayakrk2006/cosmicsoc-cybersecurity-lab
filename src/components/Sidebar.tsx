import React, { useState } from 'react';
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
  Trophy,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { NavSection } from '../types';
import { sound } from '../utils/audio';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  activeAttackCount?: number;
  lessonsMasteredCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  activeAttackCount = 2,
  lessonsMasteredCount = 3,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [dailyTaskDone, setDailyTaskDone] = useState<boolean>(false);

  const handleNav = (sec: NavSection) => {
    sound.playClick();
    onSelectSection(sec);
  };

  return (
    <aside
      className={`shrink-0 bg-[#090f18] border-r border-[#1a273b] p-3 flex flex-col justify-between transition-all duration-300 select-none overflow-y-auto ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="space-y-5">
        {/* Collapse Toggle */}
        <div className="flex items-center justify-between px-2 pt-1">
          {!collapsed && (
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500 font-bold">
              PORTAL NAVIGATION
            </span>
          )}
          <button
            onClick={() => {
              sound.playClick();
              setCollapsed(!collapsed);
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1 rounded-lg hover:bg-[#142234] text-slate-400 hover:text-slate-200 transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Group 1: Academic & Progress */}
        <div className="space-y-1">
          <button
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-left ${
              currentSection === 'dashboard'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => handleNav('learning-paths')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all text-left ${
              currentSection === 'learning-paths'
                ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 text-teal-400 shrink-0" />
              {!collapsed && <span>Curriculum & Quizzes</span>}
            </div>
            {!collapsed && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#101b2b] text-teal-300 border border-teal-800/40">
                {lessonsMasteredCount}/35
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('leaderboard')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all text-left ${
              currentSection === 'leaderboard'
                ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              {!collapsed && <span>Student Leaderboard</span>}
            </div>
            {!collapsed && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
                #4
              </span>
            )}
          </button>
        </div>

        {/* Group 2: Live War Room */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-1.5 text-[10px] font-mono tracking-wider uppercase text-cyan-400 font-bold">
              LIVE SIMULATION
            </div>
          )}
          <button
            onClick={() => handleNav('war-room')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
              currentSection === 'war-room'
                ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-200 font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Flame className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
              {!collapsed && <span>Attack War Room</span>}
            </div>
            {!collapsed && activeAttackCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold animate-pulse">
                {activeAttackCount} LIVE
              </span>
            )}
          </button>
        </div>

        {/* Group 3: Hands-On Cyber Labs & CTF Arena */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-1.5 text-[10px] font-mono tracking-wider uppercase text-slate-500 font-bold">
              HANDS-ON LABS
            </div>
          )}
          <div className="space-y-1">
            <button
              onClick={() => handleNav('password-lab')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                currentSection === 'password-lab'
                  ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                  : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
              {!collapsed && <span className="truncate">Password Entropy Lab</span>}
            </button>

            <button
              onClick={() => handleNav('phishing-lab')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                currentSection === 'phishing-lab'
                  ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                  : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
              }`}
            >
              <MailWarning className="w-4 h-4 text-amber-400 shrink-0" />
              {!collapsed && <span className="truncate">Phishing Threat Triage</span>}
            </button>

            <button
              onClick={() => handleNav('sqli-lab')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                currentSection === 'sqli-lab'
                  ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                  : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              {!collapsed && <span className="truncate">SQL Injection Lab</span>}
            </button>

            <button
              onClick={() => handleNav('xss-lab')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                currentSection === 'xss-lab'
                  ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                  : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4 text-sky-400 shrink-0" />
              {!collapsed && <span className="truncate">XSS Playground</span>}
            </button>

            <button
              onClick={() => handleNav('recon-lab')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                currentSection === 'recon-lab'
                  ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4 text-purple-400 shrink-0" />
              {!collapsed && <span className="truncate">Port Recon & Nmap</span>}
            </button>

            <button
              onClick={() => handleNav('crypto-lab')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                currentSection === 'crypto-lab'
                  ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                  : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
              }`}
            >
              <Binary className="w-4 h-4 text-indigo-400 shrink-0" />
              {!collapsed && <span className="truncate">Cipher & Hash Cracker</span>}
            </button>
          </div>
        </div>

        {/* Group 4: Student Hub & AI */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-1.5 text-[10px] font-mono tracking-wider uppercase text-slate-500 font-bold">
              STUDENT HUB
            </div>
          )}
          <div className="space-y-1">
            <button
              onClick={() => handleNav('ai-mentor')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                currentSection === 'ai-mentor'
                  ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-semibold'
                  : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
                {!collapsed && <span>AI Cyber Mentor</span>}
              </div>
              {!collapsed && (
                <span className="text-[9px] font-mono bg-cyan-900/60 text-cyan-300 px-1.5 py-0.5 rounded font-bold">
                  AI
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('certificates')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                currentSection === 'certificates'
                  ? 'bg-[#142236] border border-cyan-500/40 text-cyan-300 font-semibold'
                  : 'text-slate-300 hover:bg-[#121d2d] hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              {!collapsed && <span className="truncate">Badges & Certificate</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Mini Student Goal Card (CodeMaster Style) */}
      {!collapsed && (
        <div className="mt-4 pt-3 border-t border-[#18273b]">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#101b2a] to-[#0a121e] border border-[#1e2f47] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                DAILY MISSION
              </span>
              <span className="text-[10px] font-mono text-cyan-400">+50 XP</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Complete 1 incident containment or CTF challenge today.
            </p>
            <div className="w-full bg-[#182638] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: dailyTaskDone ? '100%' : '50%' }}
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-slate-400">
                {dailyTaskDone ? 'Goal completed' : '1 of 2 tasks done'}
              </span>
              <button
                onClick={() => {
                  sound.playSuccess();
                  setDailyTaskDone(true);
                }}
                disabled={dailyTaskDone}
                className="text-[10px] text-cyan-400 hover:text-cyan-200 font-semibold underline disabled:opacity-50 disabled:no-underline"
              >
                {dailyTaskDone ? 'Claimed' : 'Check Off'}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
