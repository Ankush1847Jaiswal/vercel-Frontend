import { BookOpen, FileText } from 'lucide-react';

const materials = [
  {
    category: 'Prelims Preparation',
    id: 'prelims',
    icon: '📚',
    color: 'from-orange-400 to-red-500',
    items: [
      { title: 'Indian Polity — M. Laxmikanth Notes', type: 'PDF Notes', pages: '180 pages', updated: 'Planned catalog' },
      { title: 'Indian Economy — Ramesh Singh Summary', type: 'PDF Notes', pages: '160 pages', updated: 'Planned catalog' },
      { title: 'Environment & Ecology — Shankar IAS', type: 'PDF Notes', pages: '120 pages', updated: 'Planned catalog' },
      { title: 'Modern History — Spectrum Notes', type: 'PDF Notes', pages: '200 pages', updated: 'Planned catalog' },
    ],
  },
  {
    category: 'Mains Preparation',
    id: 'mains',
    icon: '✍️',
    color: 'from-purple-400 to-indigo-500',
    items: [
      { title: 'GS Paper I — History & Culture Notes', type: 'PDF Notes', pages: '250 pages', updated: 'Planned catalog' },
      { title: 'GS Paper II — Polity & IR Notes', type: 'PDF Notes', pages: '220 pages', updated: 'Planned catalog' },
      { title: 'GS Paper III — Economy & Technology', type: 'PDF Notes', pages: '190 pages', updated: 'Planned catalog' },
      { title: 'GS Paper IV — Ethics Casebook', type: 'PDF Notes', pages: '150 pages', updated: 'Planned catalog' },
    ],
  },
  {
    category: 'General Studies',
    id: 'gs',
    icon: '🎓',
    color: 'from-green-400 to-emerald-500',
    items: [
      { title: 'Ancient India — Complete Study Material', type: 'PDF Notes', pages: '130 pages', updated: 'Planned catalog' },
      { title: 'Physical Geography — India & World', type: 'PDF Notes', pages: '110 pages', updated: 'Planned catalog' },
      { title: 'Indian Society — Key Topics', type: 'PDF Notes', pages: '90 pages', updated: 'Planned catalog' },
      { title: 'Science & Technology 2024', type: 'PDF Notes', pages: '80 pages', updated: 'Planned catalog' },
    ],
  },
  {
    category: 'NCERT Materials',
    id: 'ncert',
    icon: '📖',
    color: 'from-blue-400 to-cyan-500',
    items: [
      { title: 'NCERT History 6-12 — Summary Notes', type: 'Summary', pages: '200 pages', updated: 'Planned catalog' },
      { title: 'NCERT Geography 6-12 — Compiled', type: 'Summary', pages: '180 pages', updated: 'Planned catalog' },
      { title: 'NCERT Polity — Class 9-12 Notes', type: 'Summary', pages: '120 pages', updated: 'Planned catalog' },
      { title: 'NCERT Economics — Compiled Notes', type: 'Summary', pages: '100 pages', updated: 'Planned catalog' },
    ],
  },
  {
    category: 'Previous Year Papers',
    id: 'pyq',
    icon: '📄',
    color: 'from-yellow-400 to-amber-500',
    items: [
      { title: 'UPSC Prelims PYQ 2019-2024', type: 'Question Bank', pages: '300 questions', updated: 'Planned catalog' },
      { title: 'UPSC Mains GS PYQ 2010-2024', type: 'Question Bank', pages: '500 questions', updated: 'Planned catalog' },
      { title: 'Prelims PYQ Solved — With Explanation', type: 'Solved Paper', pages: '400 pages', updated: 'Planned catalog' },
    ],
  },
  {
    category: 'Answer Writing',
    id: 'answer-writing',
    icon: '🖊️',
    color: 'from-pink-400 to-rose-500',
    items: [
      { title: 'UPSC Mains Answer Writing Guide', type: 'Guide', pages: '80 pages', updated: 'Planned catalog' },
      { title: 'Model Answers — GS I & II', type: 'Model Answers', pages: '150 pages', updated: 'Planned catalog' },
      { title: 'Ethics Case Studies with Model Answers', type: 'Model Answers', pages: '100 pages', updated: 'Planned catalog' },
    ],
  },
];

export default function StudyMaterials() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-saffron to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={28} className="text-orange-200" />
            <h1 className="text-3xl font-bold">Study Materials</h1>
          </div>
          <p className="text-orange-100 text-lg">Subject-wise catalog for Prelims and Mains</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'PDF Notes', value: '500+' },
              { label: 'Subjects', value: '15+' },
              { label: 'PYQs', value: '2000+' },
              { label: 'Updated', value: 'Monthly' },
            ].map(s => (
              <div key={s.label} className="bg-white/15 rounded-xl p-3 text-center">
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-orange-200 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {materials.map(section => (
          <div key={section.category} id={section.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-2xl shadow-md`}>
                {section.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">{section.category}</h2>
                <p className="text-gray-500 text-sm">{section.items.length} resources available</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {section.items.map(item => (
                <div key={item.title} className="card p-5 hover:shadow-card-hover transition-all duration-300 group">
                  <FileText size={32} className="text-gray-300 mb-3 group-hover:text-saffron transition-colors" />
                  <h3 className="font-semibold text-navy text-sm leading-snug mb-3">{item.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="tag bg-gray-100 text-gray-600">{item.type}</span>
                    <span className="tag bg-orange-50 text-saffron">{item.pages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Updated: {item.updated}</span>
                    <span className="text-xs text-gray-400" title="Connect a document store to enable downloads">File not connected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-700">
          <strong>📌 Note:</strong> PDF downloads will be enabled once file storage is configured. Connect your backend file server to serve these documents. All listed materials represent the planned content catalog.
        </div>
      </div>
    </div>
  );
}
