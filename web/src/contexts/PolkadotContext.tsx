import React, { createContext, useContext, useState, useEffect } from 'react';

interface PolkadotContextType {
  account: string | null;
  accounts: any[];
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(undefined);

export const PolkadotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem('polkadot-account');
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Simulated wallet connection - in production, use @polkadot/extension-dapp
      // const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp');
      // const extensions = await web3Enable('DataLink Network');
      // const allAccounts = await web3Accounts();
      
      // For demo purposes, create a mock account
      const mockAccount = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
      setAccount(mockAccount);
      localStorage.setItem('polkadot-account', mockAccount);
      setAccounts([{ address: mockAccount, meta: { name: 'Demo Account' } }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setAccounts([]);
    localStorage.removeItem('polkadot-account');
  };

  return (
    <PolkadotContext.Provider
      value={{
        account,
        accounts,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </PolkadotContext.Provider>
  );
};

export const usePolkadot = () => {
  const context = useContext(PolkadotContext);
  if (!context) {
    throw new Error('usePolkadot must be used within PolkadotProvider');
  }
  return context;
};
