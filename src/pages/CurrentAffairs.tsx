import { useState, useEffect } from 'react';
import { upscApi } from '../lib/api';
import { Newspaper, Globe, TrendingUp, Building, BookOpen, Lightbulb, Filter, ArrowRight } from 'lucide-react';

const categories = ['All', 'National', 'International', 'Economy', 'Governance', 'Science & Tech', 'Environment'];

const categoryIcons: Record<string, React.ReactNode> = {
  National: <Building size={14} />,
  International: <Globe size={14} />,
  Economy: <TrendingUp size={14} />,
  Governance: <Building size={14} />,
  'Science & Tech': <Lightbulb size={14} />,
  Environment: <BookOpen size={14} />,
};

interface CurrentAffair {
  id: string; title: string; date: string; category: string; summary: string;
}

export default function CurrentAffairs() {
  const [items, setItems] = useState<CurrentAffair[]>([]);
  const [filtered, setFiltered] = useState<CurrentAffair[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    upscApi.getCurrentAffairs().then(res => {
      setItems(res.data);
      setFiltered(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') setFiltered(items);
    else setFiltered(items.filter(i => i.category === activeCategory));
  }, [activeCategory, items]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <Newspaper size={28} className="text-blue-300" />
            <h1 className="text-3xl font-bold">Current Affairs</h1>
          </div>
          <p className="text-blue-200 text-lg">Stay updated with UPSC-relevant news and analysis</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Daily articles', value: 'Feed needed' },
              { label: 'Study topics', value: '6' },
              { label: 'Monthly issues', value: 'Not connected' },
              { label: 'Editorials', value: 'Not connected' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-blue-200 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
          <Filter size={16} className="text-gray-400 shrink-0" />
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Items grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => (
                <div key={i} className="card p-5 space-y-3">
                  <div className="skeleton h-5 w-full"></div>
                  <div className="skeleton h-4 w-4/5"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-3/4"></div>
                </div>
              ))
            : filtered.map(item => (
                <div key={item.id} className="card p-5 hover:shadow-card-hover transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="tag bg-blue-50 text-blue-600 flex items-center gap-1">
                      {categoryIcons[item.category] || <Globe size={12} />}
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-navy text-base leading-snug mb-2 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{item.summary}</p>
                  <button className="flex items-center gap-1 text-blue-600 text-sm font-medium mt-3 hover:gap-2 transition-all">
                    Read More <ArrowRight size={14} />
                  </button>
                </div>
              ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-500">
            <Newspaper size={48} className="mx-auto mb-3 opacity-30" />
            <p>No articles found for this category.</p>
          </div>
        )}

        {/* Monthly Compilations */}
        <div className="mt-12">
          <h2 className="section-title mb-6">Monthly Current Affairs Compilations</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[].map((month) => (
              <div key={month} className="card p-4 text-center hover:shadow-card-hover transition-all duration-200 cursor-pointer border border-blue-100 hover:border-blue-300">
                <div className="text-3xl mb-2">📅</div>
                <div className="font-semibold text-navy">{month}</div>
                <div className="text-xs text-gray-500 mt-1">Current Affairs PDF</div>
                <span className="mt-3 text-gray-400 text-sm">File not connected</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
            💡 <strong>Note:</strong> PDF downloads require backend integration with file storage. Connect your file server to enable downloads.
          </p>
        </div>

        {/* Editorial Section */}
        <div className="mt-12 bg-gradient-to-r from-navy to-navy-light rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Editorial Analysis</h2>
          <p className="text-gray-300 mb-6">Editorial summaries will appear here after a verified news source is connected.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {([] as Array<{paper: string; topic: string; date: string}>).map(ed => (
              <div key={ed.topic} className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors cursor-pointer">
                <div className="text-saffron text-xs font-semibold mb-1">{ed.paper} • {ed.date}</div>
                <div className="font-medium text-sm">{ed.topic}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-300 mt-4">No verified editorial summaries are configured yet. Connect a trusted source and add citations before publication.</p>
        </div>
      </div>
    </div>
  );
}
