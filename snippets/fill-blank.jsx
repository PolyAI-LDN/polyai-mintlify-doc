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
    <div className="my-6">
      <p className="mt-0 mb-3 text-sm font-semibold leading-relaxed text-gray-900 dark:text-gray-100">
        {prompt}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setSubmitted(false); }}
            placeholder={hint || "Type your answer…"}
            className="flex-1 rounded-xl border py-2.5 px-4 text-sm font-mono border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-150 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-700"
          />
          <button
            type="submit"
            className="rounded-xl border py-2.5 px-5 text-sm font-medium transition-all duration-150 border-gray-800 bg-gray-800 text-white hover:bg-gray-700 hover:border-gray-700 dark:border-gray-200 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white"
          >
            Check
          </button>
        </div>
        {submitted ? (
          <div className={`py-3 pl-4 pr-3.5 rounded-r-xl text-sm leading-relaxed border-l-4 ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-500' : 'border-red-500 bg-red-50 dark:bg-red-900 dark:border-red-500'}`}>
            {isCorrect ? (
              <>
                <span className={`font-semibold !text-green-800 dark:!text-green-200`}>Correct.</span>{' '}
                <span className="!text-gray-700 dark:!text-gray-300">{explanation}</span>
              </>
            ) : (
              <>
                <span className="font-semibold !text-red-800 dark:!text-red-200">Not quite.</span>{' '}
                <span className="!text-gray-700 dark:!text-gray-300">The answer is <code className="!text-gray-800 dark:!text-gray-200">{answers[0]}</code>. {explanation}</span>
              </>
            )}
          </div>
        ) : null}
      </form>
      {submitted ? (
        <button
          type="button"
          onClick={handleReset}
          className="mt-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 cursor-pointer transition-colors duration-150"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
};
