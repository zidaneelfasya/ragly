"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Pencil, Save, X, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  joinDate: string;
  username: string;
}

export default function ProfileClient({ initialData }: { initialData: ProfileData }) {
  const supabase = createClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: initialData.fullName,
    phone: initialData.phone,
    username: initialData.username,
  });

  const [currentData, setCurrentData] = useState(initialData);

  const hasChanges = 
    formData.fullName !== currentData.fullName || 
    formData.phone !== currentData.phone ||
    formData.username !== currentData.username;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          full_name: formData.fullName,
          phone: formData.phone
        }
      });

      if (authError) throw authError;

      // Update public.profiles table if necessary
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone
        })
        .eq('user_id', currentData.id);
        
      if (profileError) {
        console.error("Error updating profile in database", profileError);
        // We don't throw here just in case profile table doesn't exist yet for some reason
      }

      setCurrentData({
        ...currentData,
        fullName: formData.fullName,
        phone: formData.phone,
        username: formData.username
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsEditing(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving profile", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: currentData.fullName,
      phone: currentData.phone,
      username: currentData.username,
    });
    setIsEditing(false);
  };

  const initials = currentData.fullName ? currentData.fullName.substring(0, 2).toUpperCase() : "UU";

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full space-y-6 p-4 pt-6 md:p-8 bg-background">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile Summary
        </h2>
      </div>

      {/* 1. Header Profile */}
      <Card className="border-border shadow-sm rounded-xl overflow-hidden bg-card">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-3xl font-medium text-muted-foreground border ring-1 ring-border shadow-sm shrink-0 overflow-hidden relative">
              {currentData.avatarUrl ? (
                <Image
                  src={currentData.avatarUrl}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {currentData.fullName}
                </h1>
                <Badge variant="secondary" className="font-medium bg-muted text-foreground border-transparent px-2.5 py-0.5 rounded-md">
                  Administrator
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{currentData.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Active Member since {currentData.joinDate}
              </p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isLoading} className="rounded-lg">
                <X className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!hasChanges || isLoading} 
                className="gap-2 rounded-lg shadow-sm font-medium transition-all"
                variant={isSuccess ? "outline" : "default"}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSuccess ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSuccess ? "Saved" : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="gap-2 shrink-0 rounded-lg shadow-sm font-medium"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Grid Layout Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width on desktop) */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* 2. Account Information */}
          <Card className="border-border shadow-sm rounded-xl overflow-hidden bg-card">
            <div className="border-b border-border bg-muted/20 px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">Account Information</h3>
            </div>
            <CardContent className="p-0">
              <dl className="divide-y divide-border">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4 min-h-[72px]">
                  <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Full Name</dt>
                  <dd className="text-sm font-medium text-foreground sm:w-2/3 mt-1 sm:mt-0">
                    {isEditing ? (
                      <Input 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="h-9 font-medium"
                      />
                    ) : (
                      currentData.fullName
                    )}
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4 min-h-[72px]">
                  <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Username</dt>
                  <dd className="text-sm font-medium text-foreground sm:w-2/3 mt-1 sm:mt-0">
                    {isEditing ? (
                      <Input 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="h-9 font-medium"
                        placeholder="@username"
                      />
                    ) : (
                      currentData.username
                    )}
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4 min-h-[72px]">
                  <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Email Address</dt>
                  <dd className="text-sm font-medium text-foreground sm:w-2/3 mt-1 sm:mt-0 opacity-70 cursor-not-allowed">
                    {currentData.email}
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4 min-h-[72px]">
                  <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Phone Number</dt>
                  <dd className="text-sm font-medium text-foreground sm:w-2/3 mt-1 sm:mt-0">
                    {isEditing ? (
                      <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="h-9 font-medium"
                        placeholder="+62 812-3456-7890"
                      />
                    ) : (
                      currentData.phone || "Not provided"
                    )}
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4 min-h-[72px]">
                  <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Location</dt>
                  <dd className="text-sm font-medium text-foreground sm:w-2/3 mt-1 sm:mt-0 opacity-70">
                    Jakarta, Indonesia
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* 5. Preferences */}
          <Card className="border-border shadow-sm rounded-xl overflow-hidden bg-card">
            <div className="border-b border-border bg-muted/20 px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">Preferences</h3>
            </div>
            <CardContent className="p-0">
              <dl className="divide-y divide-border">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4">
                  <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Theme</dt>
                  <dd className="text-sm font-medium text-foreground sm:w-2/3 mt-1 sm:mt-0">System Default</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4">
                  <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Language</dt>
                  <dd className="text-sm font-medium text-foreground sm:w-2/3 mt-1 sm:mt-0">English (US)</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4">
                  <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">Notifications</dt>
                  <dd className="text-sm font-medium text-foreground sm:w-2/3 mt-1 sm:mt-0 flex items-center gap-2">
                    Enabled <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width on desktop) */}
        <div className="col-span-1 space-y-6">
          
          {/* 3. Security Section */}
          <Card className="border-border shadow-sm rounded-xl overflow-hidden bg-card">
            <div className="border-b border-border bg-muted/20 px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">Security</h3>
            </div>
            <CardContent className="p-0">
              <div className="flex flex-col divide-y divide-border">
                <button className="flex justify-between items-center px-6 py-4 hover:bg-muted/30 transition-colors text-left">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Password</p>
                    <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Update &rarr;</span>
                </button>
                <button className="flex justify-between items-center px-6 py-4 hover:bg-muted/30 transition-colors text-left">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">2FA Authentication</p>
                    <p className="text-xs text-muted-foreground">Extra security layer</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 bg-emerald-500/10">Enabled</Badge>
                </button>
                <button className="flex justify-between items-center px-6 py-4 hover:bg-muted/30 transition-colors text-left">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Login Sessions</p>
                    <p className="text-xs text-muted-foreground">Manage active devices</p>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">View &rarr;</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* 4. Activity Section */}
          <Card className="border-border shadow-sm rounded-xl overflow-hidden bg-card">
            <div className="border-b border-border bg-muted/20 px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full border bg-muted/30 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">New Login Session</p>
                    <p className="text-xs text-muted-foreground">Jakarta, ID • Chrome MacOS</p>
                    <p className="text-xs text-muted-foreground mt-1">Just now</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full border bg-muted/30 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-foreground/20"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Profile Updated</p>
                    <p className="text-xs text-muted-foreground">Update account preferences</p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full border bg-muted/30 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-foreground/20"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Password Changed</p>
                    <p className="text-xs text-muted-foreground">Security settings</p>
                    <p className="text-xs text-muted-foreground mt-1">3 months ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
