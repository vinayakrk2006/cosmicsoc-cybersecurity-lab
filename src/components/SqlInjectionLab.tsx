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
  CheckCircle,
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
  const [hasSolved, setHasSolved] = useState<boolean>(false);

  const rawQuery = isSecureMode
    ? `SELECT id, username, role, secret FROM users WHERE username = ? AND password = ?;\n-- Parameters: [${JSON.stringify(usernameInput)}, ${JSON.stringify(passwordInput)}]`
    : `SELECT id, username, role, secret FROM users WHERE username = '${usernameInput}' AND password = '${passwordInput}';`;

  const handleExecuteQuery = () => {
    sound.playClick();

    if (isSecureMode) {
      // Prepared Statement logic: only matches exact match
      const matched = MOCK_DATABASE.filter(
        (u) => u.username === usernameInput && passwordInput === 'admin123'
      );
      setQueryResults(matched);
      if (matched.length > 0) {
        sound.playSuccess();
        setExecutionMessage('Query executed via Prepared Statement. 1 exact record matched.');
      } else {
        sound.playAlert();
        setExecutionMessage(
          'Prepared Statement safely evaluated your input as a literal string. Zero records matched. Attack neutralized!'
        );
      }
    } else {
      // Vulnerable string concatenation logic
      const lower = usernameInput.toLowerCase();
      const isBypass =
        lower.includes("' or '1'='1") ||
        lower.includes("' or 1=1") ||
        lower.includes("' or 'a'='a") ||
        lower.includes("' union");

      if (isBypass) {
        sound.playSuccess();
        setQueryResults(MOCK_DATABASE);
        setExecutionMessage(
          'AUTHENTICATION BYPASS SUCCESSFUL: The injected tautology negated the password check. Full database records extracted!'
        );
        if (!hasSolved) {
          setHasSolved(true);
          onEarnXp(150);
        }
      } else if (usernameInput === 'admin' && passwordInput === 'admin123') {
        sound.playSuccess();
        setQueryResults([MOCK_DATABASE[0]]);
        setExecutionMessage('Standard legitimate user login successful.');
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              SQL Injection & Database Privilege Sandbox
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate dynamic query string concatenation vs parameterized prepared statements against a live in-memory database.
          </p>
        </div>

        {/* Toggle Mode: Vulnerable vs Parameterized */}
        <div className="flex items-center gap-2 bg-[#0a1019] p-1 rounded-lg border border-[#1e2f47]">
          <button
            onClick={() => {
              sound.playClick();
              setIsSecureMode(false);
              setQueryResults(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              !isSecureMode
                ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60 shadow-sm'
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
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              isSecureMode
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Secure Prepared Statement
          </button>
        </div>
      </div>

      {/* Target Web Form & Payload Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Input */}
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#182638]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Vulnerable Portal Login Form
            </h3>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isSecureMode
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {isSecureMode ? '🛡️ PROTECTED WITH PDO' : '⚠️ VULNERABLE STRING CONCAT'}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username / Email Input
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password Input
              </label>
              <input
                type="text"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
              />
            </div>

            <button
              onClick={handleExecuteQuery}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Execute SQL Query</span>
            </button>
          </div>

          {/* Quick Payloads */}
          <div className="pt-3 border-t border-[#182638]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Common SQL Injection Payloads:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "' OR '1'='1",
                "' OR 1=1 --",
                "admin' --",
                "' UNION SELECT 1, 'hacked', 'ROOT', 'leak' --",
              ].map((payload) => (
                <button
                  key={payload}
                  onClick={() => handleApplyPayload(payload)}
                  className="px-2 py-1 text-[11px] font-mono bg-[#080d14] hover:bg-[#142338] border border-[#1e2e45] text-cyan-300 rounded transition-colors"
                >
                  {payload}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Query Parser & AST Breakdown */}
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#182638]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Live Query Parser Visualizer</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">SQL ENGINE</span>
            </div>

            <div className="bg-[#080d14] rounded-lg p-3 font-mono text-xs text-slate-200 border border-[#18263a] leading-relaxed overflow-x-auto">
              <pre className="text-cyan-300 whitespace-pre-wrap">{rawQuery}</pre>
            </div>

            <div className="mt-3 text-xs text-slate-400 leading-relaxed space-y-2">
              <p>
                {isSecureMode ? (
                  <span className="text-emerald-300">
                    <strong>How Prepared Statements Defend:</strong> The SQL template is pre-compiled into a fixed binary parse tree on the database server. When parameter values arrive, they are treated strictly as data literals, rendering syntax injection impossible.
                  </span>
                ) : (
                  <span className="text-rose-300">
                    <strong>Vulnerability Mechanics:</strong> The attacker input contains a single quote (<code className="text-white">'</code>) that breaks out of the string boundary, transforming user input into an executable boolean condition (<code className="text-white">OR '1'='1'</code>).
                  </span>
                )}
              </p>
            </div>
          </div>

          {executionMessage && (
            <div
              className={`p-3 rounded-lg border text-xs font-mono ${
                executionMessage.includes('SUCCESSFUL') || executionMessage.includes('1 exact')
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-800 text-rose-200'
              }`}
            >
              {executionMessage}
            </div>
          )}
        </div>
      </div>

      {/* Query Result Table */}
      {queryResults && (
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Database Returned Record Set ({queryResults.length} rows returned)
            </h3>
            {queryResults.length > 1 && (
              <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-bold">
                DATA EXFILTRATION DETECTED
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1a283e] text-slate-400 font-mono">
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Username</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Secret / Vault Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#152336] font-mono">
                {queryResults.map((row) => (
                  <tr key={row.id} className="hover:bg-[#121f30]">
                    <td className="py-2 px-3 text-slate-400">{row.id}</td>
                    <td className="py-2 px-3 text-white font-bold">{row.username}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#142336] text-cyan-300">
                        {row.role}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-amber-300">{row.secret}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
