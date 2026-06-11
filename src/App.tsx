import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Lectures from './pages/Lectures';
import Tests from './pages/Tests';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Submissions from './pages/Submissions';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto bg-[#f7f9fc]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lectures" element={<Lectures />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/submissions" element={<Submissions />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
