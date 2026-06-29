import { ErrorBanner } from 'quizlec-front';

export function Default() {
  return (
    <div style={{ padding: 24, background: '#f7f9fc', maxWidth: 480 }}>
      <ErrorBanner message="Failed to load lectures. Please try again." />
    </div>
  );
}

export function NetworkError() {
  return (
    <div style={{ padding: 24, background: '#f7f9fc', maxWidth: 480 }}>
      <ErrorBanner message="Network error: could not reach the server. Check your connection." />
    </div>
  );
}
