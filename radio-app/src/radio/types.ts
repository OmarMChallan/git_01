export type Station = {
  id: string
  name: string
  streamUrl: string
  websiteUrl?: string
  country?: string
  genre?: string
  isFavorite?: boolean
}

export type PlayerState = {
  currentStationId: string | null
  isPlaying: boolean
  volume: number // 0.0 - 1.0
}

export type SearchFilters = {
  query: string
  genre?: string
  country?: string
  favoritesOnly?: boolean
}