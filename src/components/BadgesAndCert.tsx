import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  Lock,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  KeyRound,
  Fish,
  Flame,
  Database,
  Binary,
  Radio,
  FileCheck,
} from 'lucide-react';
import { UserProgress, Badge } from '../types';
import { BADGES_LIST } from '../data/cyberData';
import { sound } from '../utils/audio';

interface BadgesAndCertProps {
  progress: UserProgress;
  onUpdateUserName: (name: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Shield: ShieldCheck,
  KeyRound: KeyRound,
  Fish: Fish,
  Flame: Flame,
  Database: Database,
  Binary: Binary,
  Radio: Radio,
  Award: Award,
};

export const BadgesAndCert: React.FC<BadgesAndCertProps> = ({
  progress,
  onUpdateUserName,
}) => {
  const [studentName, setStudentName] = useState<string>(progress.userName || 'Vinayak K Putti');
  const isCertified = progress.xp >= 800;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Badges, Achievements & SOC Certification
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track earned milestones and verify your official CosmicSOC Junior Security Analyst Level 1 credential.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#131f30] hover:bg-[#1b2b40] border border-[#20324c] rounded-lg transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            Earned Security Badges ({progress.badges.length} / {BADGES_LIST.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Total XP: {progress.xp}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = progress.badges.includes(badge.id) || (badge.unlockedAtXp !== undefined && progress.xp >= badge.unlockedAtXp);
            const Icon = ICON_MAP[badge.iconName] || ShieldCheck;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-[#0e1724] border-cyan-500/50 shadow-sm shadow-cyan-950/40'
                    : 'bg-[#080d14] border-[#162232] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300'
                          : 'bg-[#101722] text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isUnlocked ? (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded font-bold">
                        UNLOCKED
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-white mb-1">
                    {badge.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#182638] text-[10px] font-mono text-slate-400">
                  {badge.unlockedAtXp !== undefined ? `Requires ${badge.unlockedAtXp} XP` : 'Lab Activity Goal'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Certificate Card (Printable) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            Digital Certificate of Completion
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Recipient Name:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                onUpdateUserName(e.target.value);
              }}
              className="bg-[#080d14] border border-[#1e2f47] rounded px-2 py-1 text-xs text-cyan-300 font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* Certificate Frame */}
        <div className="relative bg-[#070b12] border-2 border-cyan-500/60 rounded-2xl p-8 sm:p-12 text-center shadow-2xl overflow-hidden print:p-8 print:border-black print:text-black print:bg-white">
          {/* Subtle watermarked background grid */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top Seal & Crest */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>

          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold mb-1">
            COSMIC INNOVATORS COLLECTIVE · CYBER DEFENSE ACADEMY
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif mb-2 print:text-black">
            Certificate of Security Mastery
          </h2>

          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 print:text-slate-600">
            This document certifies that the named individual has demonstrated operational proficiency in core defensive and offensive cybersecurity domains.
          </p>

          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            PROUDLY PRESENTED TO
          </div>

          <div className="text-2xl sm:text-3xl font-bold font-sans text-cyan-300 underline decoration-cyan-500/40 decoration-2 underline-offset-8 mb-6 print:text-black">
            {studentName}
          </div>

          <div className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed mb-8 print:text-slate-800">
            For successfully completing interactive training modules across <strong>SQL Injection Defense</strong>, <strong>Real-Time Threat War Room Triage</strong>, <strong>Password Entropy Math</strong>, <strong>Phishing Forensics</strong>, and <strong>Port Reconnaissance</strong>.
          </div>

          {/* Certificate Signatures & Verification Hash */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#1b2b40] text-xs">
            <div>
              <div className="font-mono text-cyan-400 font-bold">LEVEL 1 CERTIFIED</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Credential Class</div>
            </div>

            <div>
              <div className="font-mono text-slate-200">2026-10-25</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Issue Date</div>
            </div>

            <div>
              <div className="font-mono text-cyan-400 font-semibold truncate">
                HASH: 8A4F-99D2-C05M-1C50C
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Verification Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
