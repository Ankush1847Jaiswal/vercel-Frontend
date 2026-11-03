import { useState, useEffect, useCallback } from 'react';
import { Lock, CheckCircle, RotateCcw, Shield, ArrowRight } from 'lucide-react';
import { privateAuthApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Props {
  sectionId: string;
  sectionName: string;
  gradientClass?: string;
  onAuthenticated: () => void;
}

type Phase = 'idle' | 'asking' | 'success' | 'error';

interface QuestionState {
  question: string;
  questionNumber: number;
  totalQuestions: number;
}

export default function PrivateAuth({ sectionId, sectionName, gradientClass = 'from-purple-600 to-indigo-600', onAuthenticated }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentQuestion, setCurrentQuestion] = useState<QuestionState | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [alreadyAuthenticated, setAlreadyAuthenticated] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    privateAuthApi.status(sectionId).then(res => {
      if (res.data.authenticated) {
        setAlreadyAuthenticated(true);
        onAuthenticated();
      }
    }).catch(() => {});
  }, [sectionId, onAuthenticated]);

  const startAuth = useCallback(async () => {
    setLoading(true);
    setPhase('asking');
    setAnswer('');
    try {
      const res = await privateAuthApi.start(sectionId);
      if (res.data.authenticated) {
        setAlreadyAuthenticated(true);
        onAuthenticated();
        return;
      }
      setCurrentQuestion({
        question: res.data.question,
        questionNumber: res.data.questionNumber,
        totalQuestions: res.data.totalQuestions,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to start authentication. Please try again.');
      setPhase('idle');
    } finally {
      setLoading(false);
    }
  }, [sectionId, onAuthenticated]);

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please enter an answer.');
      return;
    }
    setLoading(true);
    try {
      const res = await privateAuthApi.answer(sectionId, answer.trim());
      if (res.data.authenticated) {
        setPhase('success');
        setTimeout(() => {
          onAuthenticated();
        }, 1200);
        return;
      }
      if (res.data.correct) {
        // Move to next question
        setCurrentQuestion({
          question: res.data.question,
          questionNumber: res.data.questionNumber,
          totalQuestions: res.data.totalQuestions,
        });
        setAnswer('');
        toast.success(`✓ Correct! Question ${res.data.questionNumber - 1} of ${res.data.totalQuestions} answered.`);
      }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Incorrect answer. Please try again.';
      if (err.response?.data?.resetRequired) {
        // Wrong answer — reset
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setTimeout(() => {
          setPhase('idle');
          setCurrentQuestion(null);
          setAnswer('');
        }, 700);
        toast.error('Incorrect answer. Authentication reset — please start again.');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) submitAnswer();
  };

  if (alreadyAuthenticated) return null;

  if (phase === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4 animate-bounce-slow" />
          <h2 className="text-2xl font-bold text-navy mb-2">Access Granted!</h2>
          <p className="text-gray-500">Opening {sectionName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-50">
      <div className={`w-full max-w-md ${shake ? 'shake' : ''}`}>
        {/* Lock icon header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mx-auto mb-4 shadow-xl`}>
            <Lock size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-navy">{sectionName}</h2>
          <p className="text-gray-500 text-sm mt-2">This section is private. Complete all 5 challenges to gain access.</p>
        </div>

        {phase === 'idle' && (
          <div className="card p-8 text-center">
            <div className="flex justify-center gap-1 mb-6">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                  {i + 1}
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              You will be presented with <strong>5 personal questions</strong> in random order. All must be answered correctly to unlock this section.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700 mb-6">
              <Shield size={14} className="inline mr-1.5" />
              Questions and validation happen on the server. Answers are never stored in your browser.
            </div>
            <button
              onClick={startAuth}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${gradientClass} shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2`}
            >
              {loading ? 'Starting...' : <><Lock size={16} /> Begin Authentication</>}
            </button>
          </div>
        )}

        {phase === 'asking' && currentQuestion && (
          <div className="card p-8 animate-slide-up">
            {/* Progress */}
            <div className="flex justify-center gap-1.5 mb-6">
              {Array(currentQuestion.totalQuestions).fill(0).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i < currentQuestion.questionNumber - 1
                      ? 'bg-green-500 w-8'
                      : i === currentQuestion.questionNumber - 1
                      ? `bg-gradient-to-r ${gradientClass} w-8`
                      : 'bg-gray-200 w-6'
                  }`}
                />
              ))}
            </div>
            <div className="text-center mb-6">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Challenge {currentQuestion.questionNumber} of {currentQuestion.totalQuestions}
              </span>
            </div>

            <div className={`p-4 rounded-xl bg-gradient-to-br ${gradientClass} bg-opacity-10 mb-6 text-center`}>
              <p className="font-bold text-navy text-lg">{currentQuestion.question}</p>
            </div>

            <div className="space-y-4">
              <input
                id={`auth-answer-${sectionId}`}
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your answer..."
                autoFocus
                autoComplete="off"
                className="input-field text-center text-lg font-medium"
                disabled={loading}
              />
              <button
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
                className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${gradientClass} shadow-md disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg transition-all`}
              >
                {loading ? 'Checking...' : <>Submit Answer <ArrowRight size={16} /></>}
              </button>
              <button
                onClick={() => { setPhase('idle'); setCurrentQuestion(null); setAnswer(''); }}
                className="w-full text-gray-400 text-sm hover:text-gray-600 flex items-center justify-center gap-1 py-2"
              >
                <RotateCcw size={13} /> Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
