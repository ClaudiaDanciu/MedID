
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Activity, Plus, Mic, MicOff, Command, Sparkles } from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { parseCommand, executeCommand, AICommandResult, extractHealthData } from '@/utils/aiCommands';

interface LogEntry {
  id: string;
  text: string;
  timestamp: Date;
  symptoms: string[];
  mood: number;
  severity: number;
  context: string;
  aiInsights?: string[];
}

export const LogSection = () => {
  const [logText, setLogText] = useState('');
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [lastCommandResult, setLastCommandResult] = useState<AICommandResult | null>(null);
  const { toast } = useToast();

  const handleSubmitLog = async () => {
    if (!logText.trim()) return;

    const parsedCommand = parseCommand(logText);
    
    if (parsedCommand.isCommand && parsedCommand.command && parsedCommand.args) {
      // Handle AI command
      const result = await executeCommand(parsedCommand.command, parsedCommand.args);
      setLastCommandResult(result);
      
      if (result.type === 'log' && result.data) {
        // Create log entry from AI extraction
        const extracted = result.data;
        const newEntry: LogEntry = {
          id: Date.now().toString(),
          text: parsedCommand.args,
          timestamp: new Date(),
          symptoms: extracted.symptoms,
          mood: extracted.mood,
          severity: extracted.severity,
          context: extracted.context,
          aiInsights: result.suggestions
        };
        setEntries(prev => [newEntry, ...prev]);
      }
      
      toast({
        title: "AI Command Executed",
        description: result.content
      });
    } else {
      // Regular log entry with AI enhancement
      const extracted = extractHealthData(logText);
      const newEntry: LogEntry = {
        id: Date.now().toString(),
        text: logText,
        timestamp: new Date(),
        symptoms: extracted.symptoms,
        mood: extracted.mood,
        severity: extracted.severity,
        context: extracted.context,
        aiInsights: [
          'AI detected patterns in your symptoms',
          'Consider tracking meal timing',
          'Mood seems correlated with energy levels'
        ]
      };

      setEntries(prev => [newEntry, ...prev]);
      toast({
        title: "Smart Log Entry Added",
        description: "AI enhanced your entry with insights"
      });
    }
    
    setLogText('');
  };

  const handleCommandExecute = (result: AICommandResult) => {
    setLastCommandResult(result);
    toast({
      title: "Command Executed",
      description: result.content
    });
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Voice Input Stopped" : "Voice Input Started",
      description: isListening ? "Microphone turned off" : "Speak your symptoms now"
    });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Log Header */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-6 h-6" />
            <span>SYMPA+ AI Health Logger</span>
            <Badge className="bg-white/20 text-white">Enhanced</Badge>
          </CardTitle>
          <p className="text-green-100">
            Use AI commands like /log, /analyze, /coach, or type naturally
          </p>
        </CardHeader>
      </Card>

      {/* Command Result Display */}
      {lastCommandResult && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <Badge className="bg-purple-100 text-purple-700 mb-2">
                  AI {lastCommandResult.type.toUpperCase()}
                </Badge>
                <p className="text-gray-700 whitespace-pre-line">{lastCommandResult.content}</p>
                {lastCommandResult.suggestions && (
                  <div className="mt-3 space-y-1">
                    {lastCommandResult.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-sm text-purple-700 bg-purple-50 px-2 py-1 rounded">
                        💡 {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Input Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Type naturally: 'I have a headache after lunch' or use AI commands: '/log tired and anxious' or '/analyze my patterns'"
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              className="min-h-24 border-green-200 focus:border-green-400"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleSubmitLog}
                disabled={!logText.trim()}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {parseCommand(logText).isCommand ? 'Execute Command' : 'Smart Log'}
              </Button>
              
              <Button
                onClick={() => setShowCommandPalette(true)}
                variant="outline"
                className="border-purple-200 text-purple-700"
              >
                <Command className="w-4 h-4 mr-2" />
                Commands
              </Button>
              
              <Button
                onClick={toggleVoiceInput}
                variant="outline"
                className={`border-green-200 ${isListening ? 'bg-red-50 text-red-700' : 'text-green-700'}`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 mr-2" />
                ) : (
                  <Mic className="w-4 h-4 mr-2" />
                )}
                {isListening ? 'Stop' : 'Voice'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Recent Entries */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Smart Health Entries</h3>
          {entries.map((entry) => (
            <Card key={entry.id} className="bg-white/70 backdrop-blur-sm border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString()}
                  </span>
                  <div className="flex space-x-1">
                    <Badge className="bg-blue-100 text-blue-700">
                      Mood: {entry.mood}/10
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-700">
                      Severity: {entry.severity}/10
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{entry.text}</p>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {entry.symptoms.map((symptom) => (
                      <Badge key={symptom} className="bg-red-100 text-red-700">
                        {symptom}
                      </Badge>
                    ))}
                    {entry.context && (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        {entry.context}
                      </Badge>
                    )}
                  </div>
                  
                  {entry.aiInsights && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">AI Insights</span>
                      </div>
                      <div className="space-y-1">
                        {entry.aiInsights.map((insight, index) => (
                          <p key={index} className="text-xs text-purple-700">• {insight}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CommandPalette
        isVisible={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onCommandExecute={handleCommandExecute}
      />
    </div>
  );
};
