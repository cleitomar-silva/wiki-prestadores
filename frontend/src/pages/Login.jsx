import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const payload = await response.json()
        localStorage.setItem('wiki_user', JSON.stringify(payload.data))
        navigate('/')
        return
      }

      const payload = await response.json().catch(() => ({}))
      setError(payload.message || 'E-mail ou senha inválidos.')
    } catch {
      setError('Não foi possível conectar ao servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-0 py-stack-lg relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-fixed-dim rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary-fixed-dim rounded-full blur-[120px]"></div>
      </div>

      <section className="z-10 w-full max-w-[440px] bg-white border border-border-subtle shadow-sm rounded-lg overflow-hidden flex flex-col">
        <div className="bg-primary p-stack-lg text-center ">
          <h1 className="font-headline text-headline-md font-bold text-on-primary mt-[20px]">
            Wiki Prestadores
          </h1>
          <p className="text-body-sm text-on-primary-container mt-4 pb-2 mb-[20px]">
            Portal de Operações Internas
          </p>
        </div>

        <div className="p-stack-lg md:p-10 space-y-stack-lg">
          <div className="space-y-stack-sm text-center mb-[20px]">
            <h2 className="text-headline-md font-semibold text-on-surface">
              Bem-vindo
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Informe suas credenciais para continuar.
            </p>
          </div>

          <form className="space-y-stack-md" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-label-md font-semibold text-on-surface" htmlFor="email">
                E-mail
              </label>
              <input
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface"
                id="email"
                name="email"
                type="email"
                placeholder="nome@healthcare.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1 mt-[10px]">
              <div className="flex justify-between items-center">
                <label className="text-label-md font-semibold text-on-surface" htmlFor="password">
                  Senha
                </label>
                <a className="text-label-md font-semibold text-secondary hover:text-deep-teal transition-colors" href="#">
                  {/* Esqueceu a senha? */}
                </a>
              </div>
              <input
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-body-sm text-error bg-error-container/60 border border-error-container rounded px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-[20px] w-full bg-primary-container text-on-primary py-3.5 text-label-md font-semibold rounded hover:bg-primary transition-all duration-200 active:opacity-80 mt-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/*
          <div className="relative py-4 flex items-center">
            <div className="flex-grow border-t border-border-subtle"></div>
            <span className="flex-shrink mx-4 text-on-surface-variant text-body-sm">ou</span>
            <div className="flex-grow border-t border-border-subtle"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-outline-variant py-3 px-4 rounded text-label-md font-semibold text-on-surface bg-white hover:bg-surface-container-low transition-all duration-200 cursor-pointer"
          >
            <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1h9v9H1z" fill="#f25022"></path>
              <path d="M11 1h9v9h-9z" fill="#7fbb00"></path>
              <path d="M1 11h9v9H1z" fill="#00a4ef"></path>
              <path d="M11 11h9v9h-9z" fill="#ffb900"></path>
            </svg>
            Continuar com Microsoft
          </button>
          */}
        </div>

        <div className="bg-surface-container-low px-stack-lg py-4 border-t border-border-subtle flex justify-center gap-4">
          <a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors" target='_blank' href="https://protocolo.cafazonline.org.br/">
            Central de Ajuda
          </a>   
        </div>
      </section>
      </main>
      <footer className="w-full py-base px-margin-desktop bg-surface-container-low border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-body-sm text-on-surface-variant">
        </p>        
      </footer>
    </div>
  )
}

export default Login