const SNAPCAST_SOURCE_URL =
  import.meta.env.VITE_SNAPCAST_SOURCE_URL || 'http://192.168.86.100:1780/'
const PLEXAMP_SOURCE_URL = import.meta.env.VITE_PLEXAMP_SOURCE_URL || 'http://192.168.86.100:32500'
const SPOTIFY_SOURCE_URL = import.meta.env.VITE_SPOTIFY_SOURCE_URL || 'http://192.168.86.33:3000'

export default {
  snapcast: {
    id: 'snapcast',
    name: 'Snapcast',
    icon: 'snapcast.png',
    source: SNAPCAST_SOURCE_URL,
    enabled: true,
    default: true,
  },
  plexamp: {
    id: 'plexamp',
    name: 'Plexamp',
    icon: 'plexamp.webp',
    source: PLEXAMP_SOURCE_URL,
    enabled: true,
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    icon: 'spotify.webp',
    source: SPOTIFY_SOURCE_URL,
    enabled: false,
  },
}
