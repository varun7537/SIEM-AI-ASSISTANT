export const hasAuthToken = () => {
  return !!localStorage.getItem('auth_token')
}

/**
 * Get authentication token
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

/**
 * Get stored user data
 * @returns {Object|null}
 */
export const getStoredUser = () => {
  const userData = localStorage.getItem('user_data')
  return userData ? JSON.parse(userData) : null
}

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
  localStorage.removeItem('session_id')
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expirationTime = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= expirationTime
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

/**
 * Decode JWT token
 * @param {string} token - JWT token
 * @returns {Object|null}
 */
export const decodeToken = (token) => {
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Format user display name
 * @param {Object} user - User object
 * @returns {string}
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Guest'
  return user.full_name || user.username || user.email || 'User'
}

/**
 * Get user initials for avatar
 * @param {Object} user - User object
 * @returns {string}
 */
export const getUserInitials = (user) => {
  if (!user) return 'G'
  
  if (user.full_name) {
    const names = user.full_name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return names[0][0].toUpperCase()
  }
  
  if (user.username) {
    return user.username.substring(0, 2).toUpperCase()
  }
  
  if (user.email) {
    return user.email.substring(0, 2).toUpperCase()
  }
  
  return 'U'
}

/**
 * Check if user has admin privileges
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user?.is_superuser === true
}

/**
 * Format blockchain address for display
 * @param {string} address - Blockchain address
 * @returns {string}
 */
export const formatBlockchainAddress = (address) => {
  if (!address) return ''
  if (address.length < 12) return address
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}