const LETTER = ['A', 'B', 'C', 'D'];

export const Quiz = ({ questions }) => {
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null));
  const [resetKey, setResetKey] = useState(0);

  const select = (qIdx, optIdx) => {
    if (answers[qIdx] !== null) return;
    setAnswers(prev => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  };

  const reset = () => {
    setAnswers(Array(questions.length).fill(null));
    setResetKey(k => k + 1);
  };

  return (
    <div key={resetKey} style={{ margin: '1.25rem 0' }}>
      {questions.map((q, qIdx) => {
        const selected = answers[qIdx];
        const answered = selected !== null;
        const isRight = selected === q.correct;

        return (
          <div key={qIdx} style={{ marginBottom: '1.75rem' }}>
            <p style={{
              fontWeight: 600,
              fontSize: '0.925rem',
              marginBottom: '0.75rem',
              marginTop: 0,
              color: '#111827',
              lineHeight: 1.5,
            }}>
              {qIdx + 1}. {q.q}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct;
                const isSelected = selected === i;
                let bg = '#ffffff';
                let borderColor = '#e5e7eb';
                let color = '#374151';
                let letterBg = '#f3f4f6';
                let letterColor = '#6b7280';
                let fontWeight = 400;

                if (answered) {
                  if (isCorrect) {
                    bg = '#f0fdf4'; borderColor = '#16a34a'; color = '#14532d';
                    letterBg = '#16a34a'; letterColor = '#ffffff'; fontWeight = 600;
                  } else if (isSelected) {
                    bg = '#fef2f2'; borderColor = '#dc2626'; color = '#7f1d1d';
                    letterBg = '#dc2626'; letterColor = '#ffffff';
                  } else {
                    color = '#9ca3af'; borderColor = '#f3f4f6';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => select(qIdx, i)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
                      padding: '0.55rem 0.875rem', borderRadius: '0.375rem',
                      border: `1.5px solid ${borderColor}`, background: bg, color,
                      cursor: answered ? 'default' : 'pointer', textAlign: 'left',
                      fontSize: '0.875rem', fontWeight, lineHeight: 1.5,
                      transition: 'all 0.1s ease', width: '100%', boxSizing: 'border-box',
                    }}
                  >
                    <span style={{
                      minWidth: '1.375rem', height: '1.375rem', borderRadius: '0.25rem',
                      background: letterBg, color: letterColor, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem',
                      fontWeight: 700, flexShrink: 0, marginTop: '0.05rem',
                      transition: 'all 0.1s ease',
                    }}>
                      {LETTER[i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div style={{
                marginTop: '0.75rem', padding: '0.7rem 0.875rem', borderRadius: '0.375rem',
                background: isRight ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${isRight ? '#bbf7d0' : '#fecaca'}`,
                fontSize: '0.85rem', color: isRight ? '#15803d' : '#b91c1c', lineHeight: 1.55,
              }}>
                <strong>{isRight ? '✓ Correct.' : '✕ Not quite.'}</strong>{' '}{q.explanation}
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={reset}
        style={{
          marginTop: '0.25rem', padding: '0.45rem 1rem', borderRadius: '0.375rem',
          border: '1.5px solid #e5e7eb', background: '#fafafa', color: '#6b7280',
          fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500,
        }}
      >
        Reset quiz
      </button>
    </div>
  );
};
