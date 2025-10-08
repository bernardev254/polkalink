import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Shield, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  FileText,
  Globe
} from 'lucide-react';
import PartnerRegistration from './components/PartnerRegistration';
import DataVerification from './components/DataVerification';
import SupplyChainTracker from './components/SupplyChainTracker';
import NetworkStatus from './components/NetworkStatus';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [networkStatus, setNetworkStatus] = useState('disconnected');

  useEffect(() => {
    // Simulate network connection
    const timer = setTimeout(() => {
      setNetworkStatus('connected');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'partners':
        return <PartnerRegistration />;
      case 'verification':
        return <DataVerification />;
      case 'supply-chain':
        return <SupplyChainTracker />;
      case 'network':
        return <NetworkStatus />;
      default:
        return (
          <div className="dashboard">
            <div className="card">
              <div className="card-header">
                <Users className="card-icon" size={24} />
                <h3>Partner Network</h3>
              </div>
              <p>
                Manage consortium members and their access permissions. 
                Register new partners and configure data sharing agreements.
              </p>
              <button 
                className="btn" 
                onClick={() => setActiveTab('partners')}
              >
                <Plus size={16} />
                Manage Partners
              </button>
            </div>

            <div className="card">
              <div className="card-header">
                <Shield className="card-icon" size={24} />
                <h3>Data Verification</h3>
              </div>
              <p>
                Submit and verify sustainability data with cryptographic proofs. 
                Ensure data integrity across the partner network.
              </p>
              <button 
                className="btn" 
                onClick={() => setActiveTab('verification')}
              >
                <CheckCircle size={16} />
                Verify Data
              </button>
            </div>

            <div className="card">
              <div className="card-header">
                <Database className="card-icon" size={24} />
                <h3>Supply Chain Tracking</h3>
              </div>
              <p>
                Track products through the entire supply chain with verifiable 
                records from origin to consumer.
              </p>
              <button 
                className="btn" 
                onClick={() => setActiveTab('supply-chain')}
              >
                <Search size={16} />
                Track Products
              </button>
            </div>

            <div className="card">
              <div className="card-header">
                <Globe className="card-icon" size={24} />
                <h3>Network Status</h3>
              </div>
              <p>
                Monitor blockchain network health, consensus status, and 
                cross-chain interoperability metrics.
              </p>
              <button 
                className="btn" 
                onClick={() => setActiveTab('network')}
              >
                <FileText size={16} />
                View Status
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>DataLink Network</h1>
        <p>Decentralized Partner Data Layer for Transparent Collaboration</p>
        <div style={{ marginTop: '20px' }}>
          <span className={`status ${networkStatus}`}>
            {networkStatus === 'connected' ? (
              <>
                <CheckCircle size={16} />
                Connected to Polkadot Network
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                Connecting to Network...
              </>
            )}
          </span>
        </div>
      </header>

      <nav style={{ marginBottom: '30px', textAlign: 'center' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'partners', label: 'Partners' },
          { id: 'verification', label: 'Verification' },
          { id: 'supply-chain', label: 'Supply Chain' },
          { id: 'network', label: 'Network' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn ${activeTab === tab.id ? '' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              margin: '0 8px',
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
