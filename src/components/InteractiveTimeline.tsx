import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, Filter, TrendingUp, AlertCircle, Clock, ZoomIn, ZoomOut } from 'lucide-react';
import { loadTimelineData, TimelineDataPoint } from '@/utils/storage';

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
  const [allData, setAllData] = useState<TimelineDataPoint[]>(() => loadTimelineData());

  useEffect(() => {
    const refresh = () => setAllData(loadTimelineData());
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  const filteredData = filterDataByRange(allData, selectedTimeRange);

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
            {/* Empty state */}
            {allData.length === 0 && (
              <div className="h-80 flex items-center justify-center text-center">
                <div>
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No timeline data yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start logging health entries to see your timeline here</p>
                </div>
              </div>
            )}

            {/* Main Chart */}
            {allData.length > 0 && <div className="h-80">
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
            </div>}

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
