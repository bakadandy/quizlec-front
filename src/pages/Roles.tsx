import { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit2 } from 'lucide-react';
import { roles } from '../api/endpoints';
import type { Role } from '../api/types';
import {
  PageHeader, Card, Button, Input, Spinner,
  ErrorBanner, EmptyState, Modal, Badge,
} from '../components/ui';

function RoleForm({ initial, onSave, onCancel }: {
  initial?: Partial<Role>;
  onSave: (d: Partial<Role>) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.roleName ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError('Name is required');
    setLoading(true); setError('');
    try { await onSave({ roleName: name.trim() }); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <Input label="Role Name" value={name} onChange={e => setName(e.target.value)} placeholder="TEACHER" />
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Save</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

const roleColors: Record<string, 'blue' | 'purple' | 'green' | 'gray'> = {
  ADMIN: 'purple',
  TEACHER: 'blue',
  STUDENT: 'green',
};

export default function Roles() {
  const [list, setList] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);

  useEffect(() => {
    roles.list().then(setList).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  async function handleCreate(d: Partial<Role>) {
    const created = await roles.create(d);
    setList(l => [...l, created]);
    setShowCreate(false);
  }

  async function handleUpdate(d: Partial<Role>) {
    if (!editing) return;
    const updated = await roles.update(editing.id, d);
    setList(l => l.map(r => r.id === editing.id ? updated : r));
    setEditing(null);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this role?')) return;
    await roles.delete(id);
    setList(l => l.filter(r => r.id !== id));
  }

  if (loading) return <Spinner />;

  return (
    <div className="px-8 py-10">
      <PageHeader
        title="Roles"
        subtitle="Define roles that can be assigned to users"
        action={<Button onClick={() => setShowCreate(true)}><Plus size={16} /> New Role</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {list.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ShieldCheck size={48} />}
            title="No roles yet"
            description="Create roles like ADMIN, TEACHER, STUDENT"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {list.map(role => (
            <Card key={role.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <Badge color={roleColors[role.roleName.toUpperCase()] ?? 'gray'}>{role.roleName}</Badge>
                  <p className="text-xs text-gray-400 mt-2">ID: {role.id}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" onClick={() => setEditing(role)}><Edit2 size={13} /></Button>
                  <Button variant="danger" onClick={() => handleDelete(role.id)}><Trash2 size={13} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="New Role" onClose={() => setShowCreate(false)}>
          <RoleForm onSave={handleCreate} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Role" onClose={() => setEditing(null)}>
          <RoleForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}
