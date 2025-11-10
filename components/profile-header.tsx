import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Mail, Briefcase, Building2 } from "lucide-react";


import { useEffect, useState } from "react";

type Unit = {
  unit_id: number;
  unit_name?: string | null;
};

type ProfileHeaderProps = {
  profile: {
    full_name: string;
    email: string;
    jabatan?: string;
    satuan_kerja?: string;
    instansi?: string;
    role?: string;
    // Tambahkan field lain jika ingin tampilkan
  };
};


export default function ProfileHeader({ profile }: ProfileHeaderProps) {


  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://bundui-images.netlify.app/avatars/08.png" alt="Profile" />
              <AvatarFallback className="text-2xl">{profile.full_name ? profile.full_name[0] : "U"}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full">
              <Camera />
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{profile.full_name || "-"}</h1>
              <Badge variant="secondary">
                {profile.role
                  ? profile.role === "superadmin"
                    ? "Super Admin"
                    : "Unit Access"
                  : "Unit Access"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{profile.jabatan || "-"}</p>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {profile.email || "-"}
              </div>
              {profile.satuan_kerja && (
                <div className="flex items-center gap-1">
                  <Briefcase className="size-4" />
                  {profile.satuan_kerja}
                </div>
              )}
              {profile.instansi && (
                <div className="flex items-center gap-1">
                  <Building2 className="size-4" />
                  {profile.instansi}
                </div>
              )}
            </div>
          </div>
          <Button variant="default">Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}
