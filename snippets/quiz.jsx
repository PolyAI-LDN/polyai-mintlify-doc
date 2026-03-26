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
                  btnClass += 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-200 font-semibold cursor-default';
                  letterClass += 'bg-green-600 dark:bg-green-500 text-white';
                } else if (isThisSelected) {
                  btnClass += 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-200 cursor-default';
                  letterClass += 'bg-red-600 dark:bg-red-500 text-white';
                } else {
                  btnClass += 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default';
                  letterClass += 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400';
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
                ? 'mt-3 py-2.5 px-3.5 rounded-md text-sm leading-normal bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-500/40 text-green-700 dark:text-green-300'
                : 'mt-3 py-2.5 px-3.5 rounded-md text-sm leading-normal bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300'
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
