import React, { useState, useEffect } from 'react';
import { FiX, FiMail, FiClock, FiCheck, FiXCircle, FiRefreshCw, FiTrash2, FiEye } from 'react-icons/fi';
import { InvitationsAPI, Invitation } from '../../../../api/services/invitations.api';
import { ThemeButton, ThemeCheckbox, ThemeBadge, ThemeActionButtons } from '../../../ui';

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
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvitations, setSelectedInvitations] = useState<string[]>([]);
  const [inviteForm, setInviteForm] = useState<InviteForm>({
    emails: '',
    role: 'BUSINESS',
    message: '',
    expiresIn: 7,
  });

  // Загрузка приглашений
  useEffect(() => {
    loadInvitations();
  }, []);

  // Функции для работы с выбранными приглашениями
  const handleSelectInvitation = (invitationId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvitations((prev) => [...prev, invitationId]);
    } else {
      setSelectedInvitations((prev) => prev.filter((id) => id !== invitationId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvitations(invitations.map((inv) => inv.id));
    } else {
      setSelectedInvitations([]);
    }
  };

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const response = await InvitationsAPI.getInvitations({ limit: 50 });
      setInvitations(response.data);
    } catch (err) {
      setError('Ошибка загрузки приглашений');
      console.error('Error loading invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitations = async () => {
    try {
      const emails = inviteForm.emails.split('\n').filter((email) => email.trim());
      const expiresAt = new Date(Date.now() + inviteForm.expiresIn * 24 * 60 * 60 * 1000).toISOString();

      await InvitationsAPI.createInvitations({
        emails,
        role: inviteForm.role,
        message: inviteForm.message || undefined,
        channel: 'EMAIL',
        expiresAt,
      });

      setShowInviteForm(false);
      setInviteForm({
        emails: '',
        role: 'BUSINESS',
        message: '',
        expiresIn: 7,
      });

      // Перезагружаем список приглашений
      await loadInvitations();

      // Вызываем callback для совместимости
      onSendInvitations(inviteForm);
    } catch (err) {
      setError('Ошибка отправки приглашений');
      console.error('Error sending invitations:', err);
    }
  };

  const handleResendInvitation = async (id: string) => {
    try {
      await InvitationsAPI.resendInvitation(id);
      await loadInvitations();
    } catch (err) {
      setError('Ошибка повторной отправки');
      console.error('Error resending invitation:', err);
    }
  };

  const handleCancelInvitation = async (id: string) => {
    try {
      await InvitationsAPI.cancelInvitation(id);
      await loadInvitations();
    } catch (err) {
      setError('Ошибка отмены приглашения');
      console.error('Error cancelling invitation:', err);
    }
  };

  const handleDeleteInvitation = async (id: string) => {
    if (!confirm('Удалить приглашение?')) return;

    try {
      await InvitationsAPI.deleteInvitation(id);
      await loadInvitations();
    } catch (err) {
      setError('Ошибка удаления приглашения');
      console.error('Error deleting invitation:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'ACCEPTED':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'EXPIRED':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'CANCELLED':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Ожидает';
      case 'ACCEPTED':
        return 'Принято';
      case 'EXPIRED':
        return 'Истекло';
      case 'CANCELLED':
        return 'Отменено';
      default:
        return status;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'BUSINESS':
        return 'Бизнес';
      case 'AGENCY':
        return 'Агентство';
      case 'STAFF':
        return 'Сотрудник';
      case 'SUPER_ADMIN':
        return 'Супер Админ';
      default:
        return role;
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Система приглашений</h3>
          <button
            onClick={() => setShowInviteForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FiMail className="w-4 h-4 mr-2" />
            Пригласить
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="mt-2 text-sm text-red-500 hover:text-red-700 underline">
              Закрыть
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Загрузка приглашений...</p>
          </div>
        ) : !invitations || invitations.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FiMail className="mx-auto h-12 w-12 mb-4" />
            <p>Приглашения не найдены</p>
            <p className="text-sm mt-2">Создайте первое приглашение, нажав кнопку выше</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <ThemeCheckbox
                      checked={selectedInvitations.length === invitations.length && invitations.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Роль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Отправлено
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Истекает
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {invitations.map((invitation) => (
                  <tr key={invitation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <ThemeCheckbox
                        checked={selectedInvitations.includes(invitation.id)}
                        onChange={(checked) => handleSelectInvitation(invitation.id, checked)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <FiMail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          {/* Статус-индикатор на аватарке */}
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                              invitation.status === 'PENDING'
                                ? 'bg-yellow-500'
                                : invitation.status === 'ACCEPTED'
                                  ? 'bg-green-500'
                                  : invitation.status === 'EXPIRED'
                                    ? 'bg-red-500'
                                    : 'bg-gray-500'
                            }`}
                          ></div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{invitation.email}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Приглашение</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ThemeBadge variant="info" size="sm">
                        {getRoleText(invitation.role)}
                      </ThemeBadge>
                    </td>
                    <td className="px-6 py-4">
                      <ThemeBadge
                        variant={
                          invitation.status === 'PENDING'
                            ? 'warning'
                            : invitation.status === 'ACCEPTED'
                              ? 'success'
                              : invitation.status === 'EXPIRED'
                                ? 'error'
                                : 'secondary'
                        }
                        size="sm"
                      >
                        {getStatusText(invitation.status)}
                      </ThemeBadge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {invitation.sentAt ? new Date(invitation.sentAt).toLocaleDateString('ru-RU') : 'Не отправлено'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(invitation.expiresAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <ThemeActionButtons
                        onEdit={
                          invitation.status === 'PENDING' ? () => handleResendInvitation(invitation.id) : undefined
                        }
                        onDelete={() => handleDeleteInvitation(invitation.id)}
                        editTitle="Переотправить приглашение"
                        deleteTitle="Удалить приглашение"
                        editIcon={<FiRefreshCw />}
                        showEdit={invitation.status === 'PENDING'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальное окно приглашений - TailGrids стиль */}
      {showInviteForm && (
        <div className="fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 z-50">
          <div className="w-full max-w-md rounded-lg bg-white px-6 py-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Пригласить пользователей</h3>
              <button
                onClick={() => setShowInviteForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-base font-medium text-gray-900 dark:text-white">Email адреса</label>
                <textarea
                  value={inviteForm.emails}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, emails: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md transition-all"
                  rows={4}
                  placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Введите по одному email адресу на строку
                </p>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Роль</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="BUSINESS">Бизнес</option>
                    <option value="AGENCY">Агентство</option>
                    <option value="STAFF">Сотрудник</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="mb-3 block text-base font-medium text-gray-900 dark:text-white">
                    Срок действия
                  </label>
                  <select
                    value={inviteForm.expiresIn}
                    onChange={(e) => setInviteForm((prev) => ({ ...prev, expiresIn: parseInt(e.target.value) }))}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value={1}>1 день</option>
                    <option value={3}>3 дня</option>
                    <option value={7}>7 дней</option>
                    <option value={14}>14 дней</option>
                    <option value={30}>30 дней</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-base font-medium text-gray-900 dark:text-white">
                  Персональное сообщение
                </label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-3 px-6 text-base font-medium text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:shadow-md transition-all"
                  rows={3}
                  placeholder="Добро пожаловать в нашу платформу! Мы рады видеть вас в нашей команде..."
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Необязательное поле. Будет добавлено к стандартному тексту приглашения.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mt-8">
              <div className="w-1/2 px-3">
                <button
                  onClick={() => setShowInviteForm(false)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 p-3 text-center text-base font-medium text-gray-700 dark:text-gray-300 transition hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
              </div>
              <div className="w-1/2 px-3">
                <button
                  onClick={handleSendInvitations}
                  disabled={!inviteForm.emails.trim()}
                  className="block w-full rounded-md border border-blue-600 bg-blue-600 p-3 text-center text-base font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center">
                    <FiMail className="w-4 h-4 mr-2" />
                    Пригласить
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInvites;
