import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

function CadastroUsuario() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])

  const pushToast = (type, title, message) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, type, title, message }])
  }

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role) {
      pushToast('error', 'Permissão obrigatória', 'Selecione o nível de permissão do usuário.')
      return
    }
    setLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = payload.errors
          ? Object.values(payload.errors).flat().join(' ')
          : 'Não foi possível salvar o usuário.'
        pushToast('error', 'Erro ao salvar', message)
        return
      }

      pushToast(
        'success',
        'Sucesso',
        'Usuário criado com sucesso. Redirecionando...'
      )
      setTimeout(() => navigate('/usuarios'), 1200)
    } catch {
      pushToast('error', 'Erro ao salvar', 'Não foi possível conectar ao servidor.')
    } finally {
      setLoading(false)
    }
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
            <span className="text-primary font-semibold">Novo Usuário</span>
          </nav>
          <h1 className="mt-6 text-[30px] font-bold text-primary leading-tight">
            Cadastro de Usuário
          </h1>
          <p className="text-on-surface-variant text-body-md mt-2">
            Crie novos acessos para gestores e colaboradores do setor de
            relacionamento.
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
              <span className="material-symbols-outlined">person_add</span>
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
                  Senha Temporária
                </label>
                <div className="relative">
                  <input
                    className={inputCls}
                    id="password"
                    minLength="6"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    required
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
                  O usuário será solicitado a alterar a senha no primeiro
                  acesso.
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
                disabled={loading}
                className="px-8 py-2.5 bg-primary-container text-on-primary text-label-md font-semibold rounded shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                {loading ? 'Gravando...' : 'Gravar Usuário'}
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
                  Use sempre o e-mail corporativo institucional.
                </li>
                <li className="flex gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-primary text-base">
                    check_circle
                  </span>
                  Evite senhas genéricas como &quot;123456&quot;.
                </li>
                <li className="flex gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-primary text-base">
                    check_circle
                  </span>
                  O nível &quot;Administrador&quot; deve ser restrito a
                  T.I. e gestores de alto nível.
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

export default CadastroUsuario