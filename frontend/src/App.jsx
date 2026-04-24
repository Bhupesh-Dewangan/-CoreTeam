import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Layout from "./Pages/Layout";
import Dashboard from "./Pages/Dashboard";
import Attendance from "./Pages/Attendance";
import Leave from "./Pages/Leave";
import PaySlips from "./Pages/PaySlips";
import Settings from "./Pages/Settings";
import PrintPaySlips from "./Pages/PrintPaySlips";
import LoginForm from "./Components/LoginForm";
import Employees from "./Pages/Employees";
import LoginLoading from "./Pages/LoginLoading";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginLoading />} />

        <Route
          path="/login/admin"
          element={
            <LoginForm
              role="admin"
              title="Admin Portal"
              subtitle="Sign in to access the admin panel"
            />
          }
        />

        <Route
          path="/login/employee"
          element={
            <LoginForm
              role="employee"
              title="Employee Portal"
              subtitle="Sign in to access the employee portal"
            />
          }
        />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/payslips" element={<PaySlips />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/print/payslip/:id" element={<PrintPaySlips />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
