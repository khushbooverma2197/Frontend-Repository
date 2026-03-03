import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();
  const location = useLocation();
  const userMenuRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsMobileOpen(false);
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const navLinkClass = (path) =>
    `relative text-sm font-medium transition-colors duration-150 px-1 py-0.5
    ${isActive(path)
      ? 'text-blue-600 after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full'
      : 'text-gray-600 hover:text-blue-600'}`;

  // Primary nav links (always visible in center)
  const primaryLinks = [
    { to: '/', label: 'Destinations' },
    { to: '/trip-planner', label: 'Trip Planner' },
    { to: '/deals', label: 'Deals' },
    { to: '/budget', label: 'Budget Planner' },
  ];

  // Secondary links (in user dropdown)
  const secondaryLinks = [
    { to: '/my-trips', label: '📋  My Trips' },
    { to: '/journals', label: '📓  My Journals' },
    { to: '/community', label: '👥  Community' },
    { to: '/preferences', label: '⚙️  Preferences' },
  ];

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : '??';

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TravelInspire
            </span>
          </Link>

          {/* Desktop — Primary Nav Links (center) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-7">
              {primaryLinks.map(({ to, label }) => (
                <Link key={to} to={to} className={navLinkClass(to)}>
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop — Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-150 group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-blue-600 max-w-[140px] truncate" title={user?.email}>
                    {user?.email}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full pt-1 w-52 z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-1.5">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-gray-700 truncate">{user?.email}</p>
                    </div>
                    {secondaryLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`block px-4 py-2 text-sm transition-colors duration-100
                          ${isActive(to)
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}
                      >
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-100"
                      >
                        🚪  Sign out
                      </button>
                    </div>
                  </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
              </div>
            )}
          </div>

          {/* Mobile — Hamburger */}
          <button
            onClick={() => setIsMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <span className="text-sm text-gray-600 truncate">{user?.email}</span>
              </div>
              {[...primaryLinks, ...secondaryLinks].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMobileOpen(false)}
                  className={`block px-3 py-2 text-sm rounded-lg transition-colors
                    ${isActive(to)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
              >
                🚪  Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setIsMobileOpen(false)}
                className="block text-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileOpen(false)}
                className="block text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:opacity-90 transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
