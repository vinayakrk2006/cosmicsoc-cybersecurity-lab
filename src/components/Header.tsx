import React from 'react';
import { ShieldAlert, Volume2, VolumeX, Download, RotateCcw, Award } from 'lucide-react';
import { UserProgress } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  progress: UserProgress;
  onReset: () => void;
  onExport: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigateToCert: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onReset,
  onExport,
  soundEnabled,
  onToggleSound,
  onNavigateToCert,
}) => {
  const currentLevelTitle =
    progress.level >= 6
      ? 'Senior Cyber Guardian'
      : progress.level >= 4
      ? 'SOC Tier 2 Analyst'
      : progress.level >= 2
      ? 'SOC Tier 1 Analyst'
      : 'Junior Security Trainee';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a1019]/90 backdrop-blur-md border-b border-[#1b283d] px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950/50">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap">
                COSMIC SOC
              </span>
              <span className="text-[11px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/40 text-cyan-400">
                LABS
              </span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Interactive Cybersecurity & Threat Simulation
            </span>
          </div>
        </div>

        {/* Zone 2: Live Progress & Telemetry */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2 bg-[#0e1724] border border-[#1e2e45] px-3 py-1.5 rounded-lg">
            <span className="text-amber-400 font-bold font-mono tabular-nums text-sm">
              {progress.xp} XP
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-medium hidden md:inline">
              Level {progress.level} · {currentLevelTitle}
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-400 hidden lg:inline">
              {progress.lessonsMastered}/35 mastered
            </span>
          </div>

          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            title={soundEnabled ? 'Mute audio FX' : 'Enable audio FX'}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onNavigateToCert();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 rounded-lg transition-colors whitespace-nowrap"
          >
            <Award className="w-3.5 h-3.5" />
            Certificate
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onExport();
            }}
            title="Export student training progress as JSON"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#131f30] hover:bg-[#1a2b42] border border-[#20324c] rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Export Progress</span>
          </button>

          <button
            onClick={() => {
              sound.playAlert();
              onReset();
            }}
            title="Reset training progress"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-300/80 hover:text-rose-200 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 rounded-lg transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
