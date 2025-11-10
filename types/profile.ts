// Types untuk Profile dan User

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  nip: string | null;
  jabatan: string | null;
  satuan_kerja: string | null;
  instansi: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

export interface UserWithProfile {
  user: User;
  profile: Profile | null;
}

// API Response types
export interface ProfileAPIResponse {
  success: boolean;
  data: UserWithProfile;
  message: string;
}

// Form data for creating/updating profile
export interface ProfileFormData {
  full_name?: string;
  phone?: string;
  nip?: string;
  jabatan?: string;
  satuan_kerja?: string;
  instansi?: string;
}

// Profile update request
export interface ProfileUpdateRequest extends ProfileFormData {
  id?: string; // Optional for admin updates
}