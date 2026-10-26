import React, { useState } from 'react';
import {
  Radio,
  Terminal,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Server,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PortScannerLabProps {
  onEarnXp: (xp: number) => void;
}

interface TargetProfile {
  id: string;
  name: string;
  ip: string;
  os: string;
  ports: {
    port: number;
    protocol: string;
    state: string;
    service: string;
    version: string;
    risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SAFE';
    cveHint?: string;
  }[];
}

const TARGETS: TargetProfile[] = [
  {
    id: 'target-legacy',
    name: 'Legacy Accounting Server',
    ip: '172.16.4.88',
    os: 'Linux 3.2.0 (Ubuntu 12.04 LTS)',
    ports: [
      { port: 21, protocol: 'tcp', state: 'open', service: 'ftp', version: 'vsftpd 2.3.4', risk: 'CRITICAL', cveHint: 'CVE-2011-2523: Smiley face backdoor vulnerability grants instant root shell' },
      { port: 23, protocol: 'tcp', state: 'open', service: 'telnet', version: 'Linux telnetd', risk: 'HIGH', cveHint: 'Cleartext protocol transmits admin passwords in unencrypted packets' },
      { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'Apache httpd 2.2.22', risk: 'MEDIUM', cveHint: 'Outdated web server prone to directory traversal' },
      { port: 3306, protocol: 'tcp', state: 'open', service: 'mysql', version: 'MySQL 5.5.24', risk: 'HIGH', cveHint: 'Database listening on 0.0.0.0 WAN interface without TLS' },
    ],
  },
  {
    id: 'target-gateway',
    name: 'Edge Perimeter Router / Gateway',
    ip: '192.168.1.1',
    os: 'Embedded Linux (OpenWrt 21.02)',
    ports: [
      { port: 22, protocol: 'tcp', state: 'open', service: 'ssh', version: 'OpenSSH 8.4p1', risk: 'SAFE' },
      { port: 53, protocol: 'tcp', state: 'open', service: 'domain', version: 'dnsmasq 2.85', risk: 'SAFE' },
      { port: 443, protocol: 'tcp', state: 'open', service: 'https', version: 'nginx 1.18.0', risk: 'SAFE' },
      { port: 8080, protocol: 'tcp', state: 'open', service: 'http-proxy', version: 'Squid 4.13', risk: 'MEDIUM', cveHint: 'Open proxy allowed unauthenticated upstream requests' },
    ],
  },
];

export const PortScannerLab: React.FC<PortScannerLabProps> = ({ onEarnXp }) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string>(TARGETS[0].id);
  const [scanType, setScanType] = useState<string>('-sS -sV');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [hasScanned, setHasScanned] = useState<boolean>(false);

  const currentTarget = TARGETS.find((t) => t.id === selectedTargetId) || TARGETS[0];

  const handleStartScan = () => {
    sound.playClick();
    setIsScanning(true);
    setTerminalOutput([`Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-25 21:34 UTC`]);

    const logs: string[] = [
      `Initiating SYN Stealth Scan against ${currentTarget.ip}...`,
      `Scanning ${currentTarget.ip} [1000 ports]`,
      `Discovered open ports on ${currentTarget.ip}: 21, 23, 80, 3306`,
      `Completed SYN Stealth Scan in 1.42s`,
      `Initiating Service Version Detection...`,
      `Scanning 4 services on ${currentTarget.ip}`,
      `OS Detection: Guessed OS: ${currentTarget.os}`,
      `Nmap scan report for ${currentTarget.name} (${currentTarget.ip})`,
      `Host is up (0.0014s latency).`,
    ];

    let delay = 300;
    logs.forEach((line, idx) => {
      setTimeout(() => {
        sound.playKeypress();
        setTerminalOutput((prev) => [...prev, line]);
        if (idx === logs.length - 1) {
          setIsScanning(false);
          setHasScanned(true);
          sound.playSuccess();
          onEarnXp(110);
        }
      }, delay);
      delay += 350;
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Port Recon & Network Scanner Lab (Nmap CLI)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Execute active TCP SYN stealth scans, probe open network daemon ports, and audit legacy services.
          </p>
        </div>

        {/* Scan Command Action */}
        <button
          onClick={handleStartScan}
          disabled={isScanning}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isScanning ? 'Scanning Target...' : 'Execute Nmap Scan'}</span>
        </button>
      </div>

      {/* Target & Scanner Parameter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-4 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Target Host Specification
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TARGETS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedTargetId(t.id);
                  setHasScanned(false);
                  setTerminalOutput([]);
                }}
                className={`p-2.5 rounded-lg border text-left transition-colors text-xs ${
                  selectedTargetId === t.id
                    ? 'bg-purple-950/70 border-purple-500 text-purple-200'
                    : 'bg-[#080d14] border-[#1b2b40] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold truncate">{t.name}</div>
                <div className="font-mono text-[11px] text-cyan-400">{t.ip}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-4 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Nmap Command Syntax
          </label>
          <div className="flex items-center gap-2 bg-[#080d14] p-2.5 rounded-lg border border-[#1e2f47] font-mono text-xs text-purple-300">
            <span className="text-slate-500">$</span>
            <span>nmap {scanType} {currentTarget.ip}</span>
          </div>
          <div className="flex gap-2 text-[11px] font-mono">
            {['-sS -sV', '-sS -T4 -p-', '-sV --script vuln'].map((flag) => (
              <button
                key={flag}
                onClick={() => setScanType(flag)}
                className={`px-2 py-1 rounded border ${
                  scanType === flag
                    ? 'bg-purple-950 border-purple-600 text-purple-300'
                    : 'bg-[#080d14] border-[#1a283e] text-slate-400'
                }`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="bg-[#080d14] border border-[#1b2b40] rounded-xl p-4 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#182638] text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>NMAP CLI RECON TERMINAL</span>
          </div>
          <span className="text-[10px] text-purple-300">TTY /dev/pts/1</span>
        </div>

        <div className="space-y-1 text-slate-300 min-h-[140px] max-h-60 overflow-y-auto">
          {terminalOutput.length > 0 ? (
            terminalOutput.map((line, i) => (
              <div key={i} className="text-purple-200/90 leading-relaxed">
                {line}
              </div>
            ))
          ) : (
            <div className="text-slate-600 italic">
              Terminal idle. Click "Execute Nmap Scan" to initiate packet probing...
            </div>
          )}
        </div>
      </div>

      {/* Scan Findings & Risk Table */}
      {hasScanned && (
        <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Discovered Open Ports & Service Fingerprints
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              OS: {currentTarget.os}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-[#1a283e] text-slate-400">
                  <th className="py-2 px-3">Port</th>
                  <th className="py-2 px-3">State</th>
                  <th className="py-2 px-3">Service</th>
                  <th className="py-2 px-3">Version</th>
                  <th className="py-2 px-3">Risk Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#152336]">
                {currentTarget.ports.map((p) => (
                  <tr key={p.port} className="hover:bg-[#121f30]">
                    <td className="py-2 px-3 text-cyan-400 font-bold">{p.port}/{p.protocol}</td>
                    <td className="py-2 px-3 text-emerald-400">{p.state}</td>
                    <td className="py-2 px-3 text-white">{p.service}</td>
                    <td className="py-2 px-3 text-slate-300">{p.version}</td>
                    <td className="py-2 px-3">
                      <div>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.risk === 'CRITICAL'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : p.risk === 'HIGH'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {p.risk}
                        </span>
                        {p.cveHint && (
                          <div className="text-[10px] text-slate-400 mt-0.5 font-sans">
                            {p.cveHint}
                          </div>
                        )}
                      </div>
                    </td>
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
