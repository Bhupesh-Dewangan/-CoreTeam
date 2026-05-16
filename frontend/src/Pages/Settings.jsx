import { useState, useEffect } from 'react'
import Loading from '../Components/Loading'
import { Lock, Settings2 } from 'lucide-react';
import ProfileForm from '../Components/ProfileForm'
import ChangePasswordModal from '../Components/ChangePasswordModal';
import AppearanceSettings from '../Components/AppearanceSettings';
import PageHero from '../Components/layout/PageHero';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

function Settings() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/profile")
      const profile = res.data;
      if (profile) setProfile(profile)
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="animate-fade-in">
      <PageHero
        icon={Settings2}
        title="Settings"
        subtitle="Manage your profile, security, and how CoreTeam looks on your device."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <AppearanceSettings />

          <div className="card p-6 flex items-center justify-between gap-4">
            <div className='flex items-center gap-3 min-w-0'>
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-100">Password</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Update your account password</p>
              </div>
            </div>
            <button onClick={() => setShowPasswordModal(true)} className="btn-secondary text-sm shrink-0">
              Change
            </button>
          </div>

          <div className="info-panel hidden xl:block">
            <h3 className="info-panel-title">Account security</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Use a strong, unique password and update it periodically. Your theme preference is saved locally on this device.
            </p>
          </div>
        </div>

        <div>
          {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile} />}
        </div>
      </div>

      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  )
}

export default Settings;
