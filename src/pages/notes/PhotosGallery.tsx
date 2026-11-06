import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Grid, List, X, ChevronLeft, ChevronRight, ArrowLeft, Lock } from 'lucide-react';
import PrivateAuth from './PrivateAuth';
import { photosApi, privateAuthApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Photo {
  id: string;
  album_id: string;
  caption: string;
  date: string;
  created_at: string;
}

interface Album {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function PhotosGallery() {
  const [authenticated, setAuthenticated] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const fetchData = useCallback(async () => {
    try {
      const [photosRes, albumsRes] = await Promise.all([
        photosApi.getPhotos(selectedAlbum),
        photosApi.getAlbums(),
      ]);
      setPhotos(photosRes.data);
      setAlbums(albumsRes.data);
    } catch {
      toast.error('Failed to load photos.');
    } finally {
      setLoading(false);
    }
  }, [selectedAlbum]);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  const navigate = useNavigate();

  // Auto-lock when leaving this section
  useEffect(() => {
    return () => {
      privateAuthApi.lock('photos').catch(() => {});
    };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      navigator.sendBeacon?.('/api/private-auth/lock/photos');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightboxIdx(i => i !== null ? Math.min(photos.length - 1, i + 1) : null);
      if (e.key === 'ArrowLeft') setLightboxIdx(i => i !== null ? Math.max(0, i - 1) : null);
      if (e.key === 'Escape') setLightboxIdx(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [lightboxIdx, photos.length]);

  const handleLockAndExit = async () => {
    await privateAuthApi.lock('photos').catch(() => {});
    navigate('/notes');
  };

  if (!authenticated) {
    return (
      <PrivateAuth
        sectionId="photos"
        sectionName="Photos"
        gradientClass="from-rose-500 to-pink-600"
        onAuthenticated={() => setAuthenticated(true)}
      />
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-4">
            <Link
              to="/notes"
              className="inline-flex items-center gap-1.5 text-rose-100 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Back to Notes
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera size={28} className="text-rose-200" />
              <div>
                <h1 className="text-2xl font-bold">Photos</h1>
                <p className="text-rose-200 text-sm">{photos.length} photos in archive</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLockAndExit}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 hover:bg-black/30 rounded-lg text-sm text-white transition-colors"
                title="Lock and return to Notes"
              >
                <Lock size={14} /> Lock &amp; Exit
              </button>
              <button onClick={() => setView(view === 'grid' ? 'list' : 'grid')} className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                {view === 'grid' ? <List size={18} /> : <Grid size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Albums filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <button
            onClick={() => setSelectedAlbum('all')}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedAlbum === 'all' ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 border hover:border-rose-300'}`}
          >
            All Photos
          </button>
          {albums.map(album => (
            <button
              key={album.id}
              onClick={() => setSelectedAlbum(album.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedAlbum === album.id ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 border hover:border-rose-300'}`}
            >
              {album.name}
            </button>
          ))}
        </div>

        {/* Photos */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton aspect-square rounded-xl"></div>)}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Camera size={56} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">No photos yet</p>
            <p className="text-sm mt-2">Upload photos through the admin panel to get started.</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => setLightboxIdx(idx)}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={photosApi.getPhotoUrl(photo.id)}
                  alt={photo.caption || 'Memory'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div>
                    {photo.caption && <p className="text-white text-sm font-medium line-clamp-2">{photo.caption}</p>}
                    <p className="text-gray-300 text-xs">{photo.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {photos.map((photo, idx) => (
              <div key={photo.id} onClick={() => setLightboxIdx(idx)} className="card p-4 flex items-center gap-4 cursor-pointer hover:border-rose-200 border border-transparent transition-all">
                <img src={photosApi.getPhotoUrl(photo.id)} alt={photo.caption || 'Memory'} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                <div>
                  <p className="font-medium text-navy">{photo.caption || 'Untitled'}</p>
                  <p className="text-gray-400 text-sm">{photo.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in" onClick={() => setLightboxIdx(null)}>
          <button
            onClick={e => { e.stopPropagation(); setLightboxIdx(i => i !== null ? Math.max(0, i - 1) : null); }}
            disabled={lightboxIdx === 0}
            className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div onClick={e => e.stopPropagation()} className="max-w-4xl max-h-[90vh] flex flex-col items-center gap-4">
            <img
              src={photosApi.getPhotoUrl(photos[lightboxIdx].id)}
              alt={photos[lightboxIdx].caption || 'Memory'}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            {(photos[lightboxIdx].caption || photos[lightboxIdx].date) && (
              <div className="text-center">
                {photos[lightboxIdx].caption && <p className="text-white font-medium">{photos[lightboxIdx].caption}</p>}
                <p className="text-gray-400 text-sm">{photos[lightboxIdx].date}</p>
              </div>
            )}
            <div className="text-gray-400 text-sm">{lightboxIdx + 1} / {photos.length}</div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); setLightboxIdx(i => i !== null ? Math.min(photos.length - 1, i + 1) : null); }}
            disabled={lightboxIdx === photos.length - 1}
            className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-30 transition-all"
          >
            <ChevronRight size={24} />
          </button>
          <button onClick={() => setLightboxIdx(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white">
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
