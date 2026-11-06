import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Camera, Mail, FileText, BookOpen, Plus, Shield } from 'lucide-react';
import { upscApi } from '../lib/api';
import { privateAuthApi } from '../lib/api';

interface Section {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  camera: <Camera size={28} />,
  mail: <Mail size={28} />,
  heart: <FileText size={28} />,
  book: <BookOpen size={28} />,
  lock: <Lock size={28} />,
  plus: <Plus size={28} />,
};

const routeMap: Record<string, string> = {
  photos: '/notes/photos',
  letters: '/notes/letters',
  moments: '/notes/moments',
  diary: '/notes/diary',
};

const gradientMap: Record<string, string> = {
  photos: 'from-rose-400 to-pink-600',
  letters: 'from-violet-400 to-purple-600',
  moments: 'from-amber-400 to-orange-500',
  diary: 'from-teal-400 to-emerald-600',
};

export default function Notes() {
  const [sections, setSections] = useState<Section[]>([]);
  const [authStatus, setAuthStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When visiting the main Notes directory, automatically lock all sections
    privateAuthApi.lockAll().catch(() => {});

    const fetchSections = async () => {
      try {
        const res = await upscApi.getPrivateSections();
        setSections(res.data);
        setAuthStatus({});
      } catch {
        // Fallback sections
        setSections([
          { id: 'photos', name: 'Photos', description: 'A private photo gallery', icon: 'camera' },
          { id: 'letters', name: 'Messages', description: 'Private digital messages', icon: 'mail' },
          { id: 'moments', name: 'Documents', description: 'Meaningful records and documents', icon: 'heart' },
          { id: 'diary', name: 'Articles', description: 'Private articles and notes', icon: 'book' },
        ]);
        setAuthStatus({});
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  return (
    <div className="animate-fade-in min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-purple-400 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-400 blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6">
            <Lock size={36} className="text-purple-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Private Notes</h1>
          <p className="text-purple-200 text-lg max-w-xl mx-auto leading-relaxed">
            Private study archive and records. Each section requires completing verification challenges before access is granted.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-purple-300">
            <Shield size={16} />
            <span>Server-side verification • Session-based security • Auto-locks when leaving section</span>
          </div>
        </div>
      </div>

      {/* Sections grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 gap-6">
          {loading
            ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="card p-6 space-y-4">
                <div className="skeleton h-16 w-16 rounded-2xl"></div>
                <div className="skeleton h-5 w-48"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-10 w-32 rounded-lg"></div>
              </div>
            ))
            : sections.map((section) => {
              const isAuthenticated = authStatus[section.id] || false;
              const route = routeMap[section.id] || `/notes/${section.id}`;
              const gradient = gradientMap[section.id] || 'from-gray-400 to-gray-600';

              return (
                <div key={section.id} className="card p-6 hover:shadow-card-hover transition-all duration-300 group relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {iconMap[section.icon] || <Lock size={28} />}
                    </div>

                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-navy">{section.name}</h3>
                      <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        isAuthenticated
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isAuthenticated ? (
                          <span>Unlocked</span>
                        ) : (
                          <span className="flex items-center gap-1"><Lock size={12} /> Locked</span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm mb-5 leading-relaxed">{section.description}</p>

                    <div className="flex items-center gap-3">
                      <Link
                        to={route}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                          isAuthenticated
                            ? `bg-gradient-to-r ${gradient} text-white shadow-md hover:shadow-lg hover:scale-105`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isAuthenticated ? (
                          <>Open Section</>
                        ) : (
                          <><Lock size={14} /> Authenticate &amp; Enter</>
                        )}
                      </Link>
                      {isAuthenticated && (
                        <button
                          onClick={async () => {
                            await privateAuthApi.lock(section.id);
                            setAuthStatus(prev => ({ ...prev, [section.id]: false }));
                          }}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                          Lock
                        </button>
                      )}
                    </div>

                    {!isAuthenticated && (
                      <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                        <Shield size={11} />
                        Requires authentication verification
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Info box */}
        <div className="mt-8 p-5 bg-purple-50 border border-purple-200 rounded-2xl">
          <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <Shield size={16} />
            How Authentication Works
          </h3>
          <ul className="text-sm text-purple-700 space-y-1.5">
            <li>- Each section requires answering all challenges correctly in sequence</li>
            <li>- Questions are verified on the server — answers are never stored in the browser</li>
            <li>- Automatic re-locking: leaving any section immediately locks it</li>
            <li>- Each section is independently secured</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
