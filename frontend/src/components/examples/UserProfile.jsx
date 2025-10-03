import React, { useState, useEffect } from 'react'
import { User, Mail, Shield, Calendar, Edit2, Save, X, Key, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/auth'
import LoadingSpinner from '../Common/LoadingSpinner'

const UserProfile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // API call to update user profile
      // const updated = await authAPI.updateProfile(formData)
      // updateUser(updated)
      
      // Mock update for now
      updateUser({ ...user, ...formData })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user.full_name || '',
      email: user.email || ''
    })
    setIsEditing(false)
  }

  if (!user) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 shadow-lg">
                {user.username?.substring(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.full_name}</h1>
              <p className="text-blue-100 mt-1">@{user.username}</p>
              <div className="flex items-center space-x-4 mt-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                  Security Analyst
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user.full_name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
              )}
            </div>

            {/* Username (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">@{user.username}</span>
                <span className="ml-auto px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                  Read-only
                </span>
              </div>
            </div>

            {/* Blockchain Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blockchain Wallet
              </label>
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <Shield className="h-5 w-5 text-purple-600" />
                <code className="text-sm text-gray-900 font-mono truncate flex-1">
                  {user.blockchain_address || 'Not available'}
                </code>
              </div>
            </div>

            {/* Account Created */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Last Login */}
            {user.last_login && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Login
                </label>
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">
                    {new Date(user.last_login).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="border-t border-gray-200 p-8 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Key className="h-5 w-5 mr-2 text-blue-600" />
            Security Settings
          </h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between">
              <span className="text-gray-900">Change Password</span>
              <Edit2 className="h-4 w-4 text-gray-400" />
            </button>
            <button className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between">
              <span className="text-gray-900">Two-Factor Authentication</span>
              <Shield className="h-4 w-4 text-green-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile