'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/userlogin');
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/userlogin');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">GG</span>
              </div>
              <span className="font-bold text-lg">Gyan Ganga</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {user?.username}!
          </h1>
          <p className="text-gray-600">
            Email: {user?.email}
          </p>
        </div>

        {/* Dashboard Cards */}

        {/* User Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Username</p>
              <p className="text-gray-900 font-bold">{user?.username}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-gray-900 font-bold">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">User ID</p>
              <p className="text-gray-900 font-bold font-mono text-sm">{user?.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
