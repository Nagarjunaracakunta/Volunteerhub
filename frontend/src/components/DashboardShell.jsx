import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, Menu, X } from 'lucide-react'

const ROLE_CONFIG = {
  admin: {
    label: 'Admin Panel',
    color: 'from-slate-800 to-slate-900',
    accent: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
    nav: [
      { to: '/dashboard/admin', icon: '📊', label: 'Overview' },
      { to: '/dashboard/admin/users', icon: '👥', label: 'User Management' },
      { to: '/dashboard/admin/approvals', icon: '✅', label: 'Pending Approvals' },
      { to: '/dashboard/admin/settings', icon: '⚙️', label: 'Settings' },
    ],
  },
  host: {
    label: 'Host Dashboard',
    color: 'from-blue-700 to-blue-900',
    accent: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    nav: [
      { to: '/dashboard/host', icon: '🏠', label: 'Overview' },
      { to: '/dashboard/host/opportunities', icon: '📋', label: 'My Opportunities' },
      { to: '/dashboard/host/applications', icon: '📨', label: 'Applications' },
      { to: '/dashboard/host/profile', icon: '👤', label: 'Host Profile' },
    ],
  },
  volunteer: {
    label: 'Volunteer Hub',
    color: 'from-green-700 to-green-900',
    accent: 'bg-green-500',
    badge: 'bg-green-100 text-green-700',
    nav: [
      { to: '/dashboard/volunteer', icon: '🌍', label: 'Overview' },
      { to: '/dashboard/volunteer/opportunities', icon: '🔍', label: 'Browse Opportunities' },
      { to: '/dashboard/volunteer/applications', icon: '📝', label: 'My Applications' },
      { to: '/dashboard/volunteer/skills', icon: '🤖', label: 'Skill Assessment' },
      { to: '/dashboard/volunteer/workshops', icon: '🎓', label: 'Workshops' },
      { to: '/dashboard/volunteer/perks', icon: '🎁', label: 'Perks & Discounts' },
    ],
  },
  agency: {
    label: 'Agency Portal',
    color: 'from-amber-600 to-amber-800',
    accent: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700',
    nav: [
      { to: '/dashboard/agency', icon: '🗺️', label: 'Overview' },
      { to: '/dashboard/agency/packages', icon: '🏖️', label: 'Tour Packages' },
      { to: '/dashboard/agency/coupons', icon: '🎟️', label: 'Coupons & Deals' },
      { to: '/dashboard/agency/profile', icon: '🏢', label: 'Agency Profile' },
    ],
  },
}

export default function DashboardShell({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const config = ROLE_CONFIG[user?.role] || ROLE_CONFIG.volunteer

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const Sidebar = () => (
    <div className={`flex flex-col h-full bg-gradient-to-b ${config.color} text-white`}>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 font-extrabold text-lg">
          <span className="text-xl">🌿</span> VolunteerHub
        </div>
        <div className="mt-2 text-xs text-white/60 uppercase tracking-wider">{config.label}</div>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-base">
            {user?.full_name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{user?.full_name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {config.nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length === 3}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-60 flex-shrink-0">
        <div className="w-full">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-white h-full shadow-xl z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-green-600">🌿 VolunteerHub</span>
          <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.full_name?.[0]?.toUpperCase()}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
