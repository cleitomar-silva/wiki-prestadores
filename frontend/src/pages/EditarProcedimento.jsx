import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Toast from '../components/Toast'
import { formatCnpj, maskCnpj } from '../utils/cnpj'

const inputCls =
  'w-full border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary/20 rounded h-12 px-4 bg-surface-container-low/30'
const labelCls =
  'block text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-2'

function EditarProcedimento() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])
  const [form, setForm] = useState({
    provider: '',
    cnpj: '',
    code: '',
    code_to_authorize: '',
    description: '',
    deadline_ambulatory: '',
    deadline_hospitalization: '',
    justification: 'não',
    coopanest: 'sim',
    observations: '',
  })

  const pushToast = (type, title, message) => {
    const tId = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id: tId, type, title, message }])
  }

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/procedures/${id}`, {
          headers: { Accept: 'application/json' },
        })
        if (response.status === 404) {
          setNotFound(true)
          return
        }
        if (!response.ok) throw new Error()
        const payload = await response.json()
        const p = payload.data
        setForm({
          provider: p.provider ?? '',
          cnpj: formatCnpj(p.cnpj) ?? '',
          code: p.code ?? '',
          code_to_authorize: p.code_to_authorize ?? '',
          description: p.description ?? '',
          deadline_ambulatory: p.deadlines?.ambulatory ?? '',
          deadline_hospitalization: p.deadlines?.hospitalization ?? '',
          justification: p.requires_justification ? 'sim' : 'não',
          coopanest: p.authorization_coopanest ? 'sim' : 'não',
          observations: (p.operational_notes ?? []).join('\n'),
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

    const notes = form.observations
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean)

    try {
      const response = await fetch(`/api/procedures/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          provider: form.provider,
          cnpj: form.cnpj,
          code: form.code,
          code_to_authorize: form.code_to_authorize,
          description: form.description,
          deadline_ambulatory: form.deadline_ambulatory,
          deadline_hospitalization: form.deadline_hospitalization,
          requires_justification: form.justification === 'sim',
          authorization_coopanest: form.coopanest === 'sim',
          operational_notes: notes,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = payload.errors
          ? Object.values(payload.errors).flat().join(' ')
          : payload.message || 'Não foi possível atualizar o procedimento.'
        pushToast('error', 'Erro ao salvar', message)
        return
      }

      pushToast(
        'success',
        'Sucesso',
        'Procedimento atualizado com sucesso. Redirecionando...'
      )
      setTimeout(() => navigate('/procedimentos'), 1200)
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
            Carregando procedimento...
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
            Procedimento não encontrado
          </h1>
          <p className="text-on-surface-variant mt-2">
            O procedimento que você procura pode ter sido excluído.
          </p>
          <Link
            to="/procedimentos"
            className="inline-block mt-8 px-6 py-3 bg-primary-container text-on-primary font-semibold rounded cursor-pointer"
          >
            Voltar para Procedimentos
          </Link>
        </main>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <main className="flex-1 max-w-[1280px] mx-auto px-10 py-6 flex flex-col gap-8">
        <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
              <Link to="/procedimentos" className="hover:text-primary cursor-pointer">
                Procedimentos
              </Link>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="text-primary font-semibold">
                Editar Procedimento
              </span>
            </nav>
            <h1 className="mt-6 text-[30px] font-bold text-primary leading-tight">
              Edição de Procedimento Operacional
            </h1>
            <p className="text-on-surface-variant text-body-md mt-2">
              Atualize os dados cadastrais desta diretriz de faturamento e
              auditoria.
            </p>
          </div>
        </header>

        <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-3">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>

        <form
          className="grid grid-cols-12 gap-6"
          id="procedimentoForm"
          onSubmit={handleSubmit}
        >
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-border-subtle rounded p-6">
            <div className="flex items-center gap-2 mb-6 border-l-4 border-deep-teal pl-4">
              <h3 className="text-lg font-bold text-primary">
                Identificação do Procedimento
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls} htmlFor="provider">
                  Prestador
                </label>
                <input
                  className={inputCls}
                  id="provider"
                  maxLength="150"
                  placeholder="Nome completo da unidade hospitalar ou clínica"
                  type="text"
                  value={form.provider}
                  onChange={set('provider')}
                  required
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="cnpj">
                  CNPJ do Prestador
                </label>
                <input
                  className={inputCls}
                  id="cnpj"
                  maxLength="18"
                  placeholder="Ex: 12.345.678/0001-90"
                  type="text"
                  inputMode="numeric"
                  value={form.cnpj}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cnpj: maskCnpj(e.target.value) }))
                  }
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="code">
                  Código do Procedimento{' '}
                </label>
                <input
                  className={inputCls}
                  id="code"
                  maxLength="50"
                  placeholder="Ex: 40304361"
                  type="text"
                  value={form.code}
                  onChange={set('code')}
                  required
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="code_to_authorize">
                  Qual código deve ser autorizado{' '}
                </label>
                <input
                  className={inputCls}
                  id="code_to_authorize"
                  maxLength="50"
                  placeholder="Código TUSS ou interno"
                  type="text"
                  value={form.code_to_authorize}
                  onChange={set('code_to_authorize')}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls} htmlFor="description">
                  Descrição do Procedimento
                </label>
                <input
                  className={inputCls}
                  id="description"
                  maxLength="255"
                  placeholder="Detalhamento técnico da intervenção"
                  type="text"
                  value={form.description}
                  onChange={set('description')}
                  required
                />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest border border-border-subtle rounded p-6">
              <div className="flex items-center gap-2 mb-6 border-l-4 border-secondary pl-4">
                <h3 className="text-lg font-bold text-primary">
                  Logística &amp; Prazos
                </h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className={labelCls} htmlFor="deadline_ambulatory">
                    Prazo Apresentação Conta
                  </label>
                  <input
                    className={inputCls}
                    id="deadline_ambulatory"
                    maxLength="50"
                    placeholder="Ex: 30 dias após alta"
                    type="text"
                    value={form.deadline_ambulatory}
                    onChange={set('deadline_ambulatory')}
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="deadline_hospitalization">
                    Formato de Entrega
                  </label>
                  <input
                    className={inputCls}
                    id="deadline_hospitalization"
                    maxLength="100"
                    placeholder="Físico, XML ou Portal"
                    type="text"
                    value={form.deadline_hospitalization}
                    onChange={set('deadline_hospitalization')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest border border-border-subtle rounded p-6 flex flex-col justify-center">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-error-container/20 rounded text-error">
                    <span className="material-symbols-outlined">
                      priority_high
                    </span>
                  </div>
                  <label
                    className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold"
                    htmlFor="justification"
                  >
                    Precisa de justificativa?
                  </label>
                </div>
                <select
                  className="border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary/20 rounded h-10 px-4 min-w-[100px]"
                  id="justification"
                  value={form.justification}
                  onChange={set('justification')}
                >
                  <option value="não">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-border-subtle rounded p-6 flex flex-col justify-center">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary-container/20 rounded text-secondary">
                    <span className="material-symbols-outlined">
                      business_center
                    </span>
                  </div>
                  <label
                    className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold"
                    htmlFor="coopanest"
                  >
                    Autorização em nome da Coopanest?
                  </label>
                </div>
                <select
                  className="border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary/20 rounded h-10 px-4 min-w-[100px]"
                  id="coopanest"
                  value={form.coopanest}
                  onChange={set('coopanest')}
                >
                  <option value="sim">Sim</option>
                  <option value="não">Não</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-span-12 bg-surface-container-lowest border border-border-subtle rounded p-6">
            <label
              className="block text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-4 border-l-4 border-outline-variant pl-4"
              htmlFor="observations"
            >
              Informações Gerais e Observações Técnicas
            </label>
            <textarea
              className="w-full border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary/20 rounded p-4 bg-surface-container-low/10 resize-none"
              id="observations"
              placeholder="Insira detalhes adicionais, exceções contratuais ou instruções específicas para a equipe de auditoria..."
              rows="5"
              value={form.observations}
              onChange={set('observations')}
            />
          </div>

          <div className="col-span-12 flex justify-end gap-3 mt-6 pt-6 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => navigate('/procedimentos')}
              className="px-6 py-2.5 border border-secondary text-secondary text-label-md font-semibold rounded hover:bg-secondary/5 transition-colors cursor-pointer"
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
      </main>
    </AppLayout>
  )
}

export default EditarProcedimento