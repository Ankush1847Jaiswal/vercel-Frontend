import { useState, useEffect } from 'react';
import { upscApi } from '../lib/api';
import { ClipboardList, CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Clock, Target } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  subject: string;
  difficulty: string;
}

const subjects = ['All', 'Polity', 'History', 'Geography', 'Economy', 'Science & Tech', 'Environment'];

export default function MockTests() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [activeSubject, setActiveSubject] = useState('All');
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins
  const [timerActive, setTimerActive] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimerActive(false);
  };

  useEffect(() => {
    if (!timerActive || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft, submitted]);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const subj = activeSubject === 'All' ? undefined : activeSubject;
      const res = await upscApi.getMockQuestions(subj, 10);
      setQuestions(res.data);
      setSelectedOptions({});
      setSubmitted(false);
      setCurrentIdx(0);
      setTimeLeft(res.data.length * 60);
      setQuizStarted(true);
      setTimerActive(true);
    } catch {
      // Use sample questions
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qId: string, optionIdx: number) => {
    if (submitted) return;
    setSelectedOptions(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleReset = () => {
    setQuizStarted(false);
    setQuestions([]);
    setSelectedOptions({});
    setSubmitted(false);
    setTimeLeft(600);
  };

  const score = submitted
    ? questions.filter(q => selectedOptions[q.id] === q.correct).length
    : 0;

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (!quizStarted) {
    return (
      <div className="animate-fade-in">
        <div className="bg-gradient-to-r from-green-700 to-emerald-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-3">
              <ClipboardList size={28} className="text-green-300" />
              <h1 className="text-3xl font-bold">Mock Tests & Practice</h1>
            </div>
            <p className="text-green-200 text-lg">UPSC-style questions with detailed explanations</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '📝', label: 'Prelims Style', desc: 'MCQ-based questions matching UPSC pattern' },
              { icon: '⏱️', label: 'Timed Tests', desc: 'Practice with real exam time pressure' },
              { icon: '💡', label: 'Explanations', desc: 'Detailed answers with source references' },
            ].map(f => (
              <div key={f.label} className="card p-5 text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <div className="font-bold text-navy mb-1">{f.label}</div>
                <div className="text-gray-500 text-sm">{f.desc}</div>
              </div>
            ))}
          </div>

          <div className="card p-8">
            <h2 className="text-xl font-bold text-navy mb-6">Start a Mock Test</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
              <div className="flex flex-wrap gap-2">
                {subjects.map(s => (
                  <button
                    key={s}
                    onClick={() => setActiveSubject(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeSubject === s ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6 text-center">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-700">10</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-700">10 min</div>
                <div className="text-sm text-gray-600">Time Limit</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-700">+2 / -⅔</div>
                <div className="text-sm text-gray-600">Marking</div>
              </div>
            </div>

            <button onClick={startQuiz} disabled={loading} className="btn-primary w-full text-base py-3 flex items-center justify-center gap-2">
              {loading ? 'Loading Questions...' : '🚀 Start Test Now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
        <div className="card p-8 text-center mb-8">
          <Trophy size={56} className={`mx-auto mb-4 ${pct >= 60 ? 'text-yellow-500' : 'text-gray-400'}`} />
          <h2 className="text-2xl font-bold text-navy mb-2">Test Completed!</h2>
          <div className="text-6xl font-bold text-saffron mb-1">{score}/{questions.length}</div>
          <div className="text-gray-500 mb-4">Score: {pct}%</div>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
            pct >= 70 ? 'bg-green-100 text-green-700' : pct >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
          }`}>
            {pct >= 70 ? '🎉 Excellent!' : pct >= 50 ? '👍 Good effort!' : '📚 Keep practicing!'}
          </div>
          <button onClick={handleReset} className="btn-primary mt-6 flex items-center gap-2 mx-auto">
            <RotateCcw size={16} /> Take Another Test
          </button>
        </div>

        <h3 className="text-xl font-bold text-navy mb-4">Review Answers</h3>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const userAns = selectedOptions[q.id];
            const isCorrect = userAns === q.correct;
            return (
              <div key={q.id} className={`card p-5 border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-400'}`}>
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" /> : <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Q{i + 1} • {q.subject} • {q.difficulty}</div>
                    <div className="font-semibold text-navy">{q.question}</div>
                  </div>
                </div>
                <div className="space-y-2 ml-8">
                  {q.options.map((opt, idx) => (
                    <div key={idx} className={`px-3 py-2 rounded-lg text-sm ${
                      idx === q.correct ? 'bg-green-50 text-green-700 font-medium border border-green-200' :
                      idx === userAns && !isCorrect ? 'bg-red-50 text-red-600 border border-red-200' : 'text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </div>
                  ))}
                </div>
                <div className="mt-3 ml-8 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  💡 {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const answered = Object.keys(selectedOptions).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-600">Question {currentIdx + 1} of {questions.length}</div>
          <div className={`flex items-center gap-1.5 text-sm font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-navy'}`}>
            <Clock size={16} /> {formatTime(timeLeft)}
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-saffron rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
        </div>
        <div className="flex gap-1 mt-2">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                selectedOptions[q.id] !== undefined ? 'bg-green-500' : i === currentIdx ? 'bg-saffron' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="tag bg-green-50 text-green-700">{currentQ.subject}</span>
          <span className="tag bg-gray-100 text-gray-600">{currentQ.difficulty}</span>
        </div>
        <h2 className="text-lg font-bold text-navy mb-6 leading-snug">{currentQ.question}</h2>
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(currentQ.id, idx)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 font-medium text-sm ${
                selectedOptions[currentQ.id] === idx
                  ? 'border-saffron bg-orange-50 text-saffron'
                  : 'border-gray-200 hover:border-saffron/50 hover:bg-orange-50/30 text-gray-700'
              }`}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-medium disabled:opacity-40 hover:border-saffron transition-all"
        >
          Previous
        </button>
        <div className="text-sm text-gray-500">{answered}/{questions.length} answered</div>
        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}
            className="btn-primary flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-secondary flex items-center gap-2">
            <Target size={16} /> Submit Test
          </button>
        )}
      </div>
    </div>
  );
}
