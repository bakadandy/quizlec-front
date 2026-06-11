import { NavLink } from 'react-router-dom';
import { BookOpen, ClipboardList, Users, BarChart2, ShieldCheck, Home } from 'lucide-react';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/lectures', label: 'Lectures', icon: BookOpen },
  { to: '/tests', label: 'Tests', icon: ClipboardList },
  { to: '/submissions', label: 'Submissions', icon: BarChart2 },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/roles', label: 'Roles', icon: ShieldCheck },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#1c1d1f] text-white flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-2xl font-black tracking-tight text-white">
          Quiz<span className="text-[#14bf96]">Lec</span>
        </span>
      </div>
      <nav className="flex-1 py-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-white/10 text-white border-r-2 border-[#14bf96]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-white/10 text-xs text-white/30">
        v0.1 · localhost:8080
      </div>
    </aside>
  );
}
