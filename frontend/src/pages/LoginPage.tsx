import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (_error) {
      // Error toast is shown in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8 bg-black/20 p-8 rounded-xl">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white">
            {t('loginPage.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            {t('loginPage.createAccountPrompt')}{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary/90">
              {t('loginPage.createAccountLink')}
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white/80">
              {t('loginPage.usernameLabel')}
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full appearance-none rounded-md border-0 bg-white/5 px-3 py-2 text-white placeholder-white/40 shadow-sm focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80"
            >
              {t('loginPage.passwordLabel')}
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full appearance-none rounded-md border-0 bg-white/5 px-3 py-2 text-white placeholder-white/40 shadow-sm focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center items-center gap-2 rounded-lg bg-primary py-2 px-4 text-base font-bold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading && (
                <span className="material-symbols-outlined animate-spin">
                  progress_activity
                </span>
              )}
              {isLoading ? t('loginPage.signingIn') : t('loginPage.signIn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
