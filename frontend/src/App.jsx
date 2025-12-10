import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Music, Search } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/songs';

function App() {
  const [songs, setSongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    duration: '',
    image_url: '',
    release_year: ''
  });

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingSong) {
        await fetch(`${API_URL}/${editingSong.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      
      fetchSongs();
      closeModal();
    } catch (error) {
      console.error('Error saving song:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchSongs();
      } catch (error) {
        console.error('Error deleting song:', error);
      }
    }
  };

  const openModal = (song = null) => {
    if (song) {
      setEditingSong(song);
      setFormData(song);
    } else {
      setEditingSong(null);
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: '',
        duration: '',
        image_url: '',
        release_year: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSong(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-90 sticky top-0 z-50 border-b border-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Music className="w-10 h-10 text-red-600" />
              <h1 className="text-3xl font-bold text-red-600">MusicFlix</h1>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Song</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search songs, artists, or genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>
      </div>

      {/* Songs Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold mb-6">Your Music Library</h2>
        
        {filteredSongs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No songs found. Add your first song!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className="group relative bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={song.image_url || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300'}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-white truncate">{song.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                  <p className="text-xs text-gray-500 mt-1">{song.genre}</p>
                </div>

                {/* Action buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <button
                    onClick={() => openModal(song)}
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(song.id)}
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-20 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs">
                  {song.duration}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-600">
                {editingSong ? 'Edit Song' : 'Add New Song'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Artist *</label>
                <input
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Album</label>
                  <input
                    type="text"
                    name="album"
                    value={formData.album}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (MM:SS)</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="3:45"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Release Year</label>
                  <input
                    type="number"
                    name="release_year"
                    value={formData.release_year}
                    onChange={handleChange}
                    placeholder="2024"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-medium transition-colors"
                >
                  {editingSong ? 'Update Song' : 'Add Song'}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;