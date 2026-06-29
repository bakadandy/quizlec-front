import { Card } from 'quizlec-front';

export function Default() {
  return (
    <div style={{ padding: 24, background: '#f7f9fc', maxWidth: 400 }}>
      <Card>
        <div style={{ padding: 20 }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#1c1d1f', fontSize: 14 }}>Introduction to Algorithms</p>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 13 }}>12 lectures · 48 students enrolled</p>
        </div>
      </Card>
    </div>
  );
}

export function WithCustomClass() {
  return (
    <div style={{ padding: 24, background: '#f7f9fc', maxWidth: 400 }}>
      <Card className="p-5">
        <p style={{ margin: 0, fontWeight: 700, color: '#1c1d1f', fontSize: 15 }}>Statistics for Data Science</p>
        <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 13 }}>Course overview and syllabus content goes here.</p>
      </Card>
    </div>
  );
}
