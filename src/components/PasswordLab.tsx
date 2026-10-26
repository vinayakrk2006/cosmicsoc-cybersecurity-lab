import React, { useState } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Server,
  Zap,
  Check,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { calculatePasswordEntropy, generateDicewarePassphrase } from '../utils/entropy';
import { sound } from '../utils/audio';

interface PasswordLabProps {
  onEarnXp: (xp: number) => void;
}

export const PasswordLab: React.FC<PasswordLabProps> = ({ onEarnXp }) => {
  const [password, setPassword] = useState<string>('P@ssw0rd2026!');
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    rating: string;
    vulnerabilities: string[];
    aiInsight: string;
    recommendations: string[];
    samplePassphrase: string;
  } | null>(null);

  const entropyData = calculatePasswordEntropy(password);

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateDiceware = () => {
    sound.playClick();
    const newPass = generateDicewarePassphrase(4);
    setPassword(newPass);
    setAiAnalysis(null);
    onEarnXp(50);
  };

  const handleRequestAiAudit = async () => {
    sound.playClick();
    setIsLoadingAi(true);

    try {
      const res = await fetch('/api/ai/analyze-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          entropy: entropyData.entropyBits,
          estimatedCrackTime: entropyData.crackTimes.gpuRig,
          issues: entropyData.vulnerabilities,
        }),
      });

      const data = await res.json();
      setAiAnalysis(data);
      sound.playSuccess();
      onEarnXp(100);
    } catch (err) {
      console.error(err);
      setAiAnalysis({
        rating: entropyData.rating,
        vulnerabilities: entropyData.vulnerabilities,
        aiInsight:
          'Passphrases of 16+ characters derived from independent random dictionary words resist offline GPU hashcat cracking exponentially longer than short passwords relying on character substitutions.',
        recommendations: entropyData.recommendations,
        samplePassphrase: 'solar-falcon-quantum-shield-92',
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Password Strength & Cryptographic Entropy Lab
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyze password resiliency using Shannon entropy math, offline GPU cluster benchmarks, and AI vulnerability audits.
          </p>
        </div>

        <button
          onClick={handleGenerateDiceware}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/50 rounded-lg transition-colors whitespace-nowrap"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Generate Diceware Passphrase
        </button>
      </div>

      {/* Main Interactive Input & Gauge Card */}
      <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Enter Candidate Password or Passphrase to Audit
        </label>

        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              sound.playKeypress();
              setPassword(e.target.value);
            }}
            placeholder="Type a password (e.g. correct-horse-battery-staple)..."
            className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-cyan-500 rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none transition-colors pr-24"
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            <button
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
              className="p-1.5 rounded-md hover:bg-[#152336] text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            <button
              onClick={handleCopy}
              title="Copy password"
              className="p-1.5 rounded-md hover:bg-[#152336] text-slate-400 hover:text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Real-time Entropy Bar & Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Entropy Strength:</span>
              <span className={`font-bold font-mono ${entropyData.ratingColor}`}>
                {entropyData.rating.toUpperCase()} ({entropyData.entropyBits} bits)
              </span>
            </div>
            <span className="text-slate-400 font-mono">
              Pool Size: {entropyData.poolSize} characters
            </span>
          </div>

          <div className="w-full bg-[#162233] h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                entropyData.score >= 80
                  ? 'bg-emerald-400'
                  : entropyData.score >= 60
                  ? 'bg-cyan-400'
                  : entropyData.score >= 40
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${entropyData.score}%` }}
            />
          </div>
        </div>

        {/* Character Variety Breakdown Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span
            className={`px-2.5 py-1 rounded-md font-mono ${
              entropyData.charCounts.lower > 0
                ? 'bg-cyan-950/60 border border-cyan-800/60 text-cyan-300'
                : 'bg-[#121c29] border border-[#1c2c40] text-slate-500'
            }`}
          >
            Lowercase: {entropyData.charCounts.lower}
          </span>
          <span
            className={`px-2.5 py-1 rounded-md font-mono ${
              entropyData.charCounts.upper > 0
                ? 'bg-cyan-950/60 border border-cyan-800/60 text-cyan-300'
                : 'bg-[#121c29] border border-[#1c2c40] text-slate-500'
            }`}
          >
            Uppercase: {entropyData.charCounts.upper}
          </span>
          <span
            className={`px-2.5 py-1 rounded-md font-mono ${
              entropyData.charCounts.digits > 0
                ? 'bg-cyan-950/60 border border-cyan-800/60 text-cyan-300'
                : 'bg-[#121c29] border border-[#1c2c40] text-slate-500'
            }`}
          >
            Digits: {entropyData.charCounts.digits}
          </span>
          <span
            className={`px-2.5 py-1 rounded-md font-mono ${
              entropyData.charCounts.symbols > 0
                ? 'bg-cyan-950/60 border border-cyan-800/60 text-cyan-300'
                : 'bg-[#121c29] border border-[#1c2c40] text-slate-500'
            }`}
          >
            Symbols: {entropyData.charCounts.symbols}
          </span>
          <span className="px-2.5 py-1 rounded-md font-mono bg-[#121c29] border border-[#1c2c40] text-slate-400">
            Length: {password.length} chars
          </span>
        </div>
      </div>

      {/* Cracking Benchmark Matrix (Offline Brute-Force) */}
      <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Estimated Offline Brute-Force Cracking Time</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Node 1: Commodity Laptop */}
          <div className="bg-[#080d14] border border-[#1a283e] rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Single CPU Core</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mb-2">
              ~10,000,000 hashes / sec
            </div>
            <div className="text-lg font-bold font-mono text-slate-200">
              {entropyData.crackTimes.laptop}
            </div>
          </div>

          {/* Node 2: 8x RTX 4090 GPU Rig */}
          <div className="bg-[#080d14] border border-[#1a283e] rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Server className="w-4 h-4 text-amber-400" />
              <span>8x NVIDIA RTX 4090 Hashcat Rig</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mb-2">
              ~100,000,000,000 hashes / sec
            </div>
            <div className="text-lg font-bold font-mono text-amber-400">
              {entropyData.crackTimes.gpuRig}
            </div>
          </div>

          {/* Node 3: Supercomputer */}
          <div className="bg-[#080d14] border border-[#1a283e] rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Zap className="w-4 h-4 text-rose-400" />
              <span>State-Sponsored Supercomputer</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mb-2">
              ~100,000,000,000,000 hashes / sec
            </div>
            <div className="text-lg font-bold font-mono text-cyan-400">
              {entropyData.crackTimes.supercomputer}
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerabilities & Rule-Based Flaws */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identified Vulnerabilities */}
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Identified Structural Vulnerabilities</span>
          </h4>

          {entropyData.vulnerabilities.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-300">
              {entropyData.vulnerabilities.map((vuln, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{vuln}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Check className="w-4 h-4" />
              <span>Zero common dictionary patterns or keyboard walks detected.</span>
            </div>
          )}
        </div>

        {/* Security Recommendations */}
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Remediation & Best Practices</span>
          </h4>

          <ul className="space-y-2 text-xs text-slate-300">
            {entropyData.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400">·</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Security Specialist Audit */}
      <div className="bg-[#0b1320] border border-[#1b2e47] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Gemini AI Cryptographic Assessment</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Get personalized AI feedback evaluating dictionary attacks, hashcat mask vulnerability, and mnemonic advice.
            </p>
          </div>

          <button
            onClick={handleRequestAiAudit}
            disabled={isLoadingAi || !password}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-cyan-900/30 disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoadingAi ? 'Analyzing with Gemini...' : 'Request AI Security Audit'}</span>
          </button>
        </div>

        {aiAnalysis && (
          <div className="mt-4 pt-4 border-t border-[#18283e] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">AI Vulnerability Classification:</span>
              <span className="font-bold text-cyan-400 font-mono">
                {aiAnalysis.rating.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-[#080d14] p-3 rounded-lg border border-[#19273b]">
              {aiAnalysis.aiInsight}
            </p>

            <div className="bg-[#0e1724] border border-[#1a293d] rounded-lg p-3">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                Recommended Diceware Alternative:
              </span>
              <div className="flex items-center justify-between font-mono text-xs text-emerald-300 bg-[#080d14] px-3 py-2 rounded border border-[#142336]">
                <span>{aiAnalysis.samplePassphrase}</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setPassword(aiAnalysis.samplePassphrase);
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-200 underline"
                >
                  Adopt This
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
