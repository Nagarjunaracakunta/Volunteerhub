import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Dashboard pages
import AdminDashboard from './pages/dashboard/AdminDashboard'
import HostDashboard from './pages/dashboard/HostDashboard'
import VolunteerDashboard from './pages/dashboard/VolunteerDashboard'
import AgencyDashboard from './pages/dashboard/AgencyDashboard'
import Profile from './pages/Profile'

// Smart redirect: send logged-in users to their dashboard
function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  const map = { admin: '/dashboard/admin', host: '/dashboard/host', volunteer: '/dashboard/volunteer', agency: '/dashboard/agency' }
  return <Navigate to={map[user.role] || '/dashboard/volunteer'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected — Admin */}
      <Route path="/dashboard/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Protected — Host */}
      <Route path="/dashboard/host/*" element={
        <ProtectedRoute allowedRoles={['host']}>
          <HostDashboard />
        </ProtectedRoute>
      } />

      {/* Protected — Volunteer */}
      <Route path="/dashboard/volunteer/*" element={
        <ProtectedRoute allowedRoles={['volunteer']}>
          <VolunteerDashboard />
        </ProtectedRoute>
      } />

      {/* Protected — Agency */}
      <Route path="/dashboard/agency/*" element={
        <ProtectedRoute allowedRoles={['agency']}>
          <AgencyDashboard />
        </ProtectedRoute>
      } />

      {/* Profile — any logged-in user */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px' },
            success: { iconTheme: { primary: '#2a7d4f', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
