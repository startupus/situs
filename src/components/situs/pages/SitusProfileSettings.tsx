import React, { useState } from 'react';
import { FaCamera, FaEdit, FaLinkedin, FaTwitter, FaGithub, FaInstagram } from 'react-icons/fa';

/**
 * Страница настроек профиля пользователя
 * Базируется на Profile1 компоненте из react-pro-components-main
 */
const SitusProfileSettings: React.FC = () => {
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
      instagram: 'https://instagram.com/dmitriy'
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleSaveProfile = () => {
    // TODO: Интеграция с API для сохранения профиля
    console.log('Сохранение профиля:', userProfile);
  };

  return (
    <div className="bg-gray-50 py-8 dark:bg-dark">
      <div className="mx-auto max-w-6xl px-4">
        {/* Обложка профиля */}
        <div className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-dark-2">
          <div className="relative h-48 md:h-64">
            <img
              src={userProfile.cover}
              alt="Обложка профиля"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute bottom-4 right-4">
              <label
                htmlFor="cover-upload"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/35 bg-white/30 text-white hover:bg-white/20 transition-colors"
              >
                <FaCamera size={16} />
                <input
                  type="file"
                  id="cover-upload"
                  className="sr-only"
                  accept="image/*"
                />
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
                <input
                  type="file"
                  id="avatar-upload"
                  className="sr-only"
                  accept="image/*"
                />
              </label>
            </div>

            {/* Информация профиля */}
            <div className="w-full md:pl-6">
              <div className="mb-6 items-center justify-between sm:flex">
                <div className="mb-6 sm:mb-0">
                  <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
                    {userProfile.firstName} {userProfile.lastName}
                  </h1>
                  <p className="mb-1 text-lg font-medium text-body-color dark:text-dark-6">
                    {userProfile.position}
                  </p>
                  <p className="text-sm text-body-color dark:text-dark-6">
                    {userProfile.company} • {userProfile.location}
                  </p>
                </div>

                {/* Социальные сети */}
                <div className="text-center sm:text-right">
                  <p className="mb-3 text-sm font-medium text-body-color dark:text-dark-6">
                    Социальные сети
                  </p>
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
                <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
                  О себе
                </h3>
                <p className="text-body-color dark:text-dark-6">
                  {userProfile.bio}
                </p>
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
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={userProfile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    value={userProfile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={userProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Должность
                </label>
                <input
                  type="text"
                  value={userProfile.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Компания
                </label>
                <input
                  type="text"
                  value={userProfile.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Местоположение
                </label>
                <input
                  type="text"
                  value={userProfile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Веб-сайт
                </label>
                <input
                  type="url"
                  value={userProfile.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full rounded-lg border border-stroke px-4 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  О себе
                </label>
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
            <h2 className="mb-6 text-xl font-bold text-dark dark:text-white">
              Социальные сети
            </h2>
            
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
      </div>
    </div>
  );
};

export default SitusProfileSettings; 