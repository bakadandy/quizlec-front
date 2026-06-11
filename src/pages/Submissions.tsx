import { useState } from 'react';
import { BarChart2, Search, AlertTriangle } from 'lucide-react';
import { submissionAnswers } from '../api/endpoints';
import type { SubmissionAnswer } from '../api/types';
import {
  PageHeader, Card, Button, Input, Spinner,
  ErrorBanner, EmptyState, Badge,
} from '../components/ui';

export default function Submissions() {
  const [lookupId, setLookupId] = useState('');
  const [result, setResult] = useState<SubmissionAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    const id = Number(lookupId);
    if (!id) return setError('Enter a valid submission answer ID');
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await submissionAnswers.get(id);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Not found');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-8 py-10">
      <PageHeader
        title="Submissions"
        subtitle="Look up submission answers by ID"
      />

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 flex gap-3">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Backend limitation active</p>
          <p className="text-xs text-amber-700 mt-0.5">
            POST /tests/submission-answers silently drops <code>selectedOption</code>. All answers are saved with
            <code> selectedOption: null</code>. Scores cannot be calculated until this is fixed in the backend.
          </p>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <form onSubmit={lookup} className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              label="Submission Answer ID"
              type="number"
              value={lookupId}
              onChange={e => setLookupId(e.target.value)}
              placeholder="e.g. 42"
            />
          </div>
          <Button type="submit" loading={loading}>
            <Search size={14} /> Look Up
          </Button>
        </form>
      </Card>

      {error && <ErrorBanner message={error} />}

      {loading && <Spinner />}

      {result && (
        <Card className="p-6">
          <h3 className="font-black text-[#1c1d1f] mb-4">Submission Answer #{result.id}</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-36 text-gray-500 shrink-0">Question</dt>
              <dd className="font-medium text-[#1c1d1f]">{result.question?.text ?? <span className="text-gray-400">—</span>}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-36 text-gray-500 shrink-0">Selected Option</dt>
              <dd>
                {result.selectedOption
                  ? <Badge color="green">{result.selectedOption.text}</Badge>
                  : <Badge color="red">null — backend bug</Badge>}
              </dd>
            </div>
            {result.submission && (
              <div className="flex gap-3">
                <dt className="w-36 text-gray-500 shrink-0">Submission ID</dt>
                <dd className="font-medium">{result.submission.id}</dd>
              </div>
            )}
          </dl>
        </Card>
      )}

      {!loading && !result && !error && (
        <Card>
          <EmptyState
            icon={<BarChart2 size={48} />}
            title="Enter an ID to look up a submission answer"
            description="Submission answer IDs are returned when a student submits a test"
          />
        </Card>
      )}
    </div>
  );
}
