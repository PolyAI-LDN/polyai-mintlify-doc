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
        btn: 'flex w-full items-start gap-2.5 py-2 px-3.5 rounded-md text-sm leading-normal transition-all text-left box-border border cursor-pointer border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500',
        letter:
          'min-w-5 h-5 rounded text-xs font-bold flex items-center justify-center shrink-0 mt-px transition-all bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
      };
    }

    if (isThisCorrect) {
      return {
        btn: 'flex w-full items-start gap-2.5 py-2 px-3.5 rounded-md text-sm leading-normal transition-all text-left box-border border cursor-default border-green-600 bg-green-50 text-black font-semibold',
        letter:
          'min-w-5 h-5 rounded text-xs font-bold flex items-center justify-center shrink-0 mt-px transition-all bg-green-600 text-white',
      };
    }

    if (isThisSelected) {
      return {
        btn: 'flex w-full items-start gap-2.5 py-2 px-3.5 rounded-md text-sm leading-normal transition-all text-left box-border border cursor-default border-red-600 bg-red-50 text-black',
        letter:
          'min-w-5 h-5 rounded text-xs font-bold flex items-center justify-center shrink-0 mt-px transition-all bg-red-600 text-white',
      };
    }

    return {
      btn: 'flex w-full items-start gap-2.5 py-2 px-3.5 rounded-md text-sm leading-normal transition-all text-left box-border border cursor-default border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500',
      letter:
        'min-w-5 h-5 rounded text-xs font-bold flex items-center justify-center shrink-0 mt-px transition-all bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500',
    };
  };

  const getExplanationClasses = (isCorrect) =>
    isCorrect
      ? 'mt-3 py-2.5 px-3.5 rounded-md text-sm leading-normal border bg-green-50 border-green-200 text-black'
      : 'mt-3 py-2.5 px-3.5 rounded-md text-sm leading-normal border bg-red-50 border-red-200 text-black';

  return (
    <div key={resetCount} className="my-5">
      {questions.map((q, qIdx) => {
        const answer = selected[qIdx];
        const hasAnswered = answer !== undefined;
        const isCorrect = answer === q.correct;

        return (
          <div key={String(qIdx)} className="mb-7">
            <p className="font-semibold text-sm mb-3 mt-0 leading-normal text-gray-900 dark:text-gray-100">
              {qIdx + 1}. {q.q}
            </p>

            <div className="flex flex-col gap-2">
              {q.options.map((opt, i) => {
                const isThisCorrect = i === q.correct;
                const isThisSelected = i === answer;
                const { btn, letter } = getOptionClasses({
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
                    <span className={letter}>{letters[i]}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {hasAnswered ? (
              <div className={getExplanationClasses(isCorrect)}>
                <span className="font-semibold !text-black">{isCorrect ? 'Correct.' : 'Not quite.'}</span>{' '}<span className="!text-black">{q.explanation}</span>
              </div>
            ) : null}
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleReset}
        className="mt-1 py-1.5 px-4 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs cursor-pointer font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Reset quiz
      </button>
    </div>
  );
};
