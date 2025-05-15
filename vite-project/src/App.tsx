// import { Routes, Route, Navigate } from "react-router-dom"; // No longer needed here
// import { LoginPage } from "@/pages/auth/login-page"; // No longer needed here
// import { DashboardLayout } from "@/components/layout/dashboard-layout"; // No longer needed here
// import { OverviewPage } from "@/pages/dashboard/overview-page"; // No longer needed here
import { AppRoutes } from "@/router"; // Import the centralized routes
import "./App.css";

/**
 * App 组件
 *
 * 职责:
 * - 作为应用的根组件外壳。
 * - 渲染由 AppRoutes管理的路由。
 */
function App() {
  return (
    <AppRoutes />
  );
}

export default App;
