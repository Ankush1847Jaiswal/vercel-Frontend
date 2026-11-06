import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Camera, Mail, BookOpen, Heart, Settings,
  LogOut, GraduationCap, Upload, Plus, Trash2,
  Edit2, Eye, EyeOff, ChevronRight, Calendar,
  Save, FileText
} from 'lucide-react';
import { authApi, adminApi, photosApi, lettersApi, diaryApi, momentsApi } from '../../lib/api';
import toast from 'react-hot-toast';

// ─── Sidebar ─────────────────────────────────────────────────
function Sidebar({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/admin/dashboard' },
    { label: 'Photos', icon: <Camera size={18} />, href: '/admin/photos' },
    { label: 'Letters', icon: <Mail size={18} />, href: '/admin/letters' },
    { label: 'Diary', icon: <BookOpen size={18} />, href: '/admin/diary' },
    { label: 'Moments', icon: <Heart size={18} />, href: '/admin/moments' },
    { label: 'Settings', icon: <Settings size={18} />, href: '/admin/settings' },
  ];
  return (
    <div className="w-64 bg-navy min-h-screen flex flex-col">
      <div className="p-5 border-b border-navy-light">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-saffron to-primary-700 rounded-lg flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Admin Panel</div>
            <div className="text-xs text-gray-400">UPSC Saarthi</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <Link key={item.href} to={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            location.pathname === item.href ? 'bg-saffron text-white' : 'text-gray-300 hover:bg-navy-light hover:text-white'
          }`}>
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-navy-light">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-sm transition-colors mb-1">
          <ChevronRight size={16} className="rotate-180" /> View Website
        </Link>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 text-sm transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    adminApi.getStats().then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-navy mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Photos', value: stats?.photos ?? '—', icon: <Camera size={20} />, color: 'text-rose-500 bg-rose-50' },
          { label: 'Letters', value: stats?.letters ?? '—', icon: <Mail size={20} />, color: 'text-violet-500 bg-violet-50' },
          { label: 'Diary Entries', value: stats?.diaryEntries ?? '—', icon: <BookOpen size={20} />, color: 'text-teal-500 bg-teal-50' },
          { label: 'Moments', value: stats?.moments ?? '—', icon: <Heart size={20} />, color: 'text-amber-500 bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
            <div className="text-2xl font-bold text-navy">{s.value}</div>
            <div className="text-gray-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {[
          { label: 'Upload Photos', href: '/admin/photos', icon: <Camera size={18} />, desc: 'Add to gallery albums' },
          { label: 'Write a Letter', href: '/admin/letters', icon: <Mail size={18} />, desc: 'Compose and publish' },
          { label: 'Add Diary Entry', href: '/admin/diary', icon: <BookOpen size={18} />, desc: 'Write your thoughts' },
          { label: 'Add Special Moment', href: '/admin/moments', icon: <Heart size={18} />, desc: 'Log a memory' },
        ].map(a => (
          <Link key={a.label} to={a.href} className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-all duration-200 group">
            <div className="w-10 h-10 bg-saffron/10 rounded-xl flex items-center justify-center text-saffron group-hover:bg-saffron group-hover:text-white transition-all">{a.icon}</div>
            <div>
              <div className="font-semibold text-navy">{a.label}</div>
              <div className="text-gray-400 text-sm">{a.desc}</div>
            </div>
            <ChevronRight size={16} className="text-gray-300 ml-auto" />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Photos Admin ─────────────────────────────────────────────
function PhotosAdmin() {
  const [uploading, setUploading] = useState(false);
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState('default');
  const [newAlbumName, setNewAlbumName] = useState('');
  const [caption, setCaption] = useState('');

  useEffect(() => {
    photosApi.getAlbums().then(res => setAlbums(res.data)).catch(() => {});
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const fd = new FormData();
    Array.from(e.target.files).forEach(f => fd.append('photos', f));
    fd.append('albumId', selectedAlbum);
    fd.append('caption', caption);
    setUploading(true);
    try {
      await photosApi.uploadPhotos(fd);
      toast.success('Photos uploaded successfully!');
      setCaption('');
      e.target.value = '';
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const createAlbum = async () => {
    if (!newAlbumName.trim()) return;
    try {
      await photosApi.createAlbum(newAlbumName.trim());
      toast.success('Album created!');
      setNewAlbumName('');
      const res = await photosApi.getAlbums();
      setAlbums(res.data);
    } catch {
      toast.error('Failed to create album.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-navy mb-6">Photos & Memories</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-navy mb-4 flex items-center gap-2"><Upload size={16} /> Upload Photos</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Album</label>
              <select value={selectedAlbum} onChange={e => setSelectedAlbum(e.target.value)} className="input-field">
                {albums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
              <input type="text" value={caption} onChange={e => setCaption(e.target.value)} className="input-field" placeholder="Add a caption..." />
            </div>
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${uploading ? 'border-saffron/50 bg-orange-50' : 'border-gray-200 hover:border-saffron hover:bg-orange-50/30'}`}>
              <Camera size={32} className="text-gray-300 mb-3" />
              <span className="text-gray-600 font-medium text-sm">{uploading ? 'Uploading...' : 'Click to select photos'}</span>
              <span className="text-gray-400 text-xs mt-1">JPG, PNG, WebP up to 20MB each</span>
              <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-bold text-navy mb-4 flex items-center gap-2"><Plus size={16} /> Create Album</h2>
          <div className="space-y-3">
            <input type="text" value={newAlbumName} onChange={e => setNewAlbumName(e.target.value)} className="input-field" placeholder="Album name..." />
            <button onClick={createAlbum} className="btn-primary w-full">Create Album</button>
          </div>
          <h3 className="font-medium text-gray-700 mt-6 mb-3">Existing Albums</h3>
          <div className="space-y-2">
            {albums.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
                <Camera size={14} className="text-gray-400" />
                <span className="font-medium text-navy">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Letters Admin ─────────────────────────────────────────────
function LettersAdmin() {
  const [letters, setLetters] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', content: '', date: new Date().toISOString().split('T')[0], published: false });
  const [loading, setLoading] = useState(false);

  const fetchLetters = async () => {
    try { const res = await lettersApi.getAllAdmin(); setLetters(res.data); } catch {}
  };

  useEffect(() => { fetchLetters(); }, []);

  const save = async () => {
    if (!form.title || !form.content) { toast.error('Title and content required.'); return; }
    setLoading(true);
    try {
      if (editing?.id) {
        await lettersApi.update(editing.id, form);
        toast.success('Letter updated!');
      } else {
        await lettersApi.create(form);
        toast.success('Letter created!');
      }
      setEditing(null);
      setForm({ title: '', content: '', date: new Date().toISOString().split('T')[0], published: false });
      fetchLetters();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Save failed.');
    } finally {
      setLoading(false);
    }
  };

  const deleteLetter = async (id: string) => {
    if (!confirm('Delete this letter?')) return;
    try { await lettersApi.delete(id); toast.success('Deleted.'); fetchLetters(); } catch { toast.error('Delete failed.'); }
  };

  const togglePublish = async (id: string, published: boolean) => {
    try { await lettersApi.update(id, { published: !published }); fetchLetters(); toast.success(published ? 'Unpublished.' : 'Published!'); } catch {}
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Letters to Her</h1>
        <button onClick={() => { setEditing({}); setForm({ title: '', content: '', date: new Date().toISOString().split('T')[0], published: false }); }} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Letter</button>
      </div>

      {(editing !== null) && (
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-navy mb-4">{editing.id ? 'Edit Letter' : 'New Letter'}</h2>
          <div className="space-y-4">
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-field" placeholder="Letter title..." />
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="input-field min-h-[200px] font-serif text-base" placeholder="Write your letter here... You can use basic HTML for formatting." />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-violet-600" />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
              <div className="ml-auto flex gap-3">
                <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={save} disabled={loading} className="btn-primary text-sm py-2 flex items-center gap-2"><Save size={14} /> {loading ? 'Saving...' : 'Save Letter'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {letters.map(letter => (
          <div key={letter.id} className="card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-navy">{letter.title}</div>
              <div className="text-gray-400 text-xs">{letter.date}</div>
            </div>
            <span className={`tag ${letter.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {letter.published ? 'Published' : 'Draft'}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => togglePublish(letter.id, letter.published)} className="p-1.5 text-gray-400 hover:text-violet-600 transition-colors" title={letter.published ? 'Unpublish' : 'Publish'}>
                {letter.published ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button onClick={() => { setEditing(letter); setForm({ title: letter.title, content: letter.content, date: letter.date, published: letter.published }); }} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                <Edit2 size={16} />
              </button>
              <button onClick={() => deleteLetter(letter.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {letters.length === 0 && <div className="text-center py-12 text-gray-400">No letters yet. Write your first letter!</div>}
      </div>
    </div>
  );
}

// ─── Diary Admin ──────────────────────────────────────────────
function DiaryAdmin() {
  const [entries, setEntries] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', content: '', date: new Date().toISOString().split('T')[0], draft: false, mood: '' });
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => { try { const res = await diaryApi.getAllAdmin(); setEntries(res.data); } catch {} };
  useEffect(() => { fetchEntries(); }, []);

  const save = async () => {
    if (!form.title || !form.content) { toast.error('Title and content required.'); return; }
    setLoading(true);
    try {
      if (editing?.id) { await diaryApi.update(editing.id, form); toast.success('Entry updated!'); }
      else { await diaryApi.create(form); toast.success('Entry created!'); }
      setEditing(null);
      setForm({ title: '', content: '', date: new Date().toISOString().split('T')[0], draft: false, mood: '' });
      fetchEntries();
    } catch { toast.error('Save failed.'); } finally { setLoading(false); }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    try { await diaryApi.delete(id); toast.success('Deleted.'); fetchEntries(); } catch {}
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Personal Diary</h1>
        <button onClick={() => { setEditing({}); setForm({ title: '', content: '', date: new Date().toISOString().split('T')[0], draft: false, mood: '' }); }} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Entry</button>
      </div>

      {editing !== null && (
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-navy mb-4">{editing.id ? 'Edit Entry' : 'New Diary Entry'}</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-field" placeholder="Entry title..." />
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
            </div>
            <select value={form.mood} onChange={e => setForm(f => ({ ...f, mood: e.target.value }))} className="input-field">
              <option value="">Select mood (optional)</option>
              {['happy', 'sad', 'excited', 'calm', 'grateful', 'loving', 'nostalgic'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="input-field min-h-[200px]" placeholder="Write your diary entry... You can use basic HTML for formatting." />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.draft} onChange={e => setForm(f => ({ ...f, draft: e.target.checked }))} className="w-4 h-4 accent-teal-600" />
                <span className="text-sm font-medium text-gray-700">Save as Draft</span>
              </label>
              <div className="ml-auto flex gap-3">
                <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={save} disabled={loading} className="btn-primary text-sm py-2 flex items-center gap-2"><Save size={14} /> {loading ? 'Saving...' : 'Save Entry'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {entries.map(entry => (
          <div key={entry.id} className="card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-navy">{entry.title}</div>
              <div className="text-gray-400 text-xs">{entry.date} {entry.mood && `• ${entry.mood}`}</div>
            </div>
            <span className={`tag ${entry.draft ? 'bg-gray-100 text-gray-500' : 'bg-teal-100 text-teal-700'}`}>{entry.draft ? 'Draft' : 'Published'}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(entry); setForm({ title: entry.title, content: entry.content, date: entry.date, draft: entry.draft, mood: entry.mood || '' }); }} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => deleteEntry(entry.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {entries.length === 0 && <div className="text-center py-12 text-gray-400">No diary entries yet.</div>}
      </div>
    </div>
  );
}

// ─── Moments Admin ─────────────────────────────────────────────
function MomentsAdmin() {
  const [moments, setMoments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: new Date().toISOString().split('T')[0], caption: '', type: 'general' });
  const [loading, setLoading] = useState(false);

  const fetchMoments = async () => { try { const res = await momentsApi.getAll(); setMoments(res.data); } catch {} };
  useEffect(() => { fetchMoments(); }, []);

  const save = async () => {
    if (!form.title || !form.date) { toast.error('Title and date required.'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      await momentsApi.create(fd);
      toast.success('Moment added!');
      setShowForm(false);
      setForm({ title: '', description: '', date: new Date().toISOString().split('T')[0], caption: '', type: 'general' });
      fetchMoments();
    } catch { toast.error('Failed to save moment.'); } finally { setLoading(false); }
  };

  const deleteMoment = async (id: string) => {
    if (!confirm('Delete this moment?')) return;
    try { await momentsApi.delete(id); toast.success('Deleted.'); fetchMoments(); } catch {}
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Special Moments</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Moment</button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-navy mb-4">New Special Moment</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-field" placeholder="Moment title..." />
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" />
            <input type="text" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} className="input-field" placeholder="Short caption..." />
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field">
              {['general', 'anniversary', 'birthday', 'travel', 'milestone', 'first-time'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field w-full min-h-[120px] mb-4" placeholder="Description of this moment..." />
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 border rounded-lg text-sm">Cancel</button>
            <button onClick={save} disabled={loading} className="btn-primary text-sm py-2">{loading ? 'Saving...' : 'Add Moment'}</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {moments.map(m => (
          <div key={m.id} className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <FileText size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-navy">{m.title}</div>
              <div className="text-gray-400 text-xs">{m.date} • {m.type}</div>
            </div>
            <button onClick={() => deleteMoment(m.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
          </div>
        ))}
        {moments.length === 0 && <div className="text-center py-12 text-gray-400">No moments yet.</div>}
      </div>
    </div>
  );
}

// ─── Settings Admin ─────────────────────────────────────────────
function SettingsAdmin() {
  const [annConfig, setAnnConfig] = useState({ day: 30, month: 0, year: 0, message: '', configured: false });
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [newSection, setNewSection] = useState({ name: '', description: '', icon: 'lock' });

  useEffect(() => {
    adminApi.getStats().then(res => setAnnConfig(res.data.anniversary || annConfig)).catch(() => {});
    adminApi.getSections().then(res => setSections(res.data)).catch(() => {});
  }, []);

  const saveAnniversary = async () => {
    setSaving(true);
    try {
      await momentsApi.configureAnniversary({ ...annConfig, configured: true });
      toast.success('Anniversary configured!');
    } catch { toast.error('Failed to save.'); } finally { setSaving(false); }
  };

  const addSection = async () => {
    if (!newSection.name) { toast.error('Section name required.'); return; }
    try {
      await adminApi.addSection(newSection);
      toast.success('Section added!');
      const res = await adminApi.getSections();
      setSections(res.data);
      setNewSection({ name: '', description: '', icon: 'lock' });
    } catch { toast.error('Failed to add section.'); }
  };

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-navy">Settings</h1>

      {/* Anniversary config */}
      <div className="card p-6">
        <h2 className="font-bold text-navy mb-4 flex items-center gap-2"><Calendar size={18} className="text-amber-500" /> Anniversary Configuration</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <input type="number" min="1" max="31" value={annConfig.day || ''} onChange={e => setAnnConfig(a => ({ ...a, day: parseInt(e.target.value) || 0 }))} className="input-field" placeholder="30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select value={annConfig.month || 0} onChange={e => setAnnConfig(a => ({ ...a, month: parseInt(e.target.value) }))} className="input-field">
              <option value={0}>Select month...</option>
              {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year (first anniversary year)</label>
            <input type="number" min="2020" max="2040" value={annConfig.year || ''} onChange={e => setAnnConfig(a => ({ ...a, year: parseInt(e.target.value) || 0 }))} className="input-field" placeholder="2024" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Anniversary Message</label>
          <input type="text" value={annConfig.message || ''} onChange={e => setAnnConfig(a => ({ ...a, message: e.target.value }))} className="input-field" placeholder="A special message for the anniversary..." />
        </div>
        <button onClick={saveAnniversary} disabled={saving} className="btn-primary flex items-center gap-2"><Save size={14} /> {saving ? 'Saving...' : 'Save Anniversary Config'}</button>
      </div>

      {/* Private sections */}
      <div className="card p-6">
        <h2 className="font-bold text-navy mb-4">Private Sections</h2>
        <div className="space-y-2 mb-5">
          {sections.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-navy text-sm">{s.name}</div>
              <span className={`ml-auto tag ${s.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{s.enabled ? 'Active' : 'Disabled'}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-3">Add New Private Section</h3>
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            <input type="text" value={newSection.name} onChange={e => setNewSection(s => ({ ...s, name: e.target.value }))} className="input-field" placeholder="Section name..." />
            <input type="text" value={newSection.description} onChange={e => setNewSection(s => ({ ...s, description: e.target.value }))} className="input-field" placeholder="Description..." />
            <select value={newSection.icon} onChange={e => setNewSection(s => ({ ...s, icon: e.target.value }))} className="input-field">
              {['lock', 'camera', 'mail', 'heart', 'book', 'star', 'music', 'gift'].map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <p className="text-xs text-gray-500 mb-3">⚠️ New sections automatically require the same 5-question authentication. No bypass possible.</p>
          <button onClick={addSection} className="btn-primary text-sm py-2 flex items-center gap-2"><Plus size={14} /> Add Section</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    authApi.status().then(res => {
      setIsAdmin(res.data.isAdmin);
      if (!res.data.isAdmin) navigate('/admin/login');
      setAuthChecked(true);
    }).catch(() => { navigate('/admin/login'); });
  }, [navigate]);

  const handleLogout = async () => {
    try { await authApi.logout(); navigate('/admin/login'); } catch {}
  };

  if (!authChecked) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-gray-500">Checking authentication...</div></div>;
  }
  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/photos" element={<PhotosAdmin />} />
          <Route path="/letters" element={<LettersAdmin />} />
          <Route path="/diary" element={<DiaryAdmin />} />
          <Route path="/moments" element={<MomentsAdmin />} />
          <Route path="/settings" element={<SettingsAdmin />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}
