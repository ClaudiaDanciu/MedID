
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { callClaude, handleClaudeError } from '@/utils/claude';
import { buildHealthSystemPrompt } from '@/utils/healthContext';
import { loadLogEntries, loadTimelineData } from '@/utils/storage';

interface AIInsight {
  id: string;
  type: 'pattern' | 'medical' | 'lifestyle' | 'warning';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  suggestions: string[];
  evidence: string[];
  rating?: number;
}

export const AIInsightsEngine = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateInsights = async () => {
    const logs = loadLogEntries().slice(0, 30);
    const timeline = loadTimelineData().slice(-14);

    if (logs.length === 0) {
      toast({
        title: "No data yet",
        description: "Log some health entries first to generate meaningful insights."
      });
      return;
    }

    setIsGenerating(true);

    try {
      const systemPrompt = buildHealthSystemPrompt(
        `You are a health insights AI. Analyze the provided health log data and return a JSON array of exactly 4 insight objects.
Each object must have this exact shape:
{ "id": string, "type": "pattern"|"medical"|"lifestyle"|"warning", "title": string, "description": string, "confidence": number (0-100), "actionable": boolean, "suggestions": string[], "evidence": string[] }
Return ONLY valid JSON array. No other text before or after.`
      );

      const dataContext = `Recent health logs (last 30):\n${JSON.stringify(logs, null, 2)}\n\nTimeline data (last 14 days):\n${JSON.stringify(timeline, null, 2)}`;

      const raw = await callClaude(
        [{ role: 'user', content: `Analyze this health data and return the JSON array:\n${dataContext}` }],
        systemPrompt,
        2048
      );

      const parsed: AIInsight[] = JSON.parse(raw);
      setInsights(Array.isArray(parsed) ? parsed : []);
      toast({
        title: "AI Insights Generated",
        description: `Found ${parsed.length} personalized health insights`
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast({ title: "Processing Error", description: "Could not parse AI response. Please try again.", variant: "destructive" });
      } else {
        handleClaudeError(error, toast);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const rateInsight = (insightId: string, rating: number) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId ? { ...insight, rating } : insight
    ));
    
    toast({
      title: "Feedback Recorded",
      description: "Thank you! This helps improve AI recommendations."
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'medical':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'lifestyle':
        return <Lightbulb className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern':
        return 'border-blue-200 bg-blue-50';
      case 'medical':
        return 'border-orange-200 bg-orange-50';
      case 'lifestyle':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  useEffect(() => {
    // Auto-generate insights on component mount
    generateInsights();
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6" />
            <span>AI Health Insights Engine</span>
            <Badge className="bg-white/20 text-white">Advanced ML</Badge>
          </CardTitle>
          <p className="text-indigo-100">
            Personalized health intelligence from your data patterns
          </p>
        </CardHeader>
      </Card>

      {/* Generate Button */}
      <Card className="bg-white/70 backdrop-blur-sm border-indigo-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Button
              onClick={generateInsights}
              disabled={isGenerating}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              {isGenerating ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing Patterns...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate New Insights
                </>
              )}
            </Button>
            <p className="text-sm text-gray-600">
              AI analyzes your health data to find patterns and provide personalized recommendations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Insights Display */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Personalized Health Insights</h3>
          
          {insights.map((insight) => (
            <Card key={insight.id} className={`border-2 ${getInsightColor(insight.type)}`}>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% confidence
                          </Badge>
                          {insight.actionable && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              Actionable
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Evidence */}
                  <div className="bg-white/70 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-800 mb-2">Evidence & Data Points:</div>
                    <div className="space-y-1">
                      {insight.evidence.map((evidence, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-xs text-gray-600">{evidence}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 mb-2">AI Recommendations:</div>
                    <div className="space-y-1">
                      {insight.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Lightbulb className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-blue-700">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating System */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">Was this insight helpful?</div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rateInsight(insight.id, 1)}
                        className={`${insight.rating === 1 ? 'bg-green-100 text-green-700' : ''}`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rateInsight(insight.id, -1)}
                        className={`${insight.rating === -1 ? 'bg-red-100 text-red-700' : ''}`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
