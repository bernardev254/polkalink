import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Partners from './pages/Partners'
import DataVerification from './pages/DataVerification'
import Governance from './pages/Governance'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Landing from './pages/Landing'
import { usePolkadot } from './contexts/PolkadotContext'

function App() {
  const { account } = usePolkadot()

  return (
    <div className="min-h-screen bg-gray-50">
      {account ? (
        <>
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/data-verification" element={<DataVerification />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </>
      ) : (
        <Landing />
      )}
    </div>
  )
}

export default App
