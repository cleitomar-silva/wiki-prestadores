import { Link, useLocation, useNavigate } from 'react-router-dom'

function TopNavBar({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <header className="bg-primary text-on-primary fixed top-0 z-50 flex justify-between items-center w-full px-margin-desktop h-16">
      <div className="flex items-center gap-8">
        <span className="font-headline text-headline-md font-bold text-on-primary tracking-tight ml-[25px]">
          Wiki Prestadores
        </span>
       
        
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-on-primary-container flex items-center justify-center bg-primary-container text-on-primary font-bold text-sm">
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <button
              type="button"
              onClick={onLogout}
              title="Sair"
              className="p-2 mr-[20px] hover:bg-primary-container rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 mr-[20px] bg-on-primary text-primary text-label-md font-semibold rounded hover:bg-primary-fixed transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>Entrar</span>
          </button>
        )}
      </div>
    </header>
  )
}

function SideNavBar({ user, onLogout }) {
  const { pathname } = useLocation()
  const navItems = [
    { icon: 'manage_search', label: 'Consultar', to: '/' },
    { icon: 'add_circle', label: 'Novo', to: '/novo-procedimento' },
    { icon: 'medical_services', label: 'Procedimentos', to: '/procedimentos' },
    { icon: 'person', label: 'Perfil' },
    { icon: 'group', label: 'Usuários', to: '/usuarios' },
  ]

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[250px] flex flex-col py-stack-lg bg-surface border-r border-border-subtle z-40 hidden md:flex">
      
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item, index) => {
          const active = item.to ? pathname === item.to : false
          const cls = `flex items-center gap-3 px-4 py-3 text-label-md transition-all ${
            active
              ? 'text-primary font-bold bg-surface-container-high border-l-4 border-primary'
              : 'text-on-surface-variant hover:bg-surface-container'
          } ${index === 0 ? 'mt-5' : ''}`
          const inner = (
            <>
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </>
          )
          return item.to ? (
            <Link key={item.label} to={item.to} className={cls}>
              {inner}
            </Link>
          ) : (
            <a key={item.label} href="#" className={cls}>
              {inner}
            </a>
          )
        })}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant text-label-md hover:bg-surface-container transition-all text-left cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          Sair
        </button>
      </nav>
     
    </aside>
  )
}

function AppLayout({ children }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('wiki_user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('wiki_user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <TopNavBar user={user} onLogout={handleLogout} />
      {user && <SideNavBar user={user} onLogout={handleLogout} />}
      <div className={`flex pt-16 min-h-screen flex-1 ${user ? 'md:ml-[250px]' : ''}`}>
        <div className={`flex-1 w-full flex flex-col ${user ? 'md:pl-[20px]' : ''}`}>{children}</div>
      </div>
    </div>
  )
}

export default AppLayout