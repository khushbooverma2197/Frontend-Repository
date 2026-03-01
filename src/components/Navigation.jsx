import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
            <span className="text-xl font-bold">TravelInspire</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-200 transition">
              Destinations
            </Link>
            <Link to="/trip-planner" className="hover:text-blue-200 transition flex items-center gap-1">
              <span>🗺️</span> Trip Planner
            </Link>
            <Link to="/my-trips" className="hover:text-blue-200 transition flex items-center gap-1">
              <span>📋</span> My Trips
            </Link>
            <Link to="/deals" className="hover:text-blue-200 transition flex items-center gap-1">
              <span>🔥</span> Deals
            </Link>
            <Link to="/budget" className="hover:text-blue-200 transition">
              Budget Planner
            </Link>
            <Link to="/journals" className="hover:text-blue-200 transition">
              My Journals
            </Link>
            <Link to="/community" className="hover:text-blue-200 transition flex items-center gap-1">
              <span>👥</span> Community
            </Link>
            <Link to="/preferences" className="hover:text-blue-200 transition flex items-center gap-1">
              <span>⚙️</span> Preferences
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-blue-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 hover:bg-blue-700 px-4 rounded">
              Destinations
            </Link>
            <Link to="/trip-planner" className="block py-2 hover:bg-blue-700 px-4 rounded">
              🗺️ Trip Planner
            </Link>
            <Link to="/my-trips" className="block py-2 hover:bg-blue-700 px-4 rounded">
              📋 My Trips
            </Link>
            <Link to="/deals" className="block py-2 hover:bg-blue-700 px-4 rounded">
              🔥 Deals
            </Link>
            <Link to="/budget" className="block py-2 hover:bg-blue-700 px-4 rounded">
              Budget Planner
            </Link>
            <Link to="/journals" className="block py-2 hover:bg-blue-700 px-4 rounded">
              My Journals
            </Link>
            <Link to="/community" className="block py-2 hover:bg-blue-700 px-4 rounded">
              👥 Community
            </Link>
            <Link to="/preferences" className="block py-2 hover:bg-blue-700 px-4 rounded">
              ⚙️ Preferences
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
