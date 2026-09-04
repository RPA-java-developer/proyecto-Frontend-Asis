import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'


const links = [
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/suppliers', label: 'Suppliers' }
]

export default function Sidebar() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 shrink-0 bg-ink text-paper flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="font-semibold tracking-tight text-lg">ASISYA</div>
        <div className="text-xs text-slate mt-0.5">Catálogo de productos</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-moss text-white'
                  : 'text-paper/80 hover:bg-white/5 hover:text-paper'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <div className="text-xs text-slate mb-2">Conectado como {username}</div>
        <button
          onClick={handleLogout}
          className="text-sm text-paper/80 hover:text-paper"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
