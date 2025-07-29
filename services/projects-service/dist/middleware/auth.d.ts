import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                username: string;
                email: string;
                role: string;
                iat?: number;
                exp?: number;
            };
        }
    }
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireRole: (roles: string | string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireOwnership: (resourceUserIdField?: string) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const logRequest: (req: Request, res: Response, next: NextFunction) => void;
export declare const generateToken: (user: {
    id: string;
    username: string;
    email: string;
    role: string;
}) => string;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload | null;
//# sourceMappingURL=auth.d.ts.map