import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Search,
  ArrowUpRight,
  Shield,
  Star,
  Users,
  ChevronRight,
} from 'lucide-react';
import { LEADERBOARD_USERS, LeaderboardUser } from '../data/cyberData';
import { sound } from '../utils/audio';

interface LeaderboardProps {
  currentUserXp: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserXp }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'weekly' | 'league'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const users: LeaderboardUser[] = LEADERBOARD_USERS.map((u) => {
    if (u.isCurrentUser) {
      return { ...u, xp: currentUserXp };
    }
    return u;
  }).sort((a, b) => b.xp - a.xp).map((u, idx) => ({ ...u, rank: idx + 1 }));

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.tierTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = users.slice(0, 3);
  const currentUser = users.find((u) => u.isCurrentUser) || users[3];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Student Defense Leaderboard
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                CodeMaster Cyber Cohort Rankings · Live Threat Resolution Standing
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#0b121e] p-1 rounded-xl border border-[#1e2f47] text-xs">
          {[
            { id: 'all', label: 'Global All-Time' },
            { id: 'weekly', label: 'Weekly Sprint' },
            { id: 'league', label: 'Academy League' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as 'all' | 'weekly' | 'league');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current User Standing Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-[#0e1b2e] to-indigo-950/40 border border-cyan-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-cyan-950/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-extrabold text-base shadow-md">
            VK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                Rank #{currentUser.rank}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {currentUser.tierTitle} · {currentUser.badgesCount} Badges · {currentUser.accuracy}% Accuracy
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Points</div>
            <div className="text-lg font-extrabold font-mono text-amber-400">
              {currentUser.xp} XP
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-right">
            <div className="text-xs text-slate-400">Next Rank Gap</div>
            <div className="text-xs font-mono text-cyan-300 font-semibold">
              {top3[2].xp > currentUser.xp ? `+${top3[2].xp - currentUser.xp + 10} XP to Podium` : 'On Podium!'}
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Silver (Rank 2) */}
        {top3[1] && (
          <div className="bg-[#0e1724] border border-[#1e2f47] rounded-2xl p-5 flex flex-col items-center text-center relative order-2 md:order-1 mt-4 md:mt-6">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-400 text-slate-950 font-bold text-[10px] font-mono shadow-md">
              🥈 2ND PLACE
            </div>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${top3[1].avatarColor} flex items-center justify-center text-slate-950 font-black text-xl shadow-lg mt-1 mb-3`}>
              {top3[1].name.split(' ').map((n) => n[0]).join('')}
            </div>
            <h3 className="text-sm font-bold text-white">{top3[1].name}</h3>
            <span className="text-[11px] font-mono text-slate-400">{top3[1].handle}</span>
            <span className="text-xs text-cyan-400 mt-1">{top3[1].tierTitle}</span>
            <div className="mt-4 pt-3 border-t border-[#182638] w-full flex items-center justify-around text-xs">
              <span className="font-mono text-amber-400 font-bold">{top3[1].xp} XP</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{top3[1].accuracy}% ACC</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400 flex items-center gap-1 font-mono">
                <Flame className="w-3.5 h-3.5" />
                {top3[1].streak}d
              </span>
            </div>
          </div>
        )}

        {/* Gold (Rank 1) */}
        {top3[0] && (
          <div className="bg-gradient-to-b from-[#142338] to-[#0e1724] border-2 border-amber-500/60 rounded-2xl p-6 flex flex-col items-center text-center relative order-1 md:order-2 shadow-xl shadow-amber-500/10">
            <div className="absolute -top-3.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs font-mono shadow-md flex items-center gap-1">
              👑 1ST PLACE CHAMPION
            </div>
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${top3[0].avatarColor} flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl mt-2 mb-3 ring-4 ring-amber-400/20`}>
              {top3[0].name.split(' ').map((n) => n[0]).join('')}
            </div>
            <h3 className="text-base font-extrabold text-white">{top3[0].name}</h3>
            <span className="text-xs font-mono text-slate-400">{top3[0].handle}</span>
            <span className="text-xs text-amber-400 font-semibold mt-1">{top3[0].tierTitle}</span>
            <div className="mt-5 pt-3 border-t border-[#1c304a] w-full flex items-center justify-around text-xs">
              <span className="font-mono text-amber-300 font-extrabold text-sm">{top3[0].xp} XP</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 font-semibold">{top3[0].accuracy}% ACC</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400 flex items-center gap-1 font-mono font-bold">
                <Flame className="w-4 h-4" />
                {top3[0].streak}d
              </span>
            </div>
          </div>
        )}

        {/* Bronze (Rank 3) */}
        {top3[2] && (
          <div className="bg-[#0e1724] border border-[#1e2f47] rounded-2xl p-5 flex flex-col items-center text-center relative order-3 mt-4 md:mt-6">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-700 text-amber-100 font-bold text-[10px] font-mono shadow-md">
              🥉 3RD PLACE
            </div>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${top3[2].avatarColor} flex items-center justify-center text-slate-950 font-black text-xl shadow-lg mt-1 mb-3`}>
              {top3[2].name.split(' ').map((n) => n[0]).join('')}
            </div>
            <h3 className="text-sm font-bold text-white">{top3[2].name}</h3>
            <span className="text-[11px] font-mono text-slate-400">{top3[2].handle}</span>
            <span className="text-xs text-cyan-400 mt-1">{top3[2].tierTitle}</span>
            <div className="mt-4 pt-3 border-t border-[#182638] w-full flex items-center justify-around text-xs">
              <span className="font-mono text-amber-400 font-bold">{top3[2].xp} XP</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{top3[2].accuracy}% ACC</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400 flex items-center gap-1 font-mono">
                <Flame className="w-3.5 h-3.5" />
                {top3[2].streak}d
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cohort Full Roster Table */}
      <div className="bg-[#0e1724] border border-[#1b2b40] rounded-2xl overflow-hidden shadow-sm">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-[#182638] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Complete Cohort Roster ({filteredUsers.length} Analysts)
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or handle..."
              className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-cyan-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#182638] text-slate-400 font-mono text-[11px] bg-[#090f18]/60">
                <th className="py-3 px-4 w-16">Rank</th>
                <th className="py-3 px-4">Student Analyst</th>
                <th className="py-3 px-4">Specialization Tier</th>
                <th className="py-3 px-4">Daily Streak</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#152233]">
              {filteredUsers.map((user) => (
                <tr
                  key={user.handle}
                  className={`transition-colors ${
                    user.isCurrentUser
                      ? 'bg-cyan-950/40 hover:bg-cyan-950/60 font-semibold'
                      : 'hover:bg-[#121f30]'
                  }`}
                >
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold text-xs ${
                        user.rank === 1
                          ? 'text-amber-400'
                          : user.rank === 2
                          ? 'text-slate-300'
                          : user.rank === 3
                          ? 'text-amber-600'
                          : 'text-slate-400'
                      }`}
                    >
                      #{user.rank}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-slate-950 font-bold text-xs shrink-0`}>
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-medium flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.isCurrentUser && (
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {user.handle}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-slate-300 text-xs">
                      {user.tierTitle}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-amber-400">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{user.streak} days</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    {user.accuracy}%
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-400 text-sm">
                    {user.xp} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
