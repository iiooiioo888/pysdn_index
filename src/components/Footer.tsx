import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mt-20 py-8 border-t border-gray-800"
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400">
          © 2024 PySDN - AI 驅動的內容創作平台
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Powered by React 19 + TypeScript + Vite + Tailwind CSS
        </p>
      </div>
    </motion.footer>
  );
}
