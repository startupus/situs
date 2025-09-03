import React from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';

interface WebsiteWidgetProps {
  projectId: string;
}

const WebsiteWidget: React.FC<WebsiteWidgetProps> = ({ projectId }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Страниц</div>
          <div className="text-xl font-semibold text-dark dark:text-white">5</div>
        </div>
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Опубликовано</div>
          <div className="text-xl font-semibold text-dark dark:text-white">0</div>
        </div>
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Черновиков</div>
          <div className="text-xl font-semibold text-dark dark:text-white">5</div>
        </div>
        <div className="rounded-lg border border-stroke dark:border-dark-3 p-3 bg-gray-50 dark:bg-dark-3">
          <div className="text-xs text-body-color dark:text-dark-6">Просмотры</div>
          <div className="text-xl font-semibold text-dark dark:text-white">—</div>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          to={`/redaktus?projectId=${projectId}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <FiExternalLink aria-hidden /> Открыть редактор
        </Link>
      </div>
    </div>
  );
};

export default WebsiteWidget;
