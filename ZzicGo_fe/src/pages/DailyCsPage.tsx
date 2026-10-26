import { useLocation } from 'react-router-dom';

// Standalone document keeps CS independent of the authenticated app layout and styles.
export default function DailyCsPage() {
  const { search } = useLocation();
  return (
    <iframe
      title="Daily CS · 하루 세 질문"
      src={`/daily-cs/index.html${search}`}
      style={{ display: 'block', width: '100%', height: '100dvh', border: 0 }}
    />
  );
}
