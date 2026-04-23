import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onLanguageChange?: (lang: string) => void;
}

export default function Header({ onLanguageChange }: HeaderProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    onLanguageChange?.(newLang);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/70 border-b border-purple-500/20"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center space-x-3"
        >
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            PySDN
          </span>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center space-x-6"
        >
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 transition-all duration-300 border border-purple-500/30 text-purple-300 hover:text-purple-200"
          >
            {i18n.language === 'zh' ? 'EN' : '中文'}
          </button>
        </motion.nav>
      </div>
    </motion.header>
  );
}
