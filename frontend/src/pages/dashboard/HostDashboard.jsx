import { useAuth } from '../../context/AuthContext'
import DashboardShell from '../../components/DashboardShell'
import { Home, PlusCircle, Users, Star, TrendingUp } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

const SAMPLE_APPLICATIONS = [
  { name: 'Priya Mehta', skill: 'Organic Farming', location: 'Bangalore', applied: '2 days ago', status: 'pending' },
  { name: 'Rahul Sharma', skill: 'Web Development', location: 'Delhi', applied: '4 days ago', status: 'accepted' },
  { name: 'Anjali Nair', skill: 'Teaching', location: 'Kochi', applied: '1 week ago', status: 'pending' },
]

const STATUS = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function HostDashboard() {
  const { user } = useAuth()
  return (
    <DashboardShell>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="w-7 h-7 text-blue-700" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Host Dashboard</h1>
              <p className="text-gray-500 text-sm">{user?.org_name || user?.full_name}</p>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <PlusCircle className="w-4 h-4" /> New Opportunity
          </button>
        </div>

        {/* Welcome banner */}
        {!user?.is_verified && (
          <div className="card p-4 bg-amber-50 border-amber-200 flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-semibold text-amber-800">Account Pending Verification</p>
              <p className="text-sm text-amber-600">Our admin team will review your profile shortly. You'll be notified once approved.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Home} label="Active Listings" value="3" color="text-blue-600" bg="bg-blue-100" />
          <StatCard icon={Users} label="Total Applications" value="14" color="text-green-600" bg="bg-green-100" />
          <StatCard icon={Star} label="Avg. Rating" value="4.8" color="text-amber-600" bg="bg-amber-100" />
          <StatCard icon={TrendingUp} label="Volunteers Hosted" value="27" color="text-purple-600" bg="bg-purple-100" />
        </div>

        {/* Active Listings */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Your Listings</h2>
            <span className="text-xs text-gray-400">3 active</span>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { emoji: '🌾', title: 'Organic Farm Hand', location: 'Coorg, Karnataka', apps: 6, duration: '2–8 weeks' },
              { emoji: '💻', title: 'Web Dev for Hostel', location: 'Anjuna, Goa', apps: 5, duration: '3–6 weeks' },
              { emoji: '🎨', title: 'Social Media Help', location: 'Jaipur, Rajasthan', apps: 3, duration: '3–8 weeks' },
            ].map((l) => (
              <div key={l.title} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-xl">{l.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{l.title}</p>
                  <p className="text-xs text-gray-400">📍 {l.location} · ⏱ {l.duration}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-blue-600">{l.apps}</p>
                  <p className="text-xs text-gray-400">apps</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-medium">View</button>
                  <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 font-medium">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Applications</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {SAMPLE_APPLICATIONS.map((a) => (
              <div key={a.name} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 text-sm">
                  {a.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.skill} · {a.location} · {a.applied}</p>
                </div>
                <span className={`badge ${STATUS[a.status]}`}>{a.status}</span>
                <div className="flex gap-2">
                  <button className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium">Accept</button>
                  <button className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
