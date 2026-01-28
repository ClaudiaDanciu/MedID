
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Activity, 
  Brain, 
  Heart,
  Plus,
  Command
} from 'lucide-react';
import { parseCommand, executeCommand, AICommandResult, extractHealthData } from '@/utils/aiCommands';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  data?: any;
  suggestions?: string[];
}

const quickActions = [
  { label: "Log symptoms", command: "/log", icon: Activity },
  { label: "Analyze patterns", command: "/analyze", icon: Brain },
  { label: "Get coaching", command: "/coach", icon: Heart },
  { label: "Plan meals", command: "/plan", icon: Plus },
];

const samplePrompts = [
  "I have a headache after lunch",
  "Feeling anxious today",
  "Track my mood - feeling great!",
  "Help me plan healthy meals"
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI health companion. You can chat with me naturally about your symptoms, mood, or health goals. Try saying something like 'I have a headache' or use commands like /analyze.",
      timestamp: new Date(),
      suggestions: samplePrompts
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(async () => {
      const parsedCommand = parseCommand(inputValue);
      let aiResponse: ChatMessage;

      if (parsedCommand.isCommand && parsedCommand.command && parsedCommand.args) {
        // Handle AI command
        const result = await executeCommand(parsedCommand.command, parsedCommand.args);
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: result.content,
          timestamp: new Date(),
          data: result.data,
          suggestions: result.suggestions
        };
      } else {
        // Natural language processing
        const extracted = extractHealthData(inputValue);
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I've logged that for you! I detected: ${extracted.symptoms.length > 0 ? extracted.symptoms.join(', ') : 'general health note'} with mood level ${extracted.mood}/10. ${extracted.context ? `Context: ${extracted.context}.` : ''} Is there anything else you'd like to track?`,
          timestamp: new Date(),
          data: extracted,
          suggestions: [
            "Tell me more about your symptoms",
            "How long have you felt this way?",
            "Any triggers you can think of?",
            "Track another symptom"
          ]
        };
      }

      setIsTyping(false);
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickAction = (command: string) => {
    setInputValue(command + ' ');
    textareaRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    textareaRef.current?.focus();
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Voice Input Stopped" : "Voice Input Started",
      description: isListening ? "Microphone turned off" : "Speak your symptoms now"
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-green-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">SYMPA+ AI</h2>
            <p className="text-sm text-gray-500">Your health companion</p>
          </div>
          <div className="ml-auto">
            <Badge className="bg-green-100 text-green-700">Online</Badge>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-white/50">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickActions.map((action) => (
            <Button
              key={action.command}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.command)}
              className="flex-shrink-0 border-green-200 hover:bg-green-50"
            >
              <action.icon className="w-4 h-4 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-l-2xl rounded-tr-2xl'
                  : 'bg-white border border-gray-200 rounded-r-2xl rounded-tl-2xl'
              } p-4 shadow-sm`}
            >
              <p className="whitespace-pre-line">{message.content}</p>
              
              {message.data && (
                <div className="mt-3 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {message.data.symptoms?.map((symptom: string) => (
                      <Badge key={symptom} className="bg-red-100 text-red-700 text-xs">
                        {symptom}
                      </Badge>
                    ))}
                    {message.data.mood && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        Mood: {message.data.mood}/10
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-r-2xl rounded-tl-2xl p-4 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {messages.length > 0 && messages[messages.length - 1].suggestions && !isTyping && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 text-center">Suggested responses:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs border-blue-200 hover:bg-blue-50 text-blue-700"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-green-100">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder="Type your message or use /commands..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-12 max-h-32 resize-none border-green-200 focus:border-green-400 pr-12"
              rows={1}
            />
            {inputValue.startsWith('/') && (
              <div className="absolute right-3 top-3">
                <Command className="w-4 h-4 text-purple-500" />
              </div>
            )}
          </div>
          
          <Button
            onClick={toggleVoiceInput}
            variant="outline"
            size="sm"
            className={`${isListening ? 'bg-red-50 text-red-700 border-red-200' : 'border-green-200 text-green-700'}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
