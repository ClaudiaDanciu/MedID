
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, CheckCircle, AlertCircle, XCircle, Loader2, FileText, Zap } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface MenuItem {
  name: string;
  description: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  recommendation: 'recommended' | 'caution' | 'avoid';
  reason: string;
  interactions?: string[];
  alternatives?: string[];
  confidence: number;
}

interface MenuPage {
  id: string;
  image: string;
  items: MenuItem[];
  category: string;
}

export const EnhancedMenuVision = () => {
  const [menuPages, setMenuPages] = useState<MenuPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();

  const takePhoto = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const photo = await CapacitorCamera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera
        });
        
        if (photo.dataUrl) {
          analyzeMenuPage(photo.dataUrl);
        }
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              analyzeMenuPage(result);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please try again.",
        variant: "destructive"
      });
    }
  };

  const analyzeMenuPage = async (imageData: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate progressive analysis
    const progressSteps = [
      { step: 20, message: "Scanning menu text..." },
      { step: 50, message: "Extracting dish information..." },
      { step: 70, message: "Analyzing ingredients..." },
      { step: 90, message: "Checking health profile..." },
      { step: 100, message: "Generating recommendations..." }
    ];

    for (const { step, message } of progressSteps) {
      setAnalysisProgress(step);
      toast({
        title: "MenuVision™ Processing",
        description: message
      });
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Enhanced mock analysis results with nutrition and interactions
    const mockItems: MenuItem[] = [
      {
        name: "Grilled Atlantic Salmon",
        description: "Fresh salmon fillet with lemon herb seasoning, served with quinoa pilaf and seasonal vegetables",
        ingredients: ["salmon", "quinoa", "broccoli", "carrots", "olive oil", "lemon", "herbs"],
        nutrition: { calories: 520, carbs: 35, protein: 42, fat: 18 },
        recommendation: "recommended",
        reason: "Excellent source of omega-3s, supports heart health goals, anti-inflammatory properties",
        alternatives: ["Try the wild-caught option for better nutrient profile"],
        confidence: 95
      },
      {
        name: "Caesar Salad with Chicken",
        description: "Crisp romaine lettuce, grilled chicken breast, parmesan cheese, croutons, classic caesar dressing",
        ingredients: ["romaine lettuce", "chicken breast", "parmesan", "croutons", "caesar dressing", "anchovies"],
        nutrition: { calories: 680, carbs: 28, protein: 35, fat: 45 },
        recommendation: "caution",
        reason: "High sodium content (1,200mg) may affect blood pressure management",
        alternatives: ["Ask for dressing on the side", "Request no croutons to reduce sodium"],
        confidence: 88
      },
      {
        name: "Thai Peanut Noodles",
        description: "Rice noodles in spicy peanut sauce with vegetables and choice of protein",
        ingredients: ["rice noodles", "peanuts", "peanut butter", "soy sauce", "vegetables", "chili"],
        nutrition: { calories: 750, carbs: 85, protein: 28, fat: 32 },
        recommendation: "avoid",
        reason: "Contains peanuts - severe allergy risk based on your profile",
        interactions: ["CRITICAL: Peanut allergy interaction - avoid completely"],
        confidence: 100
      },
      {
        name: "Mediterranean Quinoa Bowl",
        description: "Organic quinoa with chickpeas, cucumber, tomatoes, red onion, feta, olive oil dressing",
        ingredients: ["quinoa", "chickpeas", "cucumber", "tomatoes", "red onion", "feta", "olive oil"],
        nutrition: { calories: 485, carbs: 58, protein: 18, fat: 16 },
        recommendation: "recommended",
        reason: "Anti-inflammatory ingredients, high fiber, supports digestive health goals",
        alternatives: ["Add avocado for healthy fats", "Request extra vegetables"],
        confidence: 92
      }
    ];
    
    const newPage: MenuPage = {
      id: Date.now().toString(),
      image: imageData,
      items: mockItems,
      category: "Main Dishes"
    };
    
    setMenuPages(prev => [...prev, newPage]);
    setCurrentPage(menuPages.length);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    
    toast({
      title: "MenuVision™ Analysis Complete",
      description: `Analyzed ${mockItems.length} items with health recommendations`
    });
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'recommended':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'caution':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'avoid':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'recommended':
        return 'border-green-200 bg-green-50';
      case 'caution':
        return 'border-yellow-200 bg-yellow-50';
      case 'avoid':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const clearAllPages = () => {
    setMenuPages([]);
    setCurrentPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced MenuVision Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-6 h-6" />
            <span>MenuVision™ Pro</span>
            <Badge className="bg-white/20 text-white">Enhanced AI</Badge>
          </CardTitle>
          <p className="text-blue-100">
            Multi-page menu scanning with nutrition analysis and interaction warnings
          </p>
        </CardHeader>
      </Card>

      {/* Camera Controls */}
      {menuPages.length === 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-gray-600">Scan multiple menu pages for comprehensive analysis</p>
              <div className="flex space-x-3 justify-center">
                <Button
                  onClick={takePhoto}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Menu Page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multi-page Navigation */}
      {menuPages.length > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {menuPages.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(index)}
                    className="w-10 h-10"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={takePhoto}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Add Page
                </Button>
                <Button
                  onClick={clearAllPages}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
            
            {menuPages[currentPage] && (
              <div className="space-y-3">
                <img 
                  src={menuPages[currentPage].image} 
                  alt={`Menu Page ${currentPage + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Badge className="bg-blue-100 text-blue-700">
                  {menuPages[currentPage].category} - Page {currentPage + 1} of {menuPages.length}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
              <div className="space-y-2">
                <p className="text-gray-600">MenuVision™ AI Processing...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{analysisProgress}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Menu Analysis Results */}
      {menuPages.length > 0 && !isAnalyzing && menuPages[currentPage] && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Smart Menu Analysis</h3>
            <Badge className="bg-purple-100 text-purple-700">
              <Zap className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>
          
          {menuPages[currentPage].items.map((item, index) => (
            <Card key={index} className={`border-2 ${getRecommendationColor(item.recommendation)}`}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        {getRecommendationIcon(item.recommendation)}
                        <Badge variant="outline" className="text-xs">
                          {item.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Nutrition Info */}
                  <div className="grid grid-cols-4 gap-2 text-center bg-white/50 p-2 rounded">
                    <div>
                      <div className="text-xs text-gray-500">Calories</div>
                      <div className="font-semibold">{item.nutrition.calories}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Carbs</div>
                      <div className="font-semibold">{item.nutrition.carbs}g</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Protein</div>
                      <div className="font-semibold">{item.nutrition.protein}g</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Fat</div>
                      <div className="font-semibold">{item.nutrition.fat}g</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 font-medium">{item.reason}</p>
                  
                  {/* Interactions Warning */}
                  {item.interactions && (
                    <div className="bg-red-100 border border-red-300 p-2 rounded">
                      <div className="flex items-center space-x-1 mb-1">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-semibold text-red-800">Health Interactions</span>
                      </div>
                      {item.interactions.map((interaction, idx) => (
                        <p key={idx} className="text-xs text-red-700">{interaction}</p>
                      ))}
                    </div>
                  )}
                  
                  {/* Alternatives */}
                  {item.alternatives && (
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="text-sm font-semibold text-blue-800 mb-1">💡 Smart Suggestions:</div>
                      {item.alternatives.map((alt, idx) => (
                        <p key={idx} className="text-xs text-blue-700">• {alt}</p>
                      ))}
                    </div>
                  )}
                  
                  {/* Ingredients */}
                  <div className="flex flex-wrap gap-1">
                    {item.ingredients.map((ingredient) => (
                      <Badge key={ingredient} variant="outline" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
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
