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

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div key={resetCount} style={{ margin: '1.25rem 0' }}>
      {questions.map((q, qIdx) => {
        const answer = selected[qIdx];
        const hasAnswered = answer !== undefined;
        const isCorrect = answer === q.correct;

        return (
          <div key={String(qIdx)} style={{ marginBottom: '1.75rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.925rem', marginBottom: '0.75rem', marginTop: 0, color: '#111827', lineHeight: 1.5 }}>
              {qIdx + 1}. {q.q}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {q.options.map((opt, i) => {
                var bg = '#ffffff';
                var bc = '#e5e7eb';
                var col = '#374151';
                var lbg = '#f3f4f6';
                var lcol = '#6b7280';
                var fw = 400;

                if (hasAnswered) {
                  if (i === q.correct) {
                    bg = '#f0fdf4'; bc = '#16a34a'; col = '#14532d';
                    lbg = '#16a34a'; lcol = '#ffffff'; fw = 600;
                  } else if (i === answer) {
                    bg = '#fef2f2'; bc = '#dc2626'; col = '#7f1d1d';
                    lbg = '#dc2626'; lcol = '#ffffff';
                  } else {
                    col = '#9ca3af'; bc = '#f3f4f6';
                  }
                }

                return (
                  <button
                    key={String(i)}
                    onClick={() => handleSelect(qIdx, i)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
                      padding: '0.55rem 0.875rem', borderRadius: '0.375rem',
                      border: '1.5px solid ' + bc, background: bg, color: col,
                      cursor: hasAnswered ? 'default' : 'pointer', textAlign: 'left',
                      fontSize: '0.875rem', fontWeight: fw, lineHeight: 1.5,
                      transition: 'all 0.1s ease', width: '100%', boxSizing: 'border-box',
                    }}
                  >
                    <span style={{
                      minWidth: '1.375rem', height: '1.375rem', borderRadius: '0.25rem',
                      background: lbg, color: lcol, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem',
                      fontWeight: 700, flexShrink: 0, marginTop: '0.05rem',
                      transition: 'all 0.1s ease',
                    }}>
                      {letters[i]}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {hasAnswered && (
              <div style={{
                marginTop: '0.75rem', padding: '0.7rem 0.875rem', borderRadius: '0.375rem',
                background: isCorrect ? '#f0fdf4' : '#fef2f2',
                border: '1px solid ' + (isCorrect ? '#bbf7d0' : '#fecaca'),
                fontSize: '0.85rem', color: isCorrect ? '#15803d' : '#b91c1c', lineHeight: 1.55,
              }}>
                <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}
      <button
        onClick={handleReset}
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
