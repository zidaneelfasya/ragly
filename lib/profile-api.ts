// Utility functions untuk mengakses Profile API

import type { ProfileAPIResponse, ProfileFormData, UserWithProfile } from '@/types/profile';

export class ProfileAPI {
  private baseUrl = '/api/v1/profile';

  // Mengambil data user dan profile
  async getCurrentUserProfile(): Promise<UserWithProfile> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ProfileAPIResponse = await response.json();
    return result.data;
  }

  // Mengambil profile user lain (admin only)
  async getUserProfile(userId: string): Promise<UserWithProfile> {
    const response = await fetch(`${this.baseUrl}?id=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ProfileAPIResponse = await response.json();
    return result.data;
  }

  // Update profile
  async updateProfile(profileData: ProfileFormData): Promise<UserWithProfile> {
    const response = await fetch(this.baseUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: ProfileAPIResponse = await response.json();
    return result.data;
  }

  // Create profile (alias for update)
  async createProfile(profileData: ProfileFormData): Promise<UserWithProfile> {
    return this.updateProfile(profileData);
  }
}

// Export instance untuk digunakan langsung
export const profileAPI = new ProfileAPI();

// Export helper functions
export const ProfileHelpers = {
  // Check if profile is complete
  isProfileComplete: (profile: any) => {
    if (!profile) return false;
    const requiredFields = ['full_name', 'phone'];
    return requiredFields.every(field => profile[field]?.trim());
  },

  // Get display name
  getDisplayName: (userWithProfile: UserWithProfile) => {
    if (userWithProfile.profile?.full_name) {
      return userWithProfile.profile.full_name;
    }
    return userWithProfile.user.email?.split('@')[0] || 'User';
  },

  // Format profile for display
  formatProfile: (profile: any) => {
    if (!profile) return {};
    
    return {
      'Nama Lengkap': profile.full_name || '-',
      'Email': profile.email || '-',
      'Telepon': profile.phone || '-',
      'NIP': profile.nip || '-',
      'Jabatan': profile.jabatan || '-',
      'Satuan Kerja': profile.satuan_kerja || '-',
      'Instansi': profile.instansi || '-',
    };
  },

  // Validate profile data
  validateProfile: (profileData: ProfileFormData) => {
    const errors: string[] = [];

    if (profileData.full_name && profileData.full_name.trim().length < 2) {
      errors.push('Nama lengkap harus minimal 2 karakter');
    }

    if (profileData.phone && profileData.phone.trim().length < 10) {
      errors.push('Nomor telepon harus minimal 10 karakter');
    }

    if (profileData.nip && profileData.nip.trim().length < 8) {
      errors.push('NIP harus minimal 8 karakter');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};