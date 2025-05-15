import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

/**
 * 应用的入口点。
 *
 * 职责:
 * - 获取 DOM 中的根元素 (通常是 id 为 'root' 的 div)。
 * - 使用 React 18 的 createRoot API 创建应用的根。
 * - 渲染整个 React 应用。
 * - 使用 <StrictMode> 包裹应用，以在开发模式下进行额外的检查和警告。
 * - 使用 <BrowserRouter> 包裹 <App /> 组件，为整个应用启用客户端路由功能。
 *   这使得 react-router-dom 可以在应用内部管理 URL 和页面导航，而无需整页刷新。
 */
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error("未找到 ID 为 'root' 的 DOM 元素。请确保 index.html 中存在此元素。")
}

const root = createRoot(rootElement)
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
