import { BookOpen, ClipboardList, Users, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const cards = [
  {
    to: '/lectures',
    icon: BookOpen,
    color: 'bg-blue-50 text-[#1865f2]',
    title: 'Lectures',
    desc: 'Browse and manage learning content',
  },
  {
    to: '/tests',
    icon: ClipboardList,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Tests',
    desc: 'Create quizzes and take assessments',
  },
  {
    to: '/submissions',
    icon: BarChart2,
    color: 'bg-purple-50 text-purple-600',
    title: 'Submissions',
    desc: 'View student answers and progress',
  },
  {
    to: '/users',
    icon: Users,
    color: 'bg-orange-50 text-orange-500',
    title: 'Users',
    desc: 'Manage accounts and roles',
  },
];

export default function Home() {
  return (
    <div className="px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#1c1d1f] tracking-tight">
          Welcome to <span className="text-[#1865f2]">QuizLec</span>
        </h1>
        <p className="mt-2 text-gray-500 text-base">
          A microservices learning platform. Pick a section to get started.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {cards.map(({ to, icon: Icon, color, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-start gap-4 hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="font-black text-[#1c1d1f] text-base group-hover:text-[#1865f2] transition-colors">{title}</p>
              <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
        <p className="text-sm font-semibold text-amber-800 mb-1">Known backend limitations</p>
        <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
          <li>POST /tests/submission-answers silently drops <code>selectedOption</code> — scores will show as N/A</li>
          <li>PUT /users/deactivate/{'{id}'} returns incorrect boolean — success is determined by HTTP 200</li>
          <li>GET /tests/questions may return 500 due to a Jackson serialization bug</li>
        </ul>
      </div>
    </div>
  );
}
