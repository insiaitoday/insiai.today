'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import { CATEGORIES } from '@/types';
import type { Post } from '@/types';
import toast from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

function wordCount(html: string) {
  const text = html.replace(/<[^>]+>/g, ' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading]           = useState<'draft' | 'publish' | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [post, setPost]                 = useState<Post | null>(null);
  const [thumbnail, setThumbnail]       = useState('');
  const [linkUrl, setLinkUrl]           = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [wordCountVal, setWordCountVal] = useState(0);
  const [lastSaved, setLastSaved]       = useState<string | null>(null);

  const fileInputRef        = useRef<HTMLInputElement>(null);
  const editorFileInputRef  = useRef<HTMLInputElement>(null);
  const linkInputRef        = useRef<HTMLInputElement>(null);
  const autoSaveTimer       = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState({
    title:            '',
    snippet:          '',
    category:         'General',
    tags:             '',
    meta_title:       '',
    meta_description: '',
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Placeholder.configure({ placeholder: 'Start writing your article here…' }),
    ],
    editorProps: {
      attributes: { class: 'min-h-[420px] focus:outline-none' },
    },
    onUpdate: ({ editor }) => {
      setWordCountVal(wordCount(editor.getHTML()));
      scheduleAutoSave(editor.getHTML());
    },
  });

  // ── Auto-save indicator (does NOT hit server automatically) ─────
  const scheduleAutoSave = useCallback((content: string) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      // Store unsaved progress in localStorage keyed by post id
      const key = `leviai_edit_draft_${id}`;
      localStorage.setItem(key, JSON.stringify({ form, thumbnail, content, savedAt: new Date().toISOString() }));
      setLastSaved(new Date().toLocaleTimeString());
    }, 1500);
  }, [form, thumbnail, id]);

  useEffect(() => {
    const content = editor?.getHTML() || '';
    scheduleAutoSave(content);
  }, [form, thumbnail]); // eslint-disable-line

  // ── Load post ───────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    requireSession().then(async (s) => {
      if (!s) { router.push('/login'); return; }
      try {
        const data = await adminApi.posts.getById(id);
        setPost(data);
        setThumbnail(data.thumbnail || '');
        setForm({
          title:            data.title,
          snippet:          data.snippet || '',
          category:         data.category,
          tags:             (data.tags || []).join(', '),
          meta_title:       data.meta_title || '',
          meta_description: data.meta_description || '',
        });
        if (editor && data.content) {
          editor.commands.setContent(data.content);
          setWordCountVal(wordCount(data.content));
        }
      } catch (e) {
        toast.error('Failed to load article');
        router.push('/published');
      } finally {
        setFetchLoading(false);
      }
    });
  }, [id, router]); // eslint-disable-line

  // Set content once editor is ready (race condition guard)
  useEffect(() => {
    if (editor && post?.content && editor.isEmpty) {
      editor.commands.setContent(post.content);
      setWordCountVal(wordCount(post.content));
    }
  }, [editor, post]);

  // ── Upload helpers ───────────────────────────────────────────────
  const uploadThumbnail = async (file: File) => {
    const toastId = toast.loading('Uploading thumbnail…');
    try {
      const { url } = await adminApi.upload(file);
      setThumbnail(url);
      toast.success('Thumbnail uploaded!', { id: toastId });
    } catch (e: unknown) {
      toast.error((e as Error)?.message || 'Upload failed', { id: toastId });
    }
  };

  const uploadEditorImage = async (file: File) => {
    const toastId = toast.loading('Uploading image…');
    try {
      const { url } = await adminApi.upload(file);
      editor?.chain().focus().setImage({ src: url }).run();
      toast.success('Image inserted!', { id: toastId });
    } catch (e: unknown) {
      toast.error((e as Error)?.message || 'Upload failed', { id: toastId });
    }
  };

  // ── Submit (update) ─────────────────────────────────────────────
  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!id) return;
    setLoading(status === 'draft' ? 'draft' : 'publish');

    try {
      const content = editor?.getHTML() || '';
      const tags    = form.tags.split(',').map((t) => t.trim()).filter(Boolean);

      await adminApi.posts.update(id, {
        title:            form.title.trim(),
        snippet:          form.snippet.trim(),
        content,
        thumbnail,
        category:         form.category,
        tags,
        status,
        meta_title:       form.meta_title || form.title,
        meta_description: form.meta_description || form.snippet,
      });

      // Clear local auto-save after a real save
      localStorage.removeItem(`leviai_edit_draft_${id}`);

      if (status === 'published') {
        toast.success('🎉 Article updated and published!');
        router.push('/published');
      } else {
        toast.success('📝 Saved as draft');
        router.push('/drafts');
      }
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Failed to save');
    } finally {
      setLoading(null);
    }
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.trim() }).run();
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const readTime = Math.max(1, Math.round(wordCountVal / 200));

  const toolbarBtns = [
    { label: 'B',      title: 'Bold',          style: 'font-bold',    action: () => editor?.chain().focus().toggleBold().run(),                       active: () => !!editor?.isActive('bold') },
    { label: 'I',      title: 'Italic',        style: 'italic',       action: () => editor?.chain().focus().toggleItalic().run(),                     active: () => !!editor?.isActive('italic') },
    { label: 'U',      title: 'Underline',     style: 'underline',    action: () => editor?.chain().focus().toggleUnderline().run(),                  active: () => !!editor?.isActive('underline') },
    { label: 'S',      title: 'Strikethrough', style: 'line-through', action: () => editor?.chain().focus().toggleStrike().run(),                     active: () => !!editor?.isActive('strike') },
    { label: 'H2',     title: 'Heading 2',     style: '',             action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),        active: () => !!editor?.isActive('heading', { level: 2 }) },
    { label: 'H3',     title: 'Heading 3',     style: '',             action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),        active: () => !!editor?.isActive('heading', { level: 3 }) },
    { label: '• List', title: 'Bullet list',   style: '',             action: () => editor?.chain().focus().toggleBulletList().run(),                 active: () => !!editor?.isActive('bulletList') },
    { label: '1. List',title: 'Ordered list',  style: '',             action: () => editor?.chain().focus().toggleOrderedList().run(),                active: () => !!editor?.isActive('orderedList') },
    { label: '❝',      title: 'Blockquote',    style: '',             action: () => editor?.chain().focus().toggleBlockquote().run(),                 active: () => !!editor?.isActive('blockquote') },
    { label: '</>',    title: 'Code block',    style: '',             action: () => editor?.chain().focus().toggleCodeBlock().run(),                  active: () => !!editor?.isActive('codeBlock') },
    { label: '—',      title: 'Divider',       style: '',             action: () => editor?.chain().focus().setHorizontalRule().run(),                active: () => false },
  ];

  if (fetchLoading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 lg:ml-56 p-6 flex items-center justify-center">
          <div className="text-text-secondary text-sm animate-pulse">Loading article…</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar
          title={`Edit: ${post?.title?.slice(0, 50) || 'Article'}…`}
          subtitle={`Status: ${post?.status} · ID: ${id}`}
          actions={
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => router.back()} className="admin-btn-ghost text-xs">
                ← Back
              </button>
              <button
                id="edit-btn-save-draft"
                onClick={() => handleSubmit('draft')}
                disabled={loading !== null}
                className="admin-btn-ghost text-xs"
              >
                {loading === 'draft' ? '⏳ Saving…' : '💾 Save Draft'}
              </button>
              <button
                id="edit-btn-publish"
                onClick={() => handleSubmit('published')}
                disabled={loading !== null}
                className="admin-btn-primary text-xs"
              >
                {loading === 'publish' ? '⏳ Publishing…' : '🚀 Publish'}
              </button>
            </div>
          }
        />

        {lastSaved && (
          <div className="mb-3 text-xs text-text-muted bg-background-elevated border border-border rounded px-3 py-2">
            ✅ Local changes auto-saved at {lastSaved} — click "Save Draft" or "Publish" to persist.
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Editor Column ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Title */}
            <div className="admin-card">
              <input
                id="edit-article-title"
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Article Title *"
                className="admin-input text-xl font-bold bg-transparent border-none px-0 py-0 text-white placeholder:text-text-muted w-full"
              />
            </div>

            {/* Snippet */}
            <div className="admin-card">
              <label className="block text-xs font-medium text-text-secondary mb-2">
                Intro / Snippet <span className="text-text-muted">(shown on the feed card)</span>
              </label>
              <textarea
                id="edit-article-snippet"
                value={form.snippet}
                onChange={(e) => set('snippet', e.target.value)}
                placeholder="A compelling 1–2 sentence intro…"
                rows={3}
                className="admin-input resize-none w-full bg-transparent border-none px-0"
              />
            </div>

            {/* TipTap Editor */}
            <div className="admin-card p-0 overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-3 border-b border-border bg-background-elevated/50">
                {toolbarBtns.map((btn) => (
                  <button
                    key={btn.title}
                    type="button"
                    onClick={btn.action}
                    title={btn.title}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${btn.style} ${
                      btn.active()
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:text-white hover:bg-background-elevated'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
                <div className="w-px h-5 bg-border mx-1" />

                {/* Link */}
                <button
                  type="button"
                  id="edit-btn-insert-link"
                  onClick={() => { setShowLinkInput((v) => !v); setTimeout(() => linkInputRef.current?.focus(), 50); }}
                  title="Insert link"
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    editor?.isActive('link') ? 'bg-primary text-white' : 'text-text-secondary hover:text-white hover:bg-background-elevated'
                  }`}
                >
                  🔗 Link
                </button>

                {editor?.isActive('link') && (
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().unsetLink().run()}
                    className="px-2 py-1 rounded text-xs font-medium text-red-400 hover:bg-red-500/10"
                  >
                    ✕ Link
                  </button>
                )}

                {/* Image upload */}
                <button
                  type="button"
                  id="edit-btn-insert-image"
                  onClick={() => editorFileInputRef.current?.click()}
                  className="px-2 py-1 rounded text-xs font-medium text-text-secondary hover:text-white hover:bg-background-elevated"
                >
                  🖼 Image
                </button>
                <input
                  ref={editorFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadEditorImage(f); e.target.value = ''; }}
                />
              </div>

              {/* Link input row */}
              {showLinkInput && (
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-background-elevated/30">
                  <input
                    ref={linkInputRef}
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') insertLink(); if (e.key === 'Escape') setShowLinkInput(false); }}
                    placeholder="https://example.com"
                    className="admin-input text-xs flex-1"
                  />
                  <button onClick={insertLink} className="admin-btn-primary text-xs px-3 py-1.5">Insert</button>
                  <button onClick={() => setShowLinkInput(false)} className="admin-btn-ghost text-xs px-3 py-1.5">Cancel</button>
                </div>
              )}

              {/* Editor area */}
              <div className="p-5 min-h-[420px]">
                <EditorContent editor={editor} />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-2.5 border-t border-border text-xs text-text-muted bg-background-elevated/20">
                <span>{wordCountVal.toLocaleString()} words · ~{readTime} min read</span>
                <span>{lastSaved ? `Auto-saved locally ${lastSaved}` : ''}</span>
              </div>
            </div>
          </div>

          {/* ── Settings Sidebar ─────────────────────────────── */}
          <div className="space-y-4">

            {/* Publish actions */}
            <div className="admin-card">
              <h3 className="font-semibold text-sm mb-3">📤 Update</h3>
              <div className="space-y-2">
                <button
                  id="edit-sidebar-btn-publish"
                  onClick={() => handleSubmit('published')}
                  disabled={loading !== null}
                  className="admin-btn-primary w-full justify-center text-sm"
                >
                  {loading === 'publish' ? '⏳ Publishing…' : '🚀 Publish'}
                </button>
                <button
                  id="edit-sidebar-btn-draft"
                  onClick={() => handleSubmit('draft')}
                  disabled={loading !== null}
                  className="admin-btn-ghost w-full justify-center text-sm"
                >
                  {loading === 'draft' ? '⏳ Saving…' : '💾 Save as Draft'}
                </button>
                <button
                  onClick={() => router.back()}
                  className="w-full text-center text-xs text-text-muted hover:text-text-secondary mt-1 py-1"
                >
                  ← Cancel & go back
                </button>
              </div>
              <div className="mt-3 p-2.5 rounded-lg bg-background-elevated border border-border">
                <p className="text-xs text-text-muted">Current status: <span className="font-semibold text-text-secondary capitalize">{post?.status}</span></p>
                <p className="text-xs text-text-muted mt-0.5">Views: <span className="font-semibold text-text-secondary">{post?.view_count ?? 0}</span></p>
              </div>
            </div>

            {/* Category & Tags */}
            <div className="admin-card space-y-3">
              <h3 className="font-semibold text-sm">📁 Categorize</h3>
              <div>
                <label className="block text-xs font-medium mb-1.5">Category</label>
                <select
                  id="edit-article-category"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="admin-input text-sm"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Tags <span className="text-text-muted">(comma-separated)</span></label>
                <input
                  id="edit-article-tags"
                  type="text"
                  value={form.tags}
                  onChange={(e) => set('tags', e.target.value)}
                  placeholder="AI, GPT, research"
                  className="admin-input text-sm"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="admin-card space-y-3">
              <h3 className="font-semibold text-sm">🖼 Featured Image</h3>
              {thumbnail ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnail} alt="Thumbnail" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    onClick={() => setThumbnail('')}
                    className="absolute top-2 right-2 bg-background/80 text-xs px-2 py-1 rounded hover:bg-background"
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <button
                  id="edit-btn-upload-thumbnail"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors text-sm gap-1"
                >
                  <span className="text-2xl">📤</span>
                  <span className="text-xs">Click to upload image</span>
                </button>
              )}
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="Or paste image URL…"
                className="admin-input text-xs"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadThumbnail(f); e.target.value = ''; }}
              />
            </div>

            {/* SEO */}
            <div className="admin-card space-y-3">
              <h3 className="font-semibold text-sm">🔍 SEO</h3>
              <div>
                <label className="block text-xs font-medium mb-1.5">Meta Title</label>
                <input
                  id="edit-article-meta-title"
                  type="text"
                  value={form.meta_title}
                  onChange={(e) => set('meta_title', e.target.value)}
                  placeholder={form.title || 'Leave blank to use article title'}
                  className="admin-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Meta Description</label>
                <textarea
                  id="edit-article-meta-desc"
                  value={form.meta_description}
                  onChange={(e) => set('meta_description', e.target.value)}
                  placeholder={form.snippet || 'Leave blank to use snippet'}
                  rows={3}
                  className="admin-input text-xs resize-none w-full"
                />
                <p className="text-xs text-text-muted mt-1">{form.meta_description.length}/160 chars</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
