import React from 'react';
import {
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  Lock,
  Zap,
  ArrowRight,
  Trophy,
  ShieldAlert,
  Play,
  Terminal,
  Clock,
  Sparkles,
  Users,
} from 'lucide-react';
import { UserProgress, NavSection } from '../types';
import { sound } from '../utils/audio';
import { LEADERBOARD_USERS } from '../data/cyberData';

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
  const currentBaseXp = (progress.level - 1) * 200;
  const progressInLevel = Math.max(0, progress.xp - currentBaseXp);
  const levelPercent = Math.min(100, Math.round((progressInLevel / 200) * 100));

  const skillTracks = [
    { name: 'SQL Injection Defense & Prepared Statements', percent: 75, stars: '★★★' },
    { name: 'TCP/IP Protocol Analysis & SYN Floods', percent: 60, stars: '★★☆' },
    { name: 'Password Entropy & Offline Cracking', percent: 85, stars: '★★★' },
    { name: 'Phishing Detection & Email Forensics', percent: 70, stars: '★★☆' },
    { name: 'Incident Response & Threat Containment', percent: 65, stars: '★★☆' },
    { name: 'Cryptographic Ciphers & Rainbow Tables', percent: 45, stars: '★☆☆' },
  ];

  const featuredLabs = [
    {
      id: 'war-room' as NavSection,
      title: 'Real-Time Cyber Attack War Room',
      category: 'Live Incident Response',
      level: 'ADVANCED',
      duration: '15 min',
      xp: '+200 XP',
      desc: 'Triage active Layer 4 SYN flood DDoS and LockBit ransomware outbreak in real-time.',
      color: 'border-rose-500/40 hover:border-rose-500',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    },
    {
      id: 'sqli-lab' as NavSection,
      title: 'SQL Injection & Auth Bypass Sandbox',
      category: 'Web Application CTF',
      level: 'INTERMEDIATE',
      duration: '12 min',
      xp: '+150 XP',
      desc: 'Break out of SQL string literals with tautologies and patch queries with Prepared Statements.',
      color: 'border-emerald-500/40 hover:border-emerald-500',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    },
    {
      id: 'phishing-lab' as NavSection,
      title: 'Phishing Threat Triage & Header Forensics',
      category: 'Email Defense',
      level: 'INTERMEDIATE',
      duration: '10 min',
      xp: '+120 XP',
      desc: 'Inspect RFC 5322 headers, verify SPF/DKIM/DMARC alignment, and quarantine lookalike domains.',
      color: 'border-amber-500/40 hover:border-amber-500',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    },
    {
      id: 'password-lab' as NavSection,
      title: 'Password Entropy & Hashcat Cracker',
      category: 'Cryptography & Auth',
      level: 'BEGINNER',
      duration: '8 min',
      xp: '+100 XP',
      desc: 'Calculate Shannon entropy bits, test GPU crack times, and generate Diceware passphrases.',
      color: 'border-cyan-500/40 hover:border-cyan-500',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    },
  ];

  const topStudents = LEADERBOARD_USERS.slice(0, 3);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* CodeMaster Student Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#0c1828] via-[#0f2038] to-[#121c2d] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-xl shadow-cyan-950/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                ACADEMY COHORT 2026
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Level 5 · Senior Analyst Track
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {progress.userName || 'Vinayak'}! 🛡️
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your perimeter defense readiness is at <strong className="text-cyan-300">88%</strong>.
              {activeAttackCount > 0 ? (
                <span> There are <strong className="text-rose-400">{activeAttackCount} critical attack incidents</strong> active right now in the War Room awaiting triage.</span>
              ) : (
                <span> All perimeter nodes nominal. Ready to tackle next challenge.</span>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('war-room');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950/40"
              >
                <Flame className="w-4 h-4 text-slate-950 animate-pulse" />
                <span>Enter Attack War Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('learning-paths');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#121f30] hover:bg-[#18283e] border border-[#203450] text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Resume Course Curriculum</span>
              </button>
            </div>
          </div>

          {/* Weekly Streak & Activity Badge */}
          <div className="bg-[#080d14]/80 border border-[#1b2b40] rounded-2xl p-5 flex flex-col justify-between shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Daily Study Streak
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                7 Days
              </span>
            </div>

            {/* Mon-Sun tracker pills */}
            <div className="flex justify-between items-center gap-1.5 my-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold ${
                      i < 5
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : i === 5
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse'
                        : 'bg-[#101724] text-slate-600 border border-[#1a2638]'
                    }`}
                  >
                    {day}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#182638] flex items-center justify-between text-[11px] text-slate-400">
              <span>Goal: 50 XP / day</span>
              <span className="text-emerald-400 font-mono font-medium">100% Met</span>
            </div>
          </div>
        </div>
      </div>

      {/* CodeMaster KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total XP */}
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
                EXPERIENCE POINTS
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums mt-2">
              {progress.xp} <span className="text-xs text-slate-400 font-sans font-normal">XP</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Level {progress.level} · Next tier at {nextLevelXp} XP
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#182638]">
            <div className="w-full bg-[#162233] h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1.5">
              <span>{progressInLevel} / 200 XP</span>
              <span className="text-amber-300">Level {progress.level + 1}</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Lessons Mastered */}
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
                CURRICULUM LESSONS
              </span>
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums mt-2">
              {progress.lessonsMastered} <span className="text-xs text-slate-400 font-sans font-normal">/ 35</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Modules completed across 3 tracks
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#182638] flex items-center justify-between text-xs text-slate-400">
            <span>Overall completion</span>
            <span className="text-teal-400 font-mono font-bold">
              {Math.round((progress.lessonsMastered / 35) * 100)}%
            </span>
          </div>
        </div>

        {/* Metric 3: Exercises Passed */}
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
                CHALLENGES SOLVED
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums mt-2">
              {progress.exercisesPassed}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Hands-on lab CTFs & incidents
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#182638] flex items-center justify-between text-xs text-slate-400">
            <span>Incidents neutralized</span>
            <span className="text-emerald-400 font-mono font-bold">
              {progress.incidentsResolved} active
            </span>
          </div>
        </div>

        {/* Metric 4: Leaderboard Standing */}
        <div
          onClick={() => {
            sound.playClick();
            onNavigate('leaderboard');
          }}
          className="cursor-pointer bg-[#0e1724] border border-[#1b2b40] rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/40 transition-all group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
                COHORT RANKING
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono tabular-nums mt-2">
              #4 <span className="text-xs text-slate-400 font-sans font-normal">of 142</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Top 3% in Academy Defense League
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#182638] flex items-center justify-between text-xs text-cyan-400 font-semibold">
            <span>View Full Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* CodeMaster Featured Labs Grid (Course Cards) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Interactive Hands-On Cybersecurity Labs
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            4 Priority Labs Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredLabs.map((lab) => (
            <div
              key={lab.id}
              onClick={() => {
                sound.playClick();
                onNavigate(lab.id);
              }}
              className={`cursor-pointer bg-[#0e1724] border ${lab.color} rounded-2xl p-5 transition-all hover:bg-[#121e30] group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold border ${lab.badgeColor}`}>
                    {lab.level}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lab.duration}
                    </span>
                    <span className="text-amber-400 font-bold">{lab.xp}</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-cyan-400 mb-1">
                  {lab.category}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {lab.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {lab.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#182638] flex items-center justify-between text-xs">
                <span className="text-slate-400">Launch Sandbox Environment</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Start Lab <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Skill Map & Leaderboard Podium Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Skill Map (7 cols) */}
        <div className="lg:col-span-7 bg-[#0e1724] border border-[#1b2b40] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#182638]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Technical Skill Competency Map
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              Evaluated against MITRE & NIST
            </span>
          </div>

          <div className="space-y-3.5">
            {skillTracks.map((track) => (
              <div key={track.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{track.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 tabular-nums">{track.percent}%</span>
                    <span className="text-amber-400 font-mono tracking-widest text-[11px]">{track.stars}</span>
                  </div>
                </div>
                <div className="w-full bg-[#152233] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${track.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cohort Leaderboard Snippet (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e1724] border border-[#1b2b40] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#182638]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Cohort Top Performers
                </h3>
              </div>
              <button
                onClick={() => onNavigate('leaderboard')}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5 mt-2">
              {topStudents.map((student) => (
                <div
                  key={student.handle}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#090f18] border border-[#172538] hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 font-mono font-bold text-xs text-amber-400 text-center">
                      #{student.rank}
                    </div>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${student.avatarColor} flex items-center justify-center text-slate-950 font-bold text-xs shrink-0`}>
                      {student.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[120px]">
                        {student.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {student.tierTitle}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-bold text-amber-400">
                    {student.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('leaderboard');
            }}
            className="w-full py-2.5 bg-[#142338] hover:bg-[#1a2d46] text-cyan-300 font-bold text-xs rounded-xl border border-cyan-800/40 transition-colors flex items-center justify-center gap-2"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Academy Leaderboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
