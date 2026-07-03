import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EnConstruccion from './pages/EnConstruccion'
import CursoPlaceholder from './pages/CursoPlaceholder'
import PythonWorkspace from './courses/python/PythonWorkspace'
import PythonPro from './courses/python-pro/PythonPro'
import WebEditor from './courses/web/WebEditor'

function Protegida({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

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
        <Route path="/dashboard" element={<Protegida><Dashboard /></Protegida>} />
        <Route
          path="/estudiantes"
          element={<Protegida><EnConstruccion seccion="Estudiantes" /></Protegida>}
        />
        <Route
          path="/reportes"
          element={<Protegida><EnConstruccion seccion="Reportes" /></Protegida>}
        />
        <Route
          path="/mensajes"
          element={<Protegida><EnConstruccion seccion="Mensajes" /></Protegida>}
        />
        <Route
          path="/configuracion"
          element={<Protegida><EnConstruccion seccion="Configuración" /></Protegida>}
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
          path="/courses/python-pro"
          element={
            <ProtectedRoute>
              <PythonPro />
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
