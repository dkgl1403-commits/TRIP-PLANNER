// Dev-only lesson preview: open /lesson-preview.html?topic=<topic id> on the Vite dev server
// to render a single lesson without logging in. Not part of the production build.
import { createRoot } from 'react-dom/client';
import '../index.css';
import LessonEngine from '../components/learning/engine/LessonEngine';

const topicId = new URLSearchParams(window.location.search).get('topic');

createRoot(document.getElementById('root')).render(
  topicId
    ? <LessonEngine topicId={topicId} user={null} onBack={() => {}} />
    : <p style={{ color: 'white', padding: 24 }}>Add ?topic=&lt;topic id&gt; to the URL.</p>
);
