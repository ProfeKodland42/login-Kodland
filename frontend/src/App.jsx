import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CursoPlaceholder from './pages/CursoPlaceholder'
import PythonWorkspace from './courses/python/PythonWorkspace'
import WebEditor from './courses/web/WebEditor'

function Inicio() {
  const { user } = useAuth()
  return <Navigate to={user ? '/dashboard' : '/login'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/python"
          element={
            <ProtectedRoute>
              <PythonWorkspace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/web"
          element={
            <ProtectedRoute>
              <WebEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:clave"
          element={
            <ProtectedRoute>
              <CursoPlaceholder />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
