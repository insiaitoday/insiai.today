'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface NewsletterFormProps {
  variant?: 'default' | 'footer' | 'sidebar' | 'inline';
}

export function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [email,     setEmail]     = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('weekly');
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.newsletter.subscribe(email, frequency);
      setDone(true);
      toast.success('You\'re subscribed!');
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20 animate-fade-in">
        <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-semibold text-sm text-success">You're subscribed!</p>
          <p className="text-xs text-text-secondary">Check your inbox for the next digest.</p>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="input text-sm"
          required
        />
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm py-2">
          {loading ? 'Subscribing…' : 'Subscribe Free'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="input flex-1 text-sm"
        required
      />
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
        className="input text-sm sm:w-28"
      >
        <option value="weekly">Weekly</option>
        <option value="daily">Daily</option>
      </select>
      <button type="submit" disabled={loading} className="btn-primary shrink-0">
        {loading ? 'Subscribing…' : 'Subscribe'}
      </button>
    </form>
  );
}
