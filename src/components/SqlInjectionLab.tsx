import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Code2,
  Lock,
  Unlock,
  CheckCircle2,
  HelpCircle,
  FileCode,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface SqlInjectionLabProps {
  onEarnXp: (xp: number) => void;
}

interface UserRecord {
  id: number;
  username: string;
  role: string;
  secret: string;
}

const MOCK_DATABASE: UserRecord[] = [
  { id: 1, username: 'admin', role: 'SUPERADMIN', secret: 'FLAG{cosmicsoc_sqli_auth_bypassed_2026}' },
  { id: 2, username: 'alice_sec', role: 'SECURITY_LEAD', secret: 'FLAG{alice_vault_key_9941}' },
  { id: 3, username: 'bob_dev', role: 'DEVELOPER', secret: 'FLAG{bob_git_token_8812}' },
  { id: 4, username: 'trainee_guest', role: 'GUEST', secret: 'FLAG{guest_sandbox_demo}' },
];

export const SqlInjectionLab: React.FC<SqlInjectionLabProps> = ({ onEarnXp }) => {
  const [usernameInput, setUsernameInput] = useState<string>("' OR '1'='1");
  const [passwordInput, setPasswordInput] = useState<string>("anything");
  const [isSecureMode, setIsSecureMode] = useState<boolean>(false);
  const [queryResults, setQueryResults] = useState<UserRecord[] | null>(null);
  const [executionMessage, setExecutionMessage] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'ast' | 'database'>('editor');
  const [hasSolved, setHasSolved] = useState<boolean>(false);

  // Objectives tracking in CodeMaster challenge style
  const [obj1Met, setObj1Met] = useState<boolean>(true); // Explored parameter
  const [obj2Met, setObj2Met] = useState<boolean>(false); // Bypassed auth
  const [obj3Met, setObj3Met] = useState<boolean>(false); // Tested Prepared Statement

  const rawQuery = isSecureMode
    ? `-- Prepared Statement Template\nPREPARE login_stmt FROM 'SELECT id, username, role, secret FROM users WHERE username = ? AND password = ?';\nEXECUTE login_stmt USING ${JSON.stringify(usernameInput)}, ${JSON.stringify(passwordInput)};`
    : `SELECT id, username, role, secret FROM users WHERE username = '${usernameInput}' AND password = '${passwordInput}';`;

  const handleExecuteQuery = () => {
    sound.playClick();

    if (isSecureMode) {
      setObj3Met(true);
      const matched = MOCK_DATABASE.filter(
        (u) => u.username === usernameInput && passwordInput === 'admin123'
      );
      setQueryResults(matched);
      if (matched.length > 0) {
        sound.playSuccess();
        setExecutionMessage('Prepared Statement safely executed with exact match. 1 row retrieved.');
      } else {
        sound.playAlert();
        setExecutionMessage(
          'Prepared Statement bound parameters as literals. Zero rows matched. Injection thwarted!'
        );
      }
    } else {
      const lower = usernameInput.toLowerCase();
      const isBypass =
        lower.includes("' or '1'='1") ||
        lower.includes("' or 1=1") ||
        lower.includes("' or 'a'='a") ||
        lower.includes("' union");

      if (isBypass) {
        sound.playSuccess();
        setObj2Met(true);
        setQueryResults(MOCK_DATABASE);
        setExecutionMessage(
          'SUCCESS: Authentication bypassed! Tautology evaluated to TRUE. All sensitive rows retrieved!'
        );
        if (!hasSolved) {
          setHasSolved(true);
          onEarnXp(150);
        }
      } else if (usernameInput === 'admin' && passwordInput === 'admin123') {
        sound.playSuccess();
        setQueryResults([MOCK_DATABASE[0]]);
        setExecutionMessage('Valid credential login successful.');
      } else {
        sound.playAlert();
        setQueryResults([]);
        setExecutionMessage('Login failed: Invalid credentials.');
      }
    }
  };

  const handleApplyPayload = (payload: string) => {
    sound.playClick();
    setUsernameInput(payload);
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* CodeMaster Challenge Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              CHALLENGE #03
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Web AppSec · OWASP Top 10 A03
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            SQL Injection Authentication Bypass & Prepared Statements
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            +150 XP Bounty
          </span>
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#0a1019] p-1 rounded-xl border border-[#1e2f47] text-xs">
            <button
              onClick={() => {
                sound.playClick();
                setIsSecureMode(false);
                setQueryResults(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                !isSecureMode
                  ? 'bg-rose-950 text-rose-300 border border-rose-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vulnerable Concatenation
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setIsSecureMode(true);
                setQueryResults(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                isSecureMode
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Secure Prepared Statement
            </button>
          </div>
        </div>
      </div>

      {/* CodeMaster Signature Split-Pane Challenge Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[580px]">
        {/* Left Pane: Challenge Briefing & Objectives (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e1724] border border-[#1b2b40] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>Mission Briefing</span>
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                The target enterprise authentication gateway constructs SQL queries dynamically using unescaped string concatenation:
              </p>
              <div className="p-2.5 rounded-lg bg-[#080d14] border border-[#182638] font-mono text-[11px] text-cyan-300 mt-2 break-all">
                SELECT * FROM users WHERE user = '$user' AND pass = '$pass'
              </div>
            </div>

            {/* Objectives Checklist (CodeMaster Style) */}
            <div className="p-3.5 rounded-xl bg-[#080d14] border border-[#182638] space-y-2.5">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Challenge Objectives:
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    Task 1: Identify injection entry point in the username parameter
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  {obj2Met ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <span className={obj2Met ? 'text-slate-200 line-through' : 'text-slate-300'}>
                    Task 2: Inject a boolean tautology payload (<code className="text-amber-300 font-mono">' OR '1'='1</code>) to bypass password checks
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  {obj3Met ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <span className={obj3Met ? 'text-slate-200 line-through' : 'text-slate-300'}>
                    Task 3: Switch to Prepared Statement mode to verify code-data separation
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Payloads Shelf */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">
                Quick Payload Injector:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["' OR '1'='1", "' OR 1=1 --", "admin' --", "' UNION SELECT 1, 'hacked', 'ROOT', 'leak' --"].map((p) => (
                  <button
                    key={p}
                    onClick={() => handleApplyPayload(p)}
                    className="px-2 py-1 text-[11px] font-mono bg-[#080d14] hover:bg-[#142338] border border-[#1e2e45] text-cyan-300 rounded-lg transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hint Accordion */}
          <div className="pt-3 border-t border-[#182638]">
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-cyan-300 font-medium transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? 'Hide Guidance Hint' : 'Need a hint?'}</span>
              </div>
              <span className="text-[10px] font-mono">0 pts cost</span>
            </button>
            {showHint && (
              <p className="mt-2 text-xs text-slate-400 leading-relaxed bg-[#080d14] p-3 rounded-lg border border-[#1a273b]">
                In SQL, quotes (<code className="text-white">'</code>) demarcate string literals. By entering <code className="text-cyan-300">' OR '1'='1</code>, the parsed WHERE clause becomes <code className="text-white">WHERE username = '' OR '1'='1' AND password = '...'</code>. Because '1'='1' is true, the entire boolean clause evaluates to TRUE!
              </p>
            )}
          </div>
        </div>

        {/* Right Pane: CodeMaster IDE & Terminal Console (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Top: Editor & Input Viewport */}
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-2xl overflow-hidden shadow-sm flex flex-col flex-1">
            {/* Tab Bar */}
            <div className="p-2 px-3 border-b border-[#182638] flex items-center justify-between bg-[#0a1018]">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                    activeTab === 'editor'
                      ? 'bg-[#142234] text-cyan-300 border border-cyan-800/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  login_form.html
                </button>
                <button
                  onClick={() => setActiveTab('ast')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                    activeTab === 'ast'
                      ? 'bg-[#142234] text-cyan-300 border border-cyan-800/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  query_engine.sql
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-500">
                SQLITE VIRTUAL IN-MEMORY
              </span>
            </div>

            {/* Tab Contents */}
            <div className="p-4 flex-1 space-y-4">
              {activeTab === 'editor' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      User Parameter (Input Field)
                    </label>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password Parameter
                    </label>
                    <input
                      type="text"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-[#080d14] rounded-xl p-3 border border-[#182638] font-mono text-xs text-cyan-300 overflow-x-auto min-h-[120px]">
                  <pre className="whitespace-pre-wrap">{rawQuery}</pre>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-mono">
                  Press <strong>Execute Query</strong> to test execution
                </span>

                <button
                  onClick={handleExecuteQuery}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md shadow-cyan-950/40"
                >
                  <Play className="w-3.5 h-3.5 text-slate-950" />
                  <span>Execute Query</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Pane: Test Execution Console & Output Results (CodeMaster Style) */}
          <div className="bg-[#080d14] border border-[#1b2b40] rounded-2xl p-4 font-mono text-xs shadow-inner space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#182638]">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-xs">TEST RESULTS CONSOLE</span>
              </div>
              <span className="text-[10px] text-slate-500">
                STATUS: {queryResults ? 'COMPLETED' : 'IDLE'}
              </span>
            </div>

            {executionMessage && (
              <div
                className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                  executionMessage.includes('SUCCESS') || executionMessage.includes('safely')
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800 text-rose-200'
                }`}
              >
                {executionMessage}
              </div>
            )}

            {/* Extracted Record Table */}
            {queryResults && queryResults.length > 0 && (
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#182638] text-slate-400 text-[10px]">
                      <th className="py-1 px-2">ID</th>
                      <th className="py-1 px-2">USERNAME</th>
                      <th className="py-1 px-2">ROLE</th>
                      <th className="py-1 px-2">VAULT KEY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131f2f]">
                    {queryResults.map((r) => (
                      <tr key={r.id}>
                        <td className="py-1.5 px-2 text-slate-400">{r.id}</td>
                        <td className="py-1.5 px-2 text-white font-bold">{r.username}</td>
                        <td className="py-1.5 px-2 text-cyan-300">{r.role}</td>
                        <td className="py-1.5 px-2 text-amber-300 font-bold">{r.secret}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
