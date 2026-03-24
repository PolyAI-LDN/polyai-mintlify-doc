export const ProgressTracker = ({ lessonNum, totalLessons, level }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      onClick={() => setChecked((prev) => !prev)}
      className={checked
        ? 'flex items-center gap-3 p-4 rounded-lg border-2 border-green-600 bg-green-50 dark:bg-green-950 cursor-pointer select-none transition-all'
        : 'flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-pointer select-none transition-all'
      }
    >
      <div
        className={checked
          ? 'w-5 h-5 rounded border-2 border-green-600 bg-green-600 flex items-center justify-center shrink-0 transition-all'
          : 'w-5 h-5 rounded border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 transition-all'
        }
      >
        {checked ? (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </div>
      <div>
        <div className={checked
          ? 'font-semibold text-sm text-green-700 dark:text-green-300'
          : 'font-semibold text-sm text-gray-700 dark:text-gray-200'
        }>
          {checked ? 'Lesson complete' : 'Mark lesson complete'}
        </div>
        {lessonNum && totalLessons ? (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {level ? level + ' - ' : ''}Lesson {lessonNum} of {totalLessons}
          </div>
        ) : null}
      </div>
    </div>
  );
};
