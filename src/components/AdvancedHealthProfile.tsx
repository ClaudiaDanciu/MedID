
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Plus, X, Save, Heart, Activity, Target, AlertTriangle } from 'lucide-react';
import type { AdvancedProfile, VitalSigns } from '@/types/health';
import { loadProfile, saveProfile as saveProfileToStorage } from '@/utils/storage';

export type { AdvancedProfile, VitalSigns };

export const AdvancedHealthProfile = () => {
  const [profile, setProfile] = useState<AdvancedProfile>(() => loadProfile());

  const [newMedication, setNewMedication] = useState({
    name: '', dosage: '', frequency: '', timing: ''
  });
  const [newCondition, setNewCondition] = useState({
    name: '', severity: 'mild' as const, diagnosed: ''
  });
  const [newAllergy, setNewAllergy] = useState({
    allergen: '', severity: 'mild' as const, reaction: ''
  });
  const [newGoal, setNewGoal] = useState({
    goal: '', target: '', deadline: ''
  });

  const { toast } = useToast();

  const addMedication = () => {
    if (!newMedication.name.trim()) return;
    
    setProfile(prev => ({
      ...prev,
      medications: [...prev.medications, newMedication]
    }));
    setNewMedication({ name: '', dosage: '', frequency: '', timing: '' });
    
    toast({
      title: "Medication Added",
      description: "Added to your medication list"
    });
  };

  const addCondition = () => {
    if (!newCondition.name.trim()) return;
    
    setProfile(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
    setNewCondition({ name: '', severity: 'mild', diagnosed: '' });
    
    toast({
      title: "Condition Added",
      description: "Added to your health conditions"
    });
  };

  const addAllergy = () => {
    if (!newAllergy.allergen.trim()) return;
    
    setProfile(prev => ({
      ...prev,
      allergies: [...prev.allergies, newAllergy]
    }));
    setNewAllergy({ allergen: '', severity: 'mild', reaction: '' });
    
    toast({
      title: "Allergy Added",
      description: "Added to your allergy profile"
    });
  };

  const addGoal = () => {
    if (!newGoal.goal.trim()) return;
    
    setProfile(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
    setNewGoal({ goal: '', target: '', deadline: '' });
    
    toast({
      title: "Goal Added",
      description: "Added to your health goals"
    });
  };

  const updateVitals = (key: keyof VitalSigns, value: any) => {
    setProfile(prev => ({
      ...prev,
      vitals: { ...prev.vitals, [key]: value }
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-100 text-yellow-700';
      case 'moderate': return 'bg-orange-100 text-orange-700';
      case 'severe': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const saveProfile = () => {
    saveProfileToStorage(profile);
    toast({
      title: "Advanced Profile Saved",
      description: "Your comprehensive health profile has been updated"
    });
  };

  return (
    <div className="space-y-6">
      {/* Advanced Profile Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>Advanced Health Profile</span>
            <Badge className="bg-white/20 text-white">Professional</Badge>
          </CardTitle>
          <p className="text-blue-100">
            Comprehensive health management with smart recommendations
          </p>
        </CardHeader>
      </Card>

      {/* Vital Signs */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Current Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Blood Pressure</label>
              <div className="flex space-x-1">
                <Input
                  type="number"
                  placeholder="Systolic"
                  value={profile.vitals.bloodPressure.systolic}
                  onChange={(e) => updateVitals('bloodPressure', {
                    ...profile.vitals.bloodPressure,
                    systolic: Number(e.target.value)
                  })}
                  className="w-20"
                />
                <span className="self-center">/</span>
                <Input
                  type="number"
                  placeholder="Diastolic"
                  value={profile.vitals.bloodPressure.diastolic}
                  onChange={(e) => updateVitals('bloodPressure', {
                    ...profile.vitals.bloodPressure,
                    diastolic: Number(e.target.value)
                  })}
                  className="w-20"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Heart Rate (BPM)</label>
              <Input
                type="number"
                value={profile.vitals.heartRate}
                onChange={(e) => updateVitals('heartRate', Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (lbs)</label>
              <Input
                type="number"
                value={profile.vitals.weight}
                onChange={(e) => updateVitals('weight', Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Medications */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Medications & Supplements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input
              placeholder="Medication name"
              value={newMedication.name}
              onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Dosage (e.g., 10mg)"
              value={newMedication.dosage}
              onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
            />
            <Input
              placeholder="Frequency"
              value={newMedication.frequency}
              onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
            />
            <div className="flex space-x-2">
              <Input
                placeholder="Timing"
                value={newMedication.timing}
                onChange={(e) => setNewMedication(prev => ({ ...prev, timing: e.target.value }))}
              />
              <Button onClick={addMedication} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {profile.medications.map((med, index) => (
              <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{med.name}</div>
                  <div className="text-sm text-gray-600">
                    {med.dosage} • {med.frequency} • {med.timing}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProfile(prev => ({
                    ...prev,
                    medications: prev.medications.filter((_, i) => i !== index)
                  }))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Health Conditions */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Health Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input
              placeholder="Condition name"
              value={newCondition.name}
              onChange={(e) => setNewCondition(prev => ({ ...prev, name: e.target.value }))}
            />
            <select
              value={newCondition.severity}
              onChange={(e) => setNewCondition(prev => ({ ...prev, severity: e.target.value as any }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
            <Input
              type="date"
              value={newCondition.diagnosed}
              onChange={(e) => setNewCondition(prev => ({ ...prev, diagnosed: e.target.value }))}
            />
            <Button onClick={addCondition} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {profile.conditions.map((condition, index) => (
              <div key={index} className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{condition.name}</span>
                    <Badge className={getSeverityColor(condition.severity)}>
                      {condition.severity}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Diagnosed: {condition.diagnosed || 'Not specified'}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProfile(prev => ({
                    ...prev,
                    conditions: prev.conditions.filter((_, i) => i !== index)
                  }))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Allergies */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Allergies & Reactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input
              placeholder="Allergen"
              value={newAllergy.allergen}
              onChange={(e) => setNewAllergy(prev => ({ ...prev, allergen: e.target.value }))}
            />
            <select
              value={newAllergy.severity}
              onChange={(e) => setNewAllergy(prev => ({ ...prev, severity: e.target.value as any }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
            <Input
              placeholder="Reaction type"
              value={newAllergy.reaction}
              onChange={(e) => setNewAllergy(prev => ({ ...prev, reaction: e.target.value }))}
            />
            <Button onClick={addAllergy} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {profile.allergies.map((allergy, index) => (
              <div key={index} className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{allergy.allergen}</span>
                    <Badge className={getSeverityColor(allergy.severity)}>
                      {allergy.severity}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Reaction: {allergy.reaction}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProfile(prev => ({
                    ...prev,
                    allergies: prev.allergies.filter((_, i) => i !== index)
                  }))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Health Goals */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Smart Health Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input
              placeholder="Health goal"
              value={newGoal.goal}
              onChange={(e) => setNewGoal(prev => ({ ...prev, goal: e.target.value }))}
            />
            <Input
              placeholder="Target (measurable)"
              value={newGoal.target}
              onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
            />
            <Input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
            />
            <Button onClick={addGoal} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {profile.goals.map((goal, index) => (
              <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{goal.goal}</div>
                  <div className="text-sm text-gray-600">
                    Target: {goal.target} • Deadline: {goal.deadline}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProfile(prev => ({
                    ...prev,
                    goals: prev.goals.filter((_, i) => i !== index)
                  }))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        onClick={saveProfile}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Advanced Profile
      </Button>
    </div>
  );
};
