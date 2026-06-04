import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/api'
import DashboardShell from '../components/DashboardShell'
import toast from 'react-hot-toast'
import { Save, Lock, Loader2 } from 'lucide-react'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    org_name: user?.org_name || '',
    website: user?.website || '',
  })
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  const ROLE_BADGE = { admin: 'bg-slate-100 text-slate-700', host: 'bg-blue-100 text-blue-700', volunteer: 'bg-green-100 text-green-700', agency: 'bg-amber-100 text-amber-700' }

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authApi.updateProfile(form)
      await refreshUser()
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update profile')
    } finally { setSaving(false) }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (pwForm.new_password !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    setSavingPw(true)
    try {
      await authApi.changePassword({ current_password: pwForm.current_password, new_password: pwForm.new_password })
      toast.success('Password changed!')
      setPwForm({ current_password: '', new_password: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password')
    } finally { setSavingPw(false) }
  }

  return (
    <DashboardShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Update your personal information</p>
        </div>

        {/* Avatar + meta */}
        <div className="card p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-black">
            {user?.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-lg">{user?.full_name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${ROLE_BADGE[user?.role]}`}>{user?.role}</span>
              {user?.is_verified && <span className="badge bg-green-100 text-green-700">✓ Verified</span>}
              <span className={`badge ${user?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{user?.status}</span>
            </div>
          </div>
        </div>

        {/* Edit profile */}
        <form onSubmit={saveProfile} className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Personal Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input className="input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <input className="input" placeholder="City, State" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            {['host', 'agency'].includes(user?.role) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Organisation Name</label>
                  <input className="input" value={form.org_name} onChange={(e) => setForm({ ...form, org_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                  <input className="input" placeholder="https://..." value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea className="input resize-none" rows={3} placeholder="Tell us about yourself…"
              value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>

        {/* Change password */}
        <form onSubmit={changePassword} className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</h2>
          <div className="space-y-3">
            {[['current_password', 'Current Password'], ['new_password', 'New Password'], ['confirm', 'Confirm New Password']].map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input type="password" required minLength={key !== 'current_password' ? 8 : undefined}
                  className="input" placeholder="••••••••"
                  value={pwForm[key]} onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })} />
              </div>
            ))}
          </div>
          <button type="submit" disabled={savingPw} className="btn-primary flex items-center gap-2">
            {savingPw ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</> : <><Lock className="w-4 h-4" /> Update Password</>}
          </button>
        </form>
      </div>
    </DashboardShell>
  )
}
