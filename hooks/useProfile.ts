import { useState, useEffect } from 'react';
import { profileAPI, ProfileHelpers } from '@/lib/profile-api';
import type { UserWithProfile, ProfileFormData } from '@/types/profile';

export function useProfile(userId?: string) {
  const [data, setData] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = userId 
        ? await profileAPI.getUserProfile(userId)
        : await profileAPI.getCurrentUserProfile();
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: ProfileFormData) => {
    try {
      setError(null);
      const result = await profileAPI.updateProfile(profileData);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    data,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
    isProfileComplete: data ? ProfileHelpers.isProfileComplete(data.profile) : false,
    displayName: data ? ProfileHelpers.getDisplayName(data) : '',
  };
}

export function useProfileForm(initialData?: ProfileFormData) {
  const [formData, setFormData] = useState<ProfileFormData>(initialData || {});
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const updateField = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    
    // Clear validation errors when user types
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateForm = () => {
    const validation = ProfileHelpers.validateProfile(formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const resetForm = (newData?: ProfileFormData) => {
    setFormData(newData || {});
    setIsDirty(false);
    setValidationErrors([]);
  };

  return {
    formData,
    isDirty,
    validationErrors,
    updateField,
    validateForm,
    resetForm,
    isValid: validationErrors.length === 0,
  };
}