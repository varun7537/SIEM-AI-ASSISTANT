import React from 'react'

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }
  
  const colorClasses = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  }
  
  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`} />
  )
}

export default LoadingSpinner