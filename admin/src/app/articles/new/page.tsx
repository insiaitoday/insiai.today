'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import { CATEGORIES } from '@/types';
import toast from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    snippet: '',
    category: 'General',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    meta_title: '',
    meta_description: '',
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing your article…' }),
    ],
    editorProps: {
      attributes: { class: 'min-h-[400px] focus:outline-none' },
    },
  });

  useEffect(() => { requireSession().then((s) => { if (!s) router.push('/login'); }); }, [router]);

  const uploadThumbnail = async (file: File) => {
    try {
      const { url } = await adminApi.upload(file);
      setThumbnail(url);
      toast.success('Thumbnail uploaded!');
    } catch { toast.error('Upload failed'); }
  };

  const uploadEditorImage = async (file: File) => {
    try {
      const { url } = await adminApi.upload(file);
      editor?.chain().focus().setImage({ src: url }).run();
      toast.success('Image inserted!');
    } catch { toast.error('Upload failed'); }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!form.title) { toast.error('Title is required'); return; }
    setLoading(true);

    try {
      const content = editor?.getHTML() || '';
      const tags    = form.tags.split(',').map((t) => t.trim()).filter(Boolean);

      await adminApi.posts.create({
        type: 'article',
        title: form.title,
        snippet: form.snippet,
        content,
        thumbnail,
        category: form.category,
        tags,
        status,
        meta_title: form.meta_title || form.title,
        meta_description: form.meta_description || form.snippet,
      });

      toast.success(status === 'published' ? '🎉 Article published!' : '📝 Saved as draft');
      router.push('/published');
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const toolbarBtns = [
    { label: 'B',   title: 'Bold',   action: () => editor?.chain().focus().toggleBold().run(),       active: editor?.isActive('bold') },
    { label: 'I',   title: 'Italic', action: () => editor?.chain().focus().toggleItalic().run(),     active: editor?.isActive('italic') },
    { label: 'H2',  title: 'H2',     action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }) },
    { label: 'H3',  title: 'H3',     action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive('heading', { level: 3 }) },
    { label: '• List', title: 'Bullet list', action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList') },
    { label: '1. List', title: 'Ordered list', action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList') },
    { label: '❝',  title: 'Blockquote', action: () => editor?.chain().focus().toggleBlockquote().run(), active: editor?.isActive('blockquote') },
    { label: '</>',  title: 'Code block', action: () => editor?.chain().focus().toggleCodeBlock().run(), active: editor?.isActive('codeBlock') },
  ];

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar
          title="New Article"
          subtitle="Create and publish original content"
          actions={
            <div className="flex gap-2">
              <button onClick={() => handleSubmit('draft')} disabled={loading} className="admin-btn-ghost text-xs">
                💾 Save Draft
              </button>
              <button onClick={() => handleSubmit('published')} disabled={loading} className="admin-btn-primary text-xs">
                {loading ? 'Publishing…' : '🚀 Publish Now'}
              </button>
            </div>
          }
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div className="admin-card">
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Article Title *"
                className="admin-input text-xl font-bold bg-transparent border-none px-0 py-0 text-white placeholder:text-text-muted"
              />
            </div>

            {/* Snippet */}
            <div className="admin-card">
              <label className="block text-xs font-medium text-text-secondary mb-2">Intro / Snippet (shown in feed)</label>
              <textarea
                value={form.snippet}
                onChange={(e) => set('snippet', e.target.value)}
                placeholder="A compelling 1-2 sentence intro…"
                rows={3}
                className="admin-input resize-none w-full bg-transparent border-none px-0"
              />
            </div>

            {/* TipTap editor */}
            <div className="admin-card p-0">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 p-3 border-b border-border">
                {toolbarBtns.map((btn) => (
                  <button
                    key={btn.title}
                    type="button"
                    onClick={btn.action}
                    title={btn.title}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${btn.active ? 'bg-primary text-white' : 'text-text-secondary hover:text-white hover:bg-background-elevated'}`}
                  >
                    {btn.label}
                  </button>
                ))}
                <input 
                  ref={editorFileInputRef} 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => { 
                    const f = e.target.files?.[0]; 
                    if(f) uploadEditorImage(f); 
                    e.target.value = ''; 
                  }} 
                />
                <button
                  type="button"
                  onClick={() => editorFileInputRef.current?.click()}
                  className="px-2 py-1 rounded text-xs font-medium text-text-secondary hover:text-white hover:bg-background-elevated"
                >
                  🖼 Image Upload
                </button>
              </div>
              <div className="p-4">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* Sidebar settings */}
          <div className="space-y-4">
            {/* Publish */}
            <div className="admin-card">
              <h3 className="font-semibold text-sm mb-3">📤 Publish</h3>
              <div className="space-y-2">
                <button onClick={() => handleSubmit('published')} disabled={loading} className="admin-btn-primary w-full justify-center text-sm">
                  🚀 Publish Now
                </button>
                <button onClick={() => handleSubmit('draft')} disabled={loading} className="admin-btn-ghost w-full justify-center text-sm">
                  💾 Save as Draft
                </button>
              </div>
            </div>

            {/* Category & Tags */}
            <div className="admin-card space-y-3">
              <h3 className="font-semibold text-sm">📁 Categorize</h3>
              <div>
                <label className="block text-xs font-medium mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className="admin-input text-sm">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Tags (comma-separated)</label>
                <input type="text" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="AI, GPT, research" className="admin-input text-sm" />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="admin-card space-y-3">
              <h3 className="font-semibold text-sm">🖼 Featured Image</h3>
              {thumbnail ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnail} alt="Thumbnail" className="w-full h-32 object-cover rounded-lg" />
                  <button onClick={() => setThumbnail('')} className="absolute top-2 right-2 bg-background/80 text-xs px-2 py-1 rounded">✕ Remove</button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors text-sm gap-1"
                >
                  <span className="text-xl">📤</span>
                  <span className="text-xs">Click to upload</span>
                </button>
              )}
              <input type="url" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="Or paste image URL…" className="admin-input text-xs" />
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f) uploadThumbnail(f); }} />
            </div>

            {/* SEO */}
            <div className="admin-card space-y-3">
              <h3 className="font-semibold text-sm">🔍 SEO</h3>
              <div>
                <label className="block text-xs font-medium mb-1.5">Meta Title</label>
                <input type="text" value={form.meta_title} onChange={(e) => set('meta_title', e.target.value)} placeholder={form.title || 'Leave blank to use title'} className="admin-input text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Meta Description</label>
                <textarea value={form.meta_description} onChange={(e) => set('meta_description', e.target.value)} placeholder={form.snippet || 'Leave blank to use snippet'} rows={3} className="admin-input text-xs resize-none w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
