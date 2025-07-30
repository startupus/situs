import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().optional(),
    domain: Joi.string().pattern(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/).optional(),
    template: Joi.string().valid('website', 'ecommerce', 'blog', 'landing', 'app').optional(),
    settings: Joi.object().optional(),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        details: error.details,
      },
    });
  }
  
  return next();
};

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(30).optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid('admin', 'user', 'moderator').optional(),
    status: Joi.string().valid('active', 'inactive', 'banned').optional(),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        details: error.details,
      },
    });
  }
  
  return next();
}; 