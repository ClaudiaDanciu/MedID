
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Share, Calendar } from 'lucide-react';

export const ReportSection = () => {
  const { toast } = useToast();

  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your health report has been prepared for export"
    });
  };

  const exportPDF = () => {
    toast({
      title: "Export Started",
      description: "Your PDF report is being generated..."
    });
  };

  const shareReport = () => {
    toast({
      title: "Share Options",
      description: "Choose how you'd like to share your health report"
    });
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-6 h-6" />
            <span>Health Report</span>
          </CardTitle>
          <p className="text-orange-100">
            Export your health data for healthcare visits
          </p>
        </CardHeader>
      </Card>

      {/* Report Summary */}
      <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Report Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Log Entries</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">7</div>
              <div className="text-sm text-gray-600">Days Tracked</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Key Insights</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">• Headaches occur 3x after lunch meals</p>
              <p className="text-sm text-gray-600">• Energy levels peak in the morning</p>
              <p className="text-sm text-gray-600">• Mood correlates with sleep quality</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Recommendations</h4>
            <div className="space-y-1">
              <Badge className="bg-yellow-100 text-yellow-700 mr-1 mb-1">
                Consider food allergy testing
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 mr-1 mb-1">
                Review medication timing
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Export Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={generateReport}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Full Report
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={exportPDF}
              variant="outline"
              className="border-orange-200 text-orange-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            
            <Button
              onClick={shareReport}
              variant="outline"
              className="border-orange-200 text-orange-700"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
