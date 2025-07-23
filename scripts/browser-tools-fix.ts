#!/usr/bin/env node

import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

class BrowserToolsManager {
  private process: ChildProcess | null = null;
  private pidFile = path.join(process.cwd(), '.browser-tools.pid');
  private logFile = path.join(process.cwd(), 'logs', 'browser-tools.log');
  private port = 3025;

  constructor() {
    // Создаем папку для логов если её нет
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  async start(): Promise<void> {
    console.log('🚀 Запуск BrowserTools сервера...');
    
    // Останавливаем существующие процессы
    await this.stop();
    
    // Ждем освобождения порта
    await this.waitForPortAvailable();
    
    // Запускаем сервер
    this.process = spawn('npx', ['@agentdeskai/browser-tools-server@latest'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false,
      env: { ...process.env, PORT: this.port.toString() }
    });

    // Сохраняем PID
    if (this.process.pid) {
      fs.writeFileSync(this.pidFile, this.process.pid.toString());
      console.log(`✅ BrowserTools сервер запущен с PID: ${this.process.pid}`);
    }

    // Логируем вывод
    this.process.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log(`[BrowserTools] ${output.trim()}`);
      fs.appendFileSync(this.logFile, `[${new Date().toISOString()}] ${output}`);
    });

    this.process.stderr?.on('data', (data) => {
      const output = data.toString();
      console.error(`[BrowserTools ERROR] ${output.trim()}`);
      fs.appendFileSync(this.logFile, `[${new Date().toISOString()}] ERROR: ${output}`);
    });

    // Обработка завершения
    this.process.on('close', (code) => {
      console.log(`❌ BrowserTools сервер завершен с кодом: ${code}`);
      this.cleanup();
    });

    // Ждем запуска сервера
    await this.waitForServerReady();
    console.log('✅ BrowserTools сервер готов к работе!');
  }

  async stop(): Promise<void> {
    console.log('🛑 Остановка BrowserTools сервера...');
    
    // Останавливаем процесс если он запущен
    if (this.process) {
      this.process.kill('SIGTERM');
      this.process = null;
    }

    // Убиваем процесс по PID файлу
    if (fs.existsSync(this.pidFile)) {
      try {
        const pid = parseInt(fs.readFileSync(this.pidFile, 'utf8'));
        process.kill(pid, 'SIGTERM');
        console.log(`✅ Процесс ${pid} остановлен`);
      } catch (error) {
        // Процесс уже не существует
      }
      this.cleanup();
    }

    // Ждем освобождения порта
    await this.waitForPortAvailable();
  }

  private cleanup(): void {
    if (fs.existsSync(this.pidFile)) {
      fs.unlinkSync(this.pidFile);
    }
  }

  private async waitForPortAvailable(): Promise<void> {
    return new Promise((resolve) => {
      const checkPort = () => {
        const req = http.request({
          host: 'localhost',
          port: this.port,
          method: 'HEAD',
          timeout: 1000
        }, () => {
          // Порт занят, ждем
          setTimeout(checkPort, 1000);
        });

        req.on('error', () => {
          // Порт свободен
          resolve();
        });

        req.on('timeout', () => {
          req.destroy();
          resolve();
        });

        req.end();
      };

      checkPort();
    });
  }

  private async waitForServerReady(): Promise<void> {
    return new Promise((resolve) => {
      const checkServer = () => {
        const req = http.request({
          host: 'localhost',
          port: this.port,
          method: 'HEAD',
          timeout: 1000
        }, () => {
          resolve();
        });

        req.on('error', () => {
          // Сервер еще не готов, ждем
          setTimeout(checkServer, 1000);
        });

        req.on('timeout', () => {
          req.destroy();
          setTimeout(checkServer, 1000);
        });

        req.end();
      };

      checkServer();
    });
  }

  async testScreenshot(): Promise<void> {
    console.log('📸 Тестирование скриншота...');
    
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ url: 'http://localhost:4000/' });
      
      const req = http.request({
        host: 'localhost',
        port: this.port,
        method: 'POST',
        path: '/capture-screenshot',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ Скриншот создан успешно!');
            console.log('📄 Ответ:', body);
            resolve();
          } else {
            console.error(`❌ Ошибка создания скриншота: ${res.statusCode}`);
            console.error('📄 Ответ:', body);
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Ошибка запроса:', error.message);
        reject(error);
      });

      req.write(data);
      req.end();
    });
  }
}

// Основная функция
async function main() {
  const manager = new BrowserToolsManager();
  
  try {
    // Запускаем сервер
    await manager.start();
    
    // Ждем немного для стабилизации
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Тестируем скриншот
    await manager.testScreenshot();
    
    console.log('🎉 Все работает! BrowserTools сервер запущен и готов к работе.');
    console.log('💡 Для остановки нажмите Ctrl+C');
    
    // Держим процесс живым
    process.on('SIGINT', async () => {
      console.log('\n🛑 Получен сигнал остановки...');
      await manager.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    await manager.stop();
    process.exit(1);
  }
}

// Запускаем если скрипт вызван напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { BrowserToolsManager }; 