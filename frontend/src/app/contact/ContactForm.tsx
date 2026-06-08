'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  apiUrl: string;
}

export function ContactForm({ apiUrl }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: 'Story tip or news submission',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: 'Story tip or news submission', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit message');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="name">
            Your Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Alex Johnson"
            className="input"
            required
            disabled={status === 'submitting'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="email">
            Email Address <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="input"
            required
            disabled={status === 'submitting'}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="subject">Subject</label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="input"
          disabled={status === 'submitting'}
        >
          <option>Story tip or news submission</option>
          <option>Advertising / Partnership</option>
          <option>Press inquiry</option>
          <option>Technical issue</option>
          <option>Content correction request</option>
          <option>DMCA / Copyright takedown</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="message">
          Message <span className="text-danger">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          placeholder="Tell us more about your inquiry…"
          className="input resize-none w-full"
          required
          disabled={status === 'submitting'}
          minLength={20}
        />
        <p className="text-xs text-text-muted mt-1">Minimum 20 characters. Be as specific as possible — it helps us respond faster.</p>
      </div>

      {status === 'success' && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>
            <strong>Message sent successfully!</strong> We typically respond within 1–2 business days.
            If your inquiry is urgent, you can also reach us at{' '}
            <a href="mailto:insiai.today@gmail.com" className="underline">insiai.today@gmail.com</a>.
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-700 px-4 py-3 rounded-lg text-sm">
          <strong>Something went wrong.</strong> {errorMessage || 'Please try again or email us directly at insiai.today@gmail.com'}
        </div>
      )}

      <button
        type="submit"
        className="btn-primary w-full justify-center py-3"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending…
          </span>
        ) : 'Send Message'}
      </button>
    </form>
  );
}
