import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeatureCard from './components/FeatureCard';
import Footer from './components/Footer';

function App() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('generate_video'),
      description: 'AI 驅動的影片生成，輕鬆創建專業內容',
      icon: '🎬',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: t('create_short_drama'),
      description: '一鍵生成精彩短劇，講述你的故事',
      icon: '🎭',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: t('image_workshop'),
      description: '強大的圖片編輯與生成工具',
      icon: '🎨',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: t('prompt_optimizer'),
      description: '智能優化提示詞，提升生成品質',
      icon: '✨',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: t('trend_tracker'),
      description: '追蹤最新趨勢，把握創作方向',
      icon: '📈',
      color: 'from-red-500 to-rose-500',
    },
    {
      title: t('contact_us'),
      description: '隨時聯繫我們，獲得專業支援',
      icon: '💬',
      color: 'from-indigo-500 to-violet-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
