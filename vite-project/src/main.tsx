import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import './lib/i18n'; // 导入 i18n 配置

/**
 * Root Application Component
 *
 * This is the main entry point for the React application.
 * It sets up strict mode and renders the main App component.
 */

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Use createRoot for concurrent mode
const root = createRoot(rootElement)
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
