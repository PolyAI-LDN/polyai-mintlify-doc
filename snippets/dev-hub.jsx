// Region-aware snippets for the developer hub page (/developers).
// <RegionSwitch /> picks US, UK, EU or Studio; every <RegionCode /> on the page
// re-renders its template with that region's API host. The choice is saved in
// localStorage so it survives a reload.
//
// Mintlify keeps only the exported components from a snippet file, so each
// component carries its own constants and helpers.

export const RegionSwitch = () => {
  const regions = [
    { value: 'us', label: 'US', note: 'Data stays in the US region.' },
    { value: 'uk', label: 'UK', note: 'Data stays in the UK region.' },
    { value: 'eu', label: 'EU', note: 'Data stays in the EU region.' },
    { value: 'studio', label: 'Studio', note: 'For self-serve accounts from studio.poly.ai.' }
  ];
  const [region, setRegion] = useState('us');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('devhub.region');
      if (regions.some((r) => r.value === saved)) setRegion(saved);
    } catch {}
    const onChange = (e) => setRegion(e.detail);
    window.addEventListener('devhub-region', onChange);
    return () => window.removeEventListener('devhub-region', onChange);
  }, []);

  const pick = (value) => {
    try { window.localStorage.setItem('devhub.region', value); } catch {}
    window.dispatchEvent(new CustomEvent('devhub-region', { detail: value }));
  };
  const note = regions.find((r) => r.value === region).note;

  return (
    <div className="devhub-region not-prose">
      <span className="devhub-mini">Region</span>
      <div className="devhub-segmented" role="radiogroup" aria-label="API region">
        {regions.map((r) => (
          <button
            key={r.value}
            type="button"
            role="radio"
            aria-checked={r.value === region}
            onClick={() => pick(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>
      <span className="devhub-region-note">
        <code>{`https://api.${region}.poly.ai`}</code> · {note}
      </span>
    </div>
  );
};

export const RegionCode = ({ title, code }) => {
  const [region, setRegion] = useState('us');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('devhub.region');
      if (['us', 'uk', 'eu', 'studio'].includes(saved)) setRegion(saved);
    } catch {}
    const onChange = (e) => setRegion(e.detail);
    window.addEventListener('devhub-region', onChange);
    return () => window.removeEventListener('devhub-region', onChange);
  }, []);

  const text = code.split('{{host}}').join(`https://api.${region}.poly.ai`);
  const copy = () => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="devhub-code not-prose">
      <div className="devhub-code-head">
        <span>{title}</span>
        <button type="button" onClick={copy} aria-label={copied ? 'Copied' : `Copy ${title}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre><code>{text}</code></pre>
    </div>
  );
};
