import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Code2,
  Award,
  Sparkles,
  Clock,
  ChevronRight,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import { LearningModule, LearningLesson } from '../types';
import { LEARNING_MODULES } from '../data/cyberData';
import { sound } from '../utils/audio';

interface LearningPathsProps {
  onEarnXp: (xp: number) => void;
  solvedQuizzes: Record<string, boolean>;
  onSolveQuiz: (quizId: string) => void;
}

export const LearningPaths: React.FC<LearningPathsProps> = ({
  onEarnXp,
  solvedQuizzes,
  onSolveQuiz,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(LEARNING_MODULES[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LEARNING_MODULES[0].lessons[0].id);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');

  const currentModule = LEARNING_MODULES.find((m) => m.id === selectedModuleId) || LEARNING_MODULES[0];
  const currentLessonIndex = currentModule.lessons.findIndex((l) => l.id === selectedLessonId);
  const currentLesson = currentModule.lessons[currentLessonIndex] || currentModule.lessons[0];

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    sound.playClick();
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setActiveTab('content');
  };

  const handleSubmitQuiz = () => {
    if (selectedQuizOption === null) return;
    sound.playClick();
    setQuizSubmitted(true);

    const isCorrect = selectedQuizOption === currentLesson.quiz.correctIndex;
    if (isCorrect) {
      sound.playSuccess();
      if (!solvedQuizzes[currentLesson.quiz.id]) {
        onSolveQuiz(currentLesson.quiz.id);
        onEarnXp(currentLesson.quiz.xpReward);
      }
    } else {
      sound.playAlert();
    }
  };

  const handleNextLesson = () => {
    sound.playClick();
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      const nextLesson = currentModule.lessons[currentLessonIndex + 1];
      handleSelectLesson(currentModule.id, nextLesson.id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* CodeMaster Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <GraduationCap className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Cybersecurity Academic Curriculum
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Structured analyst modules · Hands-on assessments · Knowledge verification
              </p>
            </div>
          </div>
        </div>

        {/* Tab switch between lesson reading & quiz assessment */}
        <div className="flex items-center gap-1 bg-[#0a1019] p-1 rounded-xl border border-[#1e2f47] text-xs">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('content');
            }}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'content'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Lesson Guide
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('quiz');
            }}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz Assessment</span>
            {solvedQuizzes[currentLesson.quiz.id] && (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* 2-Column Split: Curriculum Modules on Left, Interactive Workspace on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Course Navigation Tree (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {LEARNING_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="bg-[#0e1724] border border-[#1b2b40] rounded-2xl p-4 space-y-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 font-bold">
                  {mod.track}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {mod.lessons.length} Lessons
                </span>
              </div>
              <h3 className="text-xs font-bold text-white">
                {mod.title}
              </h3>

              <div className="space-y-1.5 pt-1">
                {mod.lessons.map((lesson, idx) => {
                  const isSelected = lesson.id === currentLesson.id;
                  const isSolved = Boolean(solvedQuizzes[lesson.quiz.id]);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(mod.id, lesson.id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/70 border border-cyan-500/50 text-white font-bold shadow-sm'
                          : 'text-slate-300 hover:bg-[#121f30]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="w-5 h-5 rounded-md bg-[#0a121e] border border-[#1b2b40] flex items-center justify-center font-mono text-[10px] text-slate-400 shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      {isSolved && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right: CodeMaster Lesson / Quiz Stage (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {activeTab === 'content' ? (
            /* Lesson Guide View */
            <div className="bg-[#0e1724] border border-[#1b2b40] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#182638]">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                    {currentLesson.level} · {currentLesson.duration}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                    {currentLesson.title}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('quiz');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  <span>Start Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                <p>{currentLesson.summary}</p>
              </div>

              {/* Analytical Highlights */}
              <div className="bg-[#080d14] rounded-xl p-4 sm:p-5 border border-[#182638] space-y-3">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Core Architectural Concepts:
                </span>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-2">
                  {currentLesson.keyConcepts.map((concept, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-cyan-400 font-bold mt-0.5">✓</span>
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code Snippet Box */}
              {currentLesson.codeSnippet && (
                <div className="bg-[#05080e] rounded-xl p-4 border border-[#182638] font-mono text-xs text-cyan-300 overflow-x-auto">
                  <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-wide">
                    SECURE IMPLEMENTATION PATTERN:
                  </div>
                  <pre>{currentLesson.codeSnippet}</pre>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-[#182638] flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Lesson {currentLessonIndex + 1} of {currentModule.lessons.length}
                </span>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('quiz');
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  <span>Proceed to Knowledge Check</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* CodeMaster Signature Quiz Screen */
            <div className="bg-[#0e1724] border border-[#1b2b40] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Quiz Header & Progress Bar */}
              <div className="space-y-3 pb-4 border-b border-[#182638]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                      KNOWLEDGE CHECK
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Question {currentLessonIndex + 1} of {currentModule.lessons.length}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{currentLesson.quiz.xpReward} XP Bounty
                  </span>
                </div>

                <div className="w-full bg-[#142336] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentLessonIndex + 1) / currentModule.lessons.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Statement */}
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentLesson.quiz.question}
              </h2>

              {/* Multiple Choice Option Cards (CodeMaster Style) */}
              <div className="space-y-3">
                {currentLesson.quiz.options.map((opt, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === currentLesson.quiz.correctIndex;
                  let optStyle =
                    'bg-[#080d14] border-[#1b2b40] text-slate-200 hover:bg-[#111e2f] hover:border-cyan-500/50';

                  if (quizSubmitted) {
                    if (isCorrect) {
                      optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500';
                    } else if (isSelected) {
                      optStyle = 'bg-rose-950/60 border-rose-500 text-rose-100 ring-1 ring-rose-500';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-cyan-950/80 border-cyan-500 text-cyan-100 ring-1 ring-cyan-500';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={quizSubmitted}
                      onClick={() => {
                        sound.playClick();
                        setSelectedQuizOption(idx);
                      }}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[#142234] border border-[#213550] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>

                      {quizSubmitted && isCorrect && (
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {quizSubmitted && isSelected && !isCorrect && (
                        <X className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action / Evaluation Drawer */}
              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={selectedQuizOption === null}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md disabled:opacity-40"
                >
                  Verify Solution
                </button>
              ) : (
                <div
                  className={`p-4 rounded-xl border space-y-3 ${
                    selectedQuizOption === currentLesson.quiz.correctIndex
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-800 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm flex items-center gap-2">
                      {selectedQuizOption === currentLesson.quiz.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Correct Solution! (+{currentLesson.quiz.xpReward} XP)</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 text-rose-400" />
                          <span>Review Required</span>
                        </>
                      )}
                    </span>

                    {currentLessonIndex < currentModule.lessons.length - 1 && (
                      <button
                        onClick={handleNextLesson}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#142338] hover:bg-[#1a2d48] text-white text-xs font-bold rounded-lg border border-[#203652]"
                      >
                        <span>Next Lesson</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentLesson.quiz.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
