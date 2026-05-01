export const LessonMeta = ({ level, difficulty, time }) => {
  const levelConfig = {
    1: {
      badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      label: 'Level 1',
    },
    2: {
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      label: 'Level 2',
    },
    3: {
      badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      label: 'Level 3',
    },
  };

  const difficultyConfig = {
    Beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    Advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const lvl = levelConfig[level] || levelConfig[1];
  const diffColor = difficultyConfig[difficulty] || difficultyConfig['Beginner'];

  return (
    <div className="flex flex-wrap items-center gap-2 my-4 not-prose">
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${lvl.badge}`}
      >
        {lvl.label}
      </span>
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${diffColor}`}
      >
        {difficulty}
      </span>
      {time && (
        <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {time}
        </span>
      )}
    </div>
  );
};
