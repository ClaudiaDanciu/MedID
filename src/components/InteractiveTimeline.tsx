import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, Filter, TrendingUp, AlertCircle, Clock, ZoomIn, ZoomOut } from 'lucide-react';

interface TimelineDataPoint {
  date: string;
  symptoms: number;
  mood: number;
  energy: number;
}

const timelineData: TimelineDataPoint[] = [
  { date: '2024-01-01', symptoms: 3, mood: 7, energy: 6 },
  { date: '2024-01-08', symptoms: 5, mood: 4, energy: 3 },
  { date: '2024-01-15', symptoms: 2, mood: 8, energy: 7 },
  { date: '2024-01-22', symptoms: 4, mood: 6, energy: 5 },
  { date: '2024-01-29', symptoms: 1, mood: 9, energy: 8 },
  { date: '2024-02-05', symptoms: 3, mood: 7, energy: 6 },
  { date: '2024-02-12', symptoms: 5, mood: 4, energy: 3 },
  { date: '2024-02-19', symptoms: 2, mood: 8, energy: 7 },
  { date: '2024-02-26', symptoms: 4, mood: 6, energy: 5 },
  { date: '2024-03-04', symptoms: 1, mood: 9, energy: 8 },
  { date: '2024-03-11', symptoms: 3, mood: 7, energy: 6 },
  { date: '2024-03-18', symptoms: 5, mood: 4, energy: 3 },
  { date: '2024-03-25', symptoms: 2, mood: 8, energy: 7 },
  { date: '2024-04-01', symptoms: 4, mood: 6, energy: 5 },
  { date: '2024-04-08', symptoms: 3, mood: 7, energy: 6 },
  { date: '2024-04-15', symptoms: 5, mood: 4, energy: 3 },
  { date: '2024-04-22', symptoms: 2, mood: 8, energy: 7 },
  { date: '2024-04-29', symptoms: 1, mood: 9, energy: 8 },
  { date: '2024-05-06', symptoms: 3, mood: 7, energy: 6 },
  { date: '2024-05-13', symptoms: 5, mood: 4, energy: 3 },
  { date: '2024-05-20', symptoms: 2, mood: 8, energy: 7 },
  { date: '2024-05-27', symptoms: 4, mood: 6, energy: 5 },
];

const filterDataByRange = (data: TimelineDataPoint[], range: 'week' | 'month' | 'quarter'): TimelineDataPoint[] => {
  const today = new Date();
  let startDate: Date;

  switch (range) {
    case 'week':
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      break;
    case 'quarter':
      startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
      break;
  }

  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= today;
  });
};

export const InteractiveTimeline = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'symptoms' | 'mood' | 'energy'>('symptoms');
  const [zoomLevel, setZoomLevel] = useState<'day' | 'week' | 'month'>('week');
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = filterDataByRange(timelineData, selectedTimeRange);

  const handleZoomIn = () => {
    if (zoomLevel === 'month') setZoomLevel('week');
    else if (zoomLevel === 'week') setZoomLevel('day');
  };

  const handleZoomOut = () => {
    if (zoomLevel === 'day') setZoomLevel('week');
    else if (zoomLevel === 'week') setZoomLevel('month');
  };

  const getPatternInsights = () => {
    const recentData = filteredData.slice(-7);
    const avgMood = recentData.reduce((sum, day) => sum + day.mood, 0) / recentData.length;
    const avgEnergy = recentData.reduce((sum, day) => sum + day.energy, 0) / recentData.length;
    
    const insights = [];
    if (avgMood < 6) insights.push("Mood trending lower this week");
    if (avgEnergy < 5) insights.push("Energy levels below average");
    if (recentData.filter(d => new Date(d.date).getDay() === 1).every(d => d.mood < 6)) {
      insights.push("Mondays consistently challenging");
    }
    
    return insights;
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Interactive Health Timeline</span>
            </CardTitle>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
              
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoomLevel === 'month'}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoomLevel === 'day'}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <div className="flex space-x-1">
                {(['week', 'month', 'quarter'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={selectedTimeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeRange(range)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
              
              <div className="flex space-x-1">
                {(['symptoms', 'mood', 'energy'] as const).map((metric) => (
                  <Button
                    key={metric}
                    variant={selectedMetric === metric ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMetric(metric)}
                  >
                    {metric}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Main Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedMetric === 'symptoms' ? (
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [value, name]}
                    />
                    <Bar dataKey="symptoms" fill="#ef4444" />
                  </BarChart>
                ) : (
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis domain={[1, 10]} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [value, name]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={selectedMetric} 
                      stroke={selectedMetric === 'mood' ? '#22c55e' : '#3b82f6'} 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
            
            {/* Pattern Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Patterns Detected
                  </h4>
                  <div className="space-y-2">
                    {getPatternInsights().map((insight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {insight}
                      </Badge>
                    ))}
                    {getPatternInsights().length === 0 && (
                      <p className="text-sm text-blue-700">No significant patterns detected</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Recommendations
                  </h4>
                  <div className="space-y-1 text-sm text-amber-800">
                    <p>• Track sleep quality for better insights</p>
                    <p>• Note meal timing with symptoms</p>
                    <p>• Consider weekly mood check-ins</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
