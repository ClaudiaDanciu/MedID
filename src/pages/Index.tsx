import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatInterface } from '@/components/ChatInterface';
import { ProfileSection } from '@/components/ProfileSection';
import { EnhancedMenuVision } from '@/components/EnhancedMenuVision';
import { InteractiveTimeline } from '@/components/InteractiveTimeline';
import { AIInsightsEngine } from '@/components/AIInsightsEngine';
import { ReportSection } from '@/components/ReportSection';
import { DisclaimerScreen } from '@/components/DisclaimerScreen';
import { Activity, User, Camera, BarChart3, FileText, MessageCircle, Settings, LogOut, Menu, Bell } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { hasAcceptedDisclaimer } from '@/utils/storage';

type ActiveSection = 'chat' | 'menu' | 'insights' | 'reports';

const Index = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('chat');
  const [isNative, setIsNative] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [disclaimerAccepted, setDisclaimerAcceptedState] = useState(hasAcceptedDisclaimer());

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  if (!disclaimerAccepted) {
    return <DisclaimerScreen onAccept={() => setDisclaimerAcceptedState(true)} />;
  }

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
      label: 'Scan', 
      icon: Camera, 
      component: EnhancedMenuVision,
      description: 'Scan menus'
    },
    { 
      id: 'insights' as const, 
      label: 'Insights', 
      icon: BarChart3, 
      component: () => (
        <div className="space-y-4">
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

  const getActiveComponent = () => {
    const section = sections.find(section => section.id === activeSection);
    return section?.component || ChatInterface;
  };

  const ActiveComponent = getActiveComponent();
  const activeLabel = sections.find(s => s.id === activeSection)?.label || 'SYMPA+';

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Mobile-First Header */}
      <header className={`bg-white border-b shrink-0 ${isNative ? 'pt-safe-area-inset-top' : ''}`}>
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: Menu Button */}
          <Sheet open={showMenu} onOpenChange={setShowMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Profile Header */}
                <SheetHeader className="p-6 border-b bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <SheetTitle className="text-lg font-semibold">John Doe</SheetTitle>
                      <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                    </div>
                  </div>
                </SheetHeader>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 space-y-2">
                    <Dialog open={showProfile} onOpenChange={setShowProfile}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12 text-base"
                          onClick={() => setShowMenu(false)}
                        >
                          <User className="w-5 h-5 mr-3 text-muted-foreground" />
                          Health Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Health Profile</DialogTitle>
                        </DialogHeader>
                        <ProfileSection />
                      </DialogContent>
                    </Dialog>

                    <Button variant="ghost" className="w-full justify-start h-12 text-base">
                      <Bell className="w-5 h-5 mr-3 text-muted-foreground" />
                      Notifications
                    </Button>

                    <Dialog open={showSettings} onOpenChange={setShowSettings}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12 text-base"
                          onClick={() => setShowMenu(false)}
                        >
                          <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
                          Settings
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Settings</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div className="space-y-3">
                            <h3 className="font-medium">Notifications</h3>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm text-muted-foreground">Health reminders</span>
                              <Button variant="outline" size="sm">On</Button>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm text-muted-foreground">Symptom tracking</span>
                              <Button variant="outline" size="sm">On</Button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-medium">Privacy</h3>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm text-muted-foreground">Data sharing</span>
                              <Button variant="outline" size="sm">Off</Button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-medium">Account</h3>
                            <div className="space-y-2">
                              <Button variant="outline" className="w-full">Export Data</Button>
                              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
                                Delete Account
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t space-y-2">
                  <Button variant="ghost" className="w-full justify-start h-12 text-base text-destructive hover:bg-destructive/10">
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                  {isNative && (
                    <div className="text-xs text-center text-muted-foreground pt-2">
                      Native App Mode
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Center: Active Section Title */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-foreground">{activeLabel}</h1>
          </div>

          {/* Right: Avatar */}
          <Avatar className="h-10 w-10 ring-2 ring-border cursor-pointer" onClick={() => setShowMenu(true)}>
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content - Full Height with Scroll */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="h-full">
          <ActiveComponent />
        </div>
      </main>

      {/* Bottom Navigation - iOS Style */}
      <nav className={`bg-white border-t shrink-0 ${isNative ? 'pb-safe-area-inset-bottom' : 'pb-2'}`}>
        <div className="flex items-center justify-around px-2 pt-2">
          {sections.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                <div className={`relative ${isActive ? 'scale-110' : 'scale-100'} transition-transform`}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Index;