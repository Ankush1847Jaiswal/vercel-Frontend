import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Newspaper, ClipboardList, TrendingUp, ArrowRight,
  Star, Target, Award, ChevronRight, Play, Zap,
  Calendar, Globe, Shield
} from 'lucide-react';
import { upscApi } from '../lib/api';

interface Announcement {
  id: string; title: string; date: string; category: string; content: string; pinned: boolean;
}
interface CurrentAffair {
  id: string; title: string; date: string; category: string; summary: string;
}

const subjectCards = [
  { name: 'History', icon: '🏛️', color: 'bg-amber-50 border-amber-200', count: '240+ Topics' },
  { name: 'Geography', icon: '🌍', color: 'bg-blue-50 border-blue-200', count: '180+ Topics' },
  { name: 'Polity', icon: '⚖️', color: 'bg-purple-50 border-purple-200', count: '160+ Topics' },
  { name: 'Economy', icon: '📊', color: 'bg-green-50 border-green-200', count: '200+ Topics' },
  { name: 'Science', icon: '🔬', color: 'bg-red-50 border-red-200', count: '140+ Topics' },
  { name: 'Environment', icon: '🌿', color: 'bg-emerald-50 border-emerald-200', count: '120+ Topics' },
];

const stats = [
  { label: 'Exam stages', value: 'Prelims + Mains', icon: <BookOpen size={22} className="text-saffron" /> },
  { label: 'Practice set', value: '5 questions', icon: <ClipboardList size={22} className="text-saffron" /> },
  { label: 'Current affairs', value: 'Feed needed', icon: <Newspaper size={22} className="text-saffron" /> },
  { label: 'Study planner', value: 'Available', icon: <TrendingUp size={22} className="text-saffron" /> },
];

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annRes, caRes] = await Promise.all([
          upscApi.getAnnouncements(),
          upscApi.getCurrentAffairs(),
        ]);
        setAnnouncements(annRes.data.slice(0, 4));
        setCurrentAffairs(caRes.data.slice(0, 4));
      } catch {
        // Use fallback data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-saffron blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6 border border-white/20">
                <Zap size={14} className="text-saffron" />
                <span>A focused space for UPSC preparation</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Your Journey to
                <span className="text-saffron block mt-1">Civil Services</span>
                Starts Here
              </h1>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Explore the Civil Services syllabus, browse a subject-wise study catalog, and practise UPSC-style questions for Prelims and Mains.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/study-materials" className="btn-primary flex items-center gap-2 text-base">
                  Start Preparing <ArrowRight size={18} />
                </Link>
                <Link to="/mock-tests" className="flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-white/30 hover:border-white/60 font-semibold transition-all text-base">
                  <Play size={18} />
                  Take Free Test
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8">
                {[
                  { value: 'Prelims', label: 'Objective stage' },
                  { value: 'Mains', label: 'Written stage' },
                  { value: 'Interview', label: 'Personality test' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-bold text-saffron">{s.value}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero stats card */}
            <div className="hidden lg:block">
              <div className="glass-card rounded-2xl p-6 text-gray-800">
                <h3 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-saffron" />
                  Today's Study Highlights
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Prelims', count: 'General Studies and CSAT', icon: '📰', color: 'bg-blue-50' },
                    { label: 'Mains', count: 'Essay and four GS papers', icon: '⚖️', color: 'bg-purple-50' },
                    { label: 'Practice', count: 'Try a sample question set', icon: '📝', color: 'bg-orange-50' },
                    { label: 'Revision', count: 'Plan regular review sessions', icon: '📖', color: 'bg-green-50' },
                  ].map((item) => (
                    <div key={item.label} className={`${item.color} rounded-xl p-3 flex items-center gap-3`}>
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-navy text-sm">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.count}</div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-saffron/10 rounded-xl border border-saffron/20">
                  <div className="text-xs font-semibold text-saffron uppercase tracking-wide mb-1">Official exam calendar</div>
                  <div className="text-sm font-bold text-navy">Check the latest UPSC schedule</div>
                  <a href="https://upsc.gov.in/examinations/exam-calendar" target="_blank" rel="noreferrer" className="text-xs text-saffron underline mt-1 inline-block">Open UPSC exam calendar</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  {s.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-navy">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Announcements + Current Affairs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Announcements */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="section-title text-xl">Latest Announcements</h2>
                  <p className="text-gray-500 text-sm mt-1">UPSC notifications & updates</p>
                </div>
                <Link to="/study-materials" className="text-saffron text-sm font-medium hover:underline flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {loading
                  ? Array(3).fill(0).map((_, i) => (
                      <div key={i} className="card p-4 space-y-2">
                        <div className="skeleton h-4 w-3/4"></div>
                        <div className="skeleton h-3 w-full"></div>
                        <div className="skeleton h-3 w-1/2"></div>
                      </div>
                    ))
                  : announcements.length ? announcements.map((a) => (
                      <div key={a.id} className="card p-4 hover:border-l-4 hover:border-saffron transition-all duration-200 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 mt-0.5">
                            {a.pinned ? (
                              <Star size={16} className="text-saffron fill-saffron" />
                            ) : (
                              <Shield size={16} className="text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-navy text-sm leading-tight">{a.title}</h3>
                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{a.content}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="tag bg-orange-50 text-saffron">{a.category}</span>
                              <span className="text-xs text-gray-400">{a.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) : <div className="card p-5 text-sm text-gray-500">Official notices are not connected yet. Add verified UPSC announcements in the admin area before publishing them here.</div>}
              </div>
            </div>

            {/* Current Affairs */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="section-title text-xl">Current Affairs</h2>
                  <p className="text-gray-500 text-sm mt-1">Latest news for UPSC prep</p>
                </div>
                <Link to="/current-affairs" className="text-saffron text-sm font-medium hover:underline flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {loading
                  ? Array(4).fill(0).map((_, i) => (
                      <div key={i} className="card p-4 space-y-2">
                        <div className="skeleton h-4 w-3/4"></div>
                        <div className="skeleton h-3 w-full"></div>
                      </div>
                    ))
                  : currentAffairs.length ? currentAffairs.map((item) => (
                      <div key={item.id} className="card p-4 hover:border-l-4 hover:border-blue-400 transition-all duration-200 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <Globe size={16} className="text-blue-500 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-navy text-sm leading-tight">{item.title}</h3>
                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.summary}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="tag bg-blue-50 text-blue-600">{item.category}</span>
                              <span className="text-xs text-gray-400">{item.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) : <div className="card p-5 text-sm text-gray-500">A verified current-affairs feed has not been connected yet. Connect a trusted source before publishing daily updates.</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subject Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title">Study by Subject</h2>
            <p className="section-subtitle">Topic-wise comprehensive notes for all UPSC subjects</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjectCards.map((subj) => (
              <Link
                key={subj.name}
                to="/study-materials"
                className={`card p-4 text-center border ${subj.color} hover:scale-105 transition-all duration-200 cursor-pointer`}
              >
                <div className="text-3xl mb-2">{subj.icon}</div>
                <div className="font-semibold text-navy text-sm">{subj.name}</div>
                <div className="text-xs text-gray-500 mt-1">{subj.count}</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/study-materials" className="btn-primary inline-flex items-center gap-2">
              Explore All Materials <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-br from-navy via-navy-light to-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Everything You Need to Crack UPSC</h2>
            <p className="text-gray-400">Structured preparation resources designed by toppers and experts</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <BookOpen size={28} />, title: 'Study Materials', desc: 'Topic-wise notes, NCERT summaries, and subject-wise resources', href: '/study-materials', color: 'from-orange-400 to-red-400' },
              { icon: <Newspaper size={28} />, title: 'Current Affairs', desc: 'Daily updates, editorials, and monthly compilations', href: '/current-affairs', color: 'from-blue-400 to-cyan-400' },
              { icon: <ClipboardList size={28} />, title: 'Mock Tests', desc: 'Prelims-style MCQs with detailed explanations', href: '/mock-tests', color: 'from-green-400 to-emerald-400' },
              { icon: <Target size={28} />, title: 'Study Planner', desc: 'Structured timetables and progress trackers', href: '/syllabus', color: 'from-purple-400 to-indigo-400' },
            ].map((feat) => (
              <Link key={feat.title} to={feat.href} className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 hover:border-saffron/30 transition-all duration-300 h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                    {feat.icon}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{feat.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
                  <div className="flex items-center gap-1 text-saffron text-sm mt-4 font-medium">
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Resources */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h2 className="section-title mb-3">Featured Study Resources</h2>
              <p className="text-gray-500 mb-6">Browse the planned subject-wise catalog. Downloadable files can be added from the owner dashboard when storage is connected.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: 'Indian Polity Complete Notes', subject: 'Polity', pages: '180 pages', icon: '⚖️' },
                  { title: 'Modern History Comprehensive Guide', subject: 'History', pages: '220 pages', icon: '🏛️' },
                  { title: 'Indian Geography Atlas Notes', subject: 'Geography', pages: '150 pages', icon: '🌍' },
                  { title: 'Economy for UPSC — Complete', subject: 'Economy', pages: '200 pages', icon: '📊' },
                ].map((res) => (
                  <div key={res.title} className="card p-4 flex items-start gap-3 hover:border-saffron/30 border border-transparent transition-all duration-200">
                    <div className="text-2xl">{res.icon}</div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-navy text-sm leading-tight">{res.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="tag bg-gray-100 text-gray-600 text-xs">{res.subject}</span>
                        <span className="text-xs text-gray-400">{res.pages}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/study-materials" className="btn-primary mt-6 inline-flex items-center gap-2">
                View All Resources <ArrowRight size={16} />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-saffron to-primary-700 rounded-2xl p-6 text-white text-center">
              <Award size={48} className="mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-3">Start Your UPSC Journey Today</h3>
              <p className="text-orange-100 text-sm mb-6 leading-relaxed">
                Join thousands of aspirants preparing for the most prestigious examination in India.
              </p>
              <Link to="/syllabus" className="bg-white text-saffron px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all block">
                View Study Plan
              </Link>
              <div className="mt-4 text-xs text-orange-200">
                100% Free • No Registration Required
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
