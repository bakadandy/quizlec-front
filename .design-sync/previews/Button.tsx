import { Button } from 'quizlec-front';

export function Variants() {
  return (
    <div style={{ display: 'flex', gap: 8, padding: 24, flexWrap: 'wrap', alignItems: 'center', background: '#f7f9fc' }}>
      <Button variant="primary">Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="danger">Delete</Button>
      <Button variant="ghost">View details</Button>
    </div>
  );
}

export function Loading() {
  return (
    <div style={{ padding: 24, background: '#f7f9fc' }}>
      <Button variant="primary" loading>Saving...</Button>
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: 'flex', gap: 8, padding: 24, background: '#f7f9fc' }}>
      <Button variant="primary" disabled>Save</Button>
      <Button variant="secondary" disabled>Cancel</Button>
    </div>
  );
}
