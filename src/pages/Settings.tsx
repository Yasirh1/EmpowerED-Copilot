import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Settings as SettingsIcon, 
  User, 
  Palette, 
  Globe, 
  Accessibility,
  Download,
  Trash2,
  Shield,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  
  // User Profile Settings
  const [profile, setProfile] = useState({
    name: "Student",
    email: "student@university.edu",
    university: "University of Excellence",
    major: "Computer Science",
  });

  // Accessibility Settings
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    fontSize: [16],
    captionSize: [14],
  });

  // Language & Transcription Settings
  const [language, setLanguage] = useState({
    interface: "en",
    transcription: "en-US",
    translation: "auto",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    processingComplete: true,
    weeklyDigest: true,
    studyReminders: false,
    newFeatures: true,
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    dataRetention: "1year",
    analytics: true,
    aiImprovement: true,
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be ready for download shortly.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your EmpowerED Copilot experience
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal and academic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                value={profile.university}
                onChange={(e) => setProfile(prev => ({ ...prev, university: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="major">Major/Field of Study</Label>
              <Input
                id="major"
                value={profile.major}
                onChange={(e) => setProfile(prev => ({ ...prev, major: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Settings */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Accessibility
          </CardTitle>
          <CardDescription>
            Customize the interface for better accessibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">
                Increases contrast for better visibility
              </p>
            </div>
            <Switch
              checked={accessibility.highContrast}
              onCheckedChange={(checked) => 
                setAccessibility(prev => ({ ...prev, highContrast: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Large Text</Label>
              <p className="text-sm text-muted-foreground">
                Increases font size throughout the app
              </p>
            </div>
            <Switch
              checked={accessibility.largeText}
              onCheckedChange={(checked) => 
                setAccessibility(prev => ({ ...prev, largeText: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Reduce Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimizes animations and transitions
              </p>
            </div>
            <Switch
              checked={accessibility.reducedMotion}
              onCheckedChange={(checked) => 
                setAccessibility(prev => ({ ...prev, reducedMotion: checked }))
              }
            />
          </div>

          <div className="space-y-3">
            <Label>Base Font Size: {accessibility.fontSize[0]}px</Label>
            <Slider
              value={accessibility.fontSize}
              onValueChange={(value) => 
                setAccessibility(prev => ({ ...prev, fontSize: value }))
              }
              max={24}
              min={12}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label>Caption Font Size: {accessibility.captionSize[0]}px</Label>
            <Slider
              value={accessibility.captionSize}
              onValueChange={(value) => 
                setAccessibility(prev => ({ ...prev, captionSize: value }))
              }
              max={20}
              min={10}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Language & Transcription */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Transcription
          </CardTitle>
          <CardDescription>
            Set your preferred languages and transcription settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Interface Language</Label>
              <Select value={language.interface} onValueChange={(value) => 
                setLanguage(prev => ({ ...prev, interface: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Default Transcription Language</Label>
              <Select value={language.transcription} onValueChange={(value) => 
                setLanguage(prev => ({ ...prev, transcription: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Auto-Translation</Label>
              <Select value={language.translation} onValueChange={(value) => 
                setLanguage(prev => ({ ...prev, translation: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  <SelectItem value="off">Disabled</SelectItem>
                  <SelectItem value="en">To English</SelectItem>
                  <SelectItem value="es">To Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose which notifications you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Processing Complete</Label>
              <p className="text-sm text-muted-foreground">
                Notify when file processing is finished
              </p>
            </div>
            <Switch
              checked={notifications.processingComplete}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, processingComplete: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">
                Summary of your learning activities
              </p>
            </div>
            <Switch
              checked={notifications.weeklyDigest}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, weeklyDigest: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Study Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Gentle reminders to review your materials
              </p>
            </div>
            <Switch
              checked={notifications.studyReminders}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, studyReminders: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">New Features</Label>
              <p className="text-sm text-muted-foreground">
                Updates about new EmpowerED features
              </p>
            </div>
            <Switch
              checked={notifications.newFeatures}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, newFeatures: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Data
          </CardTitle>
          <CardDescription>
            Manage your data and privacy preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Data Retention Period</Label>
            <Select value={privacy.dataRetention} onValueChange={(value) => 
              setPrivacy(prev => ({ ...prev, dataRetention: value }))
            }>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="2years">2 Years</SelectItem>
                <SelectItem value="forever">Keep Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Usage Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Help improve the app with anonymous usage data
              </p>
            </div>
            <Switch
              checked={privacy.analytics}
              onCheckedChange={(checked) => 
                setPrivacy(prev => ({ ...prev, analytics: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">AI Model Improvement</Label>
              <p className="text-sm text-muted-foreground">
                Use my interactions to improve AI responses
              </p>
            </div>
            <Switch
              checked={privacy.aiImprovement}
              onCheckedChange={(checked) => 
                setPrivacy(prev => ({ ...prev, aiImprovement: checked }))
              }
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleExportData} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-primary to-academic-blue">
          <SettingsIcon className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}