// Password Entropy & Cryptographic Cracking Estimator

const COMMON_DICTIONARY_WORDS = [
  'password', '123456', 'qwerty', 'admin', 'welcome', 'login', 'football',
  'iloveyou', 'master', 'monkey', 'dragon', 'sunshine', 'princess', 'solo',
  'starwars', 'shadow', 'trustnoone', 'superman', 'secret', 'hunter2', 'letmein'
];

const DICEWARE_WORDLIST = [
  'beacon', 'cipher', 'quantum', 'cobalt', 'matrix', 'orbital', 'sentinel',
  'falcon', 'aurora', 'vertex', 'nebula', 'glacier', 'shield', 'phoenix',
  'vector', 'plasma', 'zenith', 'pulse', 'strata', 'echo', 'vortex',
  'shadow', 'prism', 'titan', 'cascade', 'helios', 'apex', 'cyber',
  'crypto', 'signal', 'bastion', 'router', 'packet', 'gateway', 'firewall'
];

export interface EntropyResult {
  entropyBits: number;
  poolSize: number;
  rating: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Fortified';
  ratingColor: string;
  score: number; // 0-100
  charCounts: {
    lower: number;
    upper: number;
    digits: number;
    symbols: number;
    spaces: number;
  };
  crackTimes: {
    laptop: string;
    gpuRig: string;
    supercomputer: string;
  };
  vulnerabilities: string[];
  recommendations: string[];
  isPwnedCommon: boolean;
}

export function calculatePasswordEntropy(pwd: string): EntropyResult {
  if (!pwd) {
    return {
      entropyBits: 0,
      poolSize: 0,
      rating: 'Very Weak',
      ratingColor: 'text-rose-400',
      score: 0,
      charCounts: { lower: 0, upper: 0, digits: 0, symbols: 0, spaces: 0 },
      crackTimes: {
        laptop: 'Instant',
        gpuRig: 'Instant',
        supercomputer: 'Instant',
      },
      vulnerabilities: ['Password cannot be empty'],
      recommendations: ['Enter at least 14 characters or use a multi-word passphrase'],
      isPwnedCommon: false,
    };
  }

  const length = pwd.length;
  let poolSize = 0;
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasDigit = /[0-9]/.test(pwd);
  const hasSymbol = /[^a-zA-Z0-9\s]/.test(pwd);
  const hasSpace = /\s/.test(pwd);

  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigit) poolSize += 10;
  if (hasSymbol) poolSize += 33;
  if (hasSpace) poolSize += 1;

  // Base Shannon entropy = L * log2(R)
  let entropy = length * (Math.log2(poolSize || 1));

  const vulnerabilities: string[] = [];
  const recommendations: string[] = [];

  // Dictionary check
  const lowerPwd = pwd.toLowerCase();
  const matchedWord = COMMON_DICTIONARY_WORDS.find((word) => lowerPwd.includes(word));
  const isPwnedCommon = Boolean(matchedWord);

  if (isPwnedCommon) {
    vulnerabilities.push(`Contains commonly breached dictionary root: "${matchedWord}"`);
    entropy = Math.max(10, entropy - 25);
  }

  // Sequential numbers check
  if (/0123|1234|2345|3456|4567|5678|6789|9876/.test(pwd)) {
    vulnerabilities.push('Contains predictable sequential numerical sequences');
    entropy = Math.max(12, entropy - 15);
  }

  // Keyboard walks check
  if (/qwerty|asdfgh|zxcvbn|qazwsx/.test(lowerPwd)) {
    vulnerabilities.push('Contains common keyboard walk patterns (e.g. QWERTY)');
    entropy = Math.max(15, entropy - 20);
  }

  // Repeated characters check
  if (/(.)\1{2,}/.test(pwd)) {
    vulnerabilities.push('Contains 3 or more repeated identical characters');
    entropy = Math.max(12, entropy - 10);
  }

  // Short length penalty
  if (length < 8) {
    vulnerabilities.push('Length below 8 characters; trivially cracked via brute force in seconds');
  } else if (length < 12) {
    vulnerabilities.push('Length under 12 characters; vulnerable to GPU hashcat mask attacks');
  }

  // Recommendations
  if (length < 14) {
    recommendations.push('Increase length to 14+ characters (length provides exponential security)');
  }
  if (!hasUpper || !hasLower) {
    recommendations.push('Combine both uppercase and lowercase character cases');
  }
  if (!hasSymbol) {
    recommendations.push('Introduce non-alphanumeric symbols (!@#$%^&*)');
  }
  if (vulnerabilities.length === 0) {
    recommendations.push('Excellent structure. Store in a dedicated password manager.');
  }

  // Total combinations = poolSize ^ length
  const totalCombinations = Math.pow(poolSize, length);

  // Speed estimates (guesses/sec)
  const laptopSpeed = 1e7; // 10 million / sec
  const gpuRigSpeed = 1e11; // 100 billion / sec (e.g., 8x RTX 4090)
  const supercomputerSpeed = 1e14; // 100 trillion / sec

  const formatCrackTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds > 3.15e16) return '> 1 billion years';
    if (seconds < 0.001) return 'Instant (< 1 ms)';
    if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 3.15e9) return `${Math.round(seconds / 31536000)} years`;
    return `${(seconds / 3.15e9).toFixed(1)}k years`;
  };

  const crackTimes = {
    laptop: formatCrackTime(totalCombinations / laptopSpeed),
    gpuRig: formatCrackTime(totalCombinations / gpuRigSpeed),
    supercomputer: formatCrackTime(totalCombinations / supercomputerSpeed),
  };

  // Determine rating
  let rating: EntropyResult['rating'] = 'Very Weak';
  let ratingColor = 'text-rose-400';
  let score = Math.min(100, Math.round((entropy / 85) * 100));

  if (entropy >= 80 && length >= 14 && vulnerabilities.length === 0) {
    rating = 'Fortified';
    ratingColor = 'text-emerald-400';
  } else if (entropy >= 65 && length >= 12) {
    rating = 'Strong';
    ratingColor = 'text-cyan-400';
  } else if (entropy >= 45 && length >= 9) {
    rating = 'Moderate';
    ratingColor = 'text-amber-400';
  } else if (entropy >= 28) {
    rating = 'Weak';
    ratingColor = 'text-orange-400';
  }

  return {
    entropyBits: Math.round(entropy * 10) / 10,
    poolSize,
    rating,
    ratingColor,
    score,
    charCounts: {
      lower: (pwd.match(/[a-z]/g) || []).length,
      upper: (pwd.match(/[A-Z]/g) || []).length,
      digits: (pwd.match(/[0-9]/g) || []).length,
      symbols: (pwd.match(/[^a-zA-Z0-9\s]/g) || []).length,
      spaces: (pwd.match(/\s/g) || []).length,
    },
    crackTimes,
    vulnerabilities,
    recommendations,
    isPwnedCommon,
  };
}

export function generateDicewarePassphrase(wordCount = 4): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const idx = Math.floor(Math.random() * DICEWARE_WORDLIST.length);
    words.push(DICEWARE_WORDLIST[idx]);
  }
  const randomNum = Math.floor(10 + Math.random() * 90);
  return `${words.join('-')}-${randomNum}`;
}
