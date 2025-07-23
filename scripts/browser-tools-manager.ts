#!/usr/bin/env tsx

/**
 * BrowserTools Manager - Архитектурное решение для управления процессами
 * 
 * Проблемы, которые решает:
 * 1. Множественные запуски процессов
 * 2. Некорректное завершение процессов
 * 3. Конфликты портов
 * 4. Отсутствие мониторинга состояния
 */

import { spawn, ChildProcess } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

interface ProcessInfo {
  pid: number;
  port: number;
  startTime: Date;
  status: 'running' | 'stopped' | 'error';
  type: 'server' | 'mcp';
}

class BrowserToolsManager {
  private processes: Map<number, ProcessInfo> = new Map();
  private pidFile: string;
  private logFile: string;
  private isShuttingDown = false;

  constructor() {
    this.pidFile = path.join(process.cwd(), 'logs', 'browser-tools.pid');
    this.logFile = path.join(process.cwd(), 'logs', 'browser-tools.log');
    this.setupGracefulShutdown();
  }

  /**
   * Запуск BrowserTools сервера с проверкой существующих процессов
   */
  async startServer(port: number = 3025): Promise<ProcessInfo> {
    console.log(`🚀 Запуск BrowserTools сервера на порту ${port}...`);

    // Проверяем существующие процессы
    await this.cleanupExistingProcesses();

    // Проверяем доступность порта
    const availablePort = await this.findAvailablePort(port);

    try {
      const child = spawn('npx', ['@agentdeskai/browser-tools-server@latest'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PORT: availablePort.toString() },
        detached: true // Запускаем как демон
      });

      const processInfo: ProcessInfo = {
        pid: child.pid!,
        port: availablePort,
        startTime: new Date(),
        status: 'running',
        type: 'server'
      };

      this.processes.set(child.pid!, processInfo);
      await this.saveProcessInfo(processInfo);

      // Логирование
      child.stdout?.on('data', (data) => {
        this.log(`[SERVER ${child.pid}] ${data.toString()}`);
      });

      child.stderr?.on('data', (data) => {
        this.log(`[SERVER ${child.pid}] ERROR: ${data.toString()}`);
      });

      child.on('exit', (code) => {
        this.log(`[SERVER ${child.pid}] Процесс завершен с кодом ${code}`);
        this.processes.delete(child.pid!);
        this.updateProcessStatus(child.pid!, 'stopped');
      });

      child.on('error', (error) => {
        this.log(`[SERVER ${child.pid}] Ошибка: ${error.message}`);
        this.updateProcessStatus(child.pid!, 'error');
      });

      // Ждем запуска
      await this.waitForServerStart(availablePort);

      console.log(`✅ BrowserTools сервер запущен на порту ${availablePort} (PID: ${child.pid})`);
      return processInfo;

    } catch (error) {
      console.error(`❌ Ошибка запуска сервера: ${error}`);
      throw error;
    }
  }

  /**
   * Остановка всех процессов BrowserTools
   */
  async stopAll(): Promise<void> {
    console.log('🛑 Остановка всех процессов BrowserTools...');
    
    this.isShuttingDown = true;

    for (const [pid, processInfo] of this.processes) {
      await this.stopProcess(pid);
    }

    // Очистка PID файлов
    await this.cleanupPidFiles();
    
    console.log('✅ Все процессы BrowserTools остановлены');
  }

  /**
   * Получение статуса всех процессов
   */
  getStatus(): ProcessInfo[] {
    return Array.from(this.processes.values());
  }

  /**
   * Проверка здоровья системы
   */
  async healthCheck(): Promise<{ healthy: boolean; issues: string[] }> {
    const issues: string[] = [];
    let healthy = true;

    // Проверяем количество процессов
    if (this.processes.size > 1) {
      issues.push(`Обнаружено ${this.processes.size} процессов (ожидается 1)`);
      healthy = false;
    }

    // Проверяем доступность портов
    for (const processInfo of this.processes.values()) {
      try {
        const response = await fetch(`http://localhost:${processInfo.port}/health`);
        if (!response.ok) {
          issues.push(`Порт ${processInfo.port} недоступен`);
          healthy = false;
        }
      } catch (error) {
        issues.push(`Ошибка подключения к порту ${processInfo.port}: ${error}`);
        healthy = false;
      }
    }

    return { healthy, issues };
  }

  /**
   * Очистка существующих процессов
   */
  private async cleanupExistingProcesses(): Promise<void> {
    console.log('🧹 Очистка существующих процессов...');

    // Убиваем процессы по PID файлу
    try {
      const pidData = await fs.readFile(this.pidFile, 'utf-8');
      const pids = pidData.split('\n').filter(pid => pid.trim());
      
      for (const pidStr of pids) {
        const pid = parseInt(pidStr);
        if (pid && !isNaN(pid)) {
          await this.killProcess(pid);
        }
      }
    } catch (error) {
      // PID файл не существует - это нормально
    }

    // Убиваем процессы по имени
    const killResult = await this.execCommand(`pkill -f browser-tools-server`);
    if (killResult.success) {
      console.log('✅ Существующие процессы остановлены');
    }
  }

  /**
   * Поиск доступного порта
   */
  private async findAvailablePort(startPort: number): Promise<number> {
    for (let port = startPort; port < startPort + 10; port++) {
      try {
        const response = await fetch(`http://localhost:${port}/health`, { 
          signal: AbortSignal.timeout(1000) 
        });
        // Порт занят, пробуем следующий
      } catch (error) {
        // Порт свободен
        return port;
      }
    }
    throw new Error(`Не удалось найти свободный порт в диапазоне ${startPort}-${startPort + 9}`);
  }

  /**
   * Ожидание запуска сервера
   */
  private async waitForServerStart(port: number, timeout: number = 10000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const response = await fetch(`http://localhost:${port}/health`, {
          signal: AbortSignal.timeout(1000)
        });
        if (response.ok) {
          return;
        }
      } catch (error) {
        // Сервер еще не запустился
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    throw new Error(`Сервер не запустился за ${timeout}ms`);
  }

  /**
   * Остановка конкретного процесса
   */
  private async stopProcess(pid: number): Promise<void> {
    try {
      process.kill(pid, 'SIGTERM');
      
      // Ждем завершения
      let attempts = 0;
      while (attempts < 10) {
        try {
          process.kill(pid, 0); // Проверяем существование процесса
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        } catch (error) {
          // Процесс завершен
          break;
        }
      }
      
      // Принудительное завершение если не завершился
      if (attempts >= 10) {
        process.kill(pid, 'SIGKILL');
      }
      
      this.processes.delete(pid);
    } catch (error) {
      console.error(`Ошибка остановки процесса ${pid}: ${error}`);
    }
  }

  /**
   * Убийство процесса по PID
   */
  private async killProcess(pid: number): Promise<void> {
    try {
      process.kill(pid, 'SIGKILL');
    } catch (error) {
      // Процесс уже не существует
    }
  }

  /**
   * Сохранение информации о процессе
   */
  private async saveProcessInfo(processInfo: ProcessInfo): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.pidFile), { recursive: true });
      await fs.appendFile(this.pidFile, `${processInfo.pid}\n`);
    } catch (error) {
      console.error(`Ошибка сохранения PID: ${error}`);
    }
  }

  /**
   * Обновление статуса процесса
   */
  private updateProcessStatus(pid: number, status: ProcessInfo['status']): void {
    const processInfo = this.processes.get(pid);
    if (processInfo) {
      processInfo.status = status;
    }
  }

  /**
   * Очистка PID файлов
   */
  private async cleanupPidFiles(): Promise<void> {
    try {
      await fs.unlink(this.pidFile);
    } catch (error) {
      // Файл не существует
    }
  }

  /**
   * Логирование
   */
  private async log(message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    try {
      await fs.mkdir(path.dirname(this.logFile), { recursive: true });
      await fs.appendFile(this.logFile, logMessage);
    } catch (error) {
      console.error(`Ошибка логирования: ${error}`);
    }
  }

  /**
   * Выполнение команды
   */
  private async execCommand(command: string): Promise<{ success: boolean; output: string }> {
    return new Promise((resolve) => {
      const child = spawn(command, [], { shell: true });
      let output = '';
      
      child.stdout?.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr?.on('data', (data) => {
        output += data.toString();
      });
      
      child.on('close', (code) => {
        resolve({ success: code === 0, output });
      });
    });
  }

  /**
   * Настройка graceful shutdown
   */
  private setupGracefulShutdown(): void {
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    
    signals.forEach(signal => {
      process.on(signal, async () => {
        console.log(`\n📡 Получен сигнал ${signal}, завершение работы...`);
        await this.stopAll();
        process.exit(0);
      });
    });
  }
}

// CLI интерфейс
async function main() {
  const manager = new BrowserToolsManager();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'start':
        await manager.startServer();
        break;
        
      case 'stop':
        await manager.stopAll();
        break;
        
      case 'status':
        const status = manager.getStatus();
        console.log('📊 Статус процессов:');
        status.forEach(proc => {
          console.log(`  PID: ${proc.pid}, Порт: ${proc.port}, Статус: ${proc.status}`);
        });
        break;
        
      case 'health':
        const health = await manager.healthCheck();
        if (health.healthy) {
          console.log('✅ Система здорова');
        } else {
          console.log('❌ Проблемы в системе:');
          health.issues.forEach(issue => console.log(`  - ${issue}`));
        }
        break;
        
      default:
        console.log(`
BrowserTools Manager - Архитектурное решение для управления процессами

Использование:
  tsx scripts/browser-tools-manager.ts start   - Запуск сервера
  tsx scripts/browser-tools-manager.ts stop    - Остановка всех процессов
  tsx scripts/browser-tools-manager.ts status  - Статус процессов
  tsx scripts/browser-tools-manager.ts health  - Проверка здоровья системы
        `);
    }
  } catch (error) {
    console.error(`❌ Ошибка: ${error}`);
    process.exit(1);
  }
}

// Проверяем, что файл запущен напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default BrowserToolsManager; 