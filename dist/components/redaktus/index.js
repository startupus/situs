// Redaktus Main Index - скопировано с ReactBricks
import website from './website';
import blog from './blog';
// Экспорт всех компонентов
export * from './redaktus-core';
export { types } from '../../redaktus/types';
// Экспорт блоков
export { website, blog };
const allBricks = [...website, ...blog];
export default allBricks;
//# sourceMappingURL=index.js.map