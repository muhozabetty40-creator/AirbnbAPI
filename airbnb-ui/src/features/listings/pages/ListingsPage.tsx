import { useMemo, useState, useCallback } from 'react'
import { useStore } from '../../../store/StoreContext'
import { useListings } from '../hooks/useListings'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import Spinner from '../../../shared/components/Spinner'

export default function ListingsPage() {
  const { state, dispatch } = useStore()
  const [savedOnly, setSavedOnly] = useState(false)
  useListings()

  const filtered = useMemo(() => {
    const q = state.filter.toLowerCase()
    return state.listings
      .filter(l => l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q))
      .filter(l => (savedOnly ? state.saved.includes(l.id) : true))
  }, [state.listings, state.filter, state.saved, savedOnly])

  const handleReset = useCallback(() => dispatch({ type: 'RESET' }), [dispatch])

  return (
    <main className="listings-page">
      <section className="listings-section">
        <div className="section-header">
          <h2 className="section-title">Popular homes in Nairobi</h2>
        </div>

        <div className="listings-toolbar">
          <SearchBar />
          <label className="saved-toggle">
            <input type="checkbox" checked={savedOnly} onChange={e => setSavedOnly(e.target.checked)} />
            Saved only
          </label>
          <span className="results-count">{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</span>
          <button type="button" className="clear-btn" onClick={handleReset}>Clear All</button>
        </div>

        {state.loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div className="empty-state"><p>No listings match your search.</p></div>
        ) : (
          <div className="cards-grid">
            {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>
    </main>
  )
}
