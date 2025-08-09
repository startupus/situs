import React from 'react';
import { FiPlus } from 'react-icons/fi';

interface BlogWidgetProps {
  projectId: string;
}

const BlogWidget: React.FC<BlogWidgetProps> = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Постов</div>
          <div className="text-xl font-semibold text-dark dark:text-white">—</div>
        </div>
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Опубликовано</div>
          <div className="text-xl font-semibold text-dark dark:text-white">—</div>
        </div>
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Черновиков</div>
          <div className="text-xl font-semibold text-dark dark:text-white">—</div>
        </div>
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Комментарии</div>
          <div className="text-xl font-semibold text-dark dark:text-white">—</div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white opacity-80 cursor-not-allowed">
          <FiPlus aria-hidden /> Новый пост (скоро)
        </button>
      </div>
    </div>
  );
};

export default BlogWidget;


