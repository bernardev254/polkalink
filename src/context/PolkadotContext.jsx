import React, { createContext, useContext, useState, useEffect } from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp'

const PolkadotContext = createContext()

export const usePolkadot = () => {
  const context = useContext(PolkadotContext)
  if (!context) {
    throw new Error('usePolkadot must be used within a PolkadotProvider')
  }
  return context
}

export const PolkadotProvider = ({ children }) => {
  const [api, setApi] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock connection for demo purposes
  const connectWallet = async () => {
    setIsLoading(true)
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockAccount = {
        address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        meta: { name: 'DataLink Partner Account', source: 'polkadot-js' }
      }
      
      setAccounts([mockAccount])
      setSelectedAccount(mockAccount)
      setIsConnected(true)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setAccounts([])
    setSelectedAccount(null)
    setIsConnected(false)
  }

  const value = {
    api,
    accounts,
    selectedAccount,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    setSelectedAccount
  }

  return (
    <PolkadotContext.Provider value={value}>
      {children}
    </PolkadotContext.Provider>
  )
}
