import { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, Trash2, Edit2, ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { users, roles } from '../api/endpoints';
import type { User, Role } from '../api/types';
import {
  PageHeader, Card, Button, Input, Spinner,
  ErrorBanner, EmptyState, Modal, Badge,
} from '../components/ui';

function UserForm({ initial, onSave, onCancel }: {
  initial?: Partial<User>;
  onSave: (d: Partial<User>) => Promise<void>;
  onCancel: () => void;
}) {
  const [username, setUsername] = useState(initial?.username ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return setError('Username and email are required');
    setLoading(true); setError('');
    try { await onSave({ username: username.trim(), email: email.trim() }); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="john_doe" />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Save</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function AssignRoleForm({ roleList, onSave, onCancel }: {
  roleList: Role[];
  onSave: (roleId: number) => Promise<void>;
  onCancel: () => void;
}) {
  const [roleId, setRoleId] = useState(roleList[0]?.id ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try { await onSave(roleId); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-[#1c1d1f]">Select Role</label>
        <select
          value={roleId}
          onChange={e => setRoleId(Number(e.target.value))}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1865f2]"
        >
          {roleList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Assign Role</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function Users() {
  const [list, setList] = useState<User[]>([]);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [activation, setActivation] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [assigningRole, setAssigningRole] = useState<User | null>(null);

  useEffect(() => {
    // No GET /users list endpoint — show created users tracked locally
    roles.list().then(setRoleList).catch(() => {});
    setLoading(false);
  }, []);

  async function handleCreate(d: Partial<User>) {
    const created = await users.create(d);
    setList(l => [...l, created]);
    setShowCreate(false);
  }

  async function handleUpdate(d: Partial<User>) {
    if (!editing) return;
    const updated = await users.update(editing.id, d);
    setList(l => l.map(u => u.id === editing.id ? updated : u));
    setEditing(null);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this user?')) return;
    await users.delete(id);
    setList(l => l.filter(u => u.id !== id));
  }

  async function toggleActivation(user: User) {
    const isActive = activation[user.id] ?? false;
    // NOTE: deactivate returns wrong body value — use HTTP 200 as success signal
    if (isActive) {
      await users.deactivate(user.id);
      setActivation(a => ({ ...a, [user.id]: false }));
    } else {
      await users.activate(user.id);
      setActivation(a => ({ ...a, [user.id]: true }));
    }
  }

  async function handleAssignRole(roleId: number) {
    if (!assigningRole) return;
    await users.assignRole(assigningRole.id, roleId);
    setAssigningRole(null);
  }

  if (loading) return <Spinner />;

  return (
    <div className="px-8 py-10">
      <PageHeader
        title="Users"
        subtitle="Manage user accounts and role assignments"
        action={<Button onClick={() => setShowCreate(true)}><Plus size={16} /> New User</Button>}
      />

      {error && <ErrorBanner message={error} />}

      {list.length === 0 ? (
        <Card>
          <EmptyState
            icon={<UsersIcon size={48} />}
            title="No users yet"
            description="Create a user to manage their roles and activation status"
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map(user => {
            const active = activation[user.id] ?? false;
            return (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1865f2] text-white flex items-center justify-center text-sm font-black">
                      {user.username?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#1c1d1f]">{user.username}</span>
                        <Badge color={active ? 'green' : 'gray'}>{active ? 'Active' : 'Inactive'}</Badge>
                        {user.roles?.map(r => <Badge key={r.id} color="blue">{r.name}</Badge>)}
                      </div>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => toggleActivation(user)}>
                      {active ? <UserX size={14} /> : <UserCheck size={14} />}
                      {active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="ghost" onClick={() => setAssigningRole(user)}>
                      <ShieldCheck size={14} /> Role
                    </Button>
                    <Button variant="ghost" onClick={() => setEditing(user)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(user.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showCreate && (
        <Modal title="New User" onClose={() => setShowCreate(false)}>
          <UserForm onSave={handleCreate} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit User" onClose={() => setEditing(null)}>
          <UserForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      {assigningRole && (
        <Modal title={`Assign Role to ${assigningRole.username}`} onClose={() => setAssigningRole(null)}>
          {roleList.length === 0
            ? <p className="text-sm text-gray-500">No roles available. Create roles first.</p>
            : <AssignRoleForm roleList={roleList} onSave={handleAssignRole} onCancel={() => setAssigningRole(null)} />
          }
        </Modal>
      )}
    </div>
  );
}
