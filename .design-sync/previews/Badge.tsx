import { Badge } from 'quizlec-front';

export function Colors() {
  return (
    <div style={{ display: 'flex', gap: 8, padding: 24, flexWrap: 'wrap', alignItems: 'center', background: '#f7f9fc' }}>
      <Badge color="blue">Active</Badge>
      <Badge color="green">Published</Badge>
      <Badge color="purple">Premium</Badge>
      <Badge color="gray">Draft</Badge>
      <Badge color="red">Rejected</Badge>
    </div>
  );
}

export function InContext() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 24, alignItems: 'center', background: '#f7f9fc' }}>
      <span style={{ fontSize: 14, color: '#1c1d1f', fontWeight: 600 }}>Introduction to Algorithms</span>
      <Badge color="green">Published</Badge>
    </div>
  );
}
