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

  const currentModule = LEARNING_MODULES.find((m) => m.id === selectedModuleId) || LEARNING_MODULES[0];
  const currentLesson = currentModule.lessons.find((l) => l.id === selectedLessonId) || currentModule.lessons[0];

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    sound.playClick();
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2b40]">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-teal-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Cybersecurity Curriculum & Analyst Quizzes
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structured modules covering SQL security, network protocols, defensive containment, and ethical hacking.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <span>Quizzes Solved: {Object.keys(solvedQuizzes).length}</span>
        </div>
      </div>

      {/* 2-Column Split: Module Navigation & Lesson Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Modules & Lessons Hierarchy (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          {LEARNING_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-3.5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 font-bold">
                  {mod.track}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {mod.lessons.length} Lessons
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-200">
                {mod.title}
              </h3>

              <div className="space-y-1 pt-1">
                {mod.lessons.map((lesson) => {
                  const isSelected = lesson.id === currentLesson.id;
                  const isSolved = Boolean(solvedQuizzes[lesson.quiz.id]);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(mod.id, lesson.id)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 font-semibold'
                          : 'text-slate-300 hover:bg-[#131f30]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isSolved ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">
                        {lesson.level.slice(0, 3)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Lesson Reader & Interactive Quiz (8 cols) */}
        <div className="md:col-span-8 space-y-5">
          {/* Lesson Header Card */}
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#182638]">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-bold">
                  {currentLesson.level}
                </span>
                <h2 className="text-lg font-bold text-white mt-1.5">
                  {currentLesson.title}
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {currentLesson.duration}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentLesson.summary}
            </p>

            {/* Key Concepts */}
            <div className="bg-[#080d14] rounded-lg p-3.5 border border-[#182638] space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Key Analytical Takeaways:
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {currentLesson.keyConcepts.map((concept, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">✓</span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Snippet if applicable */}
            {currentLesson.codeSnippet && (
              <div className="bg-[#05080e] rounded-lg p-3 border border-[#182638] font-mono text-xs text-cyan-300 overflow-x-auto">
                <pre>{currentLesson.codeSnippet}</pre>
              </div>
            )}
          </div>

          {/* Interactive Lesson Quiz */}
          <div className="bg-[#0e1724] border border-[#1b2b40] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#182638]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Knowledge Check Challenge</span>
              </h3>
              <span className="text-xs font-mono text-amber-400 font-bold">
                +{currentLesson.quiz.xpReward} XP Reward
              </span>
            </div>

            <p className="text-xs font-semibold text-white">
              {currentLesson.quiz.question}
            </p>

            <div className="space-y-2">
              {currentLesson.quiz.options.map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = idx === currentLesson.quiz.correctIndex;
                let optStyle = 'bg-[#080d14] border-[#1b2b40] text-slate-300 hover:bg-[#121f30]';

                if (quizSubmitted) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                  } else if (isSelected) {
                    optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-cyan-950/70 border-cyan-500 text-cyan-200';
                }

                return (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => {
                      sound.playClick();
                      setSelectedQuizOption(idx);
                    }}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center gap-2.5 ${optStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-[10px] shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={selectedQuizOption === null}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <span>Verify Answer</span>
              </button>
            ) : (
              <div
                className={`p-3 rounded-lg border text-xs leading-relaxed ${
                  selectedQuizOption === currentLesson.quiz.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800 text-rose-200'
                }`}
              >
                <div className="font-bold mb-1">
                  {selectedQuizOption === currentLesson.quiz.correctIndex
                    ? '✓ Correct Answer!'
                    : '✗ Incorrect Solution'}
                </div>
                <div>{currentLesson.quiz.explanation}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
