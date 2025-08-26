import type { Station } from './types'

export const defaultStations: Station[] = [
  {
    id: 'somafm-groove-salad',
    name: 'SomaFM: Groove Salad',
    streamUrl: 'https://ice2.somafm.com/groovesalad-128-mp3',
    websiteUrl: 'https://somafm.com/groovesalad/',
    country: 'US',
    genre: 'Ambient / Downtempo',
  },
  {
    id: 'somafm-dronezone',
    name: 'SomaFM: Drone Zone',
    streamUrl: 'https://ice2.somafm.com/dronezone-128-mp3',
    websiteUrl: 'https://somafm.com/dronezone/',
    country: 'US',
    genre: 'Ambient',
  },
  {
    id: 'somafm-lush',
    name: 'SomaFM: Lush',
    streamUrl: 'https://ice2.somafm.com/lush-128-mp3',
    websiteUrl: 'https://somafm.com/lush/',
    country: 'US',
    genre: 'Lounge / Downtempo',
  },
  {
    id: 'bbc-world-service',
    name: 'BBC World Service',
    streamUrl: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
    websiteUrl: 'https://www.bbc.co.uk/worldserviceradio',
    country: 'UK',
    genre: 'News',
  },
  {
    id: 'radio-paradise-main',
    name: 'Radio Paradise (Main Mix)',
    streamUrl: 'https://stream.radioparadise.com/aac-320',
    websiteUrl: 'https://radioparadise.com',
    country: 'US',
    genre: 'Eclectic',
  },
  {
    id: 'kexp-128',
    name: 'KEXP 90.3 FM',
    streamUrl: 'https://kexp-mp3-2.streamguys1.com/kexp128.mp3',
    websiteUrl: 'https://www.kexp.org/',
    country: 'US',
    genre: 'Indie / Alternative',
  },
]