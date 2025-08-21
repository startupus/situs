import React from 'react';
import { ThemeStatsCard } from '../../../ui';
import { FiUsers, FiActivity, FiClock, FiWifiOff } from 'react-icons/fi';

interface User {
  id: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastLogin?: Date;
}

interface UserStatsProps {
  users: User[];
}

const UserStats: React.FC<UserStatsProps> = ({ users }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const offlineUsers = users.filter(u => 
    u.lastLogin && new Date().getTime() - u.lastLogin.getTime() > 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <ThemeStatsCard
        title="Всего пользователей"
        value={totalUsers}
        icon={<FiUsers className="w-6 h-6" />}
        color="gray"
      />
      <ThemeStatsCard
        title="Активных"
        value={activeUsers}
        icon={<FiActivity className="w-6 h-6" />}
        color="success"
      />
      <ThemeStatsCard
        title="Ожидают"
        value={pendingUsers}
        icon={<FiClock className="w-6 h-6" />}
        color="warning"
      />
      <ThemeStatsCard
        title="Офлайн"
        value={offlineUsers}
        icon={<FiWifiOff className="w-6 h-6" />}
        color="gray"
      />
    </div>
  );
};

export default UserStats;
