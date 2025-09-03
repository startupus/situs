import React from 'react';
import { ThemeStatsCard } from '../../../ui';
import { FiUsers, FiActivity, FiClock, FiWifiOff } from 'react-icons/fi';

interface User {
  id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED';
  lastLogin?: Date;
}

interface UserStatsProps {
  users: User[];
}

const UserStats: React.FC<UserStatsProps> = ({ users }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;
  const pendingUsers = users.filter((u) => u.status === 'PENDING').length;
  const suspendedUsers = users.filter((u) => u.status === 'SUSPENDED' || u.status === 'BANNED').length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <ThemeStatsCard
        title="Всего пользователей"
        value={totalUsers}
        icon={<FiUsers className="w-6 h-6" />}
        color="gray"
      />
      <ThemeStatsCard title="Активных" value={activeUsers} icon={<FiActivity className="w-6 h-6" />} color="success" />
      <ThemeStatsCard title="Ожидают" value={pendingUsers} icon={<FiClock className="w-6 h-6" />} color="warning" />
      <ThemeStatsCard
        title="Заблокированных"
        value={suspendedUsers}
        icon={<FiWifiOff className="w-6 h-6" />}
        color="danger"
      />
    </div>
  );
};

export default UserStats;
