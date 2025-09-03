import React, { useState } from 'react';
import { MenuItemData, MenuItemLanguageVersion, SUPPORTED_LANGUAGES, SupportedLanguageCode } from '../../../types/menu';
import { FiPlus, FiTrash2, FiGlobe } from 'react-icons/fi';
import CorporateInput from '../../ui/CorporateInput';
import CorporateTextarea from '../../ui/CorporateTextarea';

interface MenuItemLanguageTabsProps {
  item: MenuItemData;
  onUpdate: (item: MenuItemData) => void;
}

/**
 * Компонент языковых вкладок для редактирования мультиязычного пункта меню
 * Реализует концепцию языковых вкладок вместо отдельных пунктов (как в Joomla)
 */
const MenuItemLanguageTabs: React.FC<MenuItemLanguageTabsProps> = ({ item, onUpdate }) => {
  const [activeLanguage, setActiveLanguage] = useState<string>(item.language);
  const [showAddLanguage, setShowAddLanguage] = useState(false);

  // Получаем список доступных языков для пункта меню
  const availableLanguages = [item.language];
  if (item.languageVersions) {
    availableLanguages.push(...item.languageVersions.map((v) => v.language));
  }

  // Получаем список языков, которые можно добавить
  const addableLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) => lang.code !== '*' && !availableLanguages.includes(lang.code),
  );

  // Получаем данные для текущего активного языка
  const getCurrentLanguageData = () => {
    if (activeLanguage === item.language) {
      return {
        language: item.language,
        title: item.title,
        alias: item.alias,
        externalUrl: item.externalUrl || '',
        metaTitle: item.metaTitle || '',
        metaDescription: item.metaDescription || '',
        metaKeywords: item.metaKeywords || '',
        cssClass: item.cssClass || '',
        menuImage: item.menuImage || '',
      };
    }

    const version = item.languageVersions?.find((v) => v.language === activeLanguage);
    return (
      version || {
        language: activeLanguage,
        title: '',
        alias: '',
        externalUrl: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        cssClass: '',
        menuImage: '',
      }
    );
  };

  // Обновляем данные для текущего языка
  const updateCurrentLanguageData = (field: string, value: string) => {
    if (activeLanguage === item.language) {
      // Обновляем основные данные пункта меню
      onUpdate({
        ...item,
        [field]: value,
      });
    } else {
      // Обновляем языковую версию
      const versions = item.languageVersions || [];
      const existingIndex = versions.findIndex((v) => v.language === activeLanguage);

      let updatedVersions;
      if (existingIndex >= 0) {
        updatedVersions = [...versions];
        updatedVersions[existingIndex] = {
          ...updatedVersions[existingIndex],
          [field]: value,
        };
      } else {
        const newVersion: MenuItemLanguageVersion = {
          language: activeLanguage,
          title: '',
          alias: '',
          [field]: value,
        };
        updatedVersions = [...versions, newVersion];
      }

      onUpdate({
        ...item,
        languageVersions: updatedVersions,
      });
    }
  };

  // Добавляем новый язык
  const addLanguage = (languageCode: string) => {
    const newVersion: MenuItemLanguageVersion = {
      language: languageCode,
      title: item.title, // Копируем заголовок из основного языка
      alias: item.alias + '-' + languageCode.toLowerCase().split('-')[0], // catalog-en
    };

    const updatedVersions = [...(item.languageVersions || []), newVersion];
    onUpdate({
      ...item,
      languageVersions: updatedVersions,
    });

    setActiveLanguage(languageCode);
    setShowAddLanguage(false);
  };

  // Удаляем язык
  const removeLanguage = (languageCode: string) => {
    if (languageCode === item.language) {
      alert('Нельзя удалить основной язык пункта меню');
      return;
    }

    if (!confirm(`Вы уверены, что хотите удалить языковую версию "${languageCode}"?`)) {
      return;
    }

    const updatedVersions = (item.languageVersions || []).filter((v) => v.language !== languageCode);
    onUpdate({
      ...item,
      languageVersions: updatedVersions,
    });

    // Переключаемся на основной язык
    setActiveLanguage(item.language);
  };

  const currentData = getCurrentLanguageData();
  const currentLanguageInfo = SUPPORTED_LANGUAGES.find((lang) => lang.code === activeLanguage);

  return (
    <div className="space-y-4">
      {/* Заголовок секции */}
      <div className="flex items-center gap-2 mb-4">
        <FiGlobe className="text-primary" size={20} />
        <h3 className="text-lg font-semibold text-dark dark:text-white">Языковые версии</h3>
      </div>

      {/* Вкладки языков */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-dark-3 rounded-lg p-1">
          {availableLanguages.map((langCode) => {
            const langInfo = SUPPORTED_LANGUAGES.find((lang) => lang.code === langCode);
            const isActive = activeLanguage === langCode;
            const isMainLanguage = langCode === item.language;

            return (
              <div key={langCode} className="relative">
                <button
                  onClick={() => setActiveLanguage(langCode)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white'
                  }`}
                >
                  <span className="text-base">{langInfo?.flag || '🌐'}</span>
                  <span>{langInfo?.name || langCode}</span>
                  {isMainLanguage && <span className="text-xs opacity-75">(основной)</span>}
                </button>

                {/* Кнопка удаления языка */}
                {!isMainLanguage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLanguage(langCode);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    title="Удалить языковую версию"
                  >
                    <FiTrash2 size={10} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Кнопка добавления языка */}
        {addableLanguages.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowAddLanguage(!showAddLanguage)}
              className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-stroke dark:border-dark-3 rounded-md text-sm text-body-color dark:text-dark-6 hover:border-primary hover:text-primary transition-colors"
            >
              <FiPlus size={16} />
              <span>Добавить язык</span>
            </button>

            {/* Выпадающий список языков */}
            {showAddLanguage && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-lg shadow-lg z-10 min-w-[200px]">
                {addableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => addLanguage(lang.code)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="text-sm text-dark dark:text-white">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Форма редактирования для выбранного языка */}
      <div className="bg-gray-50 dark:bg-dark-2 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{currentLanguageInfo?.flag || '🌐'}</span>
          <h4 className="text-lg font-medium text-dark dark:text-white">
            {currentLanguageInfo?.name || activeLanguage}
            {activeLanguage === item.language && (
              <span className="text-sm text-body-color dark:text-dark-6 ml-2">(основной язык)</span>
            )}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Основные поля */}
          <CorporateInput
            label="Заголовок"
            value={currentData.title}
            onChange={(value) => updateCurrentLanguageData('title', value)}
            placeholder="Введите заголовок на выбранном языке"
            required
          />

          <CorporateInput
            label="Алиас (URL)"
            value={currentData.alias}
            onChange={(value) => updateCurrentLanguageData('alias', value)}
            placeholder="url-alias"
            required
          />

          {/* Внешняя ссылка (если применимо) */}
          {item.type === 'URL' && (
            <div className="md:col-span-2">
              <CorporateInput
                label="Внешняя ссылка"
                value={currentData.externalUrl || ''}
                onChange={(value) => updateCurrentLanguageData('externalUrl', value)}
                placeholder="https://example.com"
              />
            </div>
          )}

          {/* SEO поля */}
          <div className="md:col-span-2">
            <h5 className="text-sm font-medium text-dark dark:text-white mb-3">SEO метаданные</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CorporateInput
                label="Meta Title"
                value={currentData.metaTitle || ''}
                onChange={(value) => updateCurrentLanguageData('metaTitle', value)}
                placeholder="SEO заголовок"
              />

              <CorporateInput
                label="Meta Keywords"
                value={currentData.metaKeywords || ''}
                onChange={(value) => updateCurrentLanguageData('metaKeywords', value)}
                placeholder="ключевые, слова, через, запятую"
              />

              <div className="md:col-span-2">
                <CorporateTextarea
                  label="Meta Description"
                  value={currentData.metaDescription || ''}
                  onChange={(value) => updateCurrentLanguageData('metaDescription', value)}
                  placeholder="Описание страницы для поисковых систем"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Стили */}
          <CorporateInput
            label="CSS класс"
            value={currentData.cssClass || ''}
            onChange={(value) => updateCurrentLanguageData('cssClass', value)}
            placeholder="custom-class"
          />

          <CorporateInput
            label="Изображение меню"
            value={currentData.menuImage || ''}
            onChange={(value) => updateCurrentLanguageData('menuImage', value)}
            placeholder="/path/to/image.jpg"
          />
        </div>

        {/* Информационное сообщение */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Совет:</strong> Поля, оставленные пустыми, будут использовать значения из основного языка (
            {SUPPORTED_LANGUAGES.find((l) => l.code === item.language)?.name || item.language}).
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuItemLanguageTabs;
