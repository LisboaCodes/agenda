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
  Settings,
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
  { path: '/settings', icon: Settings, label: 'Configurações' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
