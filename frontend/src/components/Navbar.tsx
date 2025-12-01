import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const navLinkClasses = "text-white/80 font-bold hover:text-white transition-colors";
  const activeNavLinkClasses = "text-white font-bold";
  return (
    <header className="relative p-4 border-b border-white/10">
      <div className="flex items-center justify-between">
        {/* Left Icon & Title */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Miria Logo" className="w-8 h-8 object-contain rounded-sm" />
          <Link to="/" className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Miria
          </Link>
        </div>

        {/* ======================================= */}
        {/* Desktop Navigation */}
        {/* ======================================= */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks
            navLinkClasses={navLinkClasses}
            activeNavLinkClasses={activeNavLinkClasses}
            t={t}
            user={user}
          />
        </nav>

        <div className="hidden md:flex items-center justify-end gap-6">
          {user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-white transition-colors focus:outline-none"
              >
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-white/10 mb-2">
                    <p className="text-white font-bold truncate">{user.username}</p>
                  </div>
                  {(user.role === 'seller' || user.role === 'admin') && (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      {t('dashboard')}
                    </Link>
                  )}
                  <Link
                    to={`/profile/${user.username}`}
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    {t('profile')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors"
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={navLinkClasses}>
                {t('login')}
              </Link>
              <Link to="/register" className="bg-primary px-4 py-2 rounded-lg text-white text-sm font-bold hover:bg-opacity-90 transition-colors">
                {t('register')}
              </Link>
            </>
          )}

          <LanguageSwitcher />
        </div>

        {/* ======================================= */}
        {/* Mobile Menu Button */}
        {/* ======================================= */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open navigation menu">
            <span className="material-symbols-outlined text-3xl">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================= */}
      {/* Mobile Menu Panel */}
      {/* ======================================= */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background-dark shadow-lg z-50">
          <nav className="flex flex-col items-center gap-6 py-8">
            <NavLinks
              isMobile={true}
              navLinkClasses={navLinkClasses}
              activeNavLinkClasses={activeNavLinkClasses}
              t={t}
              user={user}
            />

            <hr className="w-3/4 border-white/20 my-4" />

            {user ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 mb-2">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-3xl">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-white font-bold text-xl mb-4">{user.username}</div>

                {(user.role === 'seller' || user.role === 'admin') && (
                  <Link
                    to="/dashboard"
                    className={`text-lg ${navLinkClasses}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('dashboard')}
                  </Link>
                )}
                <Link
                  to={`/profile/${user.username}`}
                  className={`text-lg ${navLinkClasses}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('profile')}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className={`text-lg ${navLinkClasses} text-red-400 hover:text-red-300`}
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full px-8">
                <Link to="/login" className={`text-lg ${navLinkClasses} w-full text-center py-2`}>
                  {t('login')}
                </Link>
                <Link to="/register" className="bg-primary py-3 rounded-lg text-white font-bold w-full text-center">
                  {t('register')}
                </Link>
              </div>
            )}

            <LanguageSwitcher />
          </nav>
        </div>
      )}
    </header>
  );
};

const NavLinks: React.FC<{ isMobile?: boolean; navLinkClasses: string; activeNavLinkClasses: string; t: any; user: any }> = ({
  isMobile = false,
  navLinkClasses,
  activeNavLinkClasses,
  t,
  user
}) => (
  <>
    <NavLink
      to="/about"
      className={({ isActive }) => `${isMobile ? 'text-lg' : ''} ${isActive ? activeNavLinkClasses : navLinkClasses}`}
    >
      {t('about')}
    </NavLink>
    {user?.role === 'admin' && (
      <NavLink
        to="/admin"
        className={({ isActive }) => `${isMobile ? 'text-lg' : ''} ${isActive ? activeNavLinkClasses : navLinkClasses}`}
      >
        {t('admin')}
      </NavLink>
    )}
  </>
);

export default Navbar;
