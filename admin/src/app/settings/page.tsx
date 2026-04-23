'use client';

import { useEffect, useState } from 'react';
import { requireSession } from '@/lib/auth';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [ready,   setReady]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm]       = useState({
    siteName: 'LeviAI Today',
    tagline: 'Your daily source for AI news and insights',
    adminEmail: 'admin@leviai.today',
    twitterUrl: '',
    linkedinUrl: '',
    adsensePublisherId: '',
    adsenseEnabled: false,
  });

  useEffect(() => { requireSession().then((s) => { if (s) setReady(true); }); }, []);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate save
    setSaving(false);
    toast.success('Settings saved!');
  };

  if (!ready) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar
          title="Settings"
          subtitle="Platform configuration"
          actions={<button onClick={handleSave} disabled={saving} className="admin-btn-primary text-xs">{saving ? 'Saving…' : '💾 Save Settings'}</button>}
        />

        <div className="max-w-2xl space-y-6">
          {/* Site info */}
          <div className="admin-card space-y-4">
            <h2 className="font-semibold text-sm border-b border-border pb-2">🌐 Site Information</h2>
            <div>
              <label className="block text-xs font-medium mb-1.5">Site Name</label>
              <input type="text" value={form.siteName} onChange={(e) => set('siteName', e.target.value)} className="admin-input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Tagline</label>
              <input type="text" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} className="admin-input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Admin Email</label>
              <input type="email" value={form.adminEmail} onChange={(e) => set('adminEmail', e.target.value)} className="admin-input text-sm" />
            </div>
          </div>

          {/* Social */}
          <div className="admin-card space-y-4">
            <h2 className="font-semibold text-sm border-b border-border pb-2">📱 Social Media Links</h2>
            <div>
              <label className="block text-xs font-medium mb-1.5">Twitter / X URL</label>
              <input type="url" value={form.twitterUrl} onChange={(e) => set('twitterUrl', e.target.value)} placeholder="https://twitter.com/leviai_today" className="admin-input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">LinkedIn URL</label>
              <input type="url" value={form.linkedinUrl} onChange={(e) => set('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/company/leviai" className="admin-input text-sm" />
            </div>
          </div>

          {/* AdSense */}
          <div className="admin-card space-y-4">
            <h2 className="font-semibold text-sm border-b border-border pb-2">💰 Google AdSense</h2>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="adsenseEnabled" checked={form.adsenseEnabled} onChange={(e) => set('adsenseEnabled', e.target.checked)} className="accent-primary" />
              <label htmlFor="adsenseEnabled" className="text-sm">Enable AdSense ads</label>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Publisher ID</label>
              <input type="text" value={form.adsensePublisherId} onChange={(e) => set('adsensePublisherId', e.target.value)} placeholder="ca-pub-XXXXXXXXXXXXXXXX" className="admin-input text-sm" />
              <p className="text-xs text-text-muted mt-1">Get your Publisher ID from your Google AdSense account after approval.</p>
            </div>
          </div>

          {/* Env reminder */}
          <div className="admin-card bg-warning/5 border-warning/20">
            <h2 className="font-semibold text-sm text-warning mb-3">⚠️ Environment Variables</h2>
            <p className="text-xs text-text-secondary mb-3">The following must be set in your <code className="bg-background-elevated px-1 rounded">.env</code> files:</p>
            <div className="space-y-1 font-mono text-xs text-text-secondary">
              <p>SUPABASE_URL=<span className="text-warning">your_supabase_url</span></p>
              <p>SUPABASE_SERVICE_ROLE_KEY=<span className="text-warning">your_service_key</span></p>
              <p>RESEND_API_KEY=<span className="text-warning">your_resend_key</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
