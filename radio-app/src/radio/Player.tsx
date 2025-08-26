export function Player({
  isPlaying,
  onPlay,
  onPause,
  volume,
  onVolumeChange,
  currentStationName,
}: {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  volume: number
  onVolumeChange: (v: number) => void
  currentStationName: string | null
}) {
  return (
    <div className="player">
      <div className="now-playing">
        {currentStationName ? currentStationName : 'Select a station'}
      </div>
      <div className="controls">
        {isPlaying ? (
          <button onClick={onPause} className="btn">
            Pause
          </button>
        ) : (
          <button onClick={onPlay} className="btn">
            Play
          </button>
        )}
        <label className="volume">
          Vol
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  )
}