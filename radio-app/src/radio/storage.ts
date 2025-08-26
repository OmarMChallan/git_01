const FAVORITES_KEY = 'radio.favorites'
const LAST_STATION_KEY = 'radio.lastStationId'
const VOLUME_KEY = 'radio.volume'

export function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    return new Set(parsed)
  } catch {
    return new Set()
  }
}

export function saveFavorites(favorites: Set<string>): void {
  try {
    const arr = Array.from(favorites)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr))
  } catch {}
}

export function loadLastStationId(): string | null {
  try {
    return localStorage.getItem(LAST_STATION_KEY)
  } catch {
    return null
  }
}

export function saveLastStationId(stationId: string | null): void {
  try {
    if (stationId === null) localStorage.removeItem(LAST_STATION_KEY)
    else localStorage.setItem(LAST_STATION_KEY, stationId)
  } catch {}
}

export function loadVolume(defaultVolume = 0.8): number {
  try {
    const raw = localStorage.getItem(VOLUME_KEY)
    if (!raw) return defaultVolume
    const vol = Number(raw)
    if (Number.isNaN(vol)) return defaultVolume
    return Math.min(1, Math.max(0, vol))
  } catch {
    return defaultVolume
  }
}

export function saveVolume(volume: number): void {
  try {
    localStorage.setItem(VOLUME_KEY, String(volume))
  } catch {}
}