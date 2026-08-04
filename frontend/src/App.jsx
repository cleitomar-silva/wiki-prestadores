import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Procedimentos from './pages/Procedimentos'
import NovoProcedimento from './pages/NovoProcedimento'
import EditarProcedimento from './pages/EditarProcedimento'
import Usuarios from './pages/Usuarios'
import './App.css'

function RequireAuth({ children }) {
  const user = localStorage.getItem('wiki_user')
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
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
            <RequireAuth>
              <Usuarios />
            </RequireAuth>
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
