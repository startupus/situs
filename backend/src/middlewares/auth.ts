import { Request, Response, NextFunction } from 'express';

export default (config: any, { strapi }: any) => {
  return async (ctx: { request: Request; response: Response }, next: NextFunction) => {
    try {
      const { request, response } = ctx;
      
      // В реальном приложении здесь была бы проверка JWT токена
      const authHeader = request.headers.authorization;
      
      if (!authHeader) {
        // Для демонстрации пропускаем аутентификацию
        // В продакшене здесь был бы return response.unauthorized()
        return next();
      }
      
      // Проверка токена
      const token = authHeader.replace('Bearer ', '');
      
      if (token.startsWith('mock-jwt-token-')) {
        // Моковая аутентификация
        (request as any).user = {
          id: 'user_1',
          firstName: 'Админ',
          lastName: 'Ситус',
          email: 'admin@situs.com',
          role: 'admin',
          status: 'active'
        };
        return next();
      }
      
      // В реальном приложении здесь была бы проверка JWT
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // request.user = decoded;
      
      return next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return next();
    }
  };
}; 