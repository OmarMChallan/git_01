import { useState } from 'react'
import type { Station } from './types'

export function AddStationForm({
  onAdd,
}: {
  onAdd: (station: Station) => void
}) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !url.trim()) return
    const station: Station = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      streamUrl: url.trim(),
      websiteUrl: websiteUrl.trim() || undefined,
    }
    onAdd(station)
    setName('')
    setUrl('')
    setWebsiteUrl('')
  }

  return (
    <form className="add-station" onSubmit={handleSubmit}>
      <input
        placeholder="Station name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Stream URL (MP3/AAC)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        placeholder="Website (optional)"
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
      />
      <button type="submit" className="btn">
        Add
      </button>
    </form>
  )
}