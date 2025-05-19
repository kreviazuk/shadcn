import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // 从远程位置加载翻译（例如 public/locales）
  .use(LanguageDetector) // 检测用户语言
  .use(initReactI18next) // 将 i18n 实例传递给 react-i18next
  .init({
    supportedLngs: ['en', 'zh'], // 支持的语言列表
    fallbackLng: 'en', // 如果检测到的语言不可用，则使用的默认语言
    debug: process.env.NODE_ENV === 'development', // 在开发模式下启用调试输出
    interpolation: {
      escapeValue: false, // React 已经做了 XSS 防护
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // 翻译文件的路径
    },
  });

export default i18n; 