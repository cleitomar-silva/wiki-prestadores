import { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { formatCnpj } from '../utils/cnpj'

function formatDate(value) {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

function SearchForm({ onSearch, loading }) {
  const [provider, setProvider] = useState('')
  const [code, setCode] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({ term: provider, code })
  }

  return (
    <section className="tonal-layer-1 p-8 rounded shadow-sm bg-surface-container-lowest">
      <form
        className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end"
        onSubmit={handleSubmit}
      >
        <div className="md:col-span-5 flex flex-col gap-2">
          <label
            className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider"
            htmlFor="provider"
          >
            Prestador
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              cloud_download
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all"
              id="provider"
              placeholder="Nome do Hospital/Clínica ou CNPJ"
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            />
          </div>
        </div>
        <div className="md:col-span-4 flex flex-col gap-2">
          <label
            className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wider"
            htmlFor="procedure-code"
          >
            Código do Procedimento
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              numbers
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-primary bg-surface transition-all"
              id="procedure-code"
              placeholder="Ex: 10101012"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container text-on-primary px-6 py-3.5 rounded font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:opacity-80 transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined">search</span>
            )}
            <span>{loading ? 'Buscando...' : 'Buscar Procedimento'}</span>
          </button>
        </div>
      </form>
    </section>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded p-12 text-center">
      <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-primary text-[40px]">
          manage_search
        </span>
      </div>
      <h3 className="text-headline-md font-semibold text-on-surface mb-2">
        Aguardando busca
      </h3>
      <p className="text-on-surface-variant max-w-xs text-body-md">
        Informe o nome do prestador ou o código do procedimento para visualizar
        os detalhes operacionais.
      </p>
    </div>
  )
}

function ProcedureResult({ procedure }) {
  const {
    provider,
    cnpj,
    code,
    code_to_authorize,
    description,
    requires_justification,
    deadlines,
    operational_notes,
  } = procedure

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md font-semibold text-primary">
          Resultado da Consulta
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 tonal-layer-1 p-6 rounded bg-surface-container-lowest sidebar-accent">
          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <p className="text-outline uppercase text-[11px] font-semibold mb-1">
                Prestador
              </p>
              <p className="text-headline-md font-semibold text-on-surface">
                {provider}
              </p>
            </div>
            <div>
              <p className="text-outline uppercase text-[11px] font-semibold mb-1">
                CNPJ
              </p>
              <p className="text-headline-md font-bold text-primary">
                {formatCnpj(cnpj) || '—'}
              </p>
            </div>
            <div>
              <p className="text-outline uppercase text-[11px] font-semibold mb-1">
                Código
              </p>
              <p className="text-headline-md font-bold text-primary">{code}</p>
            </div>
            <div>
              <p className="text-outline uppercase text-[11px] font-semibold mb-1">
                Código Autorizado
              </p>
              <p className="text-headline-md font-bold text-primary">
                {code_to_authorize || '—'}
              </p>
            </div>
            <div>
              <p className="text-outline uppercase text-[11px] font-semibold mb-1">
                Precisa de Justificativa?
              </p>
              <p className="text-headline-md font-bold text-primary">
                {requires_justification ? 'Sim' : 'Não'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-outline uppercase text-[11px] font-semibold mb-1">
                Descrição
              </p>
              <p className="text-body-lg leading-relaxed text-on-surface">
                {description}
              </p>
            </div>
          </div>
        </div>
        <div className="tonal-layer-1 p-6 rounded border-secondary">
          <div className="flex items-center gap-2 mb-4 text-secondary">
            <span className="material-symbols-outlined">schedule</span>
            <h4 className="font-semibold uppercase text-sm">
              Prazos de Apresentação
            </h4>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-outline-variant pb-2">
              <span className="text-on-surface-variant text-sm">
                Prazo Apresentação Conta
              </span>
              <span className="font-bold text-primary">
                {formatDate(deadlines.ambulatory)}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-sm">
                Formato de Entrega
              </span>
              <span className="font-bold text-primary">
                {formatDate(deadlines.hospitalization)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="tonal-layer-1 bg-surface-container-low p-6 rounded border-l-4 border-deep-teal">
        <div className="flex items-center gap-2 mb-3 text-deep-teal">
          <span className="material-symbols-outlined">description</span>
          <h4 className="font-semibold uppercase text-sm">
            Notas Operacionais
          </h4>
        </div>
        <ul className="space-y-3">
          {operational_notes.map((note, index) => (
            <li
              key={index}
              className="flex gap-3 text-body-md text-on-surface-variant"
            >
              <span className="text-deep-teal font-bold">•</span>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="w-full px-margin-desktop py-base flex justify-between items-center bg-surface-container-low text-on-surface-variant text-sm border-t border-border-subtle">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        
      </div>
     
    </footer>
  )
}

function Home() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [message, setMessage] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async ({ term, code }) => {
    setLoading(true)
    setMessage('')
    setSearched(false)
    setResults([])

    try {
      const params = new URLSearchParams()
      if (term) params.set('term', term)
      if (code) params.set('code', code)

      const response = await fetch(`/api/procedures?${params.toString()}`, {
        headers: { Accept: 'application/json' },
      })
      const payload = await response.json()

      if (!response.ok) {
        setMessage('Erro ao consultar o servidor. Tente novamente.')
        return
      }

      setResults(payload.data ?? [])
      setMessage(payload.message ?? '')
      setSearched(true)
    } catch {
      setMessage('Não foi possível conectar ao servidor.')
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <main className="flex-1 max-w-[1280px] mx-auto px-margin-desktop py-stack-lg flex flex-col gap-8">
          <section className="flex flex-col gap-2">
            <h1 className="mt-10 text-[30px] font-bold text-primary leading-tight">
              Consulta de Procedimento
            </h1>
            <p className="text-on-surface-variant text-body-lg max-w-2xl">
              Utilize o formulário abaixo para consultar prazos, notas
              operacionais e detalhes técnicos de procedimentos médicos
              registrados no sistema.
            </p>
          </section>

          <SearchForm onSearch={handleSearch} loading={loading} />

          <section className="min-h-[400px] flex flex-col gap-6 pb-24">
            {!searched && !loading && <EmptyState />}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded p-12 text-center">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">
                  progress_activity
                </span>
                <p className="text-on-surface-variant mt-4">
                  Consultando procedimentos...
                </p>
              </div>
            )}

            {searched && message && (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded p-12 text-center">
                <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary text-[40px]">
                    search_off
                  </span>
                </div>
                <h3 className="text-headline-md font-semibold text-on-surface mb-2">
                  Nenhum resultado
                </h3>
                <p className="text-on-surface-variant max-w-xs">{message}</p>
              </div>
            )}

            {searched && !message &&
              results.map((procedure) => (
                <ProcedureResult
                  key={`${procedure.code}-${procedure.provider}`}
                  procedure={procedure}
                />
              ))}
          </section>
        </main>
      <Footer />
    </AppLayout>
  )
}

export default Home