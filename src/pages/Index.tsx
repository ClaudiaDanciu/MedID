import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatInterface } from '@/components/ChatInterface';
import { ProfileSection } from '@/components/ProfileSection';
import { EnhancedMenuVision } from '@/components/EnhancedMenuVision';
import { InteractiveTimeline } from '@/components/InteractiveTimeline';
import { AIInsightsEngine } from '@/components/AIInsightsEngine';
import { ReportSection } from '@/components/ReportSection';
import { Activity, User, Camera, BarChart3, FileText, MessageCircle, Settings, LogOut } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

type ActiveSection = 'chat' | 'menu' | 'insights' | 'reports';

const Index = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('chat');
  const [isNative, setIsNative] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  const sections = [
    { 
      id: 'chat' as const, 
      label: 'Chat', 
      icon: MessageCircle, 
      component: ChatInterface,
      description: 'AI health companion'
    },
    { 
      id: 'menu' as const, 
      label: 'Menu', 
      icon: Camera, 
      component: EnhancedMenuVision,
      description: 'Scan menus'
    },
    { 
      id: 'insights' as const, 
      label: 'Insights', 
      icon: BarChart3, 
      component: () => (
        <div className="space-y-6">
          <InteractiveTimeline />
          <AIInsightsEngine />
        </div>
      ),
      description: 'Health analytics'
    },
    { 
      id: 'reports' as const, 
      label: 'Reports', 
      icon: FileText, 
      component: ReportSection,
      description: 'Export data'
    },
  ];

  // Add ProfileSection to component lookup even though it's not in navigation
  const getActiveComponent = () => {
    const section = sections.find(section => section.id === activeSection);
    return section?.component || ChatInterface;
  };

  const ActiveComponent = getActiveComponent();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Apple-inspired glass morphism */}
      <header className={`glass border-b border-border/50 sticky top-0 z-50 transition-smooth ${isNative ? 'pt-safe-area-inset-top' : ''}`}>
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                  SYMPA+
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Your AI Health Companion {isNative && '• Native'}
                </p>
              </div>
            </div>
            
            {/* Profile Section - Apple-style */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="relative h-14 w-14 rounded-full p-0 hover:bg-muted/60 transition-smooth">
                  <Avatar className="h-14 w-14 ring-2 ring-border">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 shadow-lg border-border/50" align="end">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 ring-2 ring-border">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        <User className="w-9 h-9" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">John Doe</p>
                      <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <Dialog open={showProfile} onOpenChange={setShowProfile}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 font-medium transition-smooth hover:bg-muted/60"
                      >
                        <User className="w-5 h-5 mr-3 text-muted-foreground" />
                        View Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto border-border/50">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Health Profile</DialogTitle>
                      </DialogHeader>
                      <ProfileSection />
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start h-12 font-medium transition-smooth hover:bg-muted/60">
                        <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
                        Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md border-border/50">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 p-6">
                        <div className="space-y-3">
                          <h3 className="font-medium text-foreground">Notifications</h3>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Health reminders</span>
                            <Button variant="outline" size="sm" className="h-8">On</Button>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Symptom tracking</span>
                            <Button variant="outline" size="sm" className="h-8">On</Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-medium text-foreground">Privacy</h3>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Data sharing</span>
                            <Button variant="outline" size="sm" className="h-8">Off</Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-medium text-foreground">Account</h3>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full h-11 font-medium">Export Data</Button>
                            <Button variant="outline" className="w-full h-11 font-medium text-destructive hover:bg-destructive/10">Delete Account</Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="ghost" className="w-full justify-start h-12 font-medium transition-smooth hover:bg-destructive/10 text-destructive">
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Main Content - Apple-inspired spacing */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-6 py-8 pb-32">
        <div className="flex-1 flex flex-col">
          <ActiveComponent />
        </div>
      </main>

      {/* Bottom Navigation - Apple-inspired glass design */}
      <nav className={`fixed bottom-0 left-0 right-0 glass border-t border-border/50 ${isNative ? 'pb-safe-area-inset-bottom' : 'pb-3'}`}>
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex justify-around items-center">
            {sections.map(({ id, label, icon: Icon, description }) => (
              <Button
                key={id}
                variant={activeSection === id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveSection(id)}
                className={`flex-1 flex flex-col items-center py-4 px-3 space-y-2 max-w-24 min-h-20 transition-smooth ${
                  activeSection === id 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium leading-tight text-center">{label}</span>
                {activeSection !== id && (
                  <span className="text-xs opacity-60 leading-tight text-center hidden sm:block">
                    {description}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Index;
