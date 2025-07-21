#!/usr/bin/env ts-node

import { spawn, ChildProcess } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import path from 'path';

const sleep = promisify(setTimeout);

interface ServiceConfig {
  name: string;
  path: string;
  port: number;
  healthEndpoint: string;
  startCommand: string;
  env?: Record<string, string>;
}

const services: ServiceConfig[] = [
  {
    name: 'gateway-service',
    path: '../services/gateway-service',
    port: 3010,
    healthEndpoint: '/health',
    startCommand: 'npm run dev',
    env: {
      NODE_ENV: 'test',
      PORT: '3010',
      JWT_SECRET: 'test-secret-ecosystem',
    },
  },
  {
    name: 'agents-service',
    path: '../services/agents-service',
    port: 3007,
    healthEndpoint: '/health',
    startCommand: 'npm run dev',
    env: {
      NODE_ENV: 'test',
      PORT: '3007',
      JWT_SECRET: 'test-secret-ecosystem',
      DATABASE_URL: 'file:./test-ecosystem.db',
    },
  },
  {
    name: 'loginus',
    path: '../services/loginus',
    port: 3002,
    healthEndpoint: '/health',
    startCommand: 'npm run dev',
    env: {
      NODE_ENV: 'test',
      PORT: '3002',
      JWT_SECRET: 'test-secret-ecosystem',
    },
  },
  {
    name: 'bilingus-service',
    path: '../services/bilingus-service',
    port: 3003,
    healthEndpoint: '/health',
    startCommand: 'npm run dev',
    env: {
      NODE_ENV: 'test',
      PORT: '3003',
      JWT_SECRET: 'test-secret-ecosystem',
    },
  },
];

class EcosystemTestRunner {
  private processes: Map<string, ChildProcess> = new Map();
  private isShuttingDown = false;

  async run(): Promise<void> {
    console.log('🚀 Starting Ecosystem Integration Tests...\n');

    // Обработка сигналов для graceful shutdown
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());

    try {
      // 1. Проверяем наличие сервисов
      await this.checkServices();

      // 2. Запускаем сервисы
      await this.startServices();

      // 3. Ждем готовности сервисов
      await this.waitForServices();

      // 4. Запускаем интеграционные тесты
      await this.runIntegrationTests();

      console.log('\n✅ Ecosystem Integration Tests completed successfully!');
    } catch (error) {
      console.error('\n❌ Ecosystem Integration Tests failed:', error);
      process.exit(1);
    } finally {
      await this.shutdown();
    }
  }

  private async checkServices(): Promise<void> {
    console.log('🔍 Checking services...');

    for (const service of services) {
      const servicePath = path.resolve(__dirname, service.path);
      const packageJsonPath = path.join(servicePath, 'package.json');

      if (!existsSync(packageJsonPath)) {
        throw new Error(`Service ${service.name} not found at ${servicePath}`);
      }

      console.log(`  ✅ ${service.name} found`);
    }

    console.log('');
  }

  private async startServices(): Promise<void> {
    console.log('🏃 Starting services...');

    for (const service of services) {
      await this.startService(service);
      await sleep(2000); // Даем время на запуск
    }

    console.log('');
  }

  private async startService(service: ServiceConfig): Promise<void> {
    const servicePath = path.resolve(__dirname, service.path);
    
    console.log(`  🚀 Starting ${service.name}...`);

    const process = spawn('npm', ['run', 'dev'], {
      cwd: servicePath,
      env: {
        ...process.env,
        ...service.env,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    this.processes.set(service.name, process);

    process.stdout?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Server running') || output.includes('listening')) {
        console.log(`    ✅ ${service.name} started on port ${service.port}`);
      }
    });

    process.stderr?.on('data', (data) => {
      const error = data.toString();
      if (!error.includes('ExperimentalWarning')) {
        console.error(`    ❌ ${service.name} error:`, error);
      }
    });

    process.on('exit', (code) => {
      if (!this.isShuttingDown && code !== 0) {
        console.error(`    ❌ ${service.name} exited with code ${code}`);
      }
    });
  }

  private async waitForServices(): Promise<void> {
    console.log('⏳ Waiting for services to be ready...');

    const maxAttempts = 30;
    const delay = 2000;

    for (const service of services) {
      let attempts = 0;
      let ready = false;

      while (attempts < maxAttempts && !ready) {
        try {
          const response = await fetch(
            `http://localhost:${service.port}${service.healthEndpoint}`,
            { method: 'GET' }
          );

          if (response.ok) {
            console.log(`  ✅ ${service.name} is ready`);
            ready = true;
          }
        } catch (error) {
          // Service not ready yet
        }

        if (!ready) {
          attempts++;
          await sleep(delay);
        }
      }

      if (!ready) {
        throw new Error(`Service ${service.name} failed to start after ${maxAttempts} attempts`);
      }
    }

    console.log('');
  }

  private async runIntegrationTests(): Promise<void> {
    console.log('🧪 Running integration tests...');

    const testProcess = spawn('npx', ['vitest', 'run', '--reporter=verbose', 'src/__tests__/ecosystem-integration.test.ts'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: 'test',
        GATEWAY_SERVICE_URL: 'http://localhost:3010',
        AGENTS_SERVICE_URL: 'http://localhost:3007',
        LOGINUS_SERVICE_URL: 'http://localhost:3002',
        BILINGUS_SERVICE_URL: 'http://localhost:3003',
        JWT_SECRET: 'test-secret-ecosystem',
      },
      stdio: 'inherit',
    });

    return new Promise((resolve, reject) => {
      testProcess.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Integration tests failed with code ${code}`));
        }
      });
    });
  }

  private async shutdown(): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    console.log('\n🛑 Shutting down services...');

    for (const [name, process] of this.processes) {
      console.log(`  🛑 Stopping ${name}...`);
      process.kill('SIGTERM');
      
      // Даем время на graceful shutdown
      await sleep(1000);
      
      if (!process.killed) {
        process.kill('SIGKILL');
      }
    }

    console.log('  ✅ All services stopped');
  }
}

// Запуск если скрипт вызван напрямую
if (require.main === module) {
  const runner = new EcosystemTestRunner();
  runner.run().catch((error) => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

export { EcosystemTestRunner }; 