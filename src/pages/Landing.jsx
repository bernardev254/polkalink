I'll build a comprehensive frontend for DataLink Network that captures the essence of a decentralized partner data layer for transparent collaboration. This will be a React-based application with Polkadot.js integration for blockchain connectivity.

<boltArtifact id="datalink-network-frontend" title="DataLink Network - Decentralized Partner Data Layer Frontend">
<boltAction type="file" filePath="package.json">{
  "name": "datalink-network",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "@polkadot/api": "^10.9.1",
    "@polkadot/extension-dapp": "^0.46.5",
    "@polkadot/keyring": "^12.3.2",
    "@polkadot/util": "^12.3.2",
    "@polkadot/util-crypto": "^12.3.2",
    "lucide-react": "^0.263.1",
    "recharts": "^2.7.2",
    "framer-motion": "^10.12.16"
  },
  "devDependencies": {
    "@types/react": "^18.0.37",
    "@types/react-dom": "^18.0.11",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2",
    "vite": "^4.3.9"
  }
}
