import { Request, Response } from 'express';
export declare class ProjectsController {
    static getProjects(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static createProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static publishProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static unpublishProject(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateProjectStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static checkSlugAvailability(req: Request, res: Response): Promise<void>;
    static checkDomainAvailability(req: Request, res: Response): Promise<void>;
}
export default ProjectsController;
//# sourceMappingURL=projectsController.d.ts.map