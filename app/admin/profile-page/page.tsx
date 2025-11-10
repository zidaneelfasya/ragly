"use client";
import ProfileContent from "@/components/profile-content";
import ProfileHeader from "@/components/profile-header";
import { useEffect, useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export default function Page() {
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    nip: "",
    jabatan: "",
    satuan_kerja: "",
    instansi: "",
    bio: "",
    location: "",
    email: "",
    role: "",
  });
  const [initialProfile, setInitialProfile] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/v1/users/profile/get");
        if (res.data && res.data.success) {
          const p = res.data.data.profile || {};
          setProfile({
            full_name: p.full_name || "",
            phone: p.phone || "",
            nip: p.nip || "",
            jabatan: p.jabatan || "",
            satuan_kerja: p.satuan_kerja || "",
            instansi: p.instansi || "",
            bio: p.bio || "",
            location: p.location || "",
            email: res.data.data.user?.email || "",
            role: p.role || "",
          });
          console.log(profile.role)
          setInitialProfile({
            full_name: p.full_name || "",
            phone: p.phone || "",
            nip: p.nip || "",
            jabatan: p.jabatan || "",
            satuan_kerja: p.satuan_kerja || "",
            instansi: p.instansi || "",
            bio: p.bio || "",
            location: p.location || "",
            email: res.data.data.user?.email || "",
            role: p.role || "",
          });
          console.log(profile.role)
        }
      } catch (err) {
        toast.error("Gagal memuat data profile");
      }
    };
    fetchProfile();
  }, []);

  const isChanged = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await axios.put("/api/v1/users/profile/get", profile);
      if (res.data && res.data.success) {
        toast.success("Profile berhasil diupdate");
        setInitialProfile(profile);
      } else {
        toast.error("Gagal update profile");
      }
    } catch {
      toast.error("Gagal update profile");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 px-4 ">
      <Toaster />
      <ProfileHeader profile={profile} />
      <ProfileContent profile={profile} onChange={handleChange} />
      <div className="flex justify-end">
        <Button onClick={() => setConfirmOpen(true)} disabled={!isChanged || loading}>
          {loading ? "Menyimpan..." : "Update"}
        </Button>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Update</DialogTitle>
            <DialogDescription>
              Apakah data yang Anda ubah sudah benar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Menyimpan..." : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
