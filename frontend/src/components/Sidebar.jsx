import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Car,
  ParkingCircle,
  FileBarChart2,
  LogOut,
  ArrowRightToLine,
  ArrowLeftFromLine,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',    to: '/dashboard',   icon: LayoutDashboard,    match: ['/dashboard'] },
  { label: 'Parkings',     to: '/parkings',    icon: ParkingCircle,      match: ['/parkings', '/parkings/new'] },
  { label: 'All Cars',     to: '/cars',        icon: Car,                match: ['/cars'] },
  { label: 'Record Entry', to: '/cars/entry',  icon: ArrowRightToLine,   match: ['/cars/entry'] },
  { label: 'Record Exit',  to: '/cars/exit',   icon: ArrowLeftFromLine,  match: ['/cars/exit'] },
];

const ADMIN_ITEMS = [
  { label: 'Reports', to: '/reports', icon: FileBarChart2, match: ['/reports'] },
];

const NavItem = ({ item, active }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-navy-800 text-white shadow-sm'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
          active ? 'bg-navy-500 text-white' : 'text-slate-400 group-hover:text-white'
        }`}
      >
        <Icon size={16} strokeWidth={active ? 2.5 : 2} />
      </span>
      <span className="truncate">{item.label}</span>
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-navy-400 flex-shrink-0" />
      )}
    </Link>
  );
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (paths) => paths.includes(location.pathname);

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '??';

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-navy-950 border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-500 shadow-lg">
          <ParkingCircle size={20} className="text-white" strokeWidth={2.5} />
        </span>
        <div>
          <p className="text-sm font-bold text-white tracking-tight leading-none">XWZ Parking</p>
          <p className="text-[11px] text-slate-500 mt-0.5 tracking-wide uppercase">Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} item={item} active={isActive(item.match)} />
        ))}

        {user?.role === 'ADMIN' && (
          <>
            <div className="my-3 border-t border-white/5" />
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              Admin
            </p>
            {ADMIN_ITEMS.map((item) => (
              <NavItem key={item.to} item={item} active={isActive(item.match)} />
            ))}
          </>
        )}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-white/5 p-3 space-y-1">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="mt-0.5 text-[11px] text-navy-400 font-medium uppercase tracking-wide">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md group-hover:text-red-400">
            <LogOut size={16} />
          </span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
