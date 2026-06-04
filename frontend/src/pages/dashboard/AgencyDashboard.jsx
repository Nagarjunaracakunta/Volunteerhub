import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import DashboardShell from '../../components/DashboardShell'
import { MapPin, Tag, TrendingUp, Users, PlusCircle, Copy, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const PACKAGES = [
  { emoji: '🐪', title: 'Desert Safari — Jaisalmer', category: 'Adventure', price: '₹2,999', discount: '35% OFF', active: true },
  { emoji: '🏔️', title: 'Triund Trek Package', category: 'Trekking', price: '₹1,499', discount: '40% OFF', active: true },
  { emoji: '🚤', title: 'Kerala Houseboat Cruise', category: 'Leisure', price: '₹4,499', discount: '30% OFF', active: false },
]

const COUPONS = [
  { code: 'VHAGENCY40', discount: '40% OFF', used: 12, total: 50, expires: 'Jul 30, 2026' },
  { code: 'VHTRIP30', discount: '30% OFF', used: 5, total: 30, expires: 'Aug 15, 2026' },
]

export default function AgencyDashboard() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(null)

  const copyCoupon = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {})
    setCopied(code)
    toast.success(`Copied: ${code}`)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🗺️</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.org_name || 'Agency Portal'}</h1>
              <p className="text-gray-500 text-sm">Travel Agency Dashboard</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5">
              <Tag className="w-4 h-4" /> New Coupon
            </button>
            <button className="btn-primary text-sm flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" /> Add Package
            </button>
          </div>
        </div>

        {/* Pending banner */}
        {!user?.is_verified && (
          <div className="card p-4 bg-amber-50 border-amber-200 flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-semibold text-amber-800">Awaiting Admin Approval</p>
              <p className="text-sm text-amber-600">Your agency account is under review. Coupon & package features will unlock once approved.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MapPin, label: 'Active Packages', value: '2', bg: 'bg-amber-100', color: 'text-amber-600' },
            { icon: Tag, label: 'Active Coupons', value: '2', bg: 'bg-green-100', color: 'text-green-600' },
            { icon: Users, label: 'Redemptions', value: '17', bg: 'bg-blue-100', color: 'text-blue-600' },
            { icon: TrendingUp, label: 'Est. Revenue', value: '₹51K', bg: 'bg-purple-100', color: 'text-purple-600' },
          ].map(({ icon: Icon, label, value, bg, color }) => (
            <div key={label} className="card p-5 flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Packages */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4" /> Tour Packages</h2>
            <span className="text-xs text-gray-400">{PACKAGES.filter(p => p.active).length} active</span>
          </div>
          <div className="divide-y divide-gray-50">
            {PACKAGES.map((p) => (
              <div key={p.title} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-xl">{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.category} · {p.price}</p>
                </div>
                <span className="badge bg-amber-100 text-amber-700 font-bold">{p.discount}</span>
                <span className={`badge ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.active ? 'Active' : 'Paused'}
                </span>
                <div className="flex gap-2">
                  <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-medium">Edit</button>
                  <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 font-medium">
                    {p.active ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coupons */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><Tag className="w-4 h-4" /> Discount Coupons</h2>
          </div>
          <div className="p-5 grid sm:grid-cols-2 gap-4">
            {COUPONS.map((c) => (
              <div key={c.code} className="border border-dashed border-amber-300 rounded-xl p-4 bg-amber-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-amber-700 text-lg tracking-wider">{c.code}</span>
                  <span className="badge bg-amber-200 text-amber-800 font-bold">{c.discount}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Used: {c.used}/{c.total}</span>
                  <span>Expires: {c.expires}</span>
                </div>
                <div className="h-1.5 bg-amber-200 rounded-full">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(c.used / c.total) * 100}%` }} />
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => copyCoupon(c.code)}
                    className="flex-1 text-xs flex items-center justify-center gap-1.5 bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 font-medium">
                    {copied === c.code ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Code</>}
                  </button>
                  <button className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 font-medium">Edit</button>
                </div>
              </div>
            ))}
            <button className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-amber-300 hover:text-amber-500 transition-colors h-full min-h-32">
              <PlusCircle className="w-6 h-6" />
              <span className="text-sm font-medium">Create New Coupon</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
