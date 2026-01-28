
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export const TimelineSection = () => {
  // Mock timeline data
  const timelineData = [
    {
      date: '2024-06-15',
      mood: 8,
      energy: 7,
      symptoms: ['headache'],
      notes: 'Good day overall, slight headache after lunch'
    },
    {
      date: '2024-06-14',
      mood: 6,
      energy: 5,
      symptoms: ['fatigue', 'bloating'],
      notes: 'Felt tired and bloated after pasta dinner'
    },
    {
      date: '2024-06-13',
      mood: 9,
      energy: 9,
      symptoms: [],
      notes: 'Great day! Lots of energy and positive mood'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-6 h-6" />
            <span>Health Timeline</span>
          </CardTitle>
          <p className="text-purple-100">
            Track your health patterns over time
          </p>
        </CardHeader>
      </Card>

      {/* Timeline Entries */}
      <div className="space-y-4">
        {timelineData.map((entry, index) => (
          <Card key={index} className="bg-white/70 backdrop-blur-sm border-purple-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Badge className="bg-blue-100 text-blue-700">
                    Mood: {entry.mood}/10
                  </Badge>
                  <Badge className="bg-green-100 text-green-700">
                    Energy: {entry.energy}/10
                  </Badge>
                </div>
              </div>
              
              {entry.symptoms.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {entry.symptoms.map((symptom) => (
                      <Badge key={symptom} className="bg-red-100 text-red-700">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-gray-600 text-sm">{entry.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
