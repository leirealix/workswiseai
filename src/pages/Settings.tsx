
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Sidebar from '@/components/Sidebar';
import { toast } from 'sonner';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  autoSave: boolean;
  userInfo: {
    name: string;
    email: string;
    organization: string;
  };
}

export default function Settings() {
  const defaultSettings: Settings = {
    theme: 'system',
    notifications: true,
    autoSave: true,
    userInfo: {
      name: '',
      email: '',
      organization: '',
    }
  };

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('workswise_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('workswise_settings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings(defaultSettings);
      localStorage.setItem('workswise_settings', JSON.stringify(defaultSettings));
      toast.info('Settings have been reset to default');
    }
  };

  const updateUserInfo = (key: keyof Settings['userInfo'], value: string) => {
    setSettings({
      ...settings,
      userInfo: {
        ...settings.userInfo,
        [key]: value,
      }
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Appearance</h2>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred theme</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={settings.theme === 'light' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSettings({...settings, theme: 'light'})}
                    >
                      Light
                    </Button>
                    <Button 
                      variant={settings.theme === 'dark' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSettings({...settings, theme: 'dark'})}
                    >
                      Dark
                    </Button>
                    <Button 
                      variant={settings.theme === 'system' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSettings({...settings, theme: 'system'})}
                    >
                      System
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Document Handling</h2>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autosave">Auto-save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save all conversations</p>
                  </div>
                  <Switch 
                    id="autosave" 
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">User Information</h2>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={settings.userInfo.name} 
                    onChange={(e) => updateUserInfo('name', e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={settings.userInfo.email}
                    onChange={(e) => updateUserInfo('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input 
                    id="organization" 
                    value={settings.userInfo.organization}
                    onChange={(e) => updateUserInfo('organization', e.target.value)}
                    placeholder="Your company or organization"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for important events</p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings}>
            Save Changes
          </Button>
        </div>
      </main>
    </div>
  );
}
