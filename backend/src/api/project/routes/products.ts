import express from 'express';
import productController from '../controllers/product';

const router = express.Router();

// GET /api/projects/:projectId/products - получить список продуктов проекта
router.get('/', async (req, res) => {
  try {
    const result = await productController.find({
      params: { projectId: req.params.projectId },
      query: req.query,
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in products route GET:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/projects/:projectId/products/:productId - получить конкретный продукт
router.get('/:productId', async (req, res) => {
  try {
    const result = await productController.findOne({
      params: { 
        projectId: req.params.projectId,
        productId: req.params.productId 
      },
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in products route GET /:productId:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/projects/:projectId/products - создать новый продукт
router.post('/', async (req, res) => {
  try {
    const result = await productController.create({
      params: { projectId: req.params.projectId },
      request: { body: req.body },
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in products route POST:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/projects/:projectId/products/:productId - обновить продукт
router.put('/:productId', async (req, res) => {
  try {
    const result = await productController.update({
      params: { 
        projectId: req.params.projectId,
        productId: req.params.productId 
      },
      request: { body: req.body },
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in products route PUT:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/projects/:projectId/products/:productId - удалить продукт
router.delete('/:productId', async (req, res) => {
  try {
    const result = await productController.delete({
      params: { 
        projectId: req.params.projectId,
        productId: req.params.productId 
      },
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in products route DELETE:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
