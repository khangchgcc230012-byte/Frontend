// Import React hooks for state management and side effects
import { useState, useEffect, useCallback } from 'react'
// Import Toaster component and toast notification function from react-hot-toast
import { Toaster, toast } from 'react-hot-toast'
// Import icon components from lucide-react library
import {
  Link2, Scissors, BarChart2, Copy, Trash2, ExternalLink,
  RefreshCw, ChevronLeft, ChevronRight, Power, Zap, Clock, Search
} from 'lucide-react'
// Import API methods for URL operations
import { urlApi } from './api'
// Import CSS module for component styling
import styles from './App.module.css'

/* ─────────────── Config ─────────────── */
// Backend URL constant - centralized configuration for easy changes
// This URL is used for API calls and redirect operations
const BACKEND_URL = "https://backend-8bxo.onrender.com";

/* ─────────────── helpers ─────────────── */
// Helper function to format ISO date string into human-readable format (e.g., "Jan 15, 2024")
const fmt = (iso) => new Date(iso).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
})

/* ─────────────── CreateForm ─────────────── */
// CreateForm component - handles URL shortening
// onCreated: callback function that fires when a URL is successfully shortened
function CreateForm({ onCreated }) {
  // State for the input URL
  const [url, setUrl] = useState('')
  // State for loading indicator while API call is in progress
  const [loading, setLoading] = useState(false)
  // State for storing the shortened URL result
  const [result, setResult] = useState(null)

  // Handle form submission - sends URL to backend for shortening
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate that URL input is not empty
    if (!url.trim()) return
    // Set loading state to show spinner
    setLoading(true)
    // Clear previous result
    setResult(null)
    try {
      // Call API to create shortened URL
      const data = await urlApi.create(url.trim())
      // Store the result in state to display to user
      setResult(data)
      // Call parent callback to refresh the URLs list
      onCreated(data)
      // Show success notification
      toast.success('URL shortened!', { icon: '✂️' })
      // Clear the input field
      setUrl('')
    } catch (err) {
      // Show error notification if API call fails
      toast.error('Failed to shorten URL.')
    } finally {
      // Stop loading regardless of success or failure
      setLoading(false)
    }
  }

  // Helper function to copy the short URL to clipboard
  const copy = (text) => {
    // Build the complete redirect link using the short code
    const fullLink = `${BACKEND_URL}/api/URLs/go/${text}`;
    // Copy the full link to the user's clipboard
    navigator.clipboard.writeText(fullLink);
    // Show success notification
    toast.success('Full redirect link copied!');
  };

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
// URLTable component - displays list of all shortened URLs in a table format
// urls: array of URL objects to display
// onDelete: callback function to handle URL deletion
// loading: boolean flag indicating if data is being fetched
function URLTable({ urls, onDelete, loading }) {
  // Helper function to copy the short URL to clipboard
  const copy = (text) => {
    // Build the complete redirect link using the short code
    const fullLink = `${BACKEND_URL}/api/URLs/go/${text}`;
    // Copy the full link to the user's clipboard
    navigator.clipboard.writeText(fullLink)
    // Show success notification
    toast.success('Link copied!')
  }

  // Display loading spinner while fetching URLs
  if (loading) return (
    <div className={styles.emptyState}>
      <RefreshCw size={32} className={styles.spin} style={{ opacity: 0.4 }} />
    </div>
  )

  // Display empty state message if no URLs exist
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
          {/* Display the original long URL */}
          <div className={styles.urlCell}>
            <span className={styles.urlOrig}>{row.longUrl}</span>
          </div>
          {/* Display the short code as a clickable link */}
          <div className="mono" style={{ fontSize: 13 }}>
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
          {/* Display creation date in formatted style */}
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>
            <Clock size={12} style={{ marginRight: 4 }} />
            {fmt(row.createAt)}
          </div>
          {/* Action buttons: Open link, Copy link, Delete */}
          <div className={styles.actions}>
            {/* Button to open the short URL in a new tab */}
            <a 
              href={`${BACKEND_URL}/api/URLs/go/${row.shortCode}`} 
              target="_blank" 
              rel="noreferrer" 
              className={styles.iconBtn}
              title="Open Link"
            >
              <ExternalLink size={14} />
            </a>
            {/* Button to copy the short URL to clipboard */}
            <button onClick={() => copy(row.shortCode)} className={styles.iconBtn} title="Copy Full Link">
              <Copy size={14} />
            </button>
            {/* Button to delete the URL record */}
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
// Main App component - manages the overall application state and layout
export default function App() {
  // State for storing all URLs fetched from the backend
  const [urls, setUrls] = useState([])
  // State for loading indicator while fetching URLs
  const [loading, setLoading] = useState(false)
  // State for search/filter input
  const [search, setSearch] = useState('')

  // useCallback function to fetch all URLs from the backend
  // Wrapped in useCallback to prevent unnecessary re-renders
  const load = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch all URLs from the API
      const data = await urlApi.getAll()
      // Handle both array and paginated response formats
      setUrls(Array.isArray(data) ? data : data.items || [])
    } catch {
      // Show error notification if fetch fails
      toast.error('Failed to load URLs')
    } finally {
      // Stop loading regardless of success or failure
      setLoading(false)
    }
  }, [])

  // useEffect hook to load URLs when component mounts
  useEffect(() => { load() }, [load])

  // Callback when a new URL is created - refresh the list
  const handleCreated = () => { load() }

  // Handle URL deletion with confirmation
  const handleDelete = async (id) => {
    // Ask user for confirmation before deleting
    if (!confirm('Delete this URL?')) return
    try {
      // Call API to delete the URL
      await urlApi.delete(id)
      // Show success notification
      toast.success('Deleted')
      // Refresh the URLs list
      load()
    } catch { 
      // Show error notification if deletion fails
      toast.error('Failed to delete') 
    }
  }

  // Filter URLs based on search input
  // Searches in both shortCode and longUrl fields (case-insensitive for longUrl)
  const filtered = search
    ? urls.filter(u =>
        (u.shortCode || '').includes(search) ||
        (u.longUrl || '').toLowerCase().includes(search.toLowerCase())
      )
    : urls

  // Render the main application UI
  return (
    <div className={styles.app}>
      {/* Toast notification container */}
      <Toaster position="top-right" />
      
      {/* Header with logo */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Scissors size={22} className={styles.logoIcon} />
          <span>snip<em>.io</em></span>
        </div>
      </header>

      {/* Main content area */}
      <main className={styles.main}>
        {/* Form component to shorten new URLs */}
        <CreateForm onCreated={handleCreated} />
        
        {/* Card containing URLs management section */}
        <div className={styles.card}>
          {/* Card header with title and search input */}
          <div className={styles.cardHeader}>
            <BarChart2 size={20} className={styles.cardIcon} />
            <h2>Manage URLs</h2>
            {/* Search/Filter input */}
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
          {/* Table displaying filtered URLs */}
          <URLTable urls={filtered} onDelete={handleDelete} loading={loading} />
        </div>
      </main>
    </div>
  )
}