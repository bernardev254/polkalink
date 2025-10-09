import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { PolkadotProvider } from './contexts/PolkadotContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PolkadotProvider>
        <App />
      </PolkadotProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
