import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/auth/login-page";
import "./App.css";

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
