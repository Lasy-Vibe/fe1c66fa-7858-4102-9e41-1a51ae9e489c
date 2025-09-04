"use client"

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart, MoreHorizontal, Search, Home, Library, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'

// Dados mockados para demonstração
const mockPlaylists = [
  { id: 1, name: 'Liked Songs', count: 234, cover: '❤️' },
  { id: 2, name: 'My Playlist #1', count: 45, cover: '🎵' },
  { id: 3, name: 'Chill Vibes', count: 67, cover: '🌙' },
  { id: 4, name: 'Workout Mix', count: 89, cover: '💪' },
  { id: 5, name: 'Road Trip', count: 123, cover: '🚗' },
]

const mockSongs = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', cover: '🌟', liked: true },
  { id: 2, title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54', cover: '🍉', liked: false },
  { id: 3, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23', cover: '✨', liked: true },
  { id: 4, title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58', cover: '💜', liked: false },
  { id: 5, title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', album: 'F*CK LOVE 3', duration: '2:21', cover: '🎤', liked: true },
  { id: 6, title: 'Industry Baby', artist: 'Lil Nas X, Jack Harlow', album: 'MONTERO', duration: '3:32', cover: '👑', liked: false },
  { id: 7, title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration: '3:58', cover: '🔥', liked: true },
  { id: 8, title: 'Peaches', artist: 'Justin Bieber ft. Daniel Caesar', album: 'Justice', duration: '3:18', cover: '🍑', liked: false },
]

export default function SpotifyPlayer() {
  const [currentSong, setCurrentSong] = useState(mockSongs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([75])
  const [selectedPlaylist, setSelectedPlaylist] = useState(mockPlaylists[0])
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0) // 0: off, 1: all, 2: one
  const [searchQuery, setSearchQuery] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simular progresso da música
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const duration = parseInt(currentSong.duration.split(':')[0]) * 60 + parseInt(currentSong.duration.split(':')[1])
          if (prev >= duration) {
            handleNext()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, currentSong])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDuration = (duration: string) => {
    const [mins, secs] = duration.split(':').map(Number)
    return mins * 60 + secs
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    const currentIndex = mockSongs.findIndex(song => song.id === currentSong.id)
    const nextIndex = (currentIndex + 1) % mockSongs.length
    setCurrentSong(mockSongs[nextIndex])
    setCurrentTime(0)
  }

  const handlePrevious = () => {
    const currentIndex = mockSongs.findIndex(song => song.id === currentSong.id)
    const prevIndex = currentIndex === 0 ? mockSongs.length - 1 : currentIndex - 1
    setCurrentSong(mockSongs[prevIndex])
    setCurrentTime(0)
  }

  const handleSongSelect = (song: typeof mockSongs[0]) => {
    setCurrentSong(song)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const toggleLike = (songId: number) => {
    // Em uma aplicação real, isso atualizaria o estado no backend
    console.log(`Toggled like for song ${songId}`)
  }

  const filteredSongs = mockSongs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Layout principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-black border-r border-gray-800 flex flex-col hidden md:flex">
          {/* Logo e navegação principal */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-green-500 mb-8">MrFy</h1>
            <nav className="space-y-4">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                <Home className="w-5 h-5 mr-3" />
                Home
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                <Search className="w-5 h-5 mr-3" />
                Search
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                <Library className="w-5 h-5 mr-3" />
                Your Library
              </Button>
            </nav>
          </div>

          {/* Playlists */}
          <div className="flex-1 px-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Playlists</h2>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {mockPlaylists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => setSelectedPlaylist(playlist)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedPlaylist.id === playlist.id 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-lg">
                      {playlist.cover}
                    </div>
                    <div>
                      <div className="font-medium">{playlist.name}</div>
                      <div className="text-xs text-gray-500">{playlist.count} songs</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Área principal */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900 to-black">
          {/* Header com busca */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">{selectedPlaylist.name}</h1>
              <div className="w-64 hidden sm:block">
                <Input
                  placeholder="Search songs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            {/* Info da playlist */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-2xl">
                {selectedPlaylist.cover}
              </div>
              <div>
                <p className="text-sm text-gray-400">Playlist</p>
                <h2 className="text-xl font-bold">{selectedPlaylist.name}</h2>
                <p className="text-sm text-gray-400">{selectedPlaylist.count} songs</p>
              </div>
            </div>

            {/* Controles da playlist */}
            <div className="flex items-center space-x-4">
              <Button 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-black rounded-full w-14 h-14"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Lista de músicas */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto">
            <div className="space-y-1">
              {/* Header da tabela */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800">
                <div className="col-span-1">#</div>
                <div className="col-span-6 sm:col-span-5">Title</div>
                <div className="col-span-3 hidden sm:block">Album</div>
                <div className="col-span-2 sm:col-span-1 text-right">Duration</div>
                <div className="col-span-1"></div>
              </div>

              {/* Músicas */}
              {filteredSongs.map((song, index) => (
                <div
                  key={song.id}
                  onClick={() => handleSongSelect(song)}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors group ${
                    currentSong.id === song.id 
                      ? 'bg-gray-800 text-green-500' 
                      : 'hover:bg-gray-900 text-gray-300'
                  }`}
                >
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm">{index + 1}</span>
                  </div>
                  <div className="col-span-6 sm:col-span-5 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-lg">
                      {song.cover}
                    </div>
                    <div>
                      <div className="font-medium truncate">{song.title}</div>
                      <div className="text-sm text-gray-400 truncate">{song.artist}</div>
                    </div>
                  </div>
                  <div className="col-span-3 hidden sm:flex items-center">
                    <span className="text-sm text-gray-400 truncate">{song.album}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-end">
                    <span className="text-sm text-gray-400">{song.duration}</span>
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(song.id)
                      }}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                        song.liked ? 'text-green-500' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${song.liked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Player de música fixo na parte inferior */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="flex items-center justify-between">
          {/* Informações da música atual */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center text-xl">
              {currentSong.cover}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-white truncate">{currentSong.title}</div>
              <div className="text-sm text-gray-400 truncate">{currentSong.artist}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleLike(currentSong.id)}
              className={`${currentSong.liked ? 'text-green-500' : 'text-gray-400 hover:text-white'} hidden sm:flex`}
            >
              <Heart className={`w-4 h-4 ${currentSong.liked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Controles centrais */}
          <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShuffled(!isShuffled)}
                className={`${isShuffled ? 'text-green-500' : 'text-gray-400 hover:text-white'} hidden sm:flex`}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePrevious} className="text-gray-400 hover:text-white">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button 
                size="sm" 
                className="bg-white hover:bg-gray-200 text-black rounded-full w-10 h-10"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleNext} className="text-gray-400 hover:text-white">
                <SkipForward className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRepeatMode((prev) => (prev + 1) % 3)}
                className={`${repeatMode > 0 ? 'text-green-500' : 'text-gray-400 hover:text-white'} hidden sm:flex`}
              >
                <Repeat className="w-4 h-4" />
                {repeatMode === 2 && <span className="text-xs ml-1">1</span>}
              </Button>
            </div>
            
            {/* Barra de progresso */}
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={getDuration(currentSong.duration)}
                step={1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 w-10">
                {currentSong.duration}
              </span>
            </div>
          </div>

          {/* Controles de volume */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Volume2 className="w-4 h-4 text-gray-400 hidden sm:block" />
            <Slider
              value={volume}
              max={100}
              step={1}
              onValueChange={setVolume}
              className="w-24 hidden sm:block"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
