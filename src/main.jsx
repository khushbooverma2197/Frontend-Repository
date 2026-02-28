import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserPreferencesProvider } from './context/UserPreferencesContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserPreferencesProvider>
      <App />
    </UserPreferencesProvider>
  </React.StrictMode>,
)
