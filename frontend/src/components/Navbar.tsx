import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">{t('home')}</Link>
        </li>
        <li>
          <Link to="/about">{t('about')}</Link>
        </li>
        {user ? (
          <>
            {user.role === 'admin' && (
              <li>
                <Link to="/admin">{t('admin')}</Link>
              </li>
            )}
            <li>
              <button onClick={logout}>{t('logout')}</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">{t('login')}</Link>
            </li>
            <li>
              <Link to="/register">{t('register')}</Link>
            </li>
          </>
        )}
      </ul>
      <div>
        <button onClick={() => changeLanguage('en-US')}>English</button>
        <button onClick={() => changeLanguage('zh-TW')}>繁體中文</button>
      </div>
    </nav>
  );
};

export default Navbar;
