export const ProgressTracker = ({ lessonKey, lessonNum, totalLessons, level }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      onClick={() => setChecked(prev => !prev)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.25rem',
        borderRadius: '0.5rem',
        border: `1.5px solid ${checked ? '#16a34a' : '#e5e7eb'}`,
        background: checked ? '#f0fdf4' : '#fafafa',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.15s ease',
      }}
    >
      <div
        style={{
          width: '1.25rem',
          height: '1.25rem',
          borderRadius: '0.25rem',
          border: `2px solid ${checked ? '#16a34a' : '#9ca3af'}`,
          background: checked ? '#16a34a' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: checked ? '#15803d' : '#374151' }}>
          {checked ? '✓ Lesson complete' : 'Mark lesson complete'}
        </div>
        {lessonNum && totalLessons && (
          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.1rem' }}>
            {level && `${level} · `}Lesson {lessonNum} of {totalLessons}
          </div>
        )}
      </div>
    </div>
  );
};
