import { useAuth } from '../../context/AuthContext'
import DashboardShell from '../../components/DashboardShell'
import { Search, BookOpen, Award, MapPin, Clock, CheckCircle } from 'lucide-react'

const OPPORTUNITIES = [
  { emoji: '🌾', title: 'Organic Farm Hand', location: 'Coorg, Karnataka', duration: '2–8 weeks', skills: ['Farming'], perks: ['🏠', '🍽️', '🎟️'] },
  { emoji: '💻', title: 'Web Dev for Hostel', location: 'Anjuna, Goa', duration: '3–6 weeks', skills: ['Web Dev'], perks: ['🏠', '🍽️', '🏄'] },
  { emoji: '📚', title: 'English Teacher', location: 'Dharamsala, HP', duration: '4–12 weeks', skills: ['Teaching'], perks: ['🏠', '🍽️', '🧘'] },
  { emoji: '🧘', title: 'Yoga Assistant', location: 'Rishikesh, UK', duration: '1–4 weeks', skills: ['Yoga'], perks: ['🏠', '🍽️', '🏔️'] },
  { emoji: '🦁', title: 'Wildlife Monitor', location: 'Jim Corbett, UK', duration: '2–4 weeks', skills: ['Wildlife'], perks: ['🏠', '🍽️', '🎟️'] },
  { emoji: '🎨', title: 'Design & Social Media', location: 'Jaipur, Rajasthan', duration: '3–8 weeks', skills: ['Design'], perks: ['🏠', '🍽️', '🛍️'] },
]

const SKILL_BADGES = [
  { skill: 'Web Development', level: 'Intermediate', score: 72, color: 'bg-blue-100 text-blue-700' },
  { skill: 'Organic Farming', level: 'Beginner', score: 45, color: 'bg-green-100 text-green-700' },
]

export default function VolunteerDashboard() {
  const { user } = useAuth()
  return (
    <DashboardShell>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="card p-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.full_name?.split(' ')[0]}! 👋</h1>
              <p className="text-green-100 mt-1">Ready for your next adventure?</p>
            </div>
            <div className="flex gap-4">
              {[['3', 'Applications'], ['2', 'Badges'], ['1', 'Placement']].map(([n, l]) => (
                <div key={l} className="text-center bg-white/10 rounded-xl px-4 py-2">
                  <p className="text-xl font-black">{n}</p>
                  <p className="text-xs text-green-100">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Search, label: 'Browse Opportunities', color: 'text-green-600 bg-green-50' },
            { icon: BookOpen, label: 'Skill Workshops', color: 'text-blue-600 bg-blue-50' },
            { icon: Award, label: 'Take Skill Test', color: 'text-amber-600 bg-amber-50' },
            { icon: MapPin, label: 'Explore Perks', color: 'text-purple-600 bg-purple-50' },
          ].map(({ icon: Icon, label, color }) => (
            <button key={label} className="card p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-gray-700">{label}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Opportunities */}
          <div className="lg:col-span-2 card">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Recommended Opportunities</h2>
              <button className="text-xs text-green-600 font-semibold hover:underline">View all →</button>
            </div>
            <div className="divide-y divide-gray-50">
              {OPPORTUNITIES.slice(0, 4).map((o) => (
                <div key={o.title} className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-xl flex-shrink-0">{o.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{o.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">📍 {o.location} · ⏱ {o.duration}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {o.perks.map((p, i) => <span key={i} className="text-sm">{p}</span>)}
                    </div>
                  </div>
                  <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium flex-shrink-0">Apply</button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Skill Badges */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> My Skill Badges</h2>
              {SKILL_BADGES.length === 0 ? (
                <p className="text-sm text-gray-400">No badges yet. Take a skill assessment!</p>
              ) : (
                <div className="space-y-3">
                  {SKILL_BADGES.map((b) => (
                    <div key={b.skill}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700">{b.skill}</span>
                        <span className={`badge text-xs ${b.color}`}>{b.level}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${b.score}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{b.score}% score</p>
                    </div>
                  ))}
                  <button className="w-full text-xs text-green-600 font-semibold mt-2 hover:underline">+ Add new skill test</button>
                </div>
              )}
            </div>

            {/* My Applications */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> My Applications</h2>
              <div className="space-y-2">
                {[
                  { title: 'Organic Farm Hand', status: 'pending', when: '2 days ago' },
                  { title: 'Web Dev for Hostel', status: 'accepted', when: '1 week ago' },
                  { title: 'English Teacher', status: 'pending', when: '3 days ago' },
                ].map((a) => (
                  <div key={a.title} className="flex items-center gap-2">
                    {a.status === 'accepted'
                      ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      : <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{a.title}</p>
                      <p className="text-xs text-gray-400">{a.when}</p>
                    </div>
                    <span className={`badge text-xs ${a.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
