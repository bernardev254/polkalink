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
  const [account, setAccount] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [networkStatus, setNetworkStatus] = useState('disconnected')

  // Initialize Polkadot API connection
  useEffect(() => {
    const initApi = async () => {
      try {
        // For demo purposes, we'll simulate a connection
        // In production, this would connect to your DataLink Network node
        const wsProvider = new WsProvider('wss://rpc.polkadot.io') // Demo endpoint
        const api = await ApiPromise.create({ provider: wsProvider })
        setApi(api)
        setNetworkStatus('connected')
      } catch (error) {
        console.error('Failed to connect to network:', error)
        setNetworkStatus('error')
      }
    }

    initApi()
  }, [])

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      // Enable the extension
      const extensions = await web3Enable('DataLink Network')
      if (extensions.length === 0) {
        throw new Error('No extension found')
      }

      // Get all accounts
      const allAccounts = await web3Accounts()
      setAccounts(allAccounts)

      if (allAccounts.length > 0) {
        setAccount(allAccounts[0])
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setAccounts([])
  }

  const switchAccount = (newAccount) => {
    setAccount(newAccount)
  }

  const value = {
    api,
    account,
    accounts,
    isConnecting,
    networkStatus,
    connectWallet,
    disconnectWallet,
    switchAccount
  }

  return (
    <PolkadotContext.Provider value={value}>
      {children}
    </PolkadotContext.Provider>
  )
}
