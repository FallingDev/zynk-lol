'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { Shield, Users, Link2, FileCode, Crown, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  role: string
  isPremium: boolean
  createdAt: string
  _count: {
    links: number
    views: number
  }
}

interface Template {
  id: string
  name: string
  description: string
  status: string
  creator: {
    username: string
  }
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'users' | 'templates' | 'stats'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLinks: 0,
    totalViews: 0,
    pendingTemplates: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    
    if (session?.user?.role !== 'admin' && session?.user?.role !== 'mod') {
      router.push('/dashboard/overview')
      return
    }

    fetchData()
  }, [session, status])

  const fetchData = async () => {
    try {
      const [usersRes, templatesRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/templates'),
        fetch('/api/admin/stats'),
      ])

      if (usersRes.ok) setUsers(await usersRes.json())
      if (templatesRes.ok) setTemplates(await templatesRes.json())
      if (statsRes.ok) setStats(await statsRes.json())
    } catch (error) {
      toast.error('Failed to load admin data')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (res.ok) {
        toast.success('Role updated')
        fetchData()
      } else {
        toast.error('Failed to update role')
      }
    } catch (error) {
      toast.error('Error updating role')
    }
  }

  const approveTemplate = async (templateId: string) => {
    try {
      const res = await fetch(`/api/admin/templates/${templateId}/approve`, {
        method: 'PUT',
      })

      if (res.ok) {
        toast.success('Template approved')
        fetchData()
      }
    } catch (error) {
      toast.error('Failed to approve template')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('User deleted')
        fetchData()
      }
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[12px] bg-violet-500/10">
          <Shield className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-zinc-400 text-sm">Manage users, templates, and platform settings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="hover:border-violet-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[12px] bg-violet-500/10">
              <Users className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              <p className="text-sm text-zinc-400">Total Users</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="hover:border-blue-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[12px] bg-blue-500/10">
              <Link2 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalLinks}</p>
              <p className="text-sm text-zinc-400">Total Links</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[12px] bg-emerald-500/10">
              <Eye className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
              <p className="text-sm text-zinc-400">Total Views</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="hover:border-amber-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[12px] bg-amber-500/10">
              <FileCode className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.pendingTemplates}</p>
              <p className="text-sm text-zinc-400">Pending Templates</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/[0.08]">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-violet-400 border-b-2 border-violet-400'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'templates'
              ? 'text-violet-400 border-b-2 border-violet-400'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Templates
        </button>
        {(session?.user?.role === 'admin') && (
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'stats'
                ? 'text-violet-400 border-b-2 border-violet-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Platform Stats
          </button>
        )}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Stats</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/[0.06] hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                          {user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">@{user.username}</p>
                          <p className="text-zinc-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        disabled={session?.user?.role !== 'admin' && user.role === 'admin'}
                        className="bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-sm text-white"
                      >
                        <option value="user">User</option>
                        <option value="mod">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {user.isPremium && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Crown className="w-3 h-3 inline mr-1" />
                            Premium
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-zinc-400 text-sm">
                        {user._count.links} links • {user._count.views} views
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {session?.user?.role === 'admin' && user.id !== session.user.id && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {templates.map((template) => (
            <GlassCard key={template.id}>
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
                    <FileCode className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{template.name}</h3>
                    <p className="text-zinc-400 text-sm">{template.description}</p>
                    <p className="text-zinc-500 text-xs mt-1">by @{template.creator.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {template.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => approveTemplate(template.id)}
                        className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Approved
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && session?.user?.role === 'admin' && (
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Platform Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/[0.03] rounded-xl">
              <p className="text-zinc-400 text-sm">New Users (7 days)</p>
              <p className="text-2xl font-bold text-white mt-1">--</p>
            </div>
            <div className="p-4 bg-white/[0.03] rounded-xl">
              <p className="text-zinc-400 text-sm">Active Profiles</p>
              <p className="text-2xl font-bold text-white mt-1">--</p>
            </div>
            <div className="p-4 bg-white/[0.03] rounded-xl">
              <p className="text-zinc-400 text-sm">Premium Users</p>
              <p className="text-2xl font-bold text-white mt-1">--</p>
            </div>
            <div className="p-4 bg-white/[0.03] rounded-xl">
              <p className="text-zinc-400 text-sm">Staff Members</p>
              <p className="text-2xl font-bold text-white mt-1">
                {users.filter(u => u.role !== 'user').length}
              </p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
