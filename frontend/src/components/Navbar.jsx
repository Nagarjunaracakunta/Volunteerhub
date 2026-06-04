import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, User, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const ROLE_LABELS = {
  admin: { label: 'Admin', color: 'bg-red-100 text-red-700' },
  host: { label: 'Host', color: 'bg-blue-100 text-blue-700' },
  volunteer: { label: 'Volunteer', color: 'bg-green-100 text-green-700' },
  agency: { label: 'Travel Agency', color: 'bg-amber-100 text-amber-700' },
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const role = user?.role ? ROLE_LABELS[user.role] : null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-green-600">
            <span className="text-2xl">🌿</span>
            VolunteerHub
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold leading-none">{user.full_name}</p>
                    {role && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${role.color}`}>
                        {role.label}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to={`/dashboard/${user.role}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="w-4 h-4" /> My Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="w-4 h-4" /> Edit Profile
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Join Free</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
