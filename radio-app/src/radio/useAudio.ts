import { useEffect, useMemo, useRef, useState } from 'react'

export function useAudio(initialSrc: string | null, initialVolume = 0.8) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [src, setSrc] = useState<string | null>(initialSrc)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(initialVolume)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const audio = new Audio()
    audio.crossOrigin = 'anonymous'
    audio.preload = 'none'
    audioRef.current = audio

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onError = () => setError('Playback error')

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (!audioRef.current) return
    if (!src) {
      audioRef.current.pause()
      return
    }
    audioRef.current.src = src
  }, [src])

  const controls = useMemo(() => ({
    play: async () => {
      setError(null)
      try {
        await audioRef.current?.play()
      } catch (e) {
        setError('Autoplay prevented, press play')
      }
    },
    pause: () => {
      audioRef.current?.pause()
    },
    toggle: async () => {
      if (audioRef.current?.paused) {
        await controls.play()
      } else {
        controls.pause()
      }
    },
    setSrc: (newSrc: string | null) => setSrc(newSrc),
    setVolume: (v: number) => setVolume(Math.min(1, Math.max(0, v))),
  }), [setSrc, setVolume])

  return { audioRef, src, isPlaying, volume, error, ...controls }
}