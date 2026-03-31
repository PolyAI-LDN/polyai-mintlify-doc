export const Quiz = ({ questions = [] }) => {
  const [selected, setSelected] = useState({});
  const [resetCount, setResetCount] = useState(0);

  const letters = ['A', 'B', 'C', 'D'];

  const handleSelect = (qIdx, optIdx) => {
    if (selected[qIdx] !== undefined) return;
    setSelected((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleReset = () => {
    setSelected({});
    setResetCount((c) => c + 1);
  };

  if (!questions?.length) return null;

  const getOptionClasses = ({ hasAnswered, isThisCorrect, isThisSelected }) => {
    if (!hasAnswered) {
      return {
        btn: 'flex w-full items-center gap-3 py-2.5 px-4 rounded-xl text-sm leading-normal transition-all duration-150 text-left border cursor-pointer border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-800',
        badge: 'w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 leading-none transition-all duration-150 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
        icon: null,
      };
    }

    if (isThisCorrect) {
      return {
        btn: 'flex w-full items-center gap-3 py-2.5 px-4 rounded-xl text-sm leading-normal transition-all duration-150 text-left border cursor-default border-green-400 bg-green-50 text-green-900 font-medium dark:border-green-600 dark:bg-green-900 dark:text-green-100',
        badge: 'w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 leading-none transition-all duration-150 bg-green-500 text-white',
        icon: (
          <svg className="shrink-0 w-4 h-4 text-green-500 dark:text-green-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ),
      };
    }

    if (isThisSelected) {
      return {
        btn: 'flex w-full items-center gap-3 py-2.5 px-4 rounded-xl text-sm leading-normal transition-all duration-150 text-left border cursor-default border-red-400 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-900 dark:text-red-100',
        badge: 'w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 leading-none transition-all duration-150 bg-red-500 text-white',
        icon: (
          <svg className="shrink-0 w-4 h-4 text-red-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
      };
    }

    return {
      btn: 'flex w-full items-center gap-3 py-2.5 px-4 rounded-xl text-sm leading-normal transition-all duration-150 text-left border cursor-default border-gray-100 bg-white text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-600',
      badge: 'w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 leading-none transition-all duration-150 bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600',
      icon: null,
    };
  };

  return (
    <div key={resetCount} className="my-6">
      {questions.map((q, qIdx) => {
        const answer = selected[qIdx];
        const hasAnswered = answer !== undefined;
        const isCorrect = answer === q.correct;

        return (
          <div key={String(qIdx)} className="mb-8">
            <p className="flex items-start gap-2.5 font-semibold text-sm mb-3 mt-0 leading-relaxed text-gray-900 dark:text-gray-100">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-xs font-bold shrink-0 mt-px leading-none">
                {qIdx + 1}
              </span>
              {q.q}
            </p>

            <div className="flex flex-col gap-2">
              {q.options.map((opt, i) => {
                const isThisCorrect = i === q.correct;
                const isThisSelected = i === answer;
                const { btn, badge, icon } = getOptionClasses({
                  hasAnswered,
                  isThisCorrect,
                  isThisSelected,
                });

                return (
                  <button
                    key={String(i)}
                    type="button"
                    onClick={() => handleSelect(qIdx, i)}
                    className={btn}
                  >
                    <span className={badge}>{letters[i]}</span>
                    <span className="flex-1">{opt}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {hasAnswered ? (
              <div className={`mt-3 py-3 pl-4 pr-3.5 rounded-r-xl text-sm leading-relaxed border-l-4 ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-500' : 'border-red-500 bg-red-50 dark:bg-red-900 dark:border-red-500'}`}>
                <span className={`font-semibold ${isCorrect ? '!text-green-800 dark:!text-green-200' : '!text-red-800 dark:!text-red-200'}`}>
                  {isCorrect ? 'Correct.' : 'Not quite.'}
                </span>{' '}
                <span className="!text-gray-700 dark:!text-gray-300">{q.explanation}</span>
              </div>
            ) : null}
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleReset}
        className="mt-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 cursor-pointer transition-colors duration-150"
      >
        Reset quiz
      </button>
    </div>
  );
};
