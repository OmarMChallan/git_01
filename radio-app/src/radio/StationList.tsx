import { useMemo, useState } from 'react'
import type { Station } from './types'

export function StationList({
  stations,
  favorites,
  onToggleFavorite,
  onSelect,
}: {
  stations: Station[]
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
  onSelect: (id: string) => void
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return stations
    return stations.filter((s) =>
      [s.name, s.genre, s.country]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    )
  }, [stations, query])

  return (
    <div className="station-list">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stations..."
        className="search-input"
      />
      <ul>
        {filtered.map((s) => (
          <li key={s.id} className="station-item">
            <button className="station-name" onClick={() => onSelect(s.id)}>
              {s.name}
            </button>
            <div className="meta">
              <span>{s.genre}</span>
              {s.country ? <span> · {s.country}</span> : null}
              {s.websiteUrl ? (
                <>
                  {' '}
                  ·{' '}
                  <a href={s.websiteUrl} target="_blank" rel="noreferrer">
                    Site
                  </a>
                </>
              ) : null}
            </div>
            <button
              aria-label="Toggle favorite"
              className={`fav ${favorites.has(s.id) ? 'on' : ''}`}
              onClick={() => onToggleFavorite(s.id)}
              title={favorites.has(s.id) ? 'Remove favorite' : 'Add favorite'}
            >
              {favorites.has(s.id) ? '★' : '☆'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}