import React from 'react'
import Layout from './components/Layout/Layout'
import ChatInterface from './components/Chat/ChatInterface'
import ErrorBoundary from './components/Common/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Layout>
          <ChatInterface />
        </Layout>
      </div>
    </ErrorBoundary>
  )
}

export default App