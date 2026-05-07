// React core (StrictMode helps detect potential issues in development)
import { StrictMode } from 'react'

// React DOM for rendering the app into the browser
import { createRoot } from 'react-dom/client'

// Global styles
import './App.css'

// Root App component
import App from './App.jsx'

import { BrowserRouter } from "react-router-dom";


/**
 * Application entry point
 * Mounts the React app into the HTML DOM
 */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);


