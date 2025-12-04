import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
];

interface LanguageSwitcherProps {
  inline?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ inline = false }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const currentLanguage = languages.find(lang => i18n.language.startsWith(lang.code.split('-')[0])) || languages[0];

  // Inline mode for embedding in menus
  if (inline) {
    return (
      <div className="flex flex-col gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${i18n.language.startsWith(lang.code.split('-')[0])
                ? 'bg-primary/20 text-primary dark:text-primary font-medium'
                : 'text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
            {i18n.language.startsWith(lang.code.split('-')[0]) && (
              <span className="material-symbols-outlined text-base ml-auto">check</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Original dropdown mode
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white/80 font-bold hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-xl">language</span>
        <span className="hidden sm:inline">{currentLanguage.label}</span>
        <span className="material-symbols-outlined text-xl">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-lg bg-background-dark border border-white/20 shadow-lg z-20">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-white/80 hover:bg-primary/20 hover:text-white"
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;