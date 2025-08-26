# Web Radio

A simple static web radio app with stations list, favorites, search, keyboard shortcuts, and Media Session integration.

## Run locally

Using Python 3:

```bash
cd /workspace
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Keyboard shortcuts

- Space: Play/Pause
- M: Mute
- +/-: Volume up/down
- ←/→: Previous/Next station

## Notes

- Some stations may be geo-restricted or enforce CORS. If a stream fails, try another.
- Favorites are saved in localStorage.
- Toggle light/dark theme using the moon button.