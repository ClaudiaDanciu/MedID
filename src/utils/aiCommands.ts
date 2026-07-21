
import { callClaude } from './claude';
import { buildHealthSystemPrompt } from './healthContext';
import { loadLogEntries } from './storage';

export interface AICommand {
  command: string;
  description: string;
  usage: string;
  handler: (args: string, context?: any) => Promise<AICommandResult>;
}

export interface AICommandResult {
  type: 'log' | 'analyze' | 'coach' | 'plan' | 'insight' | 'error';
  content: string;
  data?: any;
  suggestions?: string[];
}

export interface ExtractedHealthData {
  symptoms: string[];
  mood: number;
  severity: number;
  timing: string;
  context: string;
  emotions: string[];
}

export const extractHealthData = (text: string): ExtractedHealthData => {
  const symptoms: string[] = [];
  const emotions: string[] = [];
  let mood = 5;
  let severity = 3;
  let timing = 'now';
  let context = '';

  // Enhanced symptom detection
  const symptomPatterns = [
    /headache|migraine|head pain/i,
    /fatigue|tired|exhausted|sleepy/i,
    /nausea|sick|queasy/i,
    /dizzy|lightheaded|vertigo/i,
    /pain|ache|sore|hurt/i,
    /anxiety|anxious|worried/i,
    /sad|depressed|down/i,
    /bloated|bloating/i,
    /cramping|cramps/i,
    /rash|itchy|skin/i
  ];

  symptomPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      symptoms.push(match[0].toLowerCase());
    }
  });

  // Mood extraction
  const moodPatterns = [
    { pattern: /great|amazing|excellent|fantastic/i, score: 9 },
    { pattern: /good|fine|okay|alright/i, score: 7 },
    { pattern: /bad|terrible|awful|horrible/i, score: 3 },
    { pattern: /sad|depressed|down/i, score: 2 }
  ];

  moodPatterns.forEach(({ pattern, score }) => {
    if (pattern.test(text)) mood = score;
  });

  // Severity extraction
  if (/severe|extreme|terrible/i.test(text)) severity = 8;
  else if (/moderate|medium/i.test(text)) severity = 5;
  else if (/mild|slight|little/i.test(text)) severity = 2;

  // Timing extraction
  if (/morning|am/i.test(text)) timing = 'morning';
  else if (/afternoon|pm/i.test(text)) timing = 'afternoon';
  else if (/evening|night/i.test(text)) timing = 'evening';
  else if (/yesterday/i.test(text)) timing = 'yesterday';

  // Context extraction
  if (/after eating|after meal|after lunch|after dinner/i.test(text)) {
    context = 'post-meal';
  } else if (/work|job|office/i.test(text)) {
    context = 'work-related';
  } else if (/exercise|workout|gym/i.test(text)) {
    context = 'exercise-related';
  }

  return { symptoms, mood, severity, timing, context, emotions };
};

export const aiCommands: AICommand[] = [
  {
    command: '/log',
    description: 'Log symptoms and mood from natural language',
    usage: '/log I have a headache and feeling tired',
    handler: async (args: string) => {
      const extracted = extractHealthData(args);

      let suggestions = ['Would you like to add any triggers?', 'Any medications taken today?', 'How long have you felt this way?'];
      try {
        const systemPrompt = buildHealthSystemPrompt(
          'You are a health logging assistant. Given a symptom report, return exactly 3 brief follow-up questions as a JSON array of strings. Return ONLY the JSON array, no other text.'
        );
        const raw = await callClaude([{ role: 'user', content: args }], systemPrompt, 256);
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) suggestions = parsed;
      } catch { /* use defaults */ }

      return {
        type: 'log',
        content: `Logged: ${extracted.symptoms.length > 0 ? extracted.symptoms.join(', ') : 'health note'} | Mood: ${extracted.mood}/10 | Severity: ${extracted.severity}/10`,
        data: extracted,
        suggestions,
      };
    }
  },
  {
    command: '/analyze',
    description: 'Analyze recent health patterns',
    usage: '/analyze my mood patterns this week',
    handler: async (args: string) => {
      const recentLogs = loadLogEntries().slice(0, 20);
      const systemPrompt = buildHealthSystemPrompt(
        'You are a precise health analysis assistant. Analyze the user health data and provide 2-3 specific pattern insights in plain text. Be concise and actionable.'
      );
      const context = recentLogs.length > 0
        ? `Recent health logs:\n${JSON.stringify(recentLogs, null, 2)}\n\nUser request: ${args}`
        : `User has no health logs yet. Request: ${args}`;

      const content = await callClaude([{ role: 'user', content: context }], systemPrompt, 512);
      return {
        type: 'analyze',
        content,
        suggestions: ['Log more entries for better insights', 'Check the Insights tab for detailed analysis'],
      };
    }
  },
  {
    command: '/coach',
    description: 'Get personalized health coaching',
    usage: '/coach me on evening routine',
    handler: async (args: string) => {
      const systemPrompt = buildHealthSystemPrompt(
        'You are a health coach. Give 4 specific, actionable recommendations for the topic the user asks about. Keep it concise and practical.'
      );
      const content = await callClaude([{ role: 'user', content: args }], systemPrompt, 512);
      return {
        type: 'coach',
        content,
        suggestions: ['Set a consistent routine', 'Track your progress', 'Review next week'],
      };
    }
  },
  {
    command: '/plan',
    description: 'Create meal or activity plans',
    usage: '/plan my meals for this week',
    handler: async (args: string) => {
      const systemPrompt = buildHealthSystemPrompt(
        'You are a health planning assistant. Create a practical plan based on the user request. ALWAYS check medications and allergies before making food or supplement recommendations. Keep it concise.'
      );
      const content = await callClaude([{ role: 'user', content: args }], systemPrompt, 768);
      return {
        type: 'plan',
        content,
        suggestions: ['Want recipes for any of these?', 'Need a grocery list?', 'Modify any days?'],
      };
    }
  }
];

export const parseCommand = (input: string): { isCommand: boolean; command?: string; args?: string } => {
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) {
    return { isCommand: false };
  }

  const parts = trimmed.split(' ');
  const command = parts[0];
  const args = parts.slice(1).join(' ');

  return { isCommand: true, command, args };
};

export const executeCommand = async (command: string, args: string): Promise<AICommandResult> => {
  const aiCommand = aiCommands.find(cmd => cmd.command === command);
  
  if (!aiCommand) {
    return {
      type: 'error',
      content: `Unknown command: ${command}. Available commands: ${aiCommands.map(cmd => cmd.command).join(', ')}`
    };
  }

  return await aiCommand.handler(args);
};
