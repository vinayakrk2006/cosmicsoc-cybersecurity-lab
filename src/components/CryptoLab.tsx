import React, { useState, useEffect } from 'react';
import {
  Binary,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Search,
  Lock,
  Unlock,
  Copy,
  Check,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface CryptoLabProps {
  onEarnXp: (xp: number) => void;
}

const RAINBOW_TABLE: Record<string, string> = {
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8': 'password',
  'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f': 'secret',
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918': 'admin',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9': 'admin123',
  'ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548': '123456',
};

export const CryptoLab: React.FC<CryptoLabProps> = ({ onEarnXp }) => {
  const [activeTab, setActiveTab] = useState<'hashing' | 'caesar' | 'base64'>('hashing');

  // Hashing state
  const [plainInput, setPlainInput] = useState<string>('password');
  const [saltInput, setSaltInput] = useState<string>('');
  const [sha256Hash, setSha256Hash] = useState<string>('');
  const [rainbowTarget, setRainbowTarget] = useState<string>('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
  const [rainbowResult, setRainbowResult] = useState<string | null>(null);

  // Caesar state
  const [caesarInput, setCaesarInput] = useState<string>('DEFEND THE PERIMETER AT ONCE');
  const [caesarShift, setCaesarShift] = useState<number>(13);

  // Base64 state
  const [b64Input, setB64Input] = useState<string>('user=admin;role=security_auditor');

  // Compute SHA-256 via Web Crypto
  useEffect(() => {
    async function computeHash() {
      const textToHash = saltInput ? `${saltInput}:${plainInput}` : plainInput;
      const encoder = new TextEncoder();
      const data = encoder.encode(textToHash);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setSha256Hash(hashHex);
    }
    computeHash();
  }, [plainInput, saltInput]);

  // Caesar Cipher transformation
  const applyCaesar = (str: string, shift: number) => {
    return str
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char;
      })
      .join('');
  };

  const handleCrackRainbow = () => {
    sound.playClick();
    const clean = rainbowTarget.trim().toLowerCase();
    if (RAINBOW_TABLE[clean]) {
      sound.playSuccess();
      setRainbowResult(`CRACKED: Plaintext is "${RAINBOW_TABLE[clean]}"`);
      onEarnXp(100);
    } else {
      sound.playAlert();
      setRainbowResult('HASH NOT FOUND: Likely fortified with cryptographic salting or high entropy.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2">
            <Binary className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Cryptography, Ciphers & Hash Cracker Lab
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Experiment with one-way SHA-256 hashes, rainbow table collisions, Caesar shifts, and Base64 encoding.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#0a1019] p-1 rounded-lg border border-[#1e2f47] text-xs">
          <button
            onClick={() => setActiveTab('hashing')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'hashing'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SHA-256 & Rainbow Tables
          </button>
          <button
            onClick={() => setActiveTab('caesar')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'caesar'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Caesar Shift
          </button>
          <button
            onClick={() => setActiveTab('base64')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'base64'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Base64 vs Encryption
          </button>
        </div>
      </div>

      {/* TAB 1: SHA-256 & Rainbow Tables */}
      {activeTab === 'hashing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hash Generator */}
            <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>SHA-256 Hash Generator (One-Way Function)</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Plaintext String
                  </label>
                  <input
                    type="text"
                    value={plainInput}
                    onChange={(e) => setPlainInput(e.target.value)}
                    className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Cryptographic Salt (Optional)
                    </label>
                    <button
                      onClick={() => setSaltInput(Math.random().toString(36).substring(2, 10))}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Generate Salt
                    </button>
                  </div>
                  <input
                    type="text"
                    value={saltInput}
                    onChange={(e) => setSaltInput(e.target.value)}
                    placeholder="e.g. s9@k!2q"
                    className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Resulting 256-bit Digest (Hex):
                  </label>
                  <div className="p-2.5 rounded bg-[#080d14] border border-[#182638] font-mono text-xs text-cyan-400 break-all">
                    {sha256Hash}
                  </div>
                </div>
              </div>
            </div>

            {/* Rainbow Table Lookup Cracker */}
            <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-400" />
                <span>Rainbow Table Collision Cracker</span>
              </h3>

              <p className="text-xs text-slate-400">
                A rainbow table is a precomputed dictionary of plaintext passwords and their corresponding cryptographic hashes.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target SHA-256 Hash to Crack:
                  </label>
                  <input
                    type="text"
                    value={rainbowTarget}
                    onChange={(e) => setRainbowTarget(e.target.value)}
                    className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-indigo-500 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCrackRainbow}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Lookup in Rainbow Table</span>
                  </button>

                  <button
                    onClick={() => {
                      setRainbowTarget(sha256Hash);
                      setRainbowResult(null);
                    }}
                    className="px-3 py-2 bg-[#142236] hover:bg-[#1a2d48] text-xs font-semibold text-slate-300 rounded-lg border border-[#203450]"
                  >
                    Use Hash from Left
                  </button>
                </div>

                {rainbowResult && (
                  <div
                    className={`p-3 rounded-lg border text-xs font-mono ${
                      rainbowResult.includes('CRACKED')
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-800 text-rose-200'
                    }`}
                  >
                    {rainbowResult}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#080d14] border border-[#1b2b40] rounded-xl p-4 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-cyan-400 font-mono">SOC Defense Note: Why Salting is Mandatory</span>
            <p className="text-slate-400 leading-relaxed">
              Without a unique random cryptographic salt, two users with the password "password" produce the identical hash (<code className="text-white">5e8848...</code>), allowing attackers to pre-compute lookup tables. With a unique 16-byte salt per user, rainbow tables become completely useless because every user requires its own billion-hash table!
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Caesar Shift */}
      {activeTab === 'caesar' && (
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#182638]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Caesar Substitution Shift Cipher
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              Shift Key: +{caesarShift} (ROT-{caesarShift})
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Plaintext Message:
              </label>
              <textarea
                value={caesarInput}
                onChange={(e) => setCaesarInput(e.target.value)}
                rows={3}
                className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-indigo-500 rounded-lg p-3 text-xs font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Shift Alphabet:</span>
                <span className="font-mono text-indigo-400">+{caesarShift} letters</span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                value={caesarShift}
                onChange={(e) => setCaesarShift(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Ciphertext Output:
              </label>
              <div className="p-3 rounded-lg bg-[#080d14] border border-[#182638] font-mono text-xs text-indigo-300 break-all leading-relaxed">
                {applyCaesar(caesarInput, caesarShift)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Base64 Encoding vs Encryption */}
      {activeTab === 'base64' && (
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#182638]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Base64 Encoding is NOT Encryption
            </h3>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded">
              CRITICAL DISTINCTION
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Many junior developers mistake Base64 encoding for encryption. Base64 is merely a binary-to-text representation intended to transport arbitrary bytes safely over 7-bit ASCII channels. It involves <strong>zero keys</strong> and <strong>zero confidentiality</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Plaintext / Token String:
              </label>
              <textarea
                value={b64Input}
                onChange={(e) => setB64Input(e.target.value)}
                rows={4}
                className="w-full bg-[#080d14] border border-[#1e2f47] focus:border-cyan-500 rounded-lg p-3 text-xs font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Base64 Encoded (Trivially reversible):
              </label>
              <div className="p-3 rounded-lg bg-[#080d14] border border-[#182638] font-mono text-xs text-cyan-300 break-all min-h-[96px]">
                {typeof window !== 'undefined' ? btoa(b64Input) : ''}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
