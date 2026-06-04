import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'

const ROLES = [
  { value: 'volunteer', icon: '🎒', label: 'Volunteer', desc: 'I want to travel and work for free accommodation' },
  { value: 'host', icon: '🏡', label: 'Host', desc: 'I offer opportunities on my farm/hostel/project' },
  { value: 'agency', icon: '🗺️', label: 'Travel Agency', desc: 'I offer tourist packages & local experiences' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', role: 'volunteer',
    org_name: '', phone: '', location: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const needsOrg = ['host', 'agency'].includes(form.role)
  const ROLE_HOME = { admin: '/dashboard/admin', host: '/dashboard/host', volunteer: '/dashboard/volunteer', agency: '/dashboard/agency' }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await register(form)
      toast.success(`Account created! Welcome, ${user.full_name} 🎉`)
      navigate(ROLE_HOME[user.role] || '/dashboard/volunteer', { replace: true })
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.detail
      if (status === 202) {
        toast.success('Registration submitted! Awaiting admin approval.')
        navigate('/login')
      } else {
        toast.error(msg || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-green-700 to-green-900 items-center justify-center p-12">
        <div className="text-white max-w-sm">
          <div className="text-4xl font-black mb-6">🌿 VolunteerHub</div>
          <div className="space-y-4">
            {['Join 12,000+ volunteers across India', 'AI-powered skill matching', 'Food & shelter in exchange for your skills', 'Exclusive travel perks & discounts'].map((t) => (
              <div key={t} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                <span className="text-green-100">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <div className="text-3xl font-black text-green-600 lg:hidden mb-2">🌿 VolunteerHub</div>
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-1 text-sm">Step {step} of 2</p>
            <div className="flex gap-2 justify-center mt-3">
              {[1, 2].map((s) => (
                <div key={s} className={`h-1.5 w-16 rounded-full transition-all ${s <= step ? 'bg-green-600' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSubmit}
            className="card p-8 space-y-5">

            {step === 1 && (
              <>
                {/* Role selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">I am a…</label>
                  <div className="grid gap-3">
                    {ROLES.map((r) => (
                      <label key={r.value}
                        className={`flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                          form.role === r.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <input type="radio" name="role" value={r.value} className="mt-1 accent-green-600"
                          checked={form.role === r.value}
                          onChange={(e) => setForm({ ...form, role: e.target.value })} />
                        <div>
                          <span className="text-lg mr-1">{r.icon}</span>
                          <span className="font-semibold text-sm">{r.label}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {needsOrg && (
                    <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-3 py-2 rounded-lg">
                      ⚠️ Host & Agency accounts require admin approval before you can log in.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input type="text" required className="input" placeholder="Your full name"
                    value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input type="email" required className="input" placeholder="you@example.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>

                <button type="submit" className="btn-primary w-full py-3">Continue →</button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} required minLength={8}
                      className="input pr-10" placeholder="Min. 8 characters"
                      value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {needsOrg && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {form.role === 'agency' ? 'Agency Name' : 'Organisation / Farm Name'}
                    </label>
                    <input type="text" required className="input"
                      placeholder={form.role === 'agency' ? 'e.g. Kerala Trails' : 'e.g. Green Valley Farm'}
                      value={form.org_name} onChange={(e) => setForm({ ...form, org_name: e.target.value })} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label>
                    <input type="tel" className="input" placeholder="+91 XXXXX XXXXX"
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Location (optional)</label>
                    <input type="text" className="input" placeholder="City, State"
                      value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : 'Create Account 🎉'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
