
import { GoogleOAuthProvider } from "@react-oauth/google";

// React core (StrictMode helps detect potential issues in development)
import { StrictMode } from 'react'

// React DOM for rendering the app into the browser
import { createRoot } from 'react-dom/client'

// Global styles
import './App.css'

// Root App component
import App from './App.jsx'


/**
 * Application entry point
 * Mounts the React app into the HTML DOM
 */
createRoot(document.getElementById('root')).render(

  // StrictMode runs extra checks in development
  <StrictMode>
  <GoogleOAuthProvider clientId="TU_CLIENT_ID_DE_GOOGLE">
    {/* Main application component */}
    <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)


