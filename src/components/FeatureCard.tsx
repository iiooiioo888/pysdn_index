import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function FeatureCard({ title, description, icon, color }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03,
        y: -5,
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative p-4 md:p-6 rounded-xl md:rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
    >
      {/* 漸層背景 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* 內容 */}
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-3xl md:text-4xl mb-3 md:mb-4"
        >
          {icon}
        </motion.div>
        
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-sm md:text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* 裝飾性光暈 */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 md:w-32 md:h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-500" />
    </motion.div>
  );
}
