import { EmptyState } from 'quizlec-front';

export function Default() {
  return (
    <div style={{ background: '#f7f9fc', padding: 24 }}>
      <EmptyState
        icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12h6m-3-3v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
        title="No lectures yet"
        description="Create your first lecture to get started."
      />
    </div>
  );
}

export function WithoutDescription() {
  return (
    <div style={{ background: '#f7f9fc', padding: 24 }}>
      <EmptyState
        icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
        title="No submissions found"
      />
    </div>
  );
}
