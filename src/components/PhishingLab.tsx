import React, { useState } from 'react';
import {
  MailWarning,
  Inbox,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  Info,
  RotateCcw,
  AlertTriangle,
  FileText,
  Search,
} from 'lucide-react';
import { PhishingEmail } from '../types';
import { PHISHING_EMAILS } from '../data/cyberData';
import { sound } from '../utils/audio';

interface PhishingLabProps {
  onEarnXp: (xp: number) => void;
}

export const PhishingLab: React.FC<PhishingLabProps> = ({ onEarnXp }) => {
  const [emails, setEmails] = useState<PhishingEmail[]>(PHISHING_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string>(PHISHING_EMAILS[0].id);
  const [userVerdicts, setUserVerdicts] = useState<Record<string, 'phish' | 'safe'>>({});
  const [selectedFlags, setSelectedFlags] = useState<Record<string, string[]>>({});
  const [showHeaderModal, setShowHeaderModal] = useState<boolean>(false);
  const [inspectingLink, setInspectingLink] = useState<{ displayText: string; actualUrl: string; isMalicious: boolean } | null>(null);
  const [aiFeedback, setAiFeedback] = useState<Record<string, {
    isCorrect: boolean;
    accuracyGrade: string;
    feedback: string;
    keyIndicators: string[];
    socRemediationStep: string;
  }>>({});
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  const currentEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];
  const currentVerdict = userVerdicts[currentEmail.id];
  const currentFlags = selectedFlags[currentEmail.id] || [];

  const handleSelectEmail = (id: string) => {
    sound.playClick();
    setSelectedEmailId(id);
    setShowHeaderModal(false);
    setInspectingLink(null);
  };

  const handleToggleFlag = (flag: string) => {
    sound.playClick();
    const updated = currentFlags.includes(flag)
      ? currentFlags.filter((f) => f !== flag)
      : [...currentFlags, flag];
    setSelectedFlags({ ...selectedFlags, [currentEmail.id]: updated });
  };

  const handleVerdict = (verdict: 'phish' | 'safe') => {
    sound.playClick();
    const updatedVerdicts = { ...userVerdicts, [currentEmail.id]: verdict };
    setUserVerdicts(updatedVerdicts);

    const isCorrect = (verdict === 'phish' && currentEmail.isPhish) || (verdict === 'safe' && !currentEmail.isPhish);

    if (isCorrect) {
      sound.playSuccess();
      onEarnXp(120);
    } else {
      sound.playAlert();
    }
  };

  const handleRequestAiFeedback = async () => {
    if (!currentVerdict) return;
    sound.playClick();
    setLoadingAi(true);

    try {
      const res = await fetch('/api/ai/analyze-phish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailSubject: currentEmail.subject,
          emailSender: currentEmail.senderEmail,
          emailBody: currentEmail.snippet,
          userVerdict: currentVerdict,
          actualVerdict: currentEmail.isPhish ? 'phish' : 'safe',
          userSelectedFlags: currentFlags,
        }),
      });

      const data = await res.json();
      setAiFeedback({ ...aiFeedback, [currentEmail.id]: data });
      sound.playSuccess();
    } catch (err) {
      console.error(err);
      setAiFeedback({
        ...aiFeedback,
        [currentEmail.id]: {
          isCorrect: (currentVerdict === 'phish' && currentEmail.isPhish) || (currentVerdict === 'safe' && !currentEmail.isPhish),
          accuracyGrade: 'B',
          feedback: currentEmail.explanation,
          keyIndicators: currentEmail.redFlags,
          socRemediationStep: currentEmail.isPhish
            ? 'Tenant-wide purge of email, domain blacklisting in border firewall.'
            : 'Legitimate notification, safe to release from quarantine.',
        },
      });
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2">
            <MailWarning className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Phishing Awareness & Threat Triage Sandbox
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated SOC mail analyst inbox. Inspect headers (SPF, DKIM, DMARC), dissect hidden URLs in sandbox, and triage threat actors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Triaged: {Object.keys(userVerdicts).length} / {emails.length}
          </span>
        </div>
      </div>

      {/* Main Mail Client 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#0e1724] border border-[#1b2b40] rounded-xl overflow-hidden min-h-[560px]">
        {/* Left Column: Email List (4 cols) */}
        <div className="md:col-span-5 border-r border-[#1a293d] flex flex-col bg-[#0a111a]">
          <div className="p-3 border-b border-[#182638] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Inbox className="w-4 h-4 text-cyan-400" />
              <span>SOC Quarantine & Inbound Mailbox</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/40 px-1.5 py-0.5 rounded">
              {emails.length} Messages
            </span>
          </div>

          <div className="flex-1 divide-y divide-[#152233] overflow-y-auto">
            {emails.map((email) => {
              const isSelected = email.id === selectedEmailId;
              const verdict = userVerdicts[email.id];
              return (
                <button
                  key={email.id}
                  onClick={() => handleSelectEmail(email.id)}
                  className={`w-full text-left p-3.5 transition-colors block ${
                    isSelected ? 'bg-[#142338]' : 'hover:bg-[#0f1926]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[170px]">
                      {email.senderName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {email.date.slice(0, 10)}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-300 truncate">
                    {email.subject}
                  </div>

                  <div className="text-[11px] text-slate-400 truncate mt-1">
                    {email.snippet}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {verdict ? (
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                          verdict === 'phish'
                            ? 'bg-rose-950 border border-rose-800 text-rose-300'
                            : 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                        }`}
                      >
                        {verdict === 'phish' ? 'Quarantined as Phish' : 'Verified Legitimate'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#182638] text-slate-400">
                        Pending Triage
                      </span>
                    )}

                    {email.isPhish ? (
                      <span className="text-[9px] font-mono text-amber-500/80">
                        {email.redFlags.length} Indicators
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-cyan-500/80">Official</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Email Viewer & Triage Console (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between p-4 bg-[#0e1724]">
          <div className="space-y-4">
            {/* Sender and Header Bar */}
            <div className="pb-3 border-b border-[#182638] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-white">
                    {currentEmail.subject}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-semibold text-slate-300">From:</span>
                    <span>{currentEmail.senderName}</span>
                    <code className="text-[11px] text-cyan-300 font-mono bg-[#080d14] px-1.5 py-0.5 rounded">
                      &lt;{currentEmail.senderEmail}&gt;
                    </code>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setShowHeaderModal(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 rounded-lg transition-colors whitespace-nowrap"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Inspect Headers
                </button>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span>SPF: <strong className={currentEmail.spf === 'Pass' ? 'text-emerald-400' : 'text-rose-400'}>{currentEmail.spf}</strong></span>
                <span>·</span>
                <span>DKIM: <strong className={currentEmail.dkim === 'Pass' ? 'text-emerald-400' : 'text-rose-400'}>{currentEmail.dkim}</strong></span>
                <span>·</span>
                <span>DMARC: <strong className={currentEmail.dmarc === 'Pass' ? 'text-emerald-400' : 'text-rose-400'}>{currentEmail.dmarc}</strong></span>
              </div>
            </div>

            {/* Email Body Preview */}
            <div className="bg-white rounded-lg p-4 text-slate-900 text-xs shadow-inner max-h-64 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: currentEmail.bodyHtml }} />

              {/* Safe Link Interceptor */}
              {currentEmail.links.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-2">
                    Detected Interactive Hyperlinks (Click to inspect in sandbox):
                  </div>
                  <div className="space-y-1.5">
                    {currentEmail.links.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playClick();
                          setInspectingLink(link);
                        }}
                        className="w-full text-left p-2 rounded bg-slate-100 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 transition-colors flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-blue-700 underline truncate">
                          {link.displayText}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                          <Search className="w-3 h-3" />
                          Sandbox Inspect
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Red Flag Checklist */}
            <div className="bg-[#080d14] border border-[#1b2b40] rounded-lg p-3">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Identified Indicators of Compromise (Check all that apply):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                {[
                  'Mismatched return-path or lookalike domain',
                  'Artificial deadline or emotional urgency',
                  'Failing SPF/DKIM authentication',
                  'Untraceable payment (Gift cards / Crypto)',
                  'Dangerous file attachment (.zip / .exe / macro)',
                ].map((flag) => (
                  <label
                    key={flag}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-[#121c29] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={currentFlags.includes(flag)}
                      onChange={() => handleToggleFlag(flag)}
                      className="rounded border-[#1e2e45] text-cyan-500 focus:ring-0 bg-[#0e1724]"
                    />
                    <span className="text-[11px]">{flag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions: Triage Decision Buttons */}
          <div className="mt-4 pt-3 border-t border-[#182638] space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleVerdict('phish')}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                    currentVerdict === 'phish'
                      ? 'bg-rose-950 border-rose-600 text-rose-200'
                      : 'bg-[#181a24] hover:bg-rose-950/40 border-[#2b212f] text-rose-300'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Flag & Quarantine Phish</span>
                </button>

                <button
                  onClick={() => handleVerdict('safe')}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                    currentVerdict === 'safe'
                      ? 'bg-emerald-950 border-emerald-600 text-emerald-200'
                      : 'bg-[#102020] hover:bg-emerald-950/40 border-[#1a332d] text-emerald-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify as Legitimate</span>
                </button>
              </div>

              {currentVerdict && (
                <button
                  onClick={handleRequestAiFeedback}
                  disabled={loadingAi}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-900/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>{loadingAi ? 'Evaluating...' : 'Request AI Analysis'}</span>
                </button>
              )}
            </div>

            {/* AI Phishing Feedback Card */}
            {aiFeedback[currentEmail.id] && (
              <div className="bg-[#0b1320] border border-cyan-500/40 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span
                    className={
                      aiFeedback[currentEmail.id].isCorrect
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }
                  >
                    {aiFeedback[currentEmail.id].isCorrect ? '✓ Correct Triage Decision' : '⚠ Misclassified Verdict'}
                  </span>
                  <span className="font-mono text-cyan-300">
                    Grade: {aiFeedback[currentEmail.id].accuracyGrade}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {aiFeedback[currentEmail.id].feedback}
                </p>
                <div className="text-[11px] text-cyan-400 font-mono bg-[#080d14] p-2 rounded border border-[#16253a]">
                  <strong>SOP Action:</strong> {aiFeedback[currentEmail.id].socRemediationStep}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header Inspector Modal */}
      {showHeaderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#182638]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>RFC 5322 Raw Email Header Inspection</span>
              </h3>
              <button
                onClick={() => setShowHeaderModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="bg-[#080d14] rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-x-auto max-h-72">
              <div><span className="text-cyan-400">Return-Path:</span> &lt;{currentEmail.replyTo}&gt;</div>
              <div><span className="text-cyan-400">Received-From:</span> {currentEmail.originatingIp}</div>
              <div><span className="text-cyan-400">Authentication-Results:</span> spf={currentEmail.spf.toLowerCase()} dkim={currentEmail.dkim.toLowerCase()} dmarc={currentEmail.dmarc.toLowerCase()}</div>
              <div><span className="text-cyan-400">X-Mailer:</span> PHPMailer 6.2.0 (Custom automated batch engine)</div>
              <div><span className="text-cyan-400">Date:</span> {currentEmail.date}</div>
              <div><span className="text-cyan-400">Subject:</span> {currentEmail.subject}</div>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed">
              <strong>Analyst Tip:</strong> Check whether the <code>Return-Path</code> matches the domain in the visible <code>From:</code> field. Mismatched envelope senders often indicate spoofed SMTP relay injection.
            </div>
          </div>
        </div>
      )}

      {/* URL Sandbox Inspector Modal */}
      {inspectingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#182638]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Isolated Link Sandbox Inspector</span>
              </h3>
              <button
                onClick={() => setInspectingLink(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wide block">Visible Anchor Text:</span>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">
                  "{inspectingLink.displayText}"
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wide block">Actual Destination URL:</span>
                <div className="p-2.5 rounded bg-[#080d14] border border-[#1b2b40] font-mono text-xs text-rose-300 break-all">
                  {inspectingLink.actualUrl}
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border text-xs leading-relaxed ${
                  inspectingLink.isMalicious
                    ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                    : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                }`}
              >
                <strong>Sandbox Verdict: </strong>
                {inspectingLink.isMalicious
                  ? 'CRITICAL IOC: The destination hostname uses a lookalike typosquatting subdomain designed to mimic an authentic login screen. Do not submit credentials!'
                  : 'SAFE: The destination leads directly to the official legitimate domain.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
