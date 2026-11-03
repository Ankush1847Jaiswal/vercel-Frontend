import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen, Newspaper, ClipboardList, CalendarDays,
  Lock, Menu, X, ChevronDown, GraduationCap, Bell
} from 'lucide-react';

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: null,
  },
  {
    label: 'Study Materials',
    href: '/study-materials',
    icon: <BookOpen size={15} />,
    children: [
      { label: 'Prelims Resources', href: '/study-materials#prelims' },
      { label: 'Mains Resources', href: '/study-materials#mains' },
      { label: 'General Studies', href: '/study-materials#gs' },
      { label: 'NCERT Materials', href: '/study-materials#ncert' },
      { label: 'Previous Year Papers', href: '/study-materials#pyq' },
      { label: 'Answer Writing', href: '/study-materials#answer-writing' },
    ],
  },
  {
    label: 'Current Affairs',
    href: '/current-affairs',
    icon: <Newspaper size={15} />,
    children: [
      { label: 'Daily Current Affairs', href: '/current-affairs#daily' },
      { label: 'National News', href: '/current-affairs#national' },
      { label: 'International News', href: '/current-affairs#international' },
      { label: 'Government Schemes', href: '/current-affairs#schemes' },
      { label: 'Editorial Analysis', href: '/current-affairs#editorial' },
    ],
  },
  {
    label: 'Mock Tests',
    href: '/mock-tests',
    icon: <ClipboardList size={15} />,
  },
  {
    label: 'Syllabus',
    href: '/syllabus',
    icon: <CalendarDays size={15} />,
    children: [
      { label: 'Prelims Syllabus', href: '/syllabus#prelims' },
      { label: 'Mains Syllabus', href: '/syllabus#mains' },
      { label: 'Optional Subjects', href: '/syllabus#optional' },
      { label: 'Study Planner', href: '/syllabus#planner' },
    ],
  },
  {
    label: 'Notes',
    href: '/notes',
    icon: <Lock size={15} />,
    special: true,
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-navy text-white text-xs py-1.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Bell size={12} className="text-saffron shrink-0" />
            <div className="ticker-wrap flex-1">
              <span className="ticker-content text-gray-300">
                UPSC Civil Services preparation • Explore the syllabus • Practice Prelims questions • Build a steady revision plan
              </span>
            </div>
          </div>
          <Link to="/admin/login" className="text-gray-400 hover:text-saffron text-xs shrink-0 transition-colors">
            Admin
          </Link>
        </div>
      </div>

      {/* Main navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-saffron to-primary-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-navy text-lg leading-tight">Prayaas IAS</div>
                <div className="text-xs text-gray-500 leading-tight">Civil Services Preparation</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.children ? (
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive(item.href)
                          ? 'text-saffron bg-orange-50'
                          : 'text-gray-700 hover:text-saffron hover:bg-gray-50'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        item.special
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm'
                          : isActive(item.href)
                          ? 'text-saffron bg-orange-50'
                          : 'text-gray-700 hover:text-saffron hover:bg-gray-50'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {item.children && openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-slide-down z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:text-saffron hover:bg-orange-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-3">
              <Link to="/mock-tests" className="hidden md:inline-flex btn-primary text-sm py-2">
                Take Test
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-down">
            <nav className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      item.special
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : isActive(item.href)
                        ? 'bg-orange-50 text-saffron'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-saffron rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          — {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/mock-tests" className="btn-primary w-full text-center block mt-2">
                Take Mock Test
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
