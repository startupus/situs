#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();

// Архитектурно правильная функция поиска свободного порта
async function findFreePort(startPort: number = 3000): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(startPort, () => {
      const port = (server.address() as any)?.port || startPort;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findFreePort(startPort + 1));
    });
  });
}

// Minimal middleware - без внешних зависимостей
app.use(cors());
app.use(express.json());

// Встроенное логирование
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ВСТРОЕННЫЕ МАРШРУТЫ (без внешних файлов)
// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'startupus-platform',
    architecture: 'monolithic-self-contained',
  });
});

// Currencies API (встроенный)
app.get('/api/currencies', (req, res) => {
  res.json({
    currencies: [
      { id: 'usd', name: 'US Dollar', symbol: '$', rate: 1.0 },
      { id: 'eur', name: 'Euro', symbol: '€', rate: 0.85 },
      { id: 'mnt', name: 'Mongolian Tugrik', symbol: '₮', rate: 2800 },
    ],
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/currencies/stats', (req, res) => {
  res.json({
    totalCurrencies: 3,
    activeCurrencies: 3,
    lastUpdated: new Date().toISOString(),
  });
});

app.get('/api/currencies/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    name: `Currency ${id.toUpperCase()}`,
    symbol: '$',
    rate: 1.0,
    active: true,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Startupus Platform - Monolithic Architecture',
    status: 'running',
    endpoints: ['/health', '/api/currencies', '/api/currencies/stats'],
    architecture: 'self-contained',
  });
});

// Встроенная обработка ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal Server Error', architecture: 'monolithic' });
});

// Архитектурно правильный запуск с автопоиском порта
async function startServer() {
  try {
    const PORT = await findFreePort(3000);

    app.listen(PORT, () => {
      console.log(`[${new Date().toISOString()}] 🚀 Startupus Platform running on port ${PORT}`);
      console.log(`[${new Date().toISOString()}] 📊 Health check: http://localhost:${PORT}/health`);
      console.log(`[${new Date().toISOString()}] 🏗️  Architecture: Monolithic Self-Contained`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Архитектурно правильный запуск
startServer();

export default app;
