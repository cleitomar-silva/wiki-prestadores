import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Toast from '../components/Toast'

const inputCls =
  'w-full border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary/20 rounded h-12 px-4 bg-surface-container-low/30'
const labelCls =
  'block text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-2'

const roleOptions = [
  {
    value: 'administrador',
    title: 'Administrador (Acesso Total)',
    description: '',
  },
  {
    value: 'gestor',
    title: 'Gestor',
    description: '',
  },
  {
    value: 'colaborador',
    title: 'Colaborador',
    description: '',
  },
]

const roleGuide = [
  {
    title: 'Administrador',
    description:
      'Acesso total ao sistema, incluindo a gestão de usuários, edição de wikis e exclusão de registros.',
  },
  {
    title: 'Gestor',
    description:
      'Acesso às opções do sistema, exceto a página de usuários (listar, editar ou excluir).',
  },
  {
    title: 'Colaborador',
    description:
      'Mesmas permissões do gestor, porém sem permissão para excluir registros.',
  },
]

function EditarUsuario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    is_active: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])

  const pushToast = (type, title, message) => {
    const tId = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id: tId, type, title, message }])
  }

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/users/${id}`, {
          headers: { Accept: 'application/json' },
        })
        if (response.status === 404) {
          setNotFound(true)
          return
        }
        if (!response.ok) throw new Error()
        const payload = await response.json()
        const u = payload.data
        setForm({
          name: u.name ?? '',
          email: u.email ?? '',
          password: '',
          role: u.role ?? '',
          is_active: u.is_active ?? true,
        })
      } catch {
        pushToast('error', 'Erro ao carregar', 'Não foi possível conectar ao servidor.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          role: form.role,
          is_active: form.is_active,
          ...(form.password ? { password: form.password } : {}),
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = payload.errors
          ? Object.values(payload.errors).flat().join(' ')
          : 'Não foi possível atualizar o usuário.'
        pushToast('error', 'Erro ao salvar', message)
        return
      }

      pushToast(
        'success',
        'Sucesso',
        'Usuário atualizado com sucesso. Redirecionando...'
      )
      setTimeout(() => navigate('/usuarios'), 1200)
    } catch {
      pushToast('error', 'Erro ao salvar', 'Não foi possível conectar ao servidor.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <main className="flex-1 max-w-[1280px] mx-auto px-10 py-6">
          <div className="p-12 text-center text-on-surface-variant">
            Carregando usuário...
          </div>
        </main>
      </AppLayout>
    )
  }

  if (notFound) {
    return (
      <AppLayout>
        <main className="flex-1 max-w-[1280px] mx-auto px-10 py-24 text-center">
          <div className="material-symbols-outlined text-6xl text-on-surface-variant">
            search_off
          </div>
          <h1 className="mt-6 text-2xl font-bold text-primary">
            Usuário não encontrado
          </h1>
          <Link
            to="/usuarios"
            className="inline-block mt-8 px-6 py-3 bg-primary-container text-on-primary font-semibold rounded cursor-pointer"
          >
            Voltar para Usuários
          </Link>
        </main>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <main className="flex-1 max-w-[1280px] mx-auto px-10 py-6 flex flex-col gap-8">
        <header className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
            <Link to="/usuarios" className="hover:text-primary cursor-pointer">
              Usuários
            </Link>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-primary font-semibold">Editar Usuário</span>
          </nav>
          <h1 className="mt-6 text-[30px] font-bold text-primary leading-tight">
            Edição de Usuário
          </h1>
          <p className="text-on-surface-variant text-body-md mt-2">
            Atualize os dados, permissões ou bloqueie o acesso deste usuário.
          </p>
        </header>

        <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-3">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>

        <form
          className="grid grid-cols-12 gap-6"
          id="usuarioForm"
          onSubmit={handleSubmit}
        >
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-border-subtle rounded p-8">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined">manage_accounts</span>
              <h3 className="text-lg font-bold text-primary">
                Informações Pessoais
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelCls} htmlFor="name">
                  Nome Completo
                </label>
                <input
                  className={inputCls}
                  id="name"
                  maxLength="150"
                  placeholder="Ex: Maria Oliveira"
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls} htmlFor="email">
                  E-mail Corporativo
                </label>
                <input
                  className={inputCls}
                  id="email"
                  maxLength="190"
                  placeholder="maria.oliveira@healthcare.com"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls} htmlFor="password">
                  Nova Senha (opcional)
                </label>
                <div className="relative">
                  <input
                    className={inputCls}
                    id="password"
                    minLength="6"
                    placeholder="Deixe em branco para manter"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-2">
                  Preencha apenas se desejar definir uma nova senha.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className={labelCls} htmlFor="role">
                  Nível de Permissão
                </label>
                <select
                  className="w-full border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary/20 rounded h-12 px-4 bg-surface-container-low/30 appearance-none cursor-pointer"
                  id="role"
                  value={form.role}
                  onChange={set('role')}
                  required
                >
                  <option value="" disabled>
                    Selecione uma permissão
                  </option>
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-subtle">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded ${
                      form.is_active
                        ? 'bg-error-container/20 text-secondary'
                        : 'bg-secondary-container/20 text-error'
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {form.is_active ? 'lock_open' : 'block'}
                    </span>
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-on-surface block"
                      htmlFor="is_active"
                    >
                      {form.is_active
                        ? 'Usuário ativo'
                        : 'Usuário bloqueado'}
                    </label>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {form.is_active
                        ? 'O usuário poderá acessar o sistema com suas credenciais.'
                        : 'O usuário não conseguirá mais acessar o sistema até ser desbloqueado.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, is_active: !f.is_active }))
                  }
                  className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer ${
                    form.is_active ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                  role="switch"
                  aria-checked={form.is_active}
                  aria-label="Bloquear ou desbloquear usuário"
                >
                  <span
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                      form.is_active ? 'left-7' : 'left-1'
                    }`}
                  ></span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => navigate('/usuarios')}
                className="px-6 py-2.5 border border-outline-variant text-on-surface-variant text-label-md font-semibold rounded hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-2.5 bg-primary-container text-on-primary text-label-md font-semibold rounded shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                {saving ? 'Gravando...' : 'Gravar Alterações'}
              </button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest border-l-4 border-secondary p-6 rounded shadow-sm">
              <div className="flex items-center gap-2 text-secondary mb-3">
                <span className="material-symbols-outlined">info</span>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Dicas de Segurança
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-primary text-base">
                    check_circle
                  </span>
                  Bloqueie o acesso de colaboradores desligados ou em férias
                  longas.
                </li>
                <li className="flex gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-primary text-base">
                    check_circle
                  </span>
                  O nível &quot;Administrador&quot; deve ser restrito a T.I. e
                  gestores de alto nível.
                </li>
                <li className="flex gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-primary text-base">
                    check_circle
                  </span>
                  Altere a senha sempre que suspeitar de compartilhamento
                  indevido.
                </li>
              </ul>
            </div>

            <div className="bg-primary text-on-primary p-8 rounded relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4">Guia de Permissões</h3>
                <div className="space-y-4">
                  {roleGuide.map((r) => (
                    <div key={r.title}>
                      <p className="font-bold text-sm text-secondary-fixed">
                        {r.title}
                      </p>
                      <p className="text-xs text-on-primary-container">
                        {r.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 200 }}
                >
                  shield_person
                </span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </AppLayout>
  )
}

export default EditarUsuario