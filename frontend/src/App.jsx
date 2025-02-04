import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import LandingPage from "./pages/LandingPage";
import CardDetails from "./pages/CardDetails";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"
function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Navigate to="/register" />
}

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/carddetails" element={<ProtectedRoutes><CardDetails /></ProtectedRoutes>} />
          <Route path="*" element={<NotFound />} />

        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
