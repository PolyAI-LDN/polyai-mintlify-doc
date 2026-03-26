export const Quiz = ({ questions = [] }) => {
  const [selected, setSelected] = useState({});
  const [resetCount, setResetCount] = useState(0);

  var letters = ['A', 'B', 'C', 'D'];

  var handleSelect = (qIdx, optIdx) => {
    if (selected[qIdx] !== undefined) return;
    setSelected((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  var handleReset = () => {
    setSelected({});
    setResetCount((c) => c + 1);
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div key={resetCount} className="my-5">
      <style>{`
        .dark .quiz-btn-correct {
          background-color: rgba(20, 83, 45, 0.35) !important;
          border-color: #4ade80 !important;
          color: #bbf7d0 !important;
        }
        .dark .quiz-btn-wrong {
          background-color: rgba(127, 29, 29, 0.35) !important;
          border-color: #f87171 !important;
          color: #fecaca !important;
        }
        .dark .quiz-btn-dimmed {
          background-color: #1f2937 !important;
          border-color: #374151 !important;
          color: #6b7280 !important;
        }
        .dark .quiz-letter-correct {
          background-color: #22c55e !important;
          color: #fff !important;
        }
        .dark .quiz-letter-wrong {
          background-color: #ef4444 !important;
          color: #fff !important;
        }
        .dark .quiz-letter-dimmed {
          background-color: #374151 !important;
          color: #9ca3af !important;
        }
        .dark .quiz-explanation-correct {
          background-color: rgba(20, 83, 45, 0.35) !important;
          border-color: rgba(74, 222, 128, 0.4) !important;
          color: #86efac !important;
        }
        .dark .quiz-explanation-wrong {
          background-color: rgba(127, 29, 29, 0.35) !important;
          border-color: rgba(248, 113, 113, 0.4) !important;
          color: #fca5a5 !important;
        }
      `}</style>
      {questions.map((q, qIdx) => {
        var answer = selected[qIdx];
        var hasAnswered = answer !== undefined;
        var isCorrect = answer === q.correct;

        return (
          <div key={String(qIdx)} className="mb-7">
            <p className="font-semibold text-sm mb-3 mt-0 leading-normal text-gray-900 dark:text-gray-100">
              {qIdx + 1}. {q.q}
            </p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, i) => {
                var isThisCorrect = i === q.correct;
                var isThisSelected = i === answer;

                var btnClass = 'flex items-start gap-2.5 py-2 px-3.5 rounded-md text-sm leading-normal transition-all w-full text-left box-border border ';
                var letterClass = 'min-w-5 h-5 rounded text-xs font-bold flex items-center justify-center shrink-0 mt-px transition-all ';

                if (!hasAnswered) {
                  btnClass += 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:border-gray-300 dark:hover:border-gray-500';
                  letterClass += 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400';
                } else if (isThisCorrect) {
                  btnClass += 'quiz-btn-correct border-green-400 bg-green-50 text-green-900 font-semibold cursor-default';
                  letterClass += 'quiz-letter-correct bg-green-600 text-white';
                } else if (isThisSelected) {
                  btnClass += 'quiz-btn-wrong border-red-400 bg-red-50 text-red-900 cursor-default';
                  letterClass += 'quiz-letter-wrong bg-red-600 text-white';
                } else {
                  btnClass += 'quiz-btn-dimmed border-gray-100 bg-white text-gray-400 cursor-default';
                  letterClass += 'quiz-letter-dimmed bg-gray-100 text-gray-500';
                }

                return (
                  <button
                    key={String(i)}
                    onClick={() => handleSelect(qIdx, i)}
                    className={btnClass}
                  >
                    <span className={letterClass}>
                      {letters[i]}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {hasAnswered ? (
              <div className={isCorrect
                ? 'quiz-explanation-correct mt-3 py-2.5 px-3.5 rounded-md text-sm leading-normal bg-green-50 border border-green-200 text-green-700'
                : 'quiz-explanation-wrong mt-3 py-2.5 px-3.5 rounded-md text-sm leading-normal bg-red-50 border border-red-200 text-red-700'
              }>
                <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {q.explanation}
              </div>
            ) : null}
          </div>
        );
      })}
      <button
        onClick={handleReset}
        className="mt-1 py-1.5 px-4 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs cursor-pointer font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Reset quiz
      </button>
    </div>
  );
};
