import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';

const SettingsMenu: React.FC = () => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            {/* Settings Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none"
                aria-label={t('settings')}
            >
                <span className="material-symbols-outlined text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white text-2xl gear-icon">
                    settings
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                    {/* About Link */}
                    <Link
                        to="/about"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <span className="material-symbols-outlined text-xl">info</span>
                        <span>{t('about')}</span>
                    </Link>

                    {/* Divider */}
                    <div className="my-2 border-t border-gray-200 dark:border-white/10"></div>

                    {/* Language Section */}
                    <div className="px-4 py-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                            {t('language')}
                        </p>
                        <LanguageSwitcher inline />
                    </div>

                    {/* Divider */}
                    <div className="my-2 border-t border-gray-200 dark:border-white/10"></div>

                    {/* Theme Toggle */}
                    <div className="px-4 py-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                            {t('theme')}
                        </p>
                        <button
                            onClick={() => {
                                toggleTheme();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl text-gray-700 dark:text-white/80">
                                    {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                                </span>
                                <span className="text-sm font-medium text-gray-700 dark:text-white/80">
                                    {theme === 'dark' ? t('darkMode') : t('lightMode')}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-white/50">
                                <span className="material-symbols-outlined text-base">swap_horiz</span>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsMenu;
