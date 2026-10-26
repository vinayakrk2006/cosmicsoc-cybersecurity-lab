import React, { useState, useEffect } from 'react';
import {
  Flame,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Activity,
  Server,
  Radio,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { AttackIncident } from '../types';
import { INITIAL_ATTACK_INCIDENTS } from '../data/cyberData';
import { sound } from '../utils/audio';

interface AttackSimulatorProps {
  onIncidentResolved: (xp: number) => void;
}

export const AttackSimulator: React.FC<AttackSimulatorProps> = ({
  onIncidentResolved,
}) => {
  const [incidents, setIncidents] = useState<AttackIncident[]>(INITIAL_ATTACK_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('inc-ddos-01');
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);
  const [simulationActive, setSimulationActive] = useState<boolean>(true);
  const [threatIntensity, setThreatIntensity] = useState<number>(92);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Active assault detected. Triage countermeasures immediately.');
  const [aiDebrief, setAiDebrief] = useState<{
    tacticalScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    nistPhaseFeedback: string;
  } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const currentIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  // Timer tick for simulation duration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (simulationActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulationActive]);

  // Reset simulation state when changing incident
  const handleSelectIncident = (id: string) => {
    sound.playClick();
    setSelectedIncidentId(id);
    setActionsTaken([]);
    setSimulationActive(true);
    setThreatIntensity(90);
    setTimerSeconds(0);
    setStatusMessage('Active assault detected. Review logs and deploy defensive countermeasures.');
    setAiDebrief(null);
  };

  // Trainee clicks an action
  const handleExecuteAction = (actionId: string, isCorrect: boolean) => {
    if (actionsTaken.includes(actionId) || !simulationActive) return;

    const newActions = [...actionsTaken, actionId];
    setActionsTaken(newActions);

    if (isCorrect) {
      sound.playSuccess();
      const newIntensity = Math.max(10, threatIntensity - 30);
      setThreatIntensity(newIntensity);
      setStatusMessage(`Countermeasure applied successfully! Threat intensity reduced to ${newIntensity}%.`);

      // Check if all optimal actions are completed
      const allDone = currentIncident.optimalSteps.every((step) => newActions.includes(step));
      if (allDone || newIntensity <= 15) {
        setSimulationActive(false);
        setThreatIntensity(0);
        setStatusMessage('INCIDENT CONTAINED: Threat actor neutralized and perimeter secured.');
        onIncidentResolved(200);
      }
    } else {
      sound.playAlert();
      setThreatIntensity((prev) => Math.min(100, prev + 15));
      setStatusMessage('SUB-OPTIMAL ACTION: Countermeasure failed or worsened system operational posture.');
    }
  };

  // Request AI Post-Incident Debrief
  const handleRequestAiDebrief = async () => {
    setIsLoadingAi(true);
    sound.playClick();

    const score = Math.max(
      20,
      100 -
        (threatIntensity > 0 ? 30 : 0) -
        actionsTaken.filter((a) => !currentIncident.optimalSteps.includes(a)).length * 20 -
        Math.floor(timerSeconds / 10)
    );

    try {
      const res = await fetch('/api/ai/analyze-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentName: currentIncident.name,
          attackVector: currentIncident.vector,
          actionsTaken: actionsTaken.map(
            (id) => currentIncident.availableActions.find((a) => a.id === id)?.label || id
          ),
          correctSequence: currentIncident.optimalSteps,
          score,
          timeSeconds: timerSeconds,
        }),
      });
      const data = await res.json();
      setAiDebrief(data);
      sound.playSuccess();
    } catch (err) {
      console.error(err);
      setAiDebrief({
        tacticalScore: score,
        summary: `Containment triage concluded at ${timerSeconds}s. Defensive posture restored.`,
        strengths: ['Identified primary vector', 'Deployed perimeter rate controls'],
        weaknesses: ['Review post-incident log rotation SOPs'],
        nistPhaseFeedback: 'Containment verified. Maintain active monitoring.',
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setActionsTaken([]);
    setSimulationActive(true);
    setThreatIntensity(92);
    setTimerSeconds(0);
    setStatusMessage('Simulation reset. Triage incident countermeasures.');
    setAiDebrief(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Real-Time Attack Simulation War Room
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Live enterprise SOC console. Triage active adversarial threats, analyze live telemetry, and deploy defenses in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#131f30] hover:bg-[#1b2b40] border border-[#20324c] rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Scenario
          </button>
        </div>
      </div>

      {/* Incident Switcher Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {incidents.map((inc) => {
          const isSelected = inc.id === selectedIncidentId;
          return (
            <button
              key={inc.id}
              onClick={() => handleSelectIncident(inc.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-sm shadow-cyan-950'
                  : 'bg-[#0e1724] border-[#1b2b40] text-slate-400 hover:text-slate-200 hover:bg-[#131f30]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    inc.severity === 'CRITICAL'
                      ? 'bg-rose-950 border border-rose-800 text-rose-300'
                      : inc.severity === 'HIGH'
                      ? 'bg-amber-950 border border-amber-800 text-amber-300'
                      : 'bg-cyan-950 border border-cyan-800 text-cyan-300'
                  }`}
                >
                  {inc.severity}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {inc.timestamp.slice(0, 5)}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 truncate">
                {inc.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                {inc.vector}
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Tactical HUD Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Target Info & Live Telemetry Meter */}
        <div className="space-y-4">
          {/* Target Metadata Card */}
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#182638]">
              <span className="text-slate-400 font-medium">Target Asset</span>
              <span className="font-mono text-cyan-400 text-[11px] truncate max-w-[180px]">
                {currentIncident.targetAsset}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#182638]">
              <span className="text-slate-400 font-medium">Adversary Source</span>
              <span className="font-mono text-rose-400 text-[11px] truncate max-w-[180px]">
                {currentIncident.sourceIp}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#182638]">
              <span className="text-slate-400 font-medium">Attack Vector</span>
              <span className="text-slate-200 text-[11px] font-medium">
                {currentIncident.vector}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Triage Clock</span>
              <span className="font-mono text-amber-400 text-sm font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Threat Intensity Gauge */}
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Threat Saturation
                </span>
              </div>
              <span
                className={`font-mono text-sm font-bold ${
                  threatIntensity > 60
                    ? 'text-rose-400'
                    : threatIntensity > 20
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {threatIntensity}%
              </span>
            </div>

            <div className="w-full bg-[#162233] h-3 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  threatIntensity > 60
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : threatIntensity > 20
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${threatIntensity}%` }}
              />
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-[#080d14] border border-[#1a273b] text-xs font-mono text-slate-300">
              <span className="text-cyan-400">&gt; STATUS:</span> {statusMessage}
            </div>
          </div>

          {/* Incident Description */}
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Incident Brief
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentIncident.description}
            </p>
          </div>
        </div>

        {/* Middle & Right: Live Raw Syslog Stream & Defensive Action Console */}
        <div className="lg:col-span-2 space-y-4">
          {/* Live Syslog Console */}
          <div className="bg-[#080d14] border border-[#1b2b40] rounded-xl p-4 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1a283e]">
              <div className="flex items-center gap-2 text-slate-400">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-slate-300">SIEM & EDR REAL-TIME LOG STREAM</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                ● LIVE INGEST
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto text-[11px] text-slate-300">
              {currentIncident.rawLogs.map((log, index) => (
                <div
                  key={index}
                  className={`py-0.5 px-1.5 rounded ${
                    log.includes('DROP') || log.includes('ALERT') || log.includes('warn')
                      ? 'bg-rose-950/30 text-rose-300'
                      : log.includes('WAF')
                      ? 'bg-amber-950/30 text-amber-300'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Countermeasure Action Console */}
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#182638]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Defensive Countermeasure Matrix</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Select and execute actions in tactical priority to neutralize the adversary.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Executed: {actionsTaken.length} / {currentIncident.optimalSteps.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {currentIncident.availableActions.map((action) => {
                const isExecuted = actionsTaken.includes(action.id);
                return (
                  <button
                    key={action.id}
                    disabled={isExecuted || !simulationActive}
                    onClick={() => handleExecuteAction(action.id, action.isCorrect)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                      isExecuted
                        ? action.isCorrect
                          ? 'bg-emerald-950/30 border-emerald-600/50 text-emerald-200'
                          : 'bg-rose-950/30 border-rose-600/50 text-rose-300'
                        : 'bg-[#121d2d] border-[#1e2f47] hover:border-cyan-500/60 text-slate-200 hover:bg-[#16253a]'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {isExecuted ? (
                          action.isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold">{action.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 pl-4 leading-normal">
                        {action.description}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">
                      {isExecuted ? 'EXECUTED' : `~${action.costSeconds}s deploy`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* AI Post-Incident Debrief Trigger */}
            <div className="mt-4 pt-4 border-t border-[#182638] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {threatIntensity === 0
                  ? 'All critical objectives achieved! Request Sentinel AI debrief.'
                  : 'Containment in progress. Mitigate remaining attack vectors.'}
              </span>
              <button
                onClick={handleRequestAiDebrief}
                disabled={isLoadingAi || actionsTaken.length === 0}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-cyan-900/30 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>{isLoadingAi ? 'Synthesizing Debrief...' : 'Request AI Incident Debrief'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Post-Incident Debrief Modal / Card */}
      {aiDebrief && (
        <div className="bg-[#0b1320] border border-cyan-500/40 rounded-xl p-5 shadow-xl shadow-cyan-950/50 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a2d47]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  SOC Commander AI Tactical Debrief (Gemini Sentinel)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Automated incident audit evaluated against NIST SP 800-61 Rev 2
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Tactical Score:</span>
              <span className="text-lg font-extrabold font-mono text-cyan-400">
                {aiDebrief.tacticalScore}/100
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {aiDebrief.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0e1724] border border-[#1b2b40] rounded-lg p-3">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                ✓ Tactical Strengths
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {aiDebrief.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">·</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0e1724] border border-[#1b2b40] rounded-lg p-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                ⚠ Operational Areas for Improvement
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {aiDebrief.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">·</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-[#080d14] border border-[#182638] rounded-lg p-3 text-xs text-slate-300">
            <span className="font-semibold text-cyan-300 font-mono">NIST Framework Phase Notes: </span>
            <span>{aiDebrief.nistPhaseFeedback}</span>
          </div>
        </div>
      )}
    </div>
  );
};
