import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import UserProfile from './components/examples/UserProfile'
import ChatInterface from './components/Chat/ChatInterface'
import AuthContainer from './components/Auth/AuthContainer'
import AdminPanel from './components/features/AdminPanel'
import AIThreatDashboard from './components/Features/AIThreatDashboard'
import CollaborativeWorkspace from './components/Features/CollaborativeWorkspace'
import BlockchainDashboard from './components/Blockchain/BlockchainDashboard'
import SecurityLedger from './components/Blockchain/SecurityLedger'
import TransactionHistory from './components/Blockchain/TransactionHistory'
import ReportGenerator from './components/Reports/ReportGenerator'
import ErrorBoundary from './components/Common/ErrorBoundary'
import LoadingSpinner from './components/Common/LoadingSpinner'
import Settings  from './components/features/Settings'
import Analytics from './components/features/Analytics'
import Preferences from './components/examples/Preferences'
import SharedInvestigation from './components/collaboration/SharedInvestigation'
import TeamChat from './components/collaboration/TeamChat'
import RealTimeUpdates from './components/collaboration/RealTimeUpdates'
import LogIn from './components/Auth/LoginForm'
import SignUp from './components/Auth/SignUpForm'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    )
  }
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/auth" replace />
  // }
  
  return children
}

const AppContent = () => {
  const { isAuthenticated } = useAuth()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Router>
        <Routes>
          {/* Admin Panel */}
          <Route path="/adminpanel" element={<AdminPanel />} />

          {/* Public Routes */}
          <Route 
            path="/auth" 
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <AuthContainer />
            } 
          />

          {/* LogIn */}
          <Route path="/logIn" element={<LogIn />} />

          {/* SignUp */}
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected Routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    {/* Main Dashboard */}
                    <Route path="/" element={<ChatInterface />} />

                    {/* User Profile */}
                    <Route path="/profile" element={<UserProfile />} />

                    {/* Settings */}
                    <Route path="/settings" element={<Settings />} />

                    {/* Preferences */}
                    <Route path="/preferences" element={<Preferences />} />

                    {/* Analytics */}
                    <Route path="/analytics" element={<Analytics />} />

                    {/* SharedInvestigation */}
                    <Route path="/sharedinvestigation" element={<SharedInvestigation />} />

                    {/* Team Chat */}
                    <Route path="/teamchat" element={<TeamChat />} />

                    {/* Real Time Updates */}
                    <Route path="/realtimeupdates" element={<RealTimeUpdates />} />

                    {/* AI Features */}
                    <Route path="/ai-dashboard" element={<AIThreatDashboard />} />
                    
                    {/* Collaboration */}
                    <Route path="/collaboration" element={<CollaborativeWorkspace />} />
                    
                    {/* Blockchain */}
                    <Route path="/blockchain" element={<BlockchainDashboard />} />
                    <Route path="/blockchain/ledger" element={<SecurityLedger />} />
                    <Route path="/blockchain/transactions" element={<TransactionHistory />} />
                    
                    {/* Reports */}
                    <Route path="/reports" element={<ReportGenerator />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App