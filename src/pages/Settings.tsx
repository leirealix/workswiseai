
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChevronRightIcon, SettingsIcon, UserIcon, BellIcon, ShieldIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Sidebar from '@/components/Sidebar';

interface UserSettings {
  notifications: {
    email: boolean;
    browser: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  privacy: {
    saveHistory: boolean;
    shareUsageData: boolean;
  };
  profile: {
    name: string;
    email: string;
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      browser: true,
    },
    theme: 'system',
    privacy: {
      saveHistory: true,
      shareUsageData: false,
    },
    profile: {
      name: '',
      email: '',
    }
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved."
    });
  };

  const updateNotifications = (key: keyof UserSettings['notifications'], value: boolean) => {
    const updatedNotifications = { ...settings.notifications, [key]: value };
    updateSettings({ notifications: updatedNotifications });
  };

  const updatePrivacy = (key: keyof UserSettings['privacy'], value: boolean) => {
    const updatedPrivacy = { ...settings.privacy, [key]: value };
    updateSettings({ privacy: updatedPrivacy });
  };

  const updateProfile = (key: keyof UserSettings['profile'], value: string) => {
    const updatedProfile = { ...settings.profile, [key]: value };
    updateSettings({ profile: updatedProfile });
  };

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <div className="h-full w-full overflow-hidden flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="flex-1 overflow-hidden">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="theme">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="flex-1 overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={settings.profile.name} 
                    onChange={(e) => updateProfile('name', e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={settings.profile.email} 
                    onChange={(e) => updateProfile('email', e.target.value)}
                    placeholder="Your email address"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="flex-1 overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateNotifications('email', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser-notifications">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch 
                    id="browser-notifications" 
                    checked={settings.notifications.browser}
                    onCheckedChange={(checked) => updateNotifications('browser', checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="flex-1 overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your data and privacy preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="save-history">Save Conversation History</Label>
                    <p className="text-sm text-muted-foreground">
                      Store your chat history for future reference
                    </p>
                  </div>
                  <Switch 
                    id="save-history" 
                    checked={settings.privacy.saveHistory}
                    onCheckedChange={(checked) => updatePrivacy('saveHistory', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-data">Share Usage Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve our services by sharing anonymous usage data
                    </p>
                  </div>
                  <Switch 
                    id="share-data" 
                    checked={settings.privacy.shareUsageData}
                    onCheckedChange={(checked) => updatePrivacy('shareUsageData', checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="flex-1 overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card 
                    className={`cursor-pointer border-2 ${settings.theme === 'light' ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => updateSettings({ theme: 'light' })}
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="w-full h-24 rounded-md bg-white border mb-3"></div>
                      <span>Light</span>
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer border-2 ${settings.theme === 'dark' ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => updateSettings({ theme: 'dark' })}
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="w-full h-24 rounded-md bg-gray-800 border mb-3"></div>
                      <span>Dark</span>
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer border-2 ${settings.theme === 'system' ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => updateSettings({ theme: 'system' })}
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="w-full h-24 rounded-md bg-gradient-to-r from-white to-gray-800 border mb-3"></div>
                      <span>System</span>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
