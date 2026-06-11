import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Image, FileText, Video } from 'lucide-react';
import { lectures } from '../api/endpoints';
import type { Lecture, LectureMedia } from '../api/types';
import {
  PageHeader, Card, Button, Input, Textarea, Spinner,
  ErrorBanner, EmptyState, Modal, Badge,
} from '../components/ui';

const mediaTypeIcon = (t: string) => {
  if (t === 'VIDEO') return <Video size={14} />;
  if (t === 'IMAGE') return <Image size={14} />;
  return <FileText size={14} />;
};

function LectureForm({ initial, onSave, onCancel }: {
  initial?: Partial<Lecture>;
  onSave: (data: { title: string; description: string; createdBy: number }) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [createdBy, setCreatedBy] = useState(String(initial?.createdBy ?? 1));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError('Title is required');
    setLoading(true);
    setError('');
    try {
      await onSave({ title: title.trim(), description: description.trim(), createdBy: Number(createdBy) });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Intro to Algebra" />
      <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="What this lecture covers…" />
      <Input label="Created by (User ID)" type="number" value={createdBy} onChange={e => setCreatedBy(e.target.value)} />
      <div className="flex gap-3 pt-1">
        <Button type="submit" loading={loading}>Save Lecture</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function MediaForm({ lectureId, onSave, onCancel }: {
  lectureId: number;
  onSave: (m: Partial<LectureMedia>) => Promise<void>;
  onCancel: () => void;
}) {
  const [mediaType, setMediaType] = useState('TEXT');
  const [content, setContent] = useState('');
  const [orderIndex, setOrderIndex] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return setError('Content is required');
    setLoading(true);
    setError('');
    try {
      await onSave({ lectureId, mediaType, content: content.trim(), orderIndex: Number(orderIndex) });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-[#1c1d1f]">Media Type</label>
        <select
          value={mediaType}
          onChange={e => setMediaType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1865f2]"
        >
          {['TEXT', 'VIDEO', 'IMAGE', 'PDF'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <Textarea label="Content (URL or text)" value={content} onChange={e => setContent(e.target.value)} rows={4} />
      <Input label="Order Index" type="number" value={orderIndex} onChange={e => setOrderIndex(e.target.value)} />
      <div className="flex gap-3 pt-1">
        <Button type="submit" loading={loading}>Add Media</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function Lectures() {
  const [list, setList] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Lecture | null>(null);
  const [addMediaTo, setAddMediaTo] = useState<number | null>(null);

  // Lectures have no GET /lectures list — we track locally
  useEffect(() => {
    setLoading(false);
  }, []);

  async function handleCreate(data: { title: string; description: string; createdBy: number }) {
    const created = await lectures.create(data);
    setList(l => [...l, created]);
    setShowCreate(false);
  }

  async function handleUpdate(data: { title: string; description: string; createdBy: number }) {
    if (!editing) return;
    const updated = await lectures.update(editing.id, data);
    setList(l => l.map(x => x.id === editing.id ? updated : x));
    setEditing(null);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this lecture?')) return;
    await lectures.delete(id);
    setList(l => l.filter(x => x.id !== id));
  }

  async function handleAddMedia(m: Partial<LectureMedia>) {
    if (addMediaTo == null) return;
    await lectures.assignMedia(addMediaTo, m);
    setAddMediaTo(null);
  }

  if (loading) return <Spinner />;

  return (
    <div className="px-8 py-10">
      <PageHeader
        title="Lectures"
        subtitle="Create and manage learning content"
        action={<Button onClick={() => setShowCreate(true)}><Plus size={16} /> New Lecture</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {list.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BookOpen size={48} />}
            title="No lectures yet"
            description="Create a lecture and attach media content to it"
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map(lecture => (
            <Card key={lecture.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-[#1c1d1f] text-base">{lecture.title}</h3>
                    <Badge color="gray">ID: {lecture.id}</Badge>
                  </div>
                  {lecture.description && (
                    <p className="text-sm text-gray-500 mt-1">{lecture.description}</p>
                  )}
                  {lecture.lectureMediaList && lecture.lectureMediaList.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lecture.lectureMediaList.map(m => (
                        <span
                          key={m.id}
                          className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {mediaTypeIcon(m.mediaType)} {m.mediaType} #{m.orderIndex}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" onClick={() => setAddMediaTo(lecture.id)}>
                    <Plus size={14} /> Media
                  </Button>
                  <Button variant="ghost" onClick={() => setEditing(lecture)}>
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(lecture.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="New Lecture" onClose={() => setShowCreate(false)}>
          <LectureForm onSave={handleCreate} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Lecture" onClose={() => setEditing(null)}>
          <LectureForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      {addMediaTo != null && (
        <Modal title="Add Media" onClose={() => setAddMediaTo(null)}>
          <MediaForm lectureId={addMediaTo} onSave={handleAddMedia} onCancel={() => setAddMediaTo(null)} />
        </Modal>
      )}
    </div>
  );
}
