import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { 
  User, 
  Bell, 
  Lock, 
  Palette,
  Upload,
  Mail,
  Save,
  Shield,
  LogOut
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { createClient } from "../utils/supabase/client";
import { projectId } from "../utils/supabase/info";

interface UserSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function UserSettingsDialog({ 
  open, 
  onOpenChange, 
  isDarkMode,
  onToggleDarkMode
}: UserSettingsDialogProps) {
  const { profile, updateProfile, signOut, refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!supabaseRef.current) {
      try {
        supabaseRef.current = createClient();
      } catch (error) {
        console.error("Failed to initialise Supabase client", error);
      }
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(name, profile?.avatar_url);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("File must be an image");
      return;
    }

    setIsUploading(true);
    
    try {
      const supabase = supabaseRef.current;
      if (!supabase) {
        toast.error("Supabase client is unavailable in this environment");
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error("Not authenticated");
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      const base64String = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Update profile with base64 image (as avatar_url)
      await updateProfile(name || profile?.name || "", base64String);
      await refreshProfile();
      toast.success("Avatar updated successfully!");
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const handleChangePassword = () => {
    toast.info("Password change functionality coming soon!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isDarkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-[#d4d4d4]'} sm:max-w-2xl max-h-[90vh]`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
            Settings
          </DialogTitle>
          <DialogDescription className={isDarkMode ? 'text-[#a0a0a0]' : 'text-[#868686]'}>
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className={`grid w-full grid-cols-4 ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-[#f5f5f5]'}`}>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">
              <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs sm:text-sm">
              <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-6">
            <TabsContent value="profile" className="space-y-6 pr-4">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}`} />
                  <AvatarFallback>{profile?.name?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleUploadAvatar}
                    disabled={isUploading}
                    className={`${isDarkMode ? 'border-[#2a2a2a] text-[#e5e5e5] hover:bg-[#2a2a2a]' : 'border-[#d4d4d4] text-[#333333] hover:bg-[#f5f5f5]'}`}
                  >
                    <Upload className="h-3 w-3 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Photo"}
                  </Button>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-[#a0a0a0]' : 'text-[#868686]'}`}>
                    JPG, PNG or GIF. Max 2MB
                  </p>
                </div>
              </div>

              <Separator className={isDarkMode ? 'bg-[#2a2a2a]' : 'bg-[#d4d4d4]'} />

              {/* Personal Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${isDarkMode ? 'border-[#2a2a2a] bg-[#0f0f0f] text-[#e5e5e5]' : 'border-[#d4d4d4] bg-white'} focus-visible:ring-[#CF0707]`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className={`${isDarkMode ? 'border-[#2a2a2a] bg-[#0f0f0f] text-[#e5e5e5] opacity-60' : 'border-[#d4d4d4] bg-white opacity-60'} focus-visible:ring-[#E11D48]`}
                  />
                  <p className={`text-xs ${isDarkMode ? 'text-[#a0a0a0]' : 'text-[#868686]'}`}>
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className={`w-full rounded-md px-3 py-2 text-sm ${isDarkMode ? 'border-[#2a2a2a] bg-[#0f0f0f] text-[#e5e5e5] placeholder:text-[#606060]' : 'border-[#d4d4d4] bg-white border'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CF0707]`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                    Public Profile
                  </Label>
                  <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-[#868686]'}`}>
                    Make your profile visible to others
                  </p>
                </div>
                <Switch
                  checked={publicProfile}
                  onCheckedChange={setPublicProfile}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className={`flex-1 ${isDarkMode ? 'bg-[#60a5fa] text-white hover:bg-[#8b5cf6]' : 'bg-[#E11D48] text-white hover:bg-[#BE123C]'} transition-all duration-200 hover:shadow-lg`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className={`${isDarkMode ? 'border-[#2a2a2a] text-[#e5e5e5] hover:bg-[#2a2a2a]' : 'border-[#d4d4d4] text-[#333333] hover:bg-[#f5f5f5]'}`}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 pr-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                      Email Notifications
                    </Label>
                    <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-[#868686]'}`}>
                      Receive email updates about your prompts
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator className={isDarkMode ? 'bg-[#2a2a2a]' : 'bg-[#d4d4d4]'} />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                      Push Notifications
                    </Label>
                    <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-[#868686]'}`}>
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>

                <Separator className={isDarkMode ? 'bg-[#2a2a2a]' : 'bg-[#d4d4d4]'} />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                      New Likes
                    </Label>
                    <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-[#868686]'}`}>
                      Notify when someone likes your prompt
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator className={isDarkMode ? 'bg-[#2a2a2a]' : 'bg-[#d4d4d4]'} />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                      Weekly Summary
                    </Label>
                    <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-[#868686]'}`}>
                      Receive a weekly summary of your activity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 pr-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    className={`${isDarkMode ? 'border-[#2a2a2a] bg-[#0f0f0f] text-[#e5e5e5]' : 'border-[#d4d4d4] bg-white'} focus-visible:ring-[#CF0707]`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    className={`${isDarkMode ? 'border-[#2a2a2a] bg-[#0f0f0f] text-[#e5e5e5]' : 'border-[#d4d4d4] bg-white'} focus-visible:ring-[#CF0707]`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className={`${isDarkMode ? 'border-[#2a2a2a] bg-[#0f0f0f] text-[#e5e5e5]' : 'border-[#d4d4d4] bg-white'} focus-visible:ring-[#CF0707]`}
                  />
                </div>

                <Button 
                  onClick={handleChangePassword}
                  className="w-full bg-[#CF0707] text-white hover:bg-[#a80606] transition-all duration-200 hover:shadow-lg"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>

                <Separator className={isDarkMode ? 'bg-[#2a2a2a]' : 'bg-[#d4d4d4]'} />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                      Two-Factor Authentication
                    </Label>
                    <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-[#868686]'}`}>
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 pr-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                      Dark Mode
                    </Label>
                    <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-[#868686]'}`}>
                      Toggle dark mode theme
                    </p>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={onToggleDarkMode}
                  />
                </div>

                <Separator className={isDarkMode ? 'bg-[#2a2a2a]' : 'bg-[#d4d4d4]'} />

                <div>
                  <Label className={`mb-3 block ${isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}`}>
                    Accent Color
                  </Label>
                  <div className="grid grid-cols-4 gap-3">
                    <button className="h-12 rounded-lg bg-[#CF0707] hover:ring-2 ring-[#CF0707] ring-offset-2 transition-all" />
                    <button className="h-12 rounded-lg bg-blue-600 hover:ring-2 ring-blue-600 ring-offset-2 transition-all" />
                    <button className="h-12 rounded-lg bg-green-600 hover:ring-2 ring-green-600 ring-offset-2 transition-all" />
                    <button className="h-12 rounded-lg bg-purple-600 hover:ring-2 ring-purple-600 ring-offset-2 transition-all" />
                  </div>
                </div>

                <Separator className={isDarkMode ? 'bg-[#2a2a2a]' : 'bg-[#d4d4d4]'} />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={isDarkMode ? 'text-[#e5e5e5]' : 'text-[#333333]'}>
                      Compact Mode
                    </Label>
                    <p className={`text-sm ${isDarkMode ? 'text-[#a0a0a0]' : 'text-[#868686]'}`}>
                      Reduce spacing for a denser layout
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
