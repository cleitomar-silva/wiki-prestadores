import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Toast from '../components/Toast'
import { canExclude, isActiveLabel, isActiveStyle, roleLabel, roleStyle } from '../utils/permissions'

function Usuarios() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [term, setTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('todos')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toasts, setToasts] = useState([])
  const pageSize = 10

  const pushToast = (type, title, message) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, type, title, message }])
  }

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: { Accept: 'application/json' },
        })
        const payload = await response.json()
        if (!response.ok) throw new Error()
        setUsers(payload.data ?? [])
      } catch {
        setError('Não foi possível carregar os usuários.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = users.filter((u) => {
    const q = term.toLowerCase()
    const matchesTerm =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    const role = (u.role || 'colaborador').toLowerCase()
    const matchesRole =
      roleFilter === 'todos' || role === roleFilter.toLowerCase()
    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'ativos' && u.is_active) ||
      (statusFilter === 'bloqueados' && !u.is_active)
    return matchesTerm && matchesRole && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const pageRows = filtered.slice(startIndex, startIndex + pageSize)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const response = await fetch(`/api/users/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) {
        pushToast('error', 'Erro ao excluir', 'Não foi possível excluir o usuário.')
        setDeleteTarget(null)
        return
      }
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
      pushToast(
        'success',
        'Sucesso',
        `Usuário "${deleteTarget.name}" excluído.`
      )
      setDeleteTarget(null)
    } catch {
      pushToast('error', 'Erro ao excluir', 'Não foi possível conectar ao servidor.')
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AppLayout>
      <main className="flex-1 max-w-[1280px] mx-auto px-10 py-6 flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <h1 className="mt-10 text-[30px] font-bold text-primary leading-tight">
              Usuários do Sistema
            </h1>
            <p className="text-on-surface-variant text-body-lg mt-1">
              Gerencie as permissões e perfis dos agentes de operação.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/novo-usuario')}
            className="bg-primary-container text-on-primary hover:opacity-90 transition-opacity flex items-center gap-2 px-6 py-3 rounded-lg text-label-md font-semibold shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Novo Usuário
          </button>
        </header>

        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle bg-surface-container-lowest flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value)
                  setPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="Filtrar por nome, email..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-label-md text-on-surface-variant">
                  Permissão:
                </span>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value)
                    setPage(1)
                  }}
                  className="px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-body-sm focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer transition-all"
                >
                  <option value="todos">Todos</option>
                  <option value="administrador">Administrador</option>
                  <option value="gestor">Gestor</option>
                  <option value="colaborador">Colaborador</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-label-md text-on-surface-variant">
                  Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setPage(1)
                  }}
                  className="px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-body-sm focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer transition-all"
                >
                  <option value="todos">Ativos e Bloqueados</option>
                  <option value="ativos">Ativos</option>
                  <option value="bloqueados">Bloqueados</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-on-surface-variant">
                Carregando usuários...
              </div>
            ) : error ? (
              <div className="p-12 text-center text-error">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant">
                Nenhum usuário encontrado.
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-border-subtle">
                    <th className="px-6 py-4 text-left text-label-md text-on-surface-variant">
                      Nome do Agente
                    </th>
                    <th className="px-6 py-4 text-left text-label-md text-on-surface-variant">
                      E-mail Corporativo
                    </th>
                    <th className="px-6 py-4 text-left text-label-md text-on-surface-variant">
                      Permissão
                    </th>
                    <th className="px-6 py-4 text-left text-label-md text-on-surface-variant">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-label-md text-on-surface-variant">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {pageRows.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-background transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-primary">
                          {u.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase ${roleStyle(
                            u.role
                          )}`}
                        >
                          {roleLabel(u.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full uppercase ${isActiveStyle(
                            u.is_active
                          )}`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {u.is_active ? 'check_circle' : 'block'}
                          </span>
                          {isActiveLabel(u.is_active)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 transition-opacity">
                          <button
                            type="button"
                            title="Editar"
                            onClick={() => navigate(`/editar-usuario/${u.id}`)}
                            className="p-1.5 hover:bg-secondary-container/20 rounded text-on-surface-variant hover:text-secondary transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-lg">
                              edit
                            </span>
                          </button>
                          {canExclude() && (
                          <button
                            type="button"
                            title="Excluir"
                            onClick={() => setDeleteTarget(u)}
                            className="p-1.5 hover:bg-error-container/20 rounded text-error transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-lg">
                              delete
                            </span>
                          </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="px-6 py-4 border-t border-border-subtle bg-surface-container-lowest flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs text-on-surface-variant">
              {filtered.length === 0
                ? 'Nenhum usuário'
                : `Mostrando ${startIndex + 1}-${Math.min(
                    startIndex + pageSize,
                    filtered.length
                  )} de ${filtered.length} usuário(s)`}
            </span>
            {filtered.length > pageSize && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-outline-variant rounded hover:bg-background disabled:opacity-30 cursor-pointer"
                  aria-label="Página anterior"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded cursor-pointer ${
                      n === currentPage
                        ? 'bg-primary text-on-primary'
                        : 'hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-outline-variant rounded hover:bg-background disabled:opacity-30 cursor-pointer"
                  aria-label="Próxima página"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-3">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>

        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-surface-container-lowest border border-border-subtle rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-error-container/40 text-error flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined">delete</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-on-surface">
                    Excluir usuário
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Tem certeza que deseja excluir o usuário{' '}
                    <span className="font-semibold text-primary">
                      {deleteTarget.name}
                    </span>{' '}
                    ({deleteTarget.email})? Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="px-5 py-2.5 border border-outline-variant text-on-surface-variant text-label-md font-semibold rounded hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-5 py-2.5 bg-error text-on-error text-label-md font-semibold rounded hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-base">
                    delete
                  </span>
                  {deleting ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  )
}

export default Usuarios