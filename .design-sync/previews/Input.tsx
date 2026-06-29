import { Input } from 'quizlec-front';

export function Default() {
  return (
    <div style={{ padding: 24, maxWidth: 360, background: '#f7f9fc' }}>
      <Input placeholder="Enter email address" />
    </div>
  );
}

export function WithLabel() {
  return (
    <div style={{ padding: 24, maxWidth: 360, background: '#f7f9fc' }}>
      <Input label="Email" placeholder="name@example.com" />
    </div>
  );
}

export function WithError() {
  return (
    <div style={{ padding: 24, maxWidth: 360, background: '#f7f9fc' }}>
      <Input label="Email" placeholder="name@example.com" value="invalid-email" error="Please enter a valid email address" readOnly />
    </div>
  );
}
