// 🏛️ Core Components Registry
// Главный экспорт всех категорий компонентов

export { FreeComponents, default as Free } from './free';
export { ProComponents, default as Pro } from './pro';
export { Templates, default as TemplatesCollection } from './templates';

// Объединенный маппинг всех компонентов
export const AllCoreComponents = {
  // Free components
  ...require('./free').FreeComponents,
  
  // Pro components  
  ...require('./pro').ProComponents,
  
  // Templates
  ...require('./templates').Templates
};

export default AllCoreComponents; 