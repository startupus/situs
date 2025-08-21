import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface InviteForm {
  emails: string;
  role: string;
  message: string;
  expiresIn: number;
}

interface UserInvitesProps {
  onSendInvitations: (inviteData: InviteForm) => void;
}

const UserInvites: React.FC<UserInvitesProps> = ({ onSendInvitations }) => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState<InviteForm>({
    emails: '',
    role: 'BUSINESS',
    message: '',
    expiresIn: 7
  });

  const handleSendInvitations = () => {
    onSendInvitations(inviteForm);
    setShowInviteForm(false);
    setInviteForm({
      emails: '',
      role: 'BUSINESS',
      message: '',
      expiresIn: 7
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Система приглашений
          </h3>
          <button
            onClick={() => setShowInviteForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Отправить приглашения
          </button>
        </div>
        
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>История приглашений будет отображаться здесь</p>
        </div>
      </div>

      {/* Модальное окно приглашений */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Пригласить пользователей
              </h3>
              <button
                onClick={() => setShowInviteForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email адреса (по одному на строку)
                </label>
                <textarea
                  value={inviteForm.emails}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, emails: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="user1@example.com&#10;user2@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Роль по умолчанию
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="BUSINESS">Бизнес</option>
                  <option value="AGENCY">Агентство</option>
                  <option value="STAFF">Сотрудник</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Персональное сообщение (необязательно)
                </label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Добро пожаловать в нашу платформу..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowInviteForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSendInvitations}
                disabled={!inviteForm.emails.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Отправить приглашения
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInvites;
