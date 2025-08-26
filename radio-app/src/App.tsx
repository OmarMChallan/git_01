import { useEffect, useMemo, useState } from 'react'
import './App.css'

import type { Station } from './radio/types'
import { defaultStations } from './radio/stations'
import { StationList } from './radio/StationList'
import { Player } from './radio/Player'
import { AddStationForm } from './radio/AddStationForm'
import { useAudio } from './radio/useAudio'
import {
  loadFavorites,
  saveFavorites,
  loadLastStationId,
  saveLastStationId,
  loadVolume,
  saveVolume,
} from './radio/storage'

function App() {
  const [stations, setStations] = useState<Station[]>(() => [...defaultStations])
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites())
  const [currentStationId, setCurrentStationId] = useState<string | null>(() => loadLastStationId())

  const initialVolume = useMemo(() => loadVolume(0.8), [])
  const audio = useAudio(null, initialVolume)

  const currentStation = useMemo(
    () => stations.find((s) => s.id === currentStationId) ?? null,
    [stations, currentStationId]
  )

  useEffect(() => {
    saveVolume(audio.volume)
  }, [audio.volume])

  useEffect(() => {
    if (currentStation) audio.setSrc(currentStation.streamUrl)
    else audio.setSrc(null)
  }, [currentStation])

  useEffect(() => {
    saveLastStationId(currentStationId)
  }, [currentStationId])

  useEffect(() => {
    if (currentStationId) return
    const firstFavorite = stations.find((s) => favorites.has(s.id))
    const fallback = firstFavorite?.id ?? stations[0]?.id ?? null
    if (fallback) setCurrentStationId(fallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleToggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveFavorites(next)
      return next
    })
  }

  function handleSelectStation(id: string) {
    if (id === currentStationId) {
      audio.toggle()
      return
    }
    const st = stations.find((s) => s.id === id)
    if (!st) return
    setCurrentStationId(id)
    audio.setSrc(st.streamUrl)
    audio.play()
  }

  function handleAddStation(station: Station) {
    setStations((prev) => [station, ...prev])
  }

  return (
    <div className="app">
      <h1>Radio</h1>
      <div className="layout">
        <aside className="sidebar">
          <StationList
            stations={stations}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelect={handleSelectStation}
          />
          <AddStationForm onAdd={handleAddStation} />
        </aside>
        <main className="main">
          <Player
            isPlaying={audio.isPlaying}
            onPlay={audio.play}
            onPause={audio.pause}
            volume={audio.volume}
            onVolumeChange={audio.setVolume}
            currentStationName={currentStation ? currentStation.name : null}
          />
        </main>
      </div>
    </div>
  )
}

export default App
