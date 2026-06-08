'use client';

import { useEffect, useState } from 'react';
import { requireSession } from '@/lib/auth';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import toast from 'react-hot-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');

  useEffect(() => {
    requireSession();
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        toast.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setMessages(prev =>
          prev.map(msg => (msg.id === id ? { ...msg, status } : msg))
        );
        toast.success('Status updated');
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== id));
        toast.success('Message deleted');
      } else {
        toast.error('Failed to delete message');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'read':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
      case 'replied':
        return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'archived':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/30';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
    }
  };

  const statusCounts = {
    all: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    archived: messages.filter(m => m.status === 'archived').length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 lg:ml-56 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar
          title="Contact Messages"
          subtitle="Manage user inquiries and feedback"
          actions={
            <div className="text-sm text-text-secondary">
              {statusCounts.unread > 0 && (
                <span className="bg-danger text-white px-2 py-1 rounded-full text-xs font-bold">
                  {statusCounts.unread} new
                </span>
              )}
            </div>
          }
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'unread', 'read', 'replied', 'archived'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-background-elevated hover:bg-background-tertiary text-text-secondary'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="admin-card p-8 text-center">
            <p className="text-text-secondary">No {filter !== 'all' ? filter : ''} messages found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map(msg => (
              <div key={msg.id} className="admin-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{msg.name}</h3>
                      <span className={`badge text-xs px-2 py-1 border ${getStatusColor(msg.status)}`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-1">
                      <a href={`mailto:${msg.email}`} className="hover:text-primary transition-colors">
                        {msg.email}
                      </a>
                    </p>
                    <p className="text-sm text-text-muted">
                      {new Date(msg.created_at).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-text-secondary mb-2">Subject: {msg.subject}</p>
                  <p className="text-text-primary whitespace-pre-wrap">{msg.message}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  <select
                    value={msg.status}
                    onChange={(e) => updateStatus(msg.id, e.target.value as ContactMessage['status'])}
                    className="input text-sm py-1.5 px-3"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>

                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="admin-btn-secondary text-sm py-1.5 px-4"
                  >
                    📧 Reply via Email
                  </a>

                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="admin-btn-secondary text-sm py-1.5 px-4 text-red-600 hover:bg-red-500/10"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
