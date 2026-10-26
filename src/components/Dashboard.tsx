import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';
import { UserProgress, NavSection } from '../types';
import { sound } from '../utils/audio';

interface DashboardProps {
  progress: UserProgress;
  onNavigate: (section: NavSection) => void;
  activeAttackCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onNavigate,
  activeAttackCount,
}) => {
  const nextLevelXp = progress.level * 200;
  const currentLevelBaseXp = (progress.level - 1) * 200;
  const xpInCurrentLevel = Math.max(0, progress.xp - currentLevelBaseXp);
  const xpNeededForNext = 200;
  const levelProgressPct = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

  const skillTracks = [
    { name: 'SQL Injection & Database Security', percent: 75, stars: '★★★' },
    { name: 'Network Defense & Protocol Analysis', percent: 45, stars: '★★☆' },
    { name: 'Authentication & Password Entropy', percent: 80, stars: '★★★' },
    { name: 'Phishing Detection & Email Forensics', percent: 60, stars: '★★☆' },
    { name: 'Incident Response & Threat Containment', percent: 50, stars: '★★☆' },
    { name: 'Cryptographic Ciphers & Hash Verification', percent: 35, stars: '★☆☆' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title block matching the reference screenshot layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            CosmicSOC Interactive Analyst Training · Threat Operations
          </p>
        </div>

        {activeAttackCount > 0 && (
          <button
            onClick={() => {
              sound.playAlert();
              onNavigate('war-room');
            }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs font-semibold hover:bg-rose-900/70 transition-all shadow-sm"
          >
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>{activeAttackCount} Critical Threats Underway in War Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* OVERVIEW Section */}
      <div>
        <div className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-semibold mb-3 flex items-center gap-1.5">
          <span>■</span>
          <span>OVERVIEW</span>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Lessons Mastered */}
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {progress.lessonsMastered}
              </div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide mt-1">
                LESSONS MASTERED
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                of 35 total · 8 visited
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#182638] flex items-center justify-between text-[11px] text-slate-400">
              <span>Curriculum progress</span>
              <span className="text-cyan-400 font-mono font-medium">
                {Math.round((progress.lessonsMastered / 35) * 100)}%
              </span>
            </div>
          </div>

          {/* Card 2: Total XP & Level */}
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                {progress.xp}
              </div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide mt-1">
                TOTAL XP — LEVEL {progress.level}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Next level at {nextLevelXp} XP
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#182638]">
              <div className="w-full bg-[#162233] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1.5">
                <span>{xpInCurrentLevel} / {xpNeededForNext} XP</span>
                <span className="text-amber-300">Lv {progress.level + 1}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Exercises Passed */}
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {progress.exercisesPassed}
              </div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide mt-1">
                EXERCISES PASSED
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Hands-on challenges completed
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#182638] flex items-center justify-between text-[11px] text-slate-400">
              <span>Incidents resolved</span>
              <span className="text-emerald-400 font-mono font-medium">
                {progress.incidentsResolved} active
              </span>
            </div>
          </div>

          {/* Card 4: Achievements */}
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">
                {progress.badges.length}
              </div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide mt-1">
                ACHIEVEMENTS
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                of 14 badges available
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#182638] flex items-center justify-between text-[11px] text-slate-400">
              <span>SOC Status</span>
              <span className="text-cyan-300 font-medium">
                {progress.xp >= 800 ? 'Certified' : 'In Training'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTINUE LEARNING QUICK ACTION */}
      <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5">
        <div className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-semibold mb-2 flex items-center gap-1.5">
          <span>▶</span>
          <span>CONTINUE LEARNING</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              Defend Against Live Volumetric SYN Flood Assault
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Module: Cyber Defense War Room · Layer 4 Mitigation · Intermediate
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('war-room');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-500/20"
          >
            <span>Resume Simulation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QUICK LABS JUMP GRID */}
      <div>
        <div className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-semibold mb-3 flex items-center gap-1.5">
          <span>■</span>
          <span>INTERACTIVE CYBER LABS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate('password-lab')}
            className="cursor-pointer bg-[#0e1724] hover:bg-[#131f30] border border-[#1b2b40] hover:border-cyan-500/40 rounded-xl p-4 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Password Entropy & Cracking</h4>
            <p className="text-xs text-slate-400 mt-1">
              Calculate Shannon entropy, test dictionary resistance, and estimate crack times across GPU rigs.
            </p>
          </div>

          <div
            onClick={() => onNavigate('phishing-lab')}
            className="cursor-pointer bg-[#0e1724] hover:bg-[#131f30] border border-[#1b2b40] hover:border-amber-500/40 rounded-xl p-4 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Phishing Threat Triage</h4>
            <p className="text-xs text-slate-400 mt-1">
              Inspect suspicious corporate email headers (SPF/DKIM), link lookalikes, and quarantine lures.
            </p>
          </div>

          <div
            onClick={() => onNavigate('sqli-lab')}
            className="cursor-pointer bg-[#0e1724] hover:bg-[#131f30] border border-[#1b2b40] hover:border-emerald-500/40 rounded-xl p-4 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">SQL Injection Sandbox</h4>
            <p className="text-xs text-slate-400 mt-1">
              Simulate vulnerable login bypasses, payload tautologies, and patch with Prepared Statements.
            </p>
          </div>
        </div>
      </div>

      {/* SKILL MAP SECTION (matches screenshot format) */}
      <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5">
        <div className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-semibold mb-4 flex items-center gap-1.5">
          <span>■</span>
          <span>SKILL MAP</span>
        </div>

        <div className="space-y-4">
          {skillTracks.map((track) => (
            <div key={track.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="w-64 text-xs font-medium text-slate-300 truncate">
                {track.name}
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className="w-full bg-[#152233] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${track.percent}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-400 w-10 text-right tabular-nums">
                  {track.percent}%
                </span>
                <span className="text-xs text-amber-400 font-mono tracking-widest w-12 text-right">
                  {track.stars}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
