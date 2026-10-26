import React, { useState } from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Download,
  RotateCcw,
  Award,
  Search,
  Flame,
  Bell,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';
import { UserProgress } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  progress: UserProgress;
  onReset: () => void;
  onExport: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigateToCert: () => void;
  onNavigateToLeaderboard: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onReset,
  onExport,
  soundEnabled,
  onToggleSound,
  onNavigateToCert,
  onNavigateToLeaderboard,
  onOpenSearch,
}) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  const nextLevelXp = progress.level * 200;
  const currentBaseXp = (progress.level - 1) * 200;
  const progressInLevel = Math.max(0, progress.xp - currentBaseXp);
  const levelPercent = Math.min(100, Math.round((progressInLevel / 200) * 100));

  const currentLevelTitle =
    progress.level >= 6
      ? 'Senior Cyber Guardian'
      : progress.level >= 4
      ? 'SOC Tier 2 Analyst'
      : progress.level >= 2
      ? 'SOC Tier 1 Analyst'
      : 'Junior Security Trainee';

  const notifications = [
    { id: 1, title: 'Critical Alert: Layer 4 SYN Flood', time: '5m ago', unread: true },
    { id: 2, title: 'Achievement: Injection Terminator unlocked', time: '1h ago', unread: false },
    { id: 3, title: 'New Threat Advisory: Log4j CVE patch live', time: '3h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090f18]/95 backdrop-blur-xl border-b border-[#1b2b40] px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                CosmicSOC
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 font-bold">
                STUDENT LMS
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline leading-none mt-0.5">
              CodeMaster Cybersecurity Lab
            </span>
          </div>
        </div>

        {/* Center: Search & Command Palette Bar (CodeMaster Style) */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <button
            onClick={() => {
              sound.playClick();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-[#0c1420] hover:bg-[#111c2c] border border-[#1e2f47] rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span>Search labs, challenges, CVEs...</span>
            </div>
            <kbd className="font-mono text-[10px] bg-[#142336] text-slate-400 px-1.5 py-0.5 rounded border border-[#1e324a]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Gamified Stats & Profile (CodeMaster Student HUD) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Daily Streak Counter */}
          <div
            title="7-Day Active Study Streak"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold"
          >
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>7d Streak</span>
          </div>

          {/* XP & Level Pill with Progress Bar */}
          <div
            onClick={onNavigateToLeaderboard}
            className="cursor-pointer flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0e1724] border border-[#1e2f47] hover:border-cyan-500/50 transition-colors"
          >
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold font-mono text-amber-400 tabular-nums">
                {progress.xp} XP
              </span>
              <span className="text-[10px] font-mono text-cyan-300">
                Lv. {progress.level}
              </span>
            </div>

            <div className="w-10 bg-[#162438] h-1.5 rounded-full overflow-hidden hidden sm:block">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            title={soundEnabled ? 'Mute audio FX' : 'Enable audio FX'}
            className="p-2 rounded-xl hover:bg-[#142234] text-slate-400 hover:text-slate-200 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-xl hover:bg-[#142234] text-slate-400 hover:text-slate-200 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0c1420] border border-[#1f314a] p-3 shadow-2xl z-50 text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#18273b]">
                  <span className="font-bold text-white">Security Bulletins</span>
                  <span className="text-[10px] font-mono text-cyan-400">3 new</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-lg bg-[#111c2b] hover:bg-[#152438] transition-colors"
                    >
                      <div className="font-semibold text-slate-200">{n.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Chip */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-[#121f30] border border-transparent hover:border-[#1e2f47] transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm">
                VK
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0c1420] border border-[#1f314a] p-2 shadow-2xl z-50 text-xs space-y-1">
                <div className="p-2.5 border-b border-[#18273b]">
                  <div className="font-bold text-white">{progress.userName || 'Vinayak K Putti'}</div>
                  <div className="text-[11px] text-cyan-400">{currentLevelTitle}</div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setShowProfileMenu(false);
                    onNavigateToCert();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#142336] text-slate-300 hover:text-white flex items-center gap-2"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Certificate</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setShowProfileMenu(false);
                    onNavigateToLeaderboard();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#142336] text-slate-300 hover:text-white flex items-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cohort Leaderboard</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setShowProfileMenu(false);
                    onExport();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#142336] text-slate-300 hover:text-white flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export Progress JSON</span>
                </button>

                <div className="pt-1 border-t border-[#18273b]">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onReset();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-300 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reset Training</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
