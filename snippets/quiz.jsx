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

  return (
    <div key={resetCount} className="my-5">
      {questions.map((q, qIdx) => {
        const answer = selected[qIdx];
        const hasAnswered = answer !== undefined;
        const isCorrect = answer === q.correct;

        return (
          <div key={qIdx} className="mb-7">
            <p className="mt-0 mb-3 text-sm font-semibold leading-normal text-gray-900 dark:text-gray-100">
              {qIdx + 1}. {q.q}
            </p>

            <div className="flex flex-col gap-2">
              {q.options.map((opt, i) => {
                const isThisCorrect = i === q.correct;
                const isThisSelected = i === answer;

                let btnClass =
                  'flex w-full items-start gap-2.5 rounded-md border px-3.5 py-2 text-left text-sm leading-normal transition-all box-border ';
                let letterClass =
                  'mt-px flex h-5 min-w-5 shrink-0 items-center justify-center rounded text-xs font-bold transition-all ';

                if (!hasAnswered) {
                  btnClass +=
                    'cursor-pointer border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-gray-600';
                  letterClass +=
                    'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
                } else if (isThisCorrect) {
                  btnClass +=
                    'cursor-default border-green-400 bg-green-50 text-green-900 font-semibold dark:border-green-700 dark:bg-green-950 dark:text-green-100';
                  letterClass +=
                    'bg-green-600 text-white dark:bg-green-500 dark:text-white';
                } else if (isThisSelected) {
                  btnClass +=
                    'cursor-default border-red-400 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-950 dark:text-red-100';
                  letterClass +=
                    'bg-red-600 text-white dark:bg-red-500 dark:text-white';
                } else {
                  btnClass +=
                    'cursor-default border-gray-100 bg-white text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500';
                  letterClass +=
                    'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500';
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(qIdx, i)}
                    className={btnClass}
                  >
                    <span className={letterClass}>{letters[i]}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <div
                className={
                  isCorrect
                    ? 'mt-3 rounded-md border border-green-200 bg-green-50 px-3.5 py-2.5 text-sm leading-normal text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-100'
                    : 'mt-3 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm leading-normal text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-100'
                }
              >
                <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleReset}
        className="mt-1 rounded-md border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        Reset quiz
      </button>
    </div>
  );
};
