import { useState, useEffect, useCallback } from 'react';
import { Heart } from 'lucide-react';
import PrivateAuth from './PrivateAuth';
import { momentsApi } from '../../lib/api';
import toast from 'react-hot-toast';
import { differenceInDays, format } from 'date-fns';

interface Moment {
  id: string;
  title: string;
  description: string;
  date: string;
  caption: string;
  type: string;
  hasPhoto: boolean;
}

interface Anniversary {
  day: number;
  month: number;
  year: number;
  message: string;
  configured: boolean;
}

function AnniversaryBanner({ anniversary }: { anniversary: Anniversary }) {
  if (!anniversary.configured || !anniversary.month || !anniversary.year) return null;

  const now = new Date();
  const thisYear = now.getFullYear();

  // Find next anniversary date
  let annDate = new Date(thisYear, anniversary.month - 1, anniversary.day);
  if (annDate < now) annDate = new Date(thisYear + 1, anniversary.month - 1, anniversary.day);

  const daysUntil = differenceInDays(annDate, now);
  const isToday2 = daysUntil === 0;

  return (
    <div className={`rounded-2xl p-6 mb-8 text-white text-center ${isToday2 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}>
      <div className="text-4xl mb-3">{'💕'}</div>
      {isToday2 ? (
        <>
          <h3 className="text-2xl font-bold mb-2">Happy Anniversary! 🎉</h3>
          <p className="text-white/90">{anniversary.message || "Today is our special day!"}</p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-1">Anniversary Countdown</h3>
          <div className="text-5xl font-bold my-3">{daysUntil}</div>
          <p className="text-white/90">days until our special day — {format(annDate, 'do MMMM yyyy')}</p>
          {anniversary.message && <p className="text-white/80 text-sm mt-3 italic">"{anniversary.message}"</p>}
        </>
      )}
    </div>
  );
}

export default function SpecialMoments() {
  const [authenticated, setAuthenticated] = useState(false);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [anniversary, setAnniversary] = useState<Anniversary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [momentsRes, annRes] = await Promise.all([
        momentsApi.getAll(),
        momentsApi.getAnniversary(),
      ]);
      setMoments(momentsRes.data);
      setAnniversary(annRes.data);
    } catch {
      toast.error('Failed to load moments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  if (!authenticated) {
    return (
      <PrivateAuth
        sectionId="moments"
        sectionName="Special Moments"
        gradientClass="from-amber-500 to-orange-500"
        onAuthenticated={() => setAuthenticated(true)}
      />
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Heart size={28} className="text-amber-200" />
            <div>
              <h1 className="text-2xl font-bold">Special Moments</h1>
              <p className="text-amber-200 text-sm">{moments.length} memories in our timeline</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Anniversary banner */}
        {anniversary && <AnniversaryBanner anniversary={anniversary} />}

        {/* Timeline */}
        {loading ? (
          <div className="space-y-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex gap-6">
                <div className="skeleton w-12 h-12 rounded-full"></div>
                <div className="card flex-1 p-5 space-y-2">
                  <div className="skeleton h-5 w-40"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : moments.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Heart size={56} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500">No special moments added yet</p>
            <p className="text-sm mt-2">Add memories through the admin panel to build your timeline.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-orange-300 opacity-40"></div>
            <div className="space-y-8">
              {moments.map((moment) => (
                <div key={moment.id} className="flex gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-lg shadow-lg z-10 shrink-0">
                    {moment.type === 'anniversary' ? '💕' : moment.type === 'birthday' ? '🎂' : moment.type === 'travel' ? '✈️' : '✨'}
                  </div>
                  <div className="card p-5 flex-1 hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-start gap-3">
                      {moment.hasPhoto && (
                        <img
                          src={momentsApi.getPhotoUrl(moment.id)}
                          alt={moment.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-amber-600 font-semibold">{moment.date}</span>
                        </div>
                        <h3 className="font-bold text-navy text-lg mb-1">{moment.title}</h3>
                        {moment.caption && <p className="text-amber-600 text-sm italic mb-2">{moment.caption}</p>}
                        {moment.description && <p className="text-gray-500 text-sm leading-relaxed">{moment.description}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
