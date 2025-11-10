// hooks/useUsers.ts
'use client';

import { useState, useEffect } from 'react';
import { UsersAPI, User, CreateUserData, UpdateUserData, UsersResponse } from '@/lib/users-api';

export function useUsers(initialPage = 1, initialLimit = 10) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0
  });
  const [search, setSearch] = useState('');

  const fetchUsers = async (page = pagination.page, limit = pagination.limit, searchTerm = search) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UsersAPI.getUsers(page, limit, searchTerm);
      
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: CreateUserData) => {
    try {
      setError(null);
      await UsersAPI.createUser(userData);
      await fetchUsers(); // Refresh the list
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateUser = async (id: string, userData: UpdateUserData) => {
    try {
      setError(null);
      await UsersAPI.updateUser(id, userData);
      await fetchUsers(); // Refresh the list
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setError(null);
      await UsersAPI.deleteUser(id);
      await fetchUsers(); // Refresh the list
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchUsers(newPage, pagination.limit, search);
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchUsers(1, newLimit, search);
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers(1, pagination.limit, searchTerm);
  };

  const refresh = () => {
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    search,
    createUser,
    updateUser,
    deleteUser,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    refresh
  };
}

export function useUser(id: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UsersAPI.getUser(userId);
      setUser(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser(id);
    } else {
      setUser(null);
    }
  }, [id]);

  return {
    user,
    loading,
    error,
    refetch: id ? () => fetchUser(id) : undefined
  };
}
