import { useState } from 'react';
import { BookOpen, FileText, ChevronDown, ChevronRight, Download, Target, CheckCircle, Calendar } from 'lucide-react';

const prelimsTopics = [
  { subject: 'History', topics: ['Ancient India', 'Medieval India', 'Modern India', 'World History', 'Art & Culture'] },
  { subject: 'Geography', topics: ['Indian Geography', 'World Geography', 'Physical Geography', 'Economic Geography', 'Environment'] },
  { subject: 'Polity', topics: ['Constitution', 'Governance', 'Political System', 'Panchayati Raj', 'Public Policy'] },
  { subject: 'Economy', topics: ['Indian Economy', 'Economic Development', 'Budgeting', 'Banking', 'International Trade'] },
  { subject: 'Science & Tech', topics: ['Physics', 'Chemistry', 'Biology', 'Space Technology', 'Defence Technology'] },
  { subject: 'Environment', topics: ['Biodiversity', 'Climate Change', 'Environmental Laws', 'Conservation', 'Ecology'] },
  { subject: 'Current Affairs', topics: ['National Affairs', 'International Affairs', 'Government Schemes', 'Awards', 'Reports & Indices'] },
];

const mainsGS = [
  { paper: 'GS Paper I', topics: ['Indian Heritage & Culture', 'History & Geography', 'World History', 'Indian Society', 'Salient features of World Geography'] },
  { paper: 'GS Paper II', topics: ['Governance', 'Constitution', 'Polity', 'Social Justice', 'International Relations'] },
  { paper: 'GS Paper III', topics: ['Technology', 'Economic Development', 'Bio-diversity', 'Environment', 'Security & Disaster Management'] },
  { paper: 'GS Paper IV', topics: ['Ethics & Integrity', 'Aptitude', 'Emotional Intelligence', 'Public Administration', 'Governance Ethics'] },
];

const studyPlan = [
  { month: 'Month 1-2', focus: 'NCERT Foundation', tasks: ['Complete all NCERTs Std 6-12', 'History: Ancient & Medieval India', 'Geography: India & World'] },
  { month: 'Month 3-4', focus: 'Standard Books', tasks: ['Polity: Laxmikanth', 'Economy: Ramesh Singh', 'Environment: Shankar IAS'] },
  { month: 'Month 5-6', focus: 'Current Affairs', tasks: ['Daily newspaper reading', 'Monthly CA compilation', 'Government schemes study'] },
  { month: 'Month 7-8', focus: 'Revision + Tests', tasks: ['Subject-wise revision', 'Mock tests daily', 'Answer writing practice'] },
];

export default function Syllabus() {
  const [expandedPrelims, setExpandedPrelims] = useState<string | null>('History');
  const [expandedMains, setExpandedMains] = useState<string | null>('GS Paper I');
  const [activeTab, setActiveTab] = useState<'prelims' | 'mains' | 'planner' | 'optional'>('prelims');

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <Calendar size={28} className="text-purple-300" />
            <h1 className="text-3xl font-bold">Syllabus & Study Planner</h1>
          </div>
          <p className="text-purple-200 text-lg">Complete UPSC syllabus with structured study plans</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { key: 'prelims', label: 'Prelims Syllabus' },
            { key: 'mains', label: 'Mains Syllabus' },
            { key: 'optional', label: 'Optional Subjects' },
            { key: 'planner', label: 'Study Planner' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`shrink-0 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Prelims */}
        {activeTab === 'prelims' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title text-xl">Prelims Syllabus (GS Paper I & CSAT)</h2>
                <button disabled title="Connect document storage to enable downloads" className="btn-outline text-sm py-2 flex items-center gap-2 opacity-50 cursor-not-allowed">
                  <Download size={14} /> PDF not connected
                </button>
              </div>
              {prelimsTopics.map(item => (
                <div key={item.subject} className="card border border-gray-200">
                  <button
                    onClick={() => setExpandedPrelims(expandedPrelims === item.subject ? null : item.subject)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-semibold text-navy">{item.subject}</span>
                    {expandedPrelims === item.subject ? <ChevronDown size={18} className="text-saffron" /> : <ChevronRight size={18} className="text-gray-400" />}
                  </button>
                  {expandedPrelims === item.subject && (
                    <div className="px-4 pb-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-slide-down">
                      {item.topics.map(topic => (
                        <div key={topic} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                          <CheckCircle size={14} className="text-green-500 shrink-0" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="card p-5 bg-orange-50 border border-orange-200">
                <h3 className="font-bold text-navy mb-3 flex items-center gap-2"><Target size={16} className="text-saffron" /> Prelims Pattern</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Paper I (GS)', value: '100 questions, 200 marks' },
                    { label: 'Paper II (CSAT)', value: '80 questions, 200 marks' },
                    { label: 'Duration', value: '2 hours each' },
                    { label: 'Negative Marking', value: '1/3 for wrong answer' },
                    { label: 'CSAT', value: 'Qualifying (33% cutoff)' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between border-b border-orange-100 pb-1">
                      <span className="text-gray-600">{row.label}</span>
                      <span className="font-medium text-navy">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-5">
                <h3 className="font-bold text-navy mb-3">Recommended Books</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {['Laxmikanth — Polity', 'Shankar IAS — Environment', 'Ramesh Singh — Economy', 'NCERT 6-12 (All subjects)', 'Spectrum — Modern History'].map(b => (
                    <li key={b} className="flex items-center gap-2">
                      <BookOpen size={12} className="text-saffron shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Mains */}
        {activeTab === 'mains' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title text-xl">Mains Syllabus (GS Papers I-IV)</h2>
              <button disabled title="Connect document storage to enable downloads" className="btn-outline text-sm py-2 flex items-center gap-2 opacity-50 cursor-not-allowed"><Download size={14} /> PDF not connected</button>
            </div>
            {mainsGS.map(paper => (
              <div key={paper.paper} className="card border border-gray-200">
                <button
                  onClick={() => setExpandedMains(expandedMains === paper.paper ? null : paper.paper)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div>
                    <div className="font-bold text-navy">{paper.paper}</div>
                  </div>
                  {expandedMains === paper.paper ? <ChevronDown size={18} className="text-purple-600" /> : <ChevronRight size={18} className="text-gray-400" />}
                </button>
                {expandedMains === paper.paper && (
                  <div className="px-4 pb-4 grid sm:grid-cols-2 gap-2 animate-slide-down">
                    {paper.topics.map(t => (
                      <div key={t} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg text-sm text-purple-700">
                        <CheckCircle size={14} className="text-purple-500 shrink-0" />
                        {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="card p-5 bg-purple-50 border border-purple-200 mt-4">
              <h3 className="font-bold text-navy mb-3">Mains Exam Pattern</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  { p: 'Essay Paper', m: '250 marks, 3 hours' },
                  { p: 'GS Paper I', m: '250 marks, 3 hours' },
                  { p: 'GS Paper II', m: '250 marks, 3 hours' },
                  { p: 'GS Paper III', m: '250 marks, 3 hours' },
                  { p: 'GS Paper IV', m: '250 marks, 3 hours' },
                  { p: 'Optional Paper I & II', m: '500 marks total' },
                ].map(r => (
                  <div key={r.p} className="flex justify-between bg-white rounded-lg px-3 py-2">
                    <span className="text-gray-600">{r.p}</span>
                    <span className="font-semibold text-purple-700">{r.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Optional */}
        {activeTab === 'optional' && (
          <div>
            <h2 className="section-title text-xl mb-6">Optional Subjects</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {['Public Administration', 'Sociology', 'History', 'Geography', 'Political Science', 'Philosophy', 'Psychology', 'Anthropology', 'Economics', 'Hindi Literature', 'English Literature', 'Law', 'Mathematics', 'Physics', 'Chemistry', 'Botany', 'Zoology', 'Agriculture', 'Medical Science', 'Electrical Engineering', 'Civil Engineering', 'Mechanical Engineering', 'Commerce & Accountancy', 'Management'].map(sub => (
                <div key={sub} className="card p-4 text-center hover:border-saffron border border-transparent transition-all cursor-pointer">
                  <FileText size={24} className="text-saffron mx-auto mb-2" />
                  <div className="font-medium text-navy text-sm">{sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
              💡 Choose your optional subject based on your academic background, interest, and available resources. Optional papers carry 500 marks (2 × 250).
            </div>
          </div>
        )}

        {/* Planner */}
        {activeTab === 'planner' && (
          <div>
            <h2 className="section-title text-xl mb-6">12-Month Study Planner</h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-saffron to-purple-500"></div>
              <div className="space-y-8">
                {studyPlan.map((phase, i) => (
                  <div key={phase.month} className="flex gap-6 relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron to-primary-700 text-white flex items-center justify-center font-bold text-xs text-center shrink-0 shadow-lg z-10">
                      {i + 1}
                    </div>
                    <div className="card p-5 flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-xs text-saffron font-semibold uppercase tracking-wide">{phase.month}</div>
                          <div className="font-bold text-navy text-lg">{phase.focus}</div>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {phase.tasks.map(task => (
                          <li key={task} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle size={14} className="text-green-500 shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 card p-6 bg-gradient-to-r from-saffron to-primary-700 text-white">
              <h3 className="text-xl font-bold mb-2">Daily Study Checklist</h3>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {['Morning newspaper (1 hour)', 'Subject study (4 hours)', 'Current affairs notes (30 min)', 'Previous year question practice (1 hour)', 'Answer writing (1 hour)', 'Revision (30 min)'].map(task => (
                  <div key={task} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-sm">
                    <CheckCircle size={14} className="text-orange-200" />
                    {task}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
