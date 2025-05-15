import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/auth/login-page";
import "./App.css";

/**
 * App 组件
 *
 * 职责:
 * - 作为应用的根组件。
 * - 使用 react-router-dom 设置应用的路由规则。
 * - 定义路径与页面组件的映射关系。
 */
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* 默认重定向到登录页 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
