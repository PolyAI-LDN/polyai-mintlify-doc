export const FillBlank = ({ prompt, answer, hint, explanation }) => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const normalize = (s) => s.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

  const answers = Array.isArray(answer) ? answer : [answer];
  const isCorrect = answers.some((a) => normalize(value) === normalize(a));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) setSubmitted(true);
  };

  const handleReset = () => {
    setValue('');
    setSubmitted(false);
  };

  return (
    <div className="my-5">
      <p className="mt-0 mb-3 text-sm font-semibold leading-normal text-gray-900 dark:text-gray-100">
        {prompt}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setSubmitted(false); }}
            placeholder={hint || "Type your answer…"}
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 font-mono"
          />
          <button
            type="submit"
            className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Check
          </button>
        </div>
        {submitted && (
          <div
            className={
              isCorrect
                ? 'rounded-md border border-green-200 bg-green-50 px-3.5 py-2.5 text-sm leading-normal text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-100'
                : 'rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm leading-normal text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-100'
            }
          >
            {isCorrect ? (
              <><strong>Correct.</strong> {explanation}</>
            ) : (
              <><strong>Not quite.</strong> The answer is <code>{answers[0]}</code>. {explanation}</>
            )}
          </div>
        )}
      </form>
      {submitted && (
        <button
          type="button"
          onClick={handleReset}
          className="mt-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          Try again
        </button>
      )}
    </div>
  );
};
