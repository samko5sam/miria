import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en-US', label: 'English' },
  { code: 'zh-TW', label: '繁體中文' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false); // 選擇後關閉選單
  };

  // 處理點擊元件外部時關閉選單的邏輯
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    // 監聽 mousedown 事件
    document.addEventListener('mousedown', handleClickOutside);
    // 元件卸載時移除監聽
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const currentLanguage = languages.find(lang => i18n.language.startsWith(lang.code.split('-')[0])) || languages[0];

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

      {/* Dropdown Panel */}
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