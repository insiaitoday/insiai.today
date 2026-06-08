'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { smartImport } from '@/lib/smartImport';

const DRAFT_KEY = 'leviai_article_draft';

function wordCount(html: string) {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<'draft' | 'publish' | null>(null);
  const [thumbnail, setThumbnail] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [wordCountVal, setWordCountVal] = useState(0);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorFileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Smart Import State ───────────────────────────────────────────
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importText, setImportText] = useState('');
  const [importProcessing, setImportProcessing] = useState(false);
  const [importOverwrite, setImportOverwrite] = useState<'replace' | 'append'>('replace');

  const [form, setForm] = useState({
    title: '',
    snippet: '',
    category: 'General',
    tags: '',
    meta_title: '',
    meta_description: '',
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Placeholder.configure({ placeholder: 'Start writing your article here…' }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    editorProps: {
      attributes: { class: 'min-h-[420px] focus:outline-none prose-editor' },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setWordCountVal(wordCount(html));
      scheduleAutoSave(html);
    },
  });

  // ── Smart Import Handler ─────────────────────────────────────────
  const handleSmartImport = useCallback(() => {
    if (!importText.trim()) {
      toast.error('Please paste some content first');
      return;
    }
    setImportProcessing(true);

    try {
      const result = smartImport(importText);

      // Insert content into editor
      if (editor) {
        if (importOverwrite === 'replace') {
          editor.commands.setContent(result.html);
        } else {
          // Append: move to end then insert
          const existing = editor.getHTML();
          editor.commands.setContent(existing + result.html);
        }
        setWordCountVal(wordCount(result.html));
      }

      // Auto-fill fields only if empty (don't overwrite existing values)
      setForm((f) => {
        let categoryToSet = f.category;
        if (result.category) {
          const cleanCat = result.category.toLowerCase();
          const matched = CATEGORIES.find(c => {
            const lowerC = c.toLowerCase();
            return cleanCat === lowerC || cleanCat.includes(lowerC) || lowerC.includes(cleanCat);
          });
          if (matched) {
            categoryToSet = matched;
          } else if (cleanCat.includes('news')) {
            categoryToSet = 'Breaking News';
          } else if (cleanCat.includes('tech') || cleanCat.includes('launch') || cleanCat.includes('technology')) {
            categoryToSet = 'Product Launches';
          } else if (cleanCat.includes('research') || cleanCat.includes('paper')) {
            categoryToSet = 'Research Papers';
          }
        }

        return {
          ...f,
          title: f.title.trim() ? f.title : result.title,
          snippet: f.snippet.trim() ? f.snippet : result.snippet,
          tags: f.tags.trim() ? f.tags : result.tags,
          category: categoryToSet,
        };
      });

      setImportText('');
      setShowImportPanel(false);
      toast.success('✅ Content imported and formatted!');
    } catch {
      toast.error('Failed to parse content. Please try again.');
    } finally {
      setImportProcessing(false);
    }
  }, [importText, importOverwrite, editor]);

  // ── Auto-save to localStorage ────────────────────────────────────
  const scheduleAutoSave = useCallback((content: string) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      const draft = { form, thumbnail, content, savedAt: new Date().toISOString() };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setLastSaved(new Date().toLocaleTimeString());
    }, 1500);
  }, [form, thumbnail]);

  // Save form changes to draft too
  useEffect(() => {
    const content = editor?.getHTML() || '';
    scheduleAutoSave(content);
  }, [form, thumbnail]); // eslint-disable-line

  // ── Restore draft on load ────────────────────────────────────────
  useEffect(() => {
    requireSession().then((s) => { if (!s) router.push('/login'); });

    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      if (saved.form) setForm(saved.form);
      if (saved.thumbnail) setThumbnail(saved.thumbnail);
      if (saved.content && editor) {
        editor.commands.setContent(saved.content);
        setWordCountVal(wordCount(saved.content));
      }
      if (saved.savedAt) {
        setLastSaved(new Date(saved.savedAt).toLocaleTimeString());
        setDraftRestored(true);
      }
    } catch { /* ignore corrupted draft */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Re-apply content once editor is ready
  useEffect(() => {
    if (!editor || draftRestored) return;
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      if (saved.content) {
        editor.commands.setContent(saved.content);
        setWordCountVal(wordCount(saved.content));
        setDraftRestored(true);
      }
    } catch { /* ignore */ }
  }, [editor, draftRestored]);

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

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setLoading(status === 'draft' ? 'draft' : 'publish');

    try {
      const content = editor?.getHTML() || '';
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);

      await adminApi.posts.create({
        type: 'article',
        title: form.title.trim(),
        snippet: form.snippet.trim(),
        content,
        thumbnail,
        category: form.category,
        tags,
        status,
        meta_title: form.meta_title || form.title,
        meta_description: form.meta_description || form.snippet,
      });

      // Clear the local draft after a successful save
      localStorage.removeItem(DRAFT_KEY);

      if (status === 'published') {
        toast.success('🎉 Article published!');
        router.push('/published');
      } else {
        toast.success('📝 Draft saved!');
        router.push('/drafts');
      }
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Failed to save');
    } finally {
      setLoading(null);
    }
  };

  const handleDiscard = () => {
    if (!window.confirm('Discard this article? Your local draft will also be deleted.')) return;
    localStorage.removeItem(DRAFT_KEY);
    router.push('/dashboard');
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
    { label: 'B',   title: 'Bold',        style: 'font-bold', action: () => editor?.chain().focus().toggleBold().run(),        active: () => !!editor?.isActive('bold') },
    { label: 'I',   title: 'Italic',      style: 'italic',    action: () => editor?.chain().focus().toggleItalic().run(),      active: () => !!editor?.isActive('italic') },
    { label: 'U',   title: 'Underline',   style: 'underline', action: () => editor?.chain().focus().toggleUnderline().run(),   active: () => !!editor?.isActive('underline') },
    { label: 'S',   title: 'Strikethrough', style: 'line-through', action: () => editor?.chain().focus().toggleStrike().run(), active: () => !!editor?.isActive('strike') },
    { label: 'H2',  title: 'Heading 2',   style: '',          action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: () => !!editor?.isActive('heading', { level: 2 }) },
    { label: 'H3',  title: 'Heading 3',   style: '',          action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: () => !!editor?.isActive('heading', { level: 3 }) },
    { label: '• List', title: 'Bullet list', style: '', action: () => editor?.chain().focus().toggleBulletList().run(), active: () => !!editor?.isActive('bulletList') },
    { label: '1. List', title: 'Ordered list', style: '', action: () => editor?.chain().focus().toggleOrderedList().run(), active: () => !!editor?.isActive('orderedList') },
    { label: '❝',   title: 'Blockquote',  style: '',          action: () => editor?.chain().focus().toggleBlockquote().run(),  active: () => !!editor?.isActive('blockquote') },
    { label: '</>',  title: 'Code block',  style: '',          action: () => editor?.chain().focus().toggleCodeBlock().run(),   active: () => !!editor?.isActive('codeBlock') },
    { label: '—',   title: 'Divider',     style: '',          action: () => editor?.chain().focus().setHorizontalRule().run(), active: () => false },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar
          title="New Article"
          subtitle="Create and publish original content"
          actions={
            <div className="flex gap-2 flex-wrap">
              <button
                id="btn-smart-import-toggle"
                onClick={() => setShowImportPanel((v) => !v)}
                className={`admin-btn-ghost text-xs ${
                  showImportPanel ? 'border-primary/60 text-primary bg-primary/10' : ''
                }`}
              >
                📋 Smart Import
              </button>
              <button
                id="btn-discard"
                onClick={handleDiscard}
                className="admin-btn-ghost text-xs text-red-400 border-red-500/30 hover:bg-red-500/10"
              >
                🗑 Discard
              </button>
              <button
                id="btn-save-draft"
                onClick={() => handleSubmit('draft')}
                disabled={loading !== null}
                className="admin-btn-ghost text-xs"
              >
                {loading === 'draft' ? '⏳ Saving…' : '💾 Save Draft'}
              </button>
              <button
                id="btn-publish"
                onClick={() => handleSubmit('published')}
                disabled={loading !== null}
                className="admin-btn-primary text-xs"
              >
                {loading === 'publish' ? '⏳ Publishing…' : '🚀 Publish Now'}
              </button>
            </div>
          }
        />

        {/* Draft restored banner */}
        {draftRestored && (
          <div className="mb-4 flex items-center justify-between bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs px-4 py-2.5 rounded-lg">
            <span>✏️ Draft restored from auto-save{lastSaved ? ` (last saved ${lastSaved})` : ''}.</span>
            <button
              onClick={() => {
                localStorage.removeItem(DRAFT_KEY);
                setDraftRestored(false);
                setForm({ title: '', snippet: '', category: 'General', tags: '', meta_title: '', meta_description: '' });
                setThumbnail('');
                editor?.commands.clearContent();
                setWordCountVal(0);
                setLastSaved(null);
              }}
              className="ml-4 underline hover:no-underline"
            >
              Start fresh
            </button>
          </div>
        )}

        {/* ── Smart Import Panel ──────────────────────────────────── */}
        {showImportPanel && (
          <div className="mb-5 admin-card border border-primary/40 bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm text-primary">📋 Smart Import</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Paste any content — plain text, Markdown, HTML, tables, bold. We'll format it automatically.
                </p>
              </div>
              <button
                onClick={() => { setShowImportPanel(false); setImportText(''); }}
                className="text-text-muted hover:text-white text-lg leading-none px-1"
              >
                ✕
              </button>
            </div>

            {/* Format hints */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { icon: '📝', label: 'Plain Text' },
                { icon: '⬇️', label: 'Markdown (# **bold** | tables |)' },
                { icon: '🌐', label: 'HTML' },
              ].map((h) => (
                <span key={h.label} className="inline-flex items-center gap-1 text-xs bg-background-elevated border border-border rounded-full px-2.5 py-1 text-text-secondary">
                  {h.icon} {h.label}
                </span>
              ))}
            </div>

            <textarea
              id="import-textarea"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Paste your content here in any format:\n\n# Article Title\n\n**Bold text** and regular text...\n\n| Column 1 | Column 2 |\n|----------|----------|
| Value 1  | Value 2  |`}
              rows={10}
              className="admin-input resize-y w-full font-mono text-xs mb-3"
            />

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-secondary">Insert mode:</span>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importOverwrite === 'replace'}
                    onChange={() => setImportOverwrite('replace')}
                    className="accent-primary"
                  />
                  Replace editor
                </label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="append"
                    checked={importOverwrite === 'append'}
                    onChange={() => setImportOverwrite('append')}
                    className="accent-primary"
                  />
                  Append to existing
                </label>
              </div>
              <button
                id="btn-smart-import"
                onClick={handleSmartImport}
                disabled={importProcessing || !importText.trim()}
                className="admin-btn-primary text-sm px-5"
              >
                {importProcessing ? '⏳ Processing…' : '✨ Format & Import'}
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Editor Column ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Title */}
            <div className="admin-card">
              <input
                id="article-title"
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
                id="article-snippet"
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

                {/* Separator */}
                <div className="w-px h-5 bg-border mx-1" />

                {/* Link button */}
                <button
                  type="button"
                  id="btn-insert-link"
                  onClick={() => {
                    setShowLinkInput((v) => !v);
                    setTimeout(() => linkInputRef.current?.focus(), 50);
                  }}
                  title="Insert link"
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    editor?.isActive('link')
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-white hover:bg-background-elevated'
                  }`}
                >
                  🔗 Link
                </button>

                {/* Image upload */}
                <button
                  type="button"
                  id="btn-insert-image"
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
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadEditorImage(f);
                    e.target.value = '';
                  }}
                />

                {/* Remove link */}
                {editor?.isActive('link') && (
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().unsetLink().run()}
                    className="px-2 py-1 rounded text-xs font-medium text-red-400 hover:bg-red-500/10"
                    title="Remove link"
                  >
                    ✕ Link
                  </button>
                )}
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

              {/* Footer: word count + auto-save indicator */}
              <div className="flex items-center justify-between px-5 py-2.5 border-t border-border text-xs text-text-muted bg-background-elevated/20">
                <span>{wordCountVal.toLocaleString()} words · ~{readTime} min read</span>
                <span>
                  {lastSaved
                    ? `✅ Auto-saved at ${lastSaved}`
                    : ''}
                </span>
              </div>
            </div>
          </div>

          {/* ── Settings Sidebar ─────────────────────────────── */}
          <div className="space-y-4">

            {/* Publish actions */}
            <div className="admin-card">
              <h3 className="font-semibold text-sm mb-3">📤 Publish</h3>
              <div className="space-y-2">
                <button
                  id="sidebar-btn-publish"
                  onClick={() => handleSubmit('published')}
                  disabled={loading !== null}
                  className="admin-btn-primary w-full justify-center text-sm"
                >
                  {loading === 'publish' ? '⏳ Publishing…' : '🚀 Publish Now'}
                </button>
                <button
                  id="sidebar-btn-draft"
                  onClick={() => handleSubmit('draft')}
                  disabled={loading !== null}
                  className="admin-btn-ghost w-full justify-center text-sm"
                >
                  {loading === 'draft' ? '⏳ Saving…' : '💾 Save as Draft'}
                </button>
                <button
                  onClick={handleDiscard}
                  className="w-full text-center text-xs text-red-400 hover:text-red-300 mt-1 py-1"
                >
                  🗑 Discard article
                </button>
              </div>
              {lastSaved && (
                <p className="text-xs text-text-muted mt-3 text-center">
                  Auto-saved {lastSaved}
                </p>
              )}
            </div>

            {/* Category & Tags */}
            <div className="admin-card space-y-3">
              <h3 className="font-semibold text-sm">📁 Categorize</h3>
              <div>
                <label className="block text-xs font-medium mb-1.5">Category</label>
                <select
                  id="article-category"
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
                  id="article-tags"
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
                  id="btn-upload-thumbnail"
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
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadThumbnail(f);
                  e.target.value = '';
                }}
              />
            </div>

            {/* SEO */}
            <div className="admin-card space-y-3">
              <h3 className="font-semibold text-sm">🔍 SEO</h3>
              <div>
                <label className="block text-xs font-medium mb-1.5">Meta Title</label>
                <input
                  id="article-meta-title"
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
                  id="article-meta-desc"
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
