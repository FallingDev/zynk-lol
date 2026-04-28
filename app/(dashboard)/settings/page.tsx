'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { User, Mail, Shield, Trash2, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This action cannot be undone.')) return

    setIsDeleting(true)
    try {
      const response = await fetch('/api/account', {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Account deleted')
        signOut({ callbackUrl: '/' })
      } else {
        toast.error('Failed to delete account')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account settings</p>
      </div>

      <div className="max-w-2xl space-y-4">
        <GlassCard>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-violet-400" />
            Account Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
              <span className="text-zinc-400">Username</span>
              <span className="text-white">{session?.user?.username}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
              <span className="text-zinc-400">Email</span>
              <span className="text-white">{session?.user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-zinc-400">User ID</span>
              <span className="text-white font-mono text-sm">
                {session?.user?.id?.slice(0, 16)}...
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Security
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <p className="font-medium text-white">Change Password</p>
              <p className="text-sm text-zinc-400">Update your account password</p>
            </button>
            <button className="w-full text-left p-3 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <p className="font-medium text-white">Two-Factor Authentication</p>
              <p className="text-sm text-zinc-400">Add an extra layer of security</p>
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-400" />
            Notifications
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-[12px] bg-white/[0.03] cursor-pointer hover:bg-white/[0.06] transition-colors">
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-zinc-400">Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 rounded border-white/[0.15] bg-white/[0.03] text-violet-500"
              />
            </label>
          </div>
        </GlassCard>

        <GlassCard className="border-red-500/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-400" />
            Danger Zone
          </h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
