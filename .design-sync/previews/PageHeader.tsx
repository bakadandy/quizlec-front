import { PageHeader, Button } from 'quizlec-front';

export function TitleOnly() {
  return (
    <div style={{ padding: 24, background: '#f7f9fc' }}>
      <PageHeader title="Lectures" />
    </div>
  );
}

export function WithSubtitle() {
  return (
    <div style={{ padding: 24, background: '#f7f9fc' }}>
      <PageHeader title="Users" subtitle="Manage platform accounts and permissions" />
    </div>
  );
}

export function WithAction() {
  return (
    <div style={{ padding: 24, background: '#f7f9fc' }}>
      <PageHeader
        title="Tests"
        subtitle="3 tests published"
        action={<Button variant="primary">New test</Button>}
      />
    </div>
  );
}
