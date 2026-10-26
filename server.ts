import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI if API key exists
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiEnabled: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: AI Password Security Feedback
app.post('/api/ai/analyze-password', async (req: Request, res: Response) => {
  try {
    const { password, entropy, estimatedCrackTime, issues } = req.body;

    if (!password || typeof password !== 'string') {
      res.status(400).json({ error: 'Password is required' });
      return;
    }

    if (!ai) {
      // Heuristic fallback response
      const fallbackAnalysis = {
        rating: entropy > 70 ? 'Strong' : entropy > 45 ? 'Moderate' : 'Vulnerable',
        vulnerabilities: issues || ['Standard dictionary / keyboard pattern vulnerability'],
        aiInsight: entropy > 70
          ? `With an entropy of ${entropy.toFixed(1)} bits, this password exhibits solid resistance against standard offline dictionary attacks. To elevate it to enterprise grade, consider a 4-word random passphrase (Diceware pattern) that resists offline GPU cracking even longer.`
          : `This password generates only ${entropy.toFixed(1)} bits of entropy. Common leetspeak substitutions (e.g. '@' for 'a', '0' for 'o') are indexed in hashcat rule masks and crackable in ${estimatedCrackTime || 'seconds'}.`,
        recommendations: [
          'Use 4 or more unrelated words separated by hyphens (e.g., correct-horse-battery-staple).',
          'Avoid predictable date formats, names, or keyboard walks (e.g., qwerty, 123456).',
          'Never reuse master passwords across high-privilege SOC or banking portals.',
        ],
        samplePassphrase: 'solar-falcon-quantum-shield-92',
      };
      res.json(fallbackAnalysis);
      return;
    }

    const prompt = `You are a Senior Defensive Cybersecurity Analyst and Cryptographer at CosmicSOC.
Evaluate the following password candidate submitted by a security trainee:
Password length: ${password.length} characters
Calculated Entropy: ${entropy} bits
Estimated Brute-force Time: ${estimatedCrackTime}
Pre-flagged Issues: ${JSON.stringify(issues || [])}

Provide structured analysis in valid JSON format only, matching this exact schema:
{
  "rating": "Vulnerable" | "Weak" | "Moderate" | "Strong" | "Fortified",
  "vulnerabilities": ["bullet point 1", "bullet point 2"],
  "aiInsight": "2-3 sentences explaining the structural and cryptanalytic strengths/flaws of this password, referencing hashcat rules or offline GPU clusters if relevant.",
  "recommendations": ["specific actionable advice 1", "specific actionable advice 2", "specific actionable advice 3"],
  "samplePassphrase": "a high entropy multi-word memorable alternative passphrase"
}
Do not wrap in markdown tags or extra prose. Return raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Password analysis error:', errorMsg);
    res.status(500).json({
      error: 'Failed to process AI password analysis',
      fallback: true,
      rating: 'Moderate',
      vulnerabilities: ['Offline dictionary and rule-based attack vulnerability'],
      aiInsight: 'Rule-based dictionary attacks quickly peel back predictable substitutions. Always strive for length over artificial character complexity.',
      recommendations: ['Use a password manager', 'Adopt 16+ character passphrases', 'Enable hardware MFA / FIDO2 keys'],
      samplePassphrase: 'cobalt-galaxy-patrol-prism-2026',
    });
  }
});

// Endpoint: AI Phishing Triage Feedback
app.post('/api/ai/analyze-phish', async (req: Request, res: Response) => {
  try {
    const { emailSubject, emailSender, emailBody, userVerdict, actualVerdict, userSelectedFlags } = req.body;

    const isCorrect = userVerdict === actualVerdict;

    if (!ai) {
      // Heuristic fallback
      res.json({
        isCorrect,
        accuracyGrade: isCorrect ? 'A' : 'C',
        feedback: isCorrect
          ? `Excellent analysis! You accurately identified this email as ${actualVerdict.toUpperCase()}. The flags you isolated (${userSelectedFlags.join(', ') || 'visual cues'}) align with standard SOC triage heuristics.`
          : `Review required: You marked this email as ${userVerdict.toUpperCase()}, but it is actually ${actualVerdict.toUpperCase()}. Notice how the domain SPF records and emotional urgency markers signal deception.`,
        keyIndicators: [
          'Domain lookalike / typo-squatting in the sender return-path',
          'Artificial urgency urging rapid action to bypass cognitive scrutiny',
          'Link destination mismatched with visible anchor text',
        ],
        socRemediationStep: actualVerdict === 'phishing'
          ? 'Quarantine message tenant-wide, extract malicious URL to perimeter firewall blocklist, check mail logs for other recipients.'
          : 'Safelist sender if verified through internal channels, release from quarantine if held.',
      });
      return;
    }

    const prompt = `You are a Tier 2 SOC Analyst reviewing a junior trainee's triage of a suspicious corporate email.
Email Subject: ${emailSubject}
Sender: ${emailSender}
Body Snippet: ${emailBody?.slice(0, 300)}
Actual Classification: ${actualVerdict}
Trainee Verdict: ${userVerdict}
Flags selected by trainee: ${JSON.stringify(userSelectedFlags || [])}

Provide detailed feedback in JSON format:
{
  "isCorrect": ${isCorrect},
  "accuracyGrade": "A" | "B" | "C" | "D",
  "feedback": "2-3 concise sentences mentoring the trainee on why their verdict was accurate or what critical Indicators of Compromise (IOCs) they overlooked.",
  "keyIndicators": ["Key indicator 1", "Key indicator 2", "Key indicator 3"],
  "socRemediationStep": "Concrete standard operating procedure (SOP) step the SOC analyst should take next."
}
Return raw JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Phish analysis error:', errorMsg);
    res.status(500).json({
      error: 'Failed to process AI phishing analysis',
      fallback: true,
      isCorrect: req.body.userVerdict === req.body.actualVerdict,
      accuracyGrade: 'B',
      feedback: 'Good effort evaluating the email headers and urgency cues. Pay close attention to domain discrepancy and hidden redirection hyperlinks.',
      keyIndicators: ['Lookalike sender domain', 'Pretexting urgency', 'Hidden payload URL'],
      socRemediationStep: 'Block sender domain and submit URL to threat intelligence sandbox.',
    });
  }
});

// Endpoint: AI Incident Response Debrief
app.post('/api/ai/analyze-incident', async (req: Request, res: Response) => {
  try {
    const { incidentName, attackVector, actionsTaken, correctSequence, score, timeSeconds } = req.body;

    if (!ai) {
      res.json({
        tacticalScore: Math.min(100, Math.max(20, score || 80)),
        summary: `Triage completed in ${timeSeconds} seconds. The threat actor attempted a ${attackVector} attack. Your intervention contained the primary propagation vector.`,
        strengths: ['Prompt isolation of the affected host', 'Perimeter firewall policy update'],
        weaknesses: actionsTaken.length < 3 ? ['Missed memory forensics capture prior to system reboot'] : ['Ensure root-cause credential rotation occurs immediately'],
        nistPhaseFeedback: 'Containment executed effectively. Focus on thorough Eradication and Recovery documentation.',
      });
      return;
    }

    const prompt = `You are a Lead Incident Commander at CosmicSOC reviewing an Incident Response simulation executed by an analyst.
Incident: ${incidentName}
Vector: ${attackVector}
Actions Taken by Analyst: ${JSON.stringify(actionsTaken)}
Optimal Protocol Sequence: ${JSON.stringify(correctSequence)}
Simulation Score: ${score}/100
Time to Contain: ${timeSeconds} seconds

Provide an executive post-incident debrief in JSON format:
{
  "tacticalScore": ${score},
  "summary": "2-3 sentences summarizing the containment outcome and operational speed.",
  "strengths": ["Strengths observed in response"],
  "weaknesses": ["Gaps or sub-optimal actions"],
  "nistPhaseFeedback": "1-2 sentences on how well NIST SP 800-61 phases (Identification, Containment, Eradication, Recovery) were executed."
}
Return raw JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Incident debrief error:', errorMsg);
    res.status(500).json({
      tacticalScore: 75,
      summary: 'Incident containment completed with minor operational delay. Host isolated successfully.',
      strengths: ['Target isolation verified', 'Traffic sinkholed'],
      weaknesses: ['Ensure SIEM correlation rules are updated post-incident'],
      nistPhaseFeedback: 'Effective Containment. Strengthen Post-Incident Lessons Learned.',
    });
  }
});

// Endpoint: AI SOC Mentor Chat
app.post('/api/ai/mentor-chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!ai) {
      // Heuristic fallback response with rich cybersecurity insights
      let reply = `As your CosmicSOC Senior Mentor: In cybersecurity, defense-in-depth is our primary doctrine. Regarding "${message}": always verify identity (Zero Trust), enforce least privilege, and sanitize all inputs. Try experimenting with our interactive SQL Injection and Live War Room labs to see this in action!`;
      const lower = message.toLowerCase();
      if (lower.includes('sql') || lower.includes('injection')) {
        reply = `SQL Injection happens when untrusted user input is directly concatenated into a dynamic SQL query string (e.g., SELECT * FROM users WHERE user = '$input'). The attacker escapes data context using quotes and injects boolean tautologies like "' OR 1=1 --". The absolute gold standard defense is Parameterized Queries (Prepared Statements), which strictly treats user inputs as literal parameters, never executable SQL tokens. Check out our SQL Injection Sandbox in the left sidebar!`;
      } else if (lower.includes('phish') || lower.includes('email')) {
        reply = `Phishing attacks rely on social engineering and cognitive load. Attackers forge sender display names, exploit typosquatting domains (e.g. paypa1.com), and fabricate high-urgency pretexts. In a SOC, we verify SPF (Sender Policy Framework), DKIM (DomainKeys Identified Mail), and DMARC alignment, and quarantine suspicious emails. Head over to the Phishing Threat Triage Sandbox to inspect real headers!`;
      } else if (lower.includes('password') || lower.includes('entropy')) {
        reply = `Password entropy is calculated as E = L * log2(R), where L is length and R is the character pool size. Length dominates entropy exponentially! An 8-character complex password (~50 bits) can be cracked in days with an RTX 4090 cluster, while a 20-character passphrase of 4 random dictionary words yields over 80 bits, taking centuries. Explore our Password Entropy Lab to test this!`;
      } else if (lower.includes('ddos') || lower.includes('syn flood')) {
        reply = `A SYN Flood exploits the 3-way TCP handshake (SYN -> SYN-ACK -> ACK). The attacker sends a barrage of SYN packets from spoofed IPs without sending the final ACK. The target server allocates memory for half-open sockets in the SYN backlog until it exhausts memory and crashes. Defenses include SYN Cookies, Anycast routing, rate-limiting, and scrubbing centers. Test this live in our Attack Simulator War Room!`;
      }
      res.json({ reply });
      return;
    }

    const systemInstruction = `You are "Sentinel", the AI Cyber Mentor at CosmicSOC (cosmicsoc.io).
You are an expert offensive and defensive security practitioner who trains students, junior analysts, and developers.
Your style is professional, encouraging, technically precise, and grounded in real-world standards (MITRE ATT&CK, NIST, OWASP Top 10, RFC standards).
Guidelines:
- Explain concepts clearly with brief technical code or command snippets when appropriate.
- When trainees ask about exploit techniques, always emphasize ethical guidelines and defensive mitigation (how to detect, prevent, and fix).
- Do not spoil CTF flags directly; instead provide guided hints and mental models.
- Format with clean Markdown (bolding, inline code, bullet points).`;

    const chatContents = (history || []).map((h: { role: string; content: string }) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }],
    }));

    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text || 'Understood. How else can I assist your security training?' });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Mentor chat error:', errorMsg);
    res.status(500).json({
      error: 'Failed to process AI mentor response',
      reply: 'The Sentinel link experienced high network jitter. Keep practicing your triage fundamentals! Remember: always validate headers, check hashes against VirusTotal, and enforce strict least privilege.',
    });
  }
});

// Configure Vite middleware or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CosmicSOC Security Lab running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
