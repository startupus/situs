import { Router } from 'express';
import { ProjectsController } from '../controllers/projectsController.js';
import { authenticateToken, logRequest } from '../middleware/auth.js';
import { validateRequest, validateQuery, createProjectSchema, updateProjectSchema, updateProjectStatusSchema, getProjectsQuerySchema } from '../validation/schemas.js';
const router = Router();
router.use(logRequest);
router.use(authenticateToken);
router.get('/', validateQuery(getProjectsQuerySchema), ProjectsController.getProjects);
router.get('/:id', ProjectsController.getProject);
router.post('/', validateRequest(createProjectSchema), ProjectsController.createProject);
router.put('/:id', validateRequest(updateProjectSchema), ProjectsController.updateProject);
router.delete('/:id', ProjectsController.deleteProject);
router.patch('/:id/publish', ProjectsController.publishProject);
router.patch('/:id/unpublish', ProjectsController.unpublishProject);
router.patch('/:id/status', validateRequest(updateProjectStatusSchema), ProjectsController.updateProjectStatus);
router.get('/check-slug/:slug', ProjectsController.checkSlugAvailability);
router.get('/check-domain/:domain', ProjectsController.checkDomainAvailability);
export default router;
//# sourceMappingURL=projects.js.map