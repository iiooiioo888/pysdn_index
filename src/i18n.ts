import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  zh: {
    translation: {
      "welcome": "歡迎使用 PySDN",
      "subtitle": "AI 驅動的內容創作平台",
      "generate_video": "生成影片",
      "create_short_drama": "創作短劇",
      "image_workshop": "圖片工坊",
      "prompt_optimizer": "提示詞優化",
      "trend_tracker": "趨勢追蹤",
      "contact_us": "聯絡我們",
      "loading": "載入中...",
      "submit": "提交",
      "cancel": "取消",
      "success": "成功",
      "error": "錯誤",
      "status": "狀態",
      "processing": "處理中",
      "completed": "已完成",
      "failed": "失敗",
    },
  },
  en: {
    translation: {
      "welcome": "Welcome to PySDN",
      "subtitle": "AI-Powered Content Creation Platform",
      "generate_video": "Generate Video",
      "create_short_drama": "Create Short Drama",
      "image_workshop": "Image Workshop",
      "prompt_optimizer": "Prompt Optimizer",
      "trend_tracker": "Trend Tracker",
      "contact_us": "Contact Us",
      "loading": "Loading...",
      "submit": "Submit",
      "cancel": "Cancel",
      "success": "Success",
      "error": "Error",
      "status": "Status",
      "processing": "Processing",
      "completed": "Completed",
      "failed": "Failed",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
