import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaCamera, FaEdit, FaLinkedin, FaTwitter, FaGithub, FaInstagram, FaCog, FaBell, FaLock } from 'react-icons/fa';
import GeneralSettings from '../settings/GeneralSettings';
import NotificationsSettings from '../settings/NotificationsSettings';
import SecuritySettings from '../settings/SecuritySettings';

/**
 * Страница настроек профиля пользователя
 * Базируется на Profile1 компоненте из react-pro-components-main
 */
const SitusProfileSettings: React.FC = () => {
  // Вкладки (левая навигация): профиль пользователя и системные пользовательские настройки
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab') || 'profile';
  const activeTab = useMemo(
    () => (['profile', 'general', 'notifications', 'security'].includes(rawTab) ? rawTab : 'profile'),
    [rawTab],
  );

  const [userProfile, setUserProfile] = useState({
    firstName: 'Дмитрий',
    lastName: 'Разработчик',
    email: 'dmitriy@situs.ru',
    phone: '+7 (999) 123-45-67',
    position: 'Fullstack Developer',
    company: 'Situs Ltd.',
    bio: 'Разрабатываю современные веб-приложения с использованием React, TypeScript и Node.js',
    location: 'Москва, Россия',
    website: 'https://situs.ru',
    avatar: 'https://cdn.tailgrids.com/2.0/image/dashboard/images/profiles/profile-01/profile.png',
    cover: 'https://cdn.tailgrids.com/2.0/image/dashboard/images/profiles/profile-01/cover.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/dmitriy',
      twitter: 'https://twitter.com/dmitriy',
      github: 'https://github.com/dmitriy',
      instagram: 'https://instagram.com/dmitriy',
    },
  });

  // Массив-схема для маппинга данных с бэка на поля страницы
  const profileFieldSchema: Array<{ key: keyof typeof userProfile; label: string }> = [
    { key: 'firstName', label: 'Имя' },
    { key: 'lastName', label: 'Фамилия' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Телефон' },
    { key: 'position', label: 'Должность' },
    { key: 'company', label: 'Компания' },
    { key: 'bio', label: 'О себе' },
    { key: 'location', label: 'Местоположение' },
    { key: 'website', label: 'Веб-сайт' },
  ];

  const IN_DEV = 'В разработке';

  // Подключение реальных данных профиля /api/users/me. Пустые поля → "В разработке"
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch('/api/users/me');
        if (!res.ok) throw new Error(String(res.status));
        const payload = await res.json();
        const data = payload && typeof payload === 'object' && 'data' in payload ? (payload as any).data : payload;

        // "profile" может быть JSON строкой с name/avatar/bio/phone/position/company/location/website
        let profileJson: any = {};
        try {
          profileJson = data?.profile
            ? typeof data.profile === 'string'
              ? JSON.parse(data.profile)
              : data.profile
            : {};
        } catch {
          profileJson = {};
        }

        const fullName: string = profileJson.name || data?.name || '';
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || IN_DEV;
        const lastName = nameParts.slice(1).join(' ') || IN_DEV;

        const nextState = {
          firstName,
          lastName,
          email: data?.email || IN_DEV,
          phone: profileJson.phone || IN_DEV,
          position: profileJson.position || IN_DEV,
          company: profileJson.company || IN_DEV,
          bio: profileJson.bio || IN_DEV,
          location: profileJson.location || IN_DEV,
          website: profileJson.website || IN_DEV,
          avatar:
            data?.avatar ||
            profileJson.avatar ||
            'https://ui-avatars.com/api/?name=' +
              encodeURIComponent(fullName || 'User') +
              '&background=3b82f6&color=fff',
          cover: userProfile.cover,
          socialLinks: {
            linkedin: profileJson.socialLinks?.linkedin || '',
            twitter: profileJson.socialLinks?.twitter || '',
            github: profileJson.socialLinks?.github || '',
            instagram: profileJson.socialLinks?.instagram || '',
          },
        } as typeof userProfile;

        if (!aborted) setUserProfile(nextState);
      } catch {
        // Если бэк недоступен — оставляем текущие значения (демо) и помечаем пустые как "В разработке"
        if (!aborted) {
          setUserProfile((prev) => ({
            ...prev,
            firstName: prev.firstName || IN_DEV,
            lastName: prev.lastName || IN_DEV,
            email: prev.email || IN_DEV,
            phone: prev.phone || IN_DEV,
            position: prev.position || IN_DEV,
            company: prev.company || IN_DEV,
            bio: prev.bio || IN_DEV,
            location: prev.location || IN_DEV,
            website: prev.website || IN_DEV,
          }));
        }
      }
    })();
    return () => {
      aborted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Локальные глобальные настройки пользователя для табов
  const [globalSettings, setGlobalSettings] = useState({
    theme: 'auto',
    language: 'ru',
    timezone: 'Europe/Moscow',
    notifications: {
      marketing: true,
      system: true,
      security: true,
    } as Record<string, boolean>,
  });

  const handleInputChange = (field: string, value: string) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setUserProfile((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSaveProfile = () => {
    // TODO: Интеграция с API для сохранения профиля
    console.log('Сохранение профиля:', userProfile);
  };

  // Обработчики для табов настроек
  const handleGlobalSettingChange = (category: string, setting: string, value: any) => {
    setGlobalSettings((prev) => {
      if (category === 'notifications') {
        return { ...prev, notifications: { ...prev.notifications, [setting]: !!value } };
      }
      return { ...prev, [category]: value } as any;
    });
  };

  const handleSaveSettings = () => {
    // TODO: Интеграция с API сохранения пользовательских настроек
    console.log('Сохранение пользовательских настроек:', globalSettings);
  };

  // Рендер контента вкладки "Профиль"
  const renderProfileTab = () => (
    <>
      {/* Обложка профиля */}
      <div className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-dark-2">
        <div className="relative h-48 md:h-64">
          <img src={userProfile.cover} alt="Обложка профиля" className="h-full w-full object-cover object-center" />
          <div className="absolute bottom-4 right-4">
            <label
              htmlFor="cover-upload"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/35 bg-white/30 text-white hover:bg-white/20 transition-colors"
            >
              <FaCamera size={16} />
              <input type="file" id="cover-upload" className="sr-only" accept="image/*" />
            </label>
          </div>
        </div>

        {/* Профиль пользователя */}
        <div className="flex flex-wrap px-6 pb-8 pt-6 md:flex-nowrap">
          {/* Аватар */}
          <div className="relative -top-16 z-30 h-32 w-32 rounded-full border-4 border-white shadow-lg dark:border-dark">
            <img
              src={userProfile.avatar}
              alt="Аватар профиля"
              className="h-full w-full rounded-full object-cover object-center"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <FaCamera size={12} />
              <input type="file" id="avatar-upload" className="sr-only" accept="image/*" />
            </label>
          </div>

          {/* Информация профиля */}
          <div className="w-full md:pl-6">
            <div className="mb-6 items-center justify-between sm:flex">
              <div className="mb-6 sm:mb-0">
                <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
                  {userProfile.firstName} {userProfile.lastName}
                </h1>
                <p className="mb-1 text-lg font-medium text-body-color dark:text-dark-6">{userProfile.position}</p>
                <p className="text-sm text-body-color dark:text-dark-6">
                  {userProfile.company} • {userProfile.location}
                </p>
              </div>

              {/* Социальные сети */}
              <div className="text-center sm:text-right">
                <p className="mb-3 text-sm font-medium text-body-color dark:text-dark-6">Социальные сети</p>
                <div className="flex items-center space-x-3 sm:justify-end">
                  <a href={userProfile.socialLinks.linkedin} className="text-blue-600 hover:text-blue-700">
                    <FaLinkedin size={20} />
                  </a>
                  <a href={userProfile.socialLinks.twitter} className="text-blue-400 hover:text-blue-500">
                    <FaTwitter size={20} />
                  </a>
                  <a href={userProfile.socialLinks.github} className="text-gray-700 hover:text-gray-800">
                    <FaGithub size={20} />
                  </a>
                  <a href={userProfile.socialLinks.instagram} className="text-pink-600 hover:text-pink-700">
                    <FaInstagram size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Биография */}
            <div className="mb-8 rounded-lg bg-gray-50 p-4 dark:bg-dark">
              <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">О себе</h3>
              <p className="text-body-color dark:text-dark-6">{userProfile.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Форма настроек */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Основная информация */}
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-dark-2">
          <h2 className="mb-6 text-xl font-bold text-dark dark:text-white flex items-center">
            <FaEdit className="mr-2" />
            Основная информация
          </h2>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Имя</label>
                <input
                  type="text"
                  value={userProfile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Фамилия</label>
                <input
                  type="text"
                  value={userProfile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Email</label>
              <input
                type="email"
                value={userProfile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Телефон</label>
              <input
                type="tel"
                value={userProfile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Должность</label>
              <input
                type="text"
                value={userProfile.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Компания</label>
              <input
                type="text"
                value={userProfile.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Местоположение</label>
              <input
                type="text"
                value={userProfile.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Веб-сайт</label>
              <input
                type="url"
                value={userProfile.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">О себе</label>
              <textarea
                value={userProfile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Социальные сети */}
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-dark-2">
          <h2 className="mb-6 text-xl font-bold text-dark dark:text-white">Социальные сети</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 flex items-center text-sm font-medium text-dark dark:text-white">
                <FaLinkedin className="mr-2 text-blue-600" />
                LinkedIn
              </label>
              <input
                type="url"
                value={userProfile.socialLinks.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center text-sm font-medium text-dark dark:text-white">
                <FaTwitter className="mr-2 text-blue-400" />
                Twitter
              </label>
              <input
                type="url"
                value={userProfile.socialLinks.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                placeholder="https://twitter.com/username"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center text-sm font-medium text-dark dark:text-white">
                <FaGithub className="mr-2 text-gray-700" />
                GitHub
              </label>
              <input
                type="url"
                value={userProfile.socialLinks.github}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center text-sm font-medium text-dark dark:text-white">
                <FaInstagram className="mr-2 text-pink-600" />
                Instagram
              </label>
              <input
                type="url"
                value={userProfile.socialLinks.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleSaveProfile}
              className="flex-1 rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors font-medium"
            >
              Сохранить изменения
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg border border-stroke px-6 py-3 text-dark hover:bg-gray-50 transition-colors font-medium dark:border-dark-3 dark:text-white dark:hover:bg-dark"
            >
              Отменить
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Основная разметка страницы с левой навигацией
  return (
    <div className="bg-gray-50 py-8 dark:bg-dark">
      <div className="px-4 xl:px-8 max-w-none">
        <div className="grid gap-6">
          {/* Контент с горизонтальными вкладками */}
          <section>
            {/* Горизонтальные вкладки под шапкой профиля / в верхней части контента */}
            <nav className="mb-4 border-b border-stroke dark:border-dark-3">
              <ul className="-mb-px flex flex-wrap gap-2">
                {[
                  { id: 'profile', name: 'Профиль' },
                  { id: 'general', name: 'Общие' },
                  { id: 'notifications', name: 'Уведомления' },
                  { id: 'security', name: 'Безопасность' },
                ].map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setSearchParams(tab.id === 'profile' ? {} : { tab: tab.id })}
                      className={`inline-flex items-center rounded-t-md px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-body-color hover:text-primary hover:border-primary'
                      }`}
                    >
                      {tab.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'general' && (
              <GeneralSettings
                globalSettings={globalSettings as any}
                handleGlobalSettingChange={handleGlobalSettingChange}
                handleSave={handleSaveSettings}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationsSettings
                globalSettings={globalSettings as any}
                handleGlobalSettingChange={handleGlobalSettingChange}
                handleSave={handleSaveSettings}
              />
            )}
            {activeTab === 'security' && <SecuritySettings handleSave={handleSaveSettings} />}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SitusProfileSettings;
