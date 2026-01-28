
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
      return {
        type: 'log',
        content: `Logged: ${extracted.symptoms.join(', ')} | Mood: ${extracted.mood}/10 | Severity: ${extracted.severity}/10`,
        data: extracted,
        suggestions: [
          'Would you like to add any triggers?',
          'Any medications taken today?',
          'How long have you felt this way?'
        ]
      };
    }
  },
  {
    command: '/analyze',
    description: 'Analyze recent health patterns',
    usage: '/analyze my mood patterns this week',
    handler: async (args: string) => {
      return {
        type: 'analyze',
        content: 'Analysis: Your headaches occur 3x after lunch meals. Energy levels peak in the morning. Mood correlates with sleep quality.',
        suggestions: [
          'Consider food allergy testing',
          'Try eating smaller lunch portions',
          'Monitor sleep schedule more closely'
        ]
      };
    }
  },
  {
    command: '/coach',
    description: 'Get personalized health coaching',
    usage: '/coach me on evening routine',
    handler: async (args: string) => {
      return {
        type: 'coach',
        content: 'Evening Routine Recommendations:\n1. Wind down 1 hour before bed\n2. Avoid screens 30 minutes before sleep\n3. Try gentle stretching or meditation\n4. Keep bedroom temperature cool (65-68°F)',
        suggestions: [
          'Set a consistent bedtime',
          'Create a relaxing pre-sleep ritual',
          'Track sleep quality for patterns'
        ]
      };
    }
  },
  {
    command: '/plan',
    description: 'Create meal or activity plans',
    usage: '/plan my meals for this week',
    handler: async (args: string) => {
      return {
        type: 'plan',
        content: 'Weekly Meal Plan (based on your health profile):\n\nMonday: Grilled salmon, quinoa, steamed broccoli\nTuesday: Chicken stir-fry with vegetables\nWednesday: Lentil soup with whole grain bread\nThursday: Baked cod with sweet potato\nFriday: Turkey and avocado wrap\n\nAll meals avoid your allergens and support your health goals.',
        suggestions: [
          'Would you like recipes for any of these meals?',
          'Need grocery shopping list?',
          'Want to modify any days?'
        ]
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
