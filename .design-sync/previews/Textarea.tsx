import { Textarea } from 'quizlec-front';

export function Default() {
  return (
    <div style={{ padding: 24, maxWidth: 380, background: '#f7f9fc' }}>
      <Textarea placeholder="Enter a description..." />
    </div>
  );
}

export function WithLabel() {
  return (
    <div style={{ padding: 24, maxWidth: 380, background: '#f7f9fc' }}>
      <Textarea label="Description" placeholder="Describe the lecture content..." rows={4} />
    </div>
  );
}

export function WithError() {
  return (
    <div style={{ padding: 24, maxWidth: 380, background: '#f7f9fc' }}>
      <Textarea label="Description" value="x" error="Description must be at least 20 characters" readOnly />
    </div>
  );
}
