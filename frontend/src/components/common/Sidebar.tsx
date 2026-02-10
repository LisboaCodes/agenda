import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  StickyNote,
  Image,
  FileText,
  Lock,
  Users,
  DollarSign,
  Bell,
  Briefcase,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/notes', icon: StickyNote, label: 'Anotações' },
  { path: '/memories', icon: Image, label: 'Memórias' },
  { path: '/files', icon: FileText, label: 'Arquivos' },
  { path: '/passwords', icon: Lock, label: 'Senhas' },
  { path: '/clients', icon: Users, label: 'Clientes' },
  { path: '/services', icon: Briefcase, label: 'Serviços' },
  { path: '/financial', icon: DollarSign, label: 'Financeiro' },
  { path: '/reminders', icon: Bell, label: 'Lembretes' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
