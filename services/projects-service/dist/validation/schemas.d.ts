import Joi from 'joi';
export declare const createProjectSchema: Joi.ObjectSchema<any>;
export declare const updateProjectSchema: Joi.ObjectSchema<any>;
export declare const updateProjectStatusSchema: Joi.ObjectSchema<any>;
export declare const getProjectsQuerySchema: Joi.ObjectSchema<any>;
export declare const createPageSchema: Joi.ObjectSchema<any>;
export declare const updatePageSchema: Joi.ObjectSchema<any>;
export declare const validateRequest: (schema: Joi.Schema) => (req: any, res: any, next: any) => any;
export declare const validateQuery: (schema: Joi.Schema) => (req: any, res: any, next: any) => any;
export declare const validateParams: (schema: Joi.Schema) => (req: any, res: any, next: any) => any;
//# sourceMappingURL=schemas.d.ts.map