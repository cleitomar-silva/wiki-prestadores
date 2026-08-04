import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Toast from '../components/Toast'
import { roleLabel, roleStyle, getUser } from '../utils/permissions'

const inputCls =
  'w-full border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary/20 rounded h-12 px-4 bg-surface-container-low/30'
const labelCls =
  'block text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-2'

function Perfil() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const pushToast = (type, title, message) => {
    const tId = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id: tId, type, title, message }])
  }

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  useEffect(() => {
    const current = getUser()
    if (!current?.id) {
      navigate('/login')
      return
    }
    const load = async () => {
      try {
        const response = await fetch(`/api/users/${current.id}`, {
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error()
        const payload = await response.json()
        setUser(payload.data)
        setForm((f) => ({
          ...f,
          name: payload.data.name ?? '',
          email: payload.data.email ?? '',
        }))
      } catch {
        pushToast(
          'error',
          'Erro ao carregar',
          'Não foi possível conectar ao servidor.'
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    if (form.password && form.password !== form.confirm_password) {
      pushToast('error', 'Senhas não conferem', 'A confirmação da senha deve ser idêntica à nova senha.')
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          role: user.role,
          is_active: user.is_active,
          ...(form.password ? { password: form.password } : {}),
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = payload.errors
          ? Object.values(payload.errors).flat().join(' ')
          : 'Não foi possível atualizar o perfil.'
        pushToast('error', 'Erro ao salvar', message)
        return
      }

      const updated = payload.data
      setUser(updated)
      setForm((f) => ({ ...f, password: '', confirm_password: '' }))
      localStorage.setItem(
        'wiki_user',
        JSON.stringify({
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
        })
      )

      pushToast(
        'success',
        'Sucesso',
        'Perfil atualizado com sucesso.'
      )
    } catch {
      pushToast(
        'error',
        'Erro ao salvar',
        'Não foi possível conectar ao servidor.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <main className="flex-1 max-w-[1280px] mx-auto px-10 py-6">
          <div className="p-12 text-center text-on-surface-variant">
            Carregando perfil...
          </div>
        </main>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <main className="flex-1 max-w-[1280px] mx-auto px-10 py-6 flex flex-col gap-8">
        <header className="mb-6">
          <h1 className="mt-10 text-[30px] font-bold text-primary leading-tight">
            Configurações de Perfil
          </h1>
          <p className="text-on-surface-variant text-body-md mt-2">
            Gerencie suas informações pessoais e credenciais de segurança de
            acesso à plataforma.
          </p>
        </header>

        <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-3">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <form
              className="bg-surface-container-lowest border border-border-subtle p-8 rounded"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center gap-2 mb-6 text-primary">
                <span className="material-symbols-outlined">person</span>
                <h2 className="text-lg font-bold text-primary">
                  Informações do Agente
                </h2>
              </div>

              <div className="col-span-full flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-border-subtle">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-container/50 bg-surface-container-low flex items-center justify-center text-primary font-bold text-3xl">
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-on-surface-variant">
                    Seu avatar é gerado automaticamente a partir das suas
                    iniciais.
                  </span>
                </div>
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
                    placeholder="Nome completo"
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelCls} htmlFor="email">
                    Endereço de E-mail Corporativo
                  </label>
                  <input
                    className={inputCls}
                    id="email"
                    maxLength="190"
                    placeholder="email@empresa.com"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    required
                  />
                  <p className="text-[11px] text-on-surface-variant mt-2">
                    Este e-mail é utilizado para notificações de auditoria e
                    recuperação de acesso.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6 mt-10 text-primary">
                <span className="material-symbols-outlined">security</span>
                <h2 className="text-lg font-bold text-primary">
                  Segurança e Senha
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls} htmlFor="password">
                    Nova Senha
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
                </div>

                <div>
                  <label className={labelCls} htmlFor="confirm_password">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      className={inputCls}
                      id="confirm_password"
                      minLength="6"
                      placeholder="••••••••"
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirm_password}
                      onChange={set('confirm_password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      <span className="material-symbols-outlined">
                        {showConfirm ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 bg-surface-container-low p-4 border-l-4 border-secondary flex gap-4">
                  <span className="material-symbols-outlined text-secondary">
                    info
                  </span>
                  <div className="text-sm text-on-surface-variant">
                    <p className="font-bold mb-1">
                      Requisitos de Senha do Sistema:
                    </p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>Mínimo de 6 caracteres</li>
                      <li>Deixe em branco para manter a senha atual</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => navigate('/')}
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
            </form>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-high p-6 rounded border border-border-subtle">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <span className="material-symbols-outlined">shield</span>
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Status da Conta
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">
                    Nível de Acesso:
                  </span>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase ${roleStyle(
                      user?.role
                    )}`}
                  >
                    {roleLabel(user?.role)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">E-mail:</span>
                  <span className="font-medium text-primary break-all text-right">
                    {user?.email}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">
                    ID do Agente:
                  </span>
                  <span className="font-medium text-primary">
                    #{user?.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-primary text-on-primary p-8 rounded relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4">Dicas de Segurança</h3>
                <ul className="space-y-3">
                  <li className="flex gap-2 text-sm text-on-primary-container">
                    <span className="material-symbols-outlined text-secondary-fixed text-base">
                      check_circle
                    </span>
                    Não compartilhe sua senha com outros colaboradores.
                  </li>
                  <li className="flex gap-2 text-sm text-on-primary-container">
                    <span className="material-symbols-outlined text-secondary-fixed text-base">
                      check_circle
                    </span>
                    Altere a senha sempre que suspeitar de uso indevido.
                  </li>
                  <li className="flex gap-2 text-sm text-on-primary-container">
                    <span className="material-symbols-outlined text-secondary-fixed text-base">
                      check_circle
                    </span>
                    Mantenha seus dados de contato sempre atualizados.
                  </li>
                </ul>
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
        </div>
      </main>
    </AppLayout>
  )
}

export default Perfil
