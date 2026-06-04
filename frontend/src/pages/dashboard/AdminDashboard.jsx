import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminApi } from '../../services/api'
import DashboardShell from '../../components/DashboardShell'
import toast from 'react-hot-toast'
import { Users, CheckCircle, Clock, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'

const STATUS_BADGE = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  suspended: 'bg-red-100 text-red-700',
}
const ROLE_BADGE = {
  admin: 'bg-slate-100 text-slate-700',
  host: 'bg-blue-100 text-blue-700',
  volunteer: 'bg-green-100 text-green-700',
  agency: 'bg-amber-100 text-amber-700',
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value ?? '—'}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    adminApi.stats().then(({ data }) => setStats(data)).finally(() => setLoadingStats(false))
    fetchUsers()
  }, [])

  const fetchUsers = async (role = filterRole, status = filterStatus) => {
    setLoadingUsers(true)
    try {
      const params = {}
      if (role) params.role = role
      if (status) params.status = status
      const { data } = await adminApi.users(params)
      setUsers(data)
    } catch { toast.error('Failed to load users') }
    finally { setLoadingUsers(false) }
  }

  const applyFilters = () => fetchUsers(filterRole, filterStatus)

  const handleApprove = async (id, name) => {
    setActionLoading(id + '_approve')
    try {
      await adminApi.approve(id)
      toast.success(`${name} approved!`)
      fetchUsers(); adminApi.stats().then(({ data }) => setStats(data))
    } catch { toast.error('Action failed') }
    finally { setActionLoading(null) }
  }

  const handleSuspend = async (id, name) => {
    if (!confirm(`Suspend ${name}?`)) return
    setActionLoading(id + '_suspend')
    try {
      await adminApi.suspend(id)
      toast.success(`${name} suspended`)
      fetchUsers()
    } catch (e) { toast.error(e.response?.data?.detail || 'Action failed') }
    finally { setActionLoading(null) }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Permanently delete ${name}? This cannot be undone.`)) return
    setActionLoading(id + '_delete')
    try {
      await adminApi.delete(id)
      toast.success(`${name} deleted`)
      fetchUsers(); adminApi.stats().then(({ data }) => setStats(data))
    } catch { toast.error('Action failed') }
    finally { setActionLoading(null) }
  }

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-slate-700" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user?.full_name}</p>
          </div>
        </div>

        {/* Stats */}
        {loadingStats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="card p-5 h-20 animate-pulse bg-gray-100" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="👥" label="Total Users" value={stats?.total_users} color="bg-slate-100" />
            <StatCard icon="🎒" label="Volunteers" value={stats?.by_role?.volunteer} color="bg-green-100" />
            <StatCard icon="🏡" label="Hosts" value={stats?.by_role?.host} color="bg-blue-100" />
            <StatCard icon="⏳" label="Pending Approvals" value={stats?.pending_approvals} color="bg-amber-100" sub="Requires action" />
          </div>
        )}

        {/* Second row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="🗺️" label="Travel Agencies" value={stats?.by_role?.agency} color="bg-amber-100" />
          <StatCard icon="🔑" label="Admins" value={stats?.by_role?.admin} color="bg-slate-100" />
          <div className="card p-5 col-span-2 flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <div>
              <p className="font-bold text-lg">Platform Health</p>
              <p className="text-green-100 text-sm">All systems operational</p>
            </div>
          </div>
        </div>

        {/* User management */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5" /> User Management</h2>
            <div className="flex gap-2 flex-wrap">
              <select className="input text-sm w-auto py-1.5" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="">All Roles</option>
                {['admin','host','volunteer','agency'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
              </select>
              <select className="input text-sm w-auto py-1.5" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                {['active','pending','suspended'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
              <button className="btn-primary py-1.5 px-4 text-sm" onClick={applyFilters}>Filter</button>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-green-600" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-gray-400">No users found</td></tr>
                  ) : users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                            {u.full_name?.[0]}
                          </div>
                          {u.full_name}
                          {u.is_verified && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${STATUS_BADGE[u.status]}`}>{u.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {u.status === 'pending' && (
                            <button onClick={() => handleApprove(u.id, u.full_name)}
                              disabled={actionLoading === u.id + '_approve'}
                              className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-200 font-semibold disabled:opacity-50">
                              {actionLoading === u.id + '_approve' ? '…' : 'Approve'}
                            </button>
                          )}
                          {u.status === 'active' && (
                            <button onClick={() => handleSuspend(u.id, u.full_name)}
                              disabled={actionLoading === u.id + '_suspend'}
                              className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg hover:bg-amber-200 font-semibold disabled:opacity-50">
                              {actionLoading === u.id + '_suspend' ? '…' : 'Suspend'}
                            </button>
                          )}
                          <button onClick={() => handleDelete(u.id, u.full_name)}
                            disabled={actionLoading === u.id + '_delete'}
                            className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-200 font-semibold disabled:opacity-50">
                            {actionLoading === u.id + '_delete' ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
