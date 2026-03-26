export const Quiz = ({ questions = [] }) => {
  const [selected, setSelected] = useState({});
  const [resetCount, setResetCount] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const check = () => setIsDark(root.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

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

  // Dark/light color sets
  var colors = {
    unanswered: {
      btn: isDark
        ? { background: '#1f2937', borderColor: '#4b5563', color: '#e5e7eb' }
        : {},
      letter: isDark
        ? { background: '#374151', color: '#9ca3af' }
        : {},
    },
    correct: {
      btn: isDark
        ? { background: 'rgba(20, 83, 45, 0.3)', borderColor: '#4ade80', color: '#bbf7d0' }
        : {},
      letter: isDark
        ? { background: '#22c55e', color: '#fff' }
        : {},
    },
    wrong: {
      btn: isDark
        ? { background: 'rgba(127, 29, 29, 0.3)', borderColor: '#f87171', color: '#fecaca' }
        : {},
      letter: isDark
        ? { background: '#ef4444', color: '#fff' }
        : {},
    },
    dimmed: {
      btn: isDark
        ? { background: '#1f2937', borderColor: '#374151', color: '#6b7280' }
        : {},
      letter: isDark
        ? { background: '#374151', color: '#9ca3af' }
        : {},
    },
    explanationCorrect: isDark
      ? { background: 'rgba(20, 83, 45, 0.3)', borderColor: 'rgba(74, 222, 128, 0.4)', color: '#86efac' }
      : {},
    explanationWrong: isDark
      ? { background: 'rgba(127, 29, 29, 0.3)', borderColor: 'rgba(248, 113, 113, 0.4)', color: '#fca5a5' }
      : {},
    resetBtn: isDark
      ? { background: '#1f2937', borderColor: '#4b5563', color: '#9ca3af' }
      : {},
    questionText: isDark
      ? { color: '#f3f4f6' }
      : {},
  };

  return (
    <div key={resetCount} className="my-5">
      {questions.map((q, qIdx) => {
        var answer = selected[qIdx];
        var hasAnswered = answer !== undefined;
        var isCorrect = answer === q.correct;

        return (
          <div key={String(qIdx)} className="mb-7">
            <p
              className="font-semibold text-sm mb-3 mt-0 leading-normal text-gray-900"
              style={colors.questionText}
            >
              {qIdx + 1}. {q.q}
            </p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, i) => {
                var isThisCorrect = i === q.correct;
                var isThisSelected = i === answer;

                var btnBase = 'flex items-start gap-2.5 py-2 px-3.5 rounded-md text-sm leading-normal transition-all w-full text-left box-border border ';
                var letterBase = 'min-w-5 h-5 rounded text-xs font-bold flex items-center justify-center shrink-0 mt-px transition-all ';

                var btnClass, letterClass, btnStyle, letterStyle;

                if (!hasAnswered) {
                  btnClass = btnBase + 'border-gray-200 bg-white text-gray-700 cursor-pointer hover:border-gray-300';
                  letterClass = letterBase + 'bg-gray-100 text-gray-500';
                  btnStyle = colors.unanswered.btn;
                  letterStyle = colors.unanswered.letter;
                } else if (isThisCorrect) {
                  btnClass = btnBase + 'border-green-500 bg-green-50 text-green-900 font-semibold cursor-default';
                  letterClass = letterBase + 'bg-green-600 text-white';
                  btnStyle = colors.correct.btn;
                  letterStyle = colors.correct.letter;
                } else if (isThisSelected) {
                  btnClass = btnBase + 'border-red-500 bg-red-50 text-red-900 cursor-default';
                  letterClass = letterBase + 'bg-red-600 text-white';
                  btnStyle = colors.wrong.btn;
                  letterStyle = colors.wrong.letter;
                } else {
                  btnClass = btnBase + 'border-gray-100 bg-white text-gray-400 cursor-default';
                  letterClass = letterBase + 'bg-gray-100 text-gray-500';
                  btnStyle = colors.dimmed.btn;
                  letterStyle = colors.dimmed.letter;
                }

                return (
                  <button
                    key={String(i)}
                    onClick={() => handleSelect(qIdx, i)}
                    className={btnClass}
                    style={btnStyle}
                  >
                    <span className={letterClass} style={letterStyle}>
                      {letters[i]}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {hasAnswered ? (
              <div
                className={isCorrect
                  ? 'mt-3 py-2.5 px-3.5 rounded-md text-sm leading-normal bg-green-50 border border-green-200 text-green-700'
                  : 'mt-3 py-2.5 px-3.5 rounded-md text-sm leading-normal bg-red-50 border border-red-200 text-red-700'
                }
                style={isCorrect ? colors.explanationCorrect : colors.explanationWrong}
              >
                <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {q.explanation}
              </div>
            ) : null}
          </div>
        );
      })}
      <button
        onClick={handleReset}
        className="mt-1 py-1.5 px-4 rounded-md border border-gray-200 bg-gray-50 text-gray-500 text-xs cursor-pointer font-medium hover:bg-gray-100"
        style={colors.resetBtn}
      >
        Reset quiz
      </button>
    </div>
  );
};
