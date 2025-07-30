import express from 'express';
import projectController from '../controllers/project';
import { formatResponse, formatError } from '../../../utils/api-response';
import { validateProject } from '../../../middlewares/validation';

const router = express.Router();

// GET /api/projects - получить список проектов
router.get('/', async (req, res) => {
  try {
    const result = await projectController.find({ query: req.query });
    return res.json(formatResponse(result.data, result.meta));
  } catch (error) {
    console.error('Error in project routes find:', error);
    return res.status(500).json(formatError(error as Error));
  }
});

// GET /api/projects/:id - получить проект по ID
router.get('/:id', async (req, res) => {
  try {
    const result = await projectController.findOne({ params: req.params });
    return res.json(formatResponse(result.data));
  } catch (error) {
    console.error('Error in project routes findOne:', error);
    if ((error as Error).message === 'Project not found') {
      return res.status(404).json(formatError(error as Error));
    }
    return res.status(500).json(formatError(error as Error));
  }
});

// POST /api/projects - создать новый проект
router.post('/', validateProject, async (req, res) => {
  try {
    const result = await projectController.create({ request: { body: req.body } });
    return res.status(201).json(formatResponse(result.data));
  } catch (error) {
    console.error('Error in project routes create:', error);
    if ((error as Error).message === 'Project name is required') {
      return res.status(400).json(formatError(error as Error));
    }
    return res.status(500).json(formatError(error as Error));
  }
});

// PUT /api/projects/:id - обновить проект
router.put('/:id', validateProject, async (req, res) => {
  try {
    const result = await projectController.update({ 
      params: req.params as { id: string }, 
      request: { body: req.body } 
    });
    return res.json(formatResponse(result.data));
  } catch (error) {
    console.error('Error in project routes update:', error);
    return res.status(500).json(formatError(error as Error));
  }
});

// DELETE /api/projects/:id - удалить проект
router.delete('/:id', async (req, res) => {
  try {
    const result = await projectController.delete({ params: req.params });
    return res.json(formatResponse(result.data));
  } catch (error) {
    console.error('Error in project routes delete:', error);
    return res.status(500).json(formatError(error as Error));
  }
});

export default router; 