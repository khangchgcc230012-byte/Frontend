import { useState, useEffect, useCallback } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import {
  Link2, Scissors, BarChart2, Copy, Trash2, ExternalLink,
  RefreshCw, ChevronLeft, ChevronRight, Power, Zap, Clock, Search
} from 'lucide-react'
import { urlApi } from './api'
import styles from './App.module.css'

/* ─────────────── Config ─────────────── */
// This makes it easy to change your backend URL in one place
const BACKEND_URL = "https://backend-8bxo.onrender.com";

/* ─────────────── helpers ─────────────── */
const fmt = (iso) => new Date(iso).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
})

/* ─────────────── CreateForm ─────────────── */
function CreateForm({ onCreated }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const data = await urlApi.create(url.trim())
      setResult(data)
      onCreated(data)
      toast.success('URL shortened!', { icon: '✂️' })
      setUrl('')
    } catch (err) {
      toast.error('Failed to shorten URL.')
    } finally {
      setLoading(false)
    }
  }

  const copy = (text) => {
    // Generate the full link for the user to copy
    const fullLink = `${BACKEND_URL}/api/URLs/go/${text}`;
    navigator.clipboard.writeText(fullLink)
    toast.success('Full link copied!')
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Scissors size={20} className={styles.cardIcon} />
        <h2>Shorten a URL</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>URL *</label>
          <div className={styles.inputWrap}>
            <Link2 size={16} className={styles.inputIcon} />
            <input
              type="url"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
              className={styles.input}
            />
          </div>
        </div>

        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? <RefreshCw size={16} className={styles.spin} /> : <Zap size={16} />}
          {loading ? 'Shortening…' : 'Shorten URL'}
        </button>
      </form>

      {result && (
        <div className={styles.resultBox}>
          <div className={styles.resultLabel}>Your short URL is ready</div>
          <div className={styles.resultUrl}>
            {/* Added: Link that triggers the backend redirect */}
            <a 
              href={`${BACKEND_URL}/api/URLs/go/${result.shortCode}`} 
              target="_blank" 
              rel="noreferrer"
              className="mono"
              style={{ color: 'var(--primary)', textDecoration: 'underline' }}
            >
              {result.shortCode}
            </a>
            <div className={styles.resultActions}>
              <button onClick={() => copy(result.shortCode)} className={styles.iconBtn} title="Copy Full Link">
                <Copy size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── URLTable ─────────────── */
function URLTable({ urls, onDelete, loading }) {
  const copy = (text) => {
    const fullLink = `${BACKEND_URL}/api/URLs/go/${text}`;
    navigator.clipboard.writeText(fullLink)
    toast.success('Link copied!')
  }

  if (loading) return (
    <div className={styles.emptyState}>
      <RefreshCw size={32} className={styles.spin} style={{ opacity: 0.4 }} />
    </div>
  )

  if (!urls || !urls.length) return (
    <div className={styles.emptyState}>
      <Link2 size={40} style={{ opacity: 0.2 }} />
      <p>No URLs yet. Shorten one above!</p>
    </div>
  )

  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <span>LONG URL</span>
        <span>SHORT CODE</span>
        <span>CREATED</span>
        <span>ACTIONS</span>
      </div>
      {urls.map(row => (
        <div key={row.id} className={styles.tableRow}>
          <div className={styles.urlCell}>
            <span className={styles.urlOrig}>{row.longUrl}</span>
          </div>
          <div className="mono" style={{ fontSize: 13 }}>
            {/* Added: Clickable short code that opens the redirect */}
            <a 
               href={`${BACKEND_URL}/api/URLs/go/${row.shortCode}`} 
               target="_blank" 
               rel="noreferrer"
               className={styles.code}
               style={{ color: 'inherit' }}
            >
              {row.shortCode}
            </a>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>
            <Clock size={12} style={{ marginRight: 4 }} />
            {fmt(row.createAt)}
          </div>
          <div className={styles.actions}>
            {/* Added: External link button to test redirect immediately */}
            <a 
              href={`${BACKEND_URL}/api/URLs/go/${row.shortCode}`} 
              target="_blank" 
              rel="noreferrer" 
              className={styles.iconBtn}
              title="Open Link"
            >
              <ExternalLink size={14} />
            </a>
            <button onClick={() => copy(row.shortCode)} className={styles.iconBtn} title="Copy Full Link">
              <Copy size={14} />
            </button>
            <button onClick={() => onDelete(row.id)} className={`${styles.iconBtn} ${styles.danger}`} title="Delete">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────── App ─────────────── */
export default function App() {
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await urlApi.getAll()
      setUrls(Array.isArray(data) ? data : data.items || [])
    } catch {
      toast.error('Failed to load URLs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreated = () => { load() }

  const handleDelete = async (id) => {
    if (!confirm('Delete this URL?')) return
    try {
      await urlApi.delete(id)
      toast.success('Deleted')
      load()
    } catch { toast.error('Failed to delete') }
  }

  const filtered = search
    ? urls.filter(u =>
        (u.shortCode || '').includes(search) ||
        (u.longUrl || '').toLowerCase().includes(search.toLowerCase())
      )
    : urls

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <header className={styles.header}>
        <div className={styles.logo}>
          <Scissors size={22} className={styles.logoIcon} />
          <span>snip<em>.io</em></span>
        </div>
      </header>

      <main className={styles.main}>
        <CreateForm onCreated={handleCreated} />
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <BarChart2 size={20} className={styles.cardIcon} />
            <h2>Manage URLs</h2>
            <div className={styles.searchWrap}>
              <Search size={14} />
              <input
                type="text"
                placeholder="Filter..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
          <URLTable urls={filtered} onDelete={handleDelete} loading={loading} />
        </div>
      </main>
    </div>
  )
}