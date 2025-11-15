import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const navLinkClasses = "text-white/80 font-bold hover:text-white transition-colors";
  const activeNavLinkClasses = "text-white font-bold";
  return (
    <header className="relative p-4 border-b border-white/10">
      <div className="flex items-center justify-between">
        {/* Left Icon & Title */}
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-white text-3xl">widgets</span>
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

        <div className="hidden md:flex items-center justify-end gap-6"> {/* 調整 gap */}
          {user ? (
            <button onClick={logout} className={navLinkClasses}>
              {t('logout')}
            </button>
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
              <button onClick={logout} className={`text-lg ${navLinkClasses}`}>
                {t('logout')}
              </button>
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
