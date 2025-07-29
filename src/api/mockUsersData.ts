// Временная заглушка для обратной совместимости
// TODO: Полностью мигрировать на новые API сервисы

export const mockUsersApi = {
  getUsers: () => Promise.resolve({
    success: true,
    data: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
  }),
  
  getUserStats: () => Promise.resolve({
    success: true,
    data: {
      total: 0,
      active: 0,
      inactive: 0,
      pending: 0
    }
  }),
  
  createUser: (userData: any) => Promise.resolve({
    success: true,
    data: { id: '1', ...userData }
  }),
  
  updateUser: (id: string, userData: any) => Promise.resolve({
    success: true,
    data: { id, ...userData }
  }),
  
  deleteUser: (id: string) => Promise.resolve({
    success: true,
    data: null
  })
};

export default mockUsersApi; 