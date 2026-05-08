// Import React library
import React from 'react'
// Import ReactDOM for rendering React components to the DOM
import ReactDOM from 'react-dom/client'
// Import the main App component
import App from './App.jsx'
// Import global styles
import './index.css'

// Render the React application
// ReactDOM.createRoot creates the root React component
// StrictMode helps detect potential problems in the application during development
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
