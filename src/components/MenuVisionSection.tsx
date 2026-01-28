
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface MenuItem {
  name: string;
  ingredients: string[];
  recommendation: 'recommended' | 'caution' | 'avoid';
  reason: string;
}

export const MenuVisionSection = () => {
  const [image, setImage] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
          setImage(photo.dataUrl);
          analyzeMenu(photo.dataUrl);
        }
      } else {
        // Web fallback - file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              setImage(result);
              analyzeMenu(result);
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

  const selectFromGallery = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const photo = await CapacitorCamera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos
        });
        
        if (photo.dataUrl) {
          setImage(photo.dataUrl);
          analyzeMenu(photo.dataUrl);
        }
      } else {
        takePhoto(); // Fallback to file input
      }
    } catch (error) {
      toast({
        title: "Gallery Error",
        description: "Unable to access gallery. Please try again.",
        variant: "destructive"
      });
    }
  };

  const analyzeMenu = async (imageData: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI menu analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    const mockItems: MenuItem[] = [
      {
        name: "Grilled Salmon with Quinoa",
        ingredients: ["salmon", "quinoa", "vegetables", "olive oil"],
        recommendation: "recommended",
        reason: "High in omega-3s, supports heart health goals"
      },
      {
        name: "Caesar Salad",
        ingredients: ["romaine lettuce", "parmesan", "croutons", "caesar dressing"],
        recommendation: "caution",
        reason: "High sodium content may affect blood pressure"
      },
      {
        name: "Peanut Pad Thai",
        ingredients: ["rice noodles", "peanuts", "soy sauce", "fish sauce"],
        recommendation: "avoid",
        reason: "Contains peanuts - matches your allergy profile"
      },
      {
        name: "Mediterranean Bowl",
        ingredients: ["chickpeas", "cucumber", "tomatoes", "feta", "olive oil"],
        recommendation: "recommended",
        reason: "Anti-inflammatory ingredients support your wellness goals"
      }
    ];
    
    setMenuItems(mockItems);
    setIsAnalyzing(false);
    
    toast({
      title: "Menu Analysis Complete",
      description: `Analyzed ${mockItems.length} menu items based on your health profile`
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

  return (
    <div className="space-y-6">
      {/* MenuVision Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-6 h-6" />
            <span>MenuVision™</span>
          </CardTitle>
          <p className="text-blue-100">
            Scan any menu to get personalized recommendations based on your health profile
          </p>
        </CardHeader>
      </Card>

      {/* Camera Controls */}
      {!image && (
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-gray-600">Take a photo of a menu to get started</p>
              <div className="flex space-x-3 justify-center">
                <Button
                  onClick={takePhoto}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                <Button
                  onClick={selectFromGallery}
                  variant="outline"
                  className="border-blue-200 text-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose from Gallery
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview & Analysis */}
      {image && (
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <img 
                src={image} 
                alt="Menu" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={takePhoto}
                  variant="outline"
                  className="border-blue-200 text-blue-700"
                >
                  Retake Photo
                </Button>
                <Button
                  onClick={() => {
                    setImage(null);
                    setMenuItems([]);
                  }}
                  variant="outline"
                  className="border-red-200 text-red-700"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Loading */}
      {isAnalyzing && (
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
              <p className="text-gray-600">Analyzing menu items...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Analysis Results */}
      {menuItems.length > 0 && !isAnalyzing && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Menu Analysis Results</h3>
          {menuItems.map((item, index) => (
            <Card key={index} className={`border-2 ${getRecommendationColor(item.recommendation)}`}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  {getRecommendationIcon(item.recommendation)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.reason}</p>
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.map((ingredient) => (
                    <Badge key={ingredient} variant="outline" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
