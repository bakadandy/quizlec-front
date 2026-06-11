import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Trash2, Edit2, ChevronDown, ChevronUp, CheckCircle, Circle } from 'lucide-react';
import { tests, questions, answerOptions, submissionAnswers } from '../api/endpoints';
import type { Test, Question, AnswerOption } from '../api/types';
import {
  PageHeader, Card, Button, Input, Textarea, Spinner,
  ErrorBanner, EmptyState, Modal, Badge,
} from '../components/ui';

// ─── Test Form ────────────────────────────────────────────────────────────────
function TestForm({ initial, onSave, onCancel }: {
  initial?: Partial<Test>;
  onSave: (d: { title: string; description: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError('Title is required');
    setLoading(true); setError('');
    try { await onSave({ title: title.trim(), description: description.trim() }); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Algebra Quiz 1" />
      <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <div className="flex gap-3"><Button type="submit" loading={loading}>Save</Button><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button></div>
    </form>
  );
}

// ─── Question Form ────────────────────────────────────────────────────────────
function QuestionForm({ testId, onSave, onCancel }: {
  testId: number;
  onSave: (q: Question) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState('');
  const [options, setOptions] = useState([
    { text: '', correct: false },
    { text: '', correct: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function setOptionText(i: number, val: string) {
    setOptions(o => o.map((x, idx) => idx === i ? { ...x, text: val } : x));
  }
  function toggleCorrect(i: number) {
    setOptions(o => o.map((x, idx) => ({ ...x, correct: idx === i })));
  }
  function addOption() {
    setOptions(o => [...o, { text: '', correct: false }]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return setError('Question text is required');
    if (options.filter(o => o.text.trim()).length < 2) return setError('At least 2 answer options required');
    setLoading(true); setError('');
    try {
      const q = await questions.create({ text: text.trim(), testId });
      // create answer options sequentially
      const opts: AnswerOption[] = [];
      for (const opt of options.filter(o => o.text.trim())) {
        const ao = await answerOptions.create({ text: opt.text.trim(), correct: opt.correct, questionId: q.id });
        opts.push(ao);
      }
      onSave({ ...q, answerOptions: opts });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <Textarea label="Question Text" value={text} onChange={e => setText(e.target.value)} placeholder="What is 2 + 2?" />
      <div>
        <p className="text-sm font-semibold text-[#1c1d1f] mb-2">Answer Options <span className="text-gray-400 font-normal">(click circle to mark correct)</span></p>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <button type="button" onClick={() => toggleCorrect(i)} className="shrink-0">
                {opt.correct
                  ? <CheckCircle size={18} className="text-emerald-500" />
                  : <Circle size={18} className="text-gray-300" />}
              </button>
              <Input
                value={opt.text}
                onChange={e => setOptionText(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="flex-1"
              />
            </div>
          ))}
        </div>
        <button type="button" onClick={addOption} className="mt-2 text-xs text-[#1865f2] font-semibold hover:underline">
          + Add option
        </button>
      </div>
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Add Question</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// ─── Take Test ────────────────────────────────────────────────────────────────
function TakeTest({ test, onClose }: { test: Test; onClose: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const qs = test.questions ?? [];

  async function submit() {
    if (Object.keys(answers).length < qs.length) {
      return setError('Please answer all questions before submitting');
    }
    setSubmitting(true); setError('');
    try {
      // Backend bug: selectedOption is silently dropped — submit anyway
      for (const [questionId, selectedOptionId] of Object.entries(answers)) {
        await submissionAnswers.create({
          submissionId: 0, // no submission entity yet — adjust when endpoint exists
          questionId: Number(questionId),
          selectedOptionId,
        });
      }
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <CheckCircle size={48} className="text-emerald-500 mx-auto mb-3" />
        <p className="font-black text-lg text-[#1c1d1f]">Test submitted!</p>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Score display is unavailable — the backend currently drops <code>selectedOption</code>.
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} />}
      {qs.map((q, qi) => (
        <div key={q.id} className="space-y-2">
          <p className="font-semibold text-sm text-[#1c1d1f]">{qi + 1}. {q.text}</p>
          <div className="space-y-1">
            {(q.answerOptions ?? []).map(opt => (
              <label key={opt.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                answers[q.id] === opt.id
                  ? 'border-[#1865f2] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt.id}
                  checked={answers[q.id] === opt.id}
                  onChange={() => setAnswers(a => ({ ...a, [q.id]: opt.id }))}
                  className="accent-[#1865f2]"
                />
                <span className="text-sm">{opt.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <Button onClick={submit} loading={submitting}>Submit Answers</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

// ─── Test Card ────────────────────────────────────────────────────────────────
function TestCard({ test, onDelete, onUpdate }: {
  test: Test;
  onDelete: (id: number) => void;
  onUpdate: (t: Test) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showAddQ, setShowAddQ] = useState(false);
  const [showTake, setShowTake] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const qs = test.questions ?? [];

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-[#1c1d1f]">{test.title}</h3>
              <Badge color="gray">{qs.length} question{qs.length !== 1 ? 's' : ''}</Badge>
            </div>
            {test.description && <p className="text-sm text-gray-500 mt-1">{test.description}</p>}
          </div>
          <div className="flex gap-2 ml-4">
            <Button variant="primary" onClick={() => setShowTake(true)}>Take Test</Button>
            <Button variant="ghost" onClick={() => setShowAddQ(true)}><Plus size={14} /></Button>
            <Button variant="ghost" onClick={() => setShowEdit(true)}><Edit2 size={14} /></Button>
            <Button variant="danger" onClick={() => onDelete(test.id)}><Trash2 size={14} /></Button>
            <Button variant="ghost" onClick={() => setExpanded(e => !e)}>
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </div>
        </div>

        {expanded && qs.length > 0 && (
          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
            {qs.map((q, qi) => (
              <div key={q.id} className="text-sm">
                <p className="font-semibold text-[#1c1d1f]">{qi + 1}. {q.text}</p>
                <ul className="mt-1 space-y-0.5 ml-4">
                  {(q.answerOptions ?? []).map(opt => (
                    <li key={opt.id} className={`text-xs flex items-center gap-1 ${opt.correct ? 'text-emerald-600 font-semibold' : 'text-gray-500'}`}>
                      {opt.correct ? '✓' : '·'} {opt.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddQ && (
        <Modal title="Add Question" onClose={() => setShowAddQ(false)}>
          <QuestionForm
            testId={test.id}
            onSave={q => {
              onUpdate({ ...test, questions: [...qs, q] });
              setShowAddQ(false);
            }}
            onCancel={() => setShowAddQ(false)}
          />
        </Modal>
      )}

      {showTake && (
        <Modal title={`Taking: ${test.title}`} onClose={() => setShowTake(false)}>
          <TakeTest test={test} onClose={() => setShowTake(false)} />
        </Modal>
      )}

      {showEdit && (
        <Modal title="Edit Test" onClose={() => setShowEdit(false)}>
          <TestForm
            initial={test}
            onSave={async d => {
              const updated = await tests.update(test.id, d);
              onUpdate({ ...updated, questions: qs });
              setShowEdit(false);
            }}
            onCancel={() => setShowEdit(false)}
          />
        </Modal>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Tests() {
  const [list, setList] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    tests.list()
      .then(setList)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(d: { title: string; description: string }) {
    const created = await tests.create(d);
    setList(l => [...l, { ...created, questions: [] }]);
    setShowCreate(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this test and all its questions?')) return;
    await tests.delete(id);
    setList(l => l.filter(t => t.id !== id));
  }

  if (loading) return <Spinner />;

  return (
    <div className="px-8 py-10">
      <PageHeader
        title="Tests"
        subtitle="Create quizzes, add questions, and take assessments"
        action={<Button onClick={() => setShowCreate(true)}><Plus size={16} /> New Test</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {list.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ClipboardList size={48} />}
            title="No tests yet"
            description="Create a test and add multiple-choice questions"
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map(test => (
            <TestCard
              key={test.id}
              test={test}
              onDelete={handleDelete}
              onUpdate={updated => setList(l => l.map(t => t.id === updated.id ? updated : t))}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="New Test" onClose={() => setShowCreate(false)}>
          <TestForm onSave={handleCreate} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}
    </div>
  );
}
