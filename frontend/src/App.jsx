import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Procedimentos from './pages/Procedimentos'
import NovoProcedimento from './pages/NovoProcedimento'
import EditarProcedimento from './pages/EditarProcedimento'
import Usuarios from './pages/Usuarios'
import CadastroUsuario from './pages/CadastroUsuario'
import Perfil from './pages/Perfil'
import EditarUsuario from './pages/EditarUsuario'
import { canManageUsers } from './utils/permissions'
import './App.css'

function RequireAuth({ children }) {
  const user = localStorage.getItem('wiki_user')
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

function RequireAdmin({ children }) {
  if (!canManageUsers()) {
    return <Navigate to="/" replace />
  }
  return <RequireAuth>{children}</RequireAuth>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/perfil"
          element={
            <RequireAuth>
              <Perfil />
            </RequireAuth>
          }
        />
        <Route
          path="/procedimentos"
          element={
            <RequireAuth>
              <Procedimentos />
            </RequireAuth>
          }
        />
        <Route
          path="/usuarios"
          element={
            <RequireAdmin>
              <Usuarios />
            </RequireAdmin>
          }
        />
        <Route
          path="/novo-usuario"
          element={
            <RequireAdmin>
              <CadastroUsuario />
            </RequireAdmin>
          }
        />
        <Route
          path="/editar-usuario/:id"
          element={
            <RequireAdmin>
              <EditarUsuario />
            </RequireAdmin>
          }
        />
        <Route
          path="/novo-procedimento"
          element={
            <RequireAuth>
              <NovoProcedimento />
            </RequireAuth>
          }
        />
        <Route
          path="/editar-procedimento/:id"
          element={
            <RequireAuth>
              <EditarProcedimento />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
