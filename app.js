const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeInput = document.getElementById('volume');
const nowStationEl = document.getElementById('nowStation');
const stationsListEl = document.getElementById('stationsList');
const favoritesListEl = document.getElementById('favoritesList');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');

const STORAGE_KEYS = {
	favorites: 'radio.favorites',
	theme: 'radio.theme'
};

let stations = [];
let filteredStations = [];
let currentIndex = -1;
let favorites = new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]'));

function persistFavorites() {
	localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...favorites]));
}

function setTheme(theme) {
	if (theme === 'light') {
		document.documentElement.classList.add('light');
	} else {
		document.documentElement.classList.remove('light');
	}
	localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function toggleTheme() {
	const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
	setTheme(next);
}

themeToggle.addEventListener('click', toggleTheme);
setTheme(localStorage.getItem(STORAGE_KEYS.theme) || 'dark');

async function loadStations() {
	try {
		const res = await fetch('stations.json');
		if (!res.ok) throw new Error(`Failed to load stations: ${res.status}`);
		stations = await res.json();
		filteredStations = stations;
		renderLists();
	} catch (err) {
		console.error(err);
		stationsListEl.innerHTML = `<li><div>Could not load stations</div><div class="meta">${String(err)}</div></li>`;
	}
}

function renderLists() {
	renderStationsList();
	renderFavoritesList();
}

function renderStationsList() {
	const q = searchInput.value.trim().toLowerCase();
	const list = (q ? stations.filter(s => s.name.toLowerCase().includes(q) || (s.genre||'').toLowerCase().includes(q)) : stations);
	stationsListEl.innerHTML = list.map((s, i) => stationItemTemplate(s)).join('');
	attachStationItemHandlers(stationsListEl, list);
}

function renderFavoritesList() {
	const favs = stations.filter(s => favorites.has(s.id));
	favoritesListEl.innerHTML = favs.length ? favs.map(s => stationItemTemplate(s, true)).join('') : '<li><div>No favorites yet</div></li>';
	attachStationItemHandlers(favoritesListEl, favs);
}

function stationItemTemplate(station, isFavoriteList = false) {
	const isFav = favorites.has(station.id);
	return `
		<li data-id="${station.id}">
			<div>
				<div><strong>${station.name}</strong></div>
				<div class="meta">${station.genre || 'Variety'} • ${station.country || ''}</div>
			</div>
			<div class="station-actions">
				<button data-action="play">▶️</button>
				<button data-action="fav" aria-pressed="${isFav}">${isFav ? '★' : '☆'}</button>
			</div>
		</li>
	`;
}

function attachStationItemHandlers(rootEl, list) {
	rootEl.querySelectorAll('li').forEach((li, idx) => {
		li.querySelector('[data-action="play"]').addEventListener('click', () => {
			const id = li.getAttribute('data-id');
			const station = list.find(s => String(s.id) === String(id));
			if (station) playStationById(station.id);
		});
		li.querySelector('[data-action="fav"]').addEventListener('click', () => {
			const id = li.getAttribute('data-id');
			if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
			persistFavorites();
			renderLists();
		});
	});
}

function playStationById(id) {
	const idx = stations.findIndex(s => String(s.id) === String(id));
	if (idx !== -1) playByIndex(idx);
}

function playByIndex(idx) {
	const station = stations[idx];
	if (!station) return;
	currentIndex = idx;
	audio.src = station.stream;
	audio.play().catch(console.error);
	updateNowPlaying();
	updatePlayPauseButton();
	updateMediaSession(station);
}

function updateNowPlaying() {
	if (currentIndex < 0) {
		nowStationEl.textContent = 'No station';
	} else {
		nowStationEl.textContent = stations[currentIndex].name;
	}
}

function updatePlayPauseButton() {
	playPauseBtn.textContent = audio.paused ? '▶️' : '⏸️';
}

playPauseBtn.addEventListener('click', () => {
	if (audio.src) {
		if (audio.paused) audio.play(); else audio.pause();
		updatePlayPauseButton();
	} else if (stations.length) {
		playByIndex(0);
	}
});

stopBtn.addEventListener('click', () => {
	audio.pause();
	audio.removeAttribute('src');
	audio.load();
	currentIndex = -1;
	updateNowPlaying();
	updatePlayPauseButton();
});

muteBtn.addEventListener('click', () => {
	audio.muted = !audio.muted;
	muteBtn.textContent = audio.muted ? '🔈' : '🔇';
});

volumeInput.addEventListener('input', () => {
	audio.volume = Number(volumeInput.value);
});

searchInput.addEventListener('input', () => {
	renderStationsList();
});

audio.addEventListener('play', updatePlayPauseButton);

audio.addEventListener('pause', updatePlayPauseButton);

audio.addEventListener('error', (e) => {
	console.error('Audio error', e);
});

function updateMediaSession(station) {
	if (!('mediaSession' in navigator) || !station) return;
	navigator.mediaSession.metadata = new MediaMetadata({
		title: station.name,
		artist: station.genre || 'Radio',
		album: station.country || 'Internet Radio'
	});
	navigator.mediaSession.setActionHandler('play', () => audio.play());
	navigator.mediaSession.setActionHandler('pause', () => audio.pause());
	navigator.mediaSession.setActionHandler('stop', () => stopBtn.click());
	navigator.mediaSession.setActionHandler('previoustrack', () => playByIndex(Math.max(0, currentIndex - 1)));
	navigator.mediaSession.setActionHandler('nexttrack', () => playByIndex(Math.min(stations.length - 1, currentIndex + 1)));
}

window.addEventListener('keydown', (e) => {
	if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
	switch (e.key) {
		case ' ': e.preventDefault(); playPauseBtn.click(); break;
		case 'm': case 'M': muteBtn.click(); break;
		case '+': case '=': volumeInput.value = String(Math.min(1, Number(volumeInput.value) + 0.05)); volumeInput.dispatchEvent(new Event('input')); break;
		case '-': case '_': volumeInput.value = String(Math.max(0, Number(volumeInput.value) - 0.05)); volumeInput.dispatchEvent(new Event('input')); break;
		case 'ArrowLeft': playByIndex(Math.max(0, currentIndex - 1)); break;
		case 'ArrowRight': playByIndex(Math.min(stations.length - 1, currentIndex + 1)); break;
	}
});

loadStations();