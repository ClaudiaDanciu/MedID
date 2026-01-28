
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { aiCommands, parseCommand, executeCommand, AICommandResult } from '@/utils/aiCommands';
import { Command, Lightbulb, Zap } from 'lucide-react';

interface CommandPaletteProps {
  isVisible: boolean;
  onClose: () => void;
  onCommandExecute: (result: AICommandResult) => void;
}

export const CommandPalette = ({ isVisible, onClose, onCommandExecute }: CommandPaletteProps) => {
  const [selectedCommand, setSelectedCommand] = useState<string>('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const handleCommandClick = async (command: string) => {
    setSelectedCommand(command);
    // Execute with example args for demo
    const result = await executeCommand(command, 'example input');
    onCommandExecute(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Command className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">AI Command Palette</h3>
            <Badge className="bg-blue-100 text-blue-700">Pro</Badge>
          </div>
          
          <div className="space-y-3">
            {aiCommands.map((cmd) => (
              <Button
                key={cmd.command}
                variant="outline"
                onClick={() => handleCommandClick(cmd.command)}
                className="w-full justify-start text-left h-auto p-4 hover:bg-blue-50"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {cmd.command === '/log' && <Lightbulb className="w-5 h-5 text-green-600" />}
                    {cmd.command === '/analyze' && <Zap className="w-5 h-5 text-purple-600" />}
                    {cmd.command === '/coach' && <Command className="w-5 h-5 text-blue-600" />}
                    {cmd.command === '/plan' && <Lightbulb className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {cmd.command}
                      </code>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{cmd.description}</p>
                    <p className="text-xs text-gray-500 font-mono">{cmd.usage}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              Type commands directly in chat or use this palette • Press ESC to close
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
