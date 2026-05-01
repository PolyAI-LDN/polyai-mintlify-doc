export const Challenge = ({ scenario, hints = [], solution }) => {
  const [revealed, setRevealed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="my-6 rounded-xl border-2 border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950 overflow-hidden">
      <div className="flex items-center gap-2 px-5 pt-4 pb-0">
        <svg
          className="w-4 h-4 shrink-0 text-violet-500 dark:text-violet-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest text-violet-500 dark:text-violet-400">
          Challenge
        </span>
      </div>

      <p className="px-5 pt-3 pb-4 mt-0 text-sm leading-relaxed text-violet-900 dark:text-violet-100">
        {scenario}
      </p>

      {hints.length > 0 && (
        <div className="border-t border-violet-200 dark:border-violet-800 px-5 py-3">
          {revealed > 0 && (
            <div className="mb-3 space-y-2">
              {hints.slice(0, revealed).map((h, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="font-semibold shrink-0 text-violet-400 dark:text-violet-500">
                    Hint {i + 1}:
                  </span>
                  <span className="text-violet-800 dark:text-violet-200">{h}</span>
                </div>
              ))}
            </div>
          )}
          {revealed < hints.length && (
            <button
              type="button"
              onClick={() => setRevealed((r) => r + 1)}
              className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 underline underline-offset-2 cursor-pointer transition-colors duration-150"
            >
              {revealed === 0 ? 'Show a hint' : 'Show next hint'}
            </button>
          )}
        </div>
      )}

      {solution && (
        <div className="border-t border-violet-200 dark:border-violet-800 px-5 py-3">
          {!showSolution ? (
            <button
              type="button"
              onClick={() => setShowSolution(true)}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline underline-offset-2 cursor-pointer transition-colors duration-150"
            >
              Show solution
            </button>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Solution
                </span>
                <button
                  type="button"
                  onClick={() => setShowSolution(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 cursor-pointer transition-colors duration-150"
                >
                  Hide
                </button>
              </div>
              <p className="mt-0 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                {solution}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
