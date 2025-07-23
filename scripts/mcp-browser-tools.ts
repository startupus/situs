#!/usr/bin/env tsx

/**
 * MCP BrowserTools Integration
 * 
 * Интеграция BrowserTools Manager с MCP системой
 * Обеспечивает автоматическое управление процессами
 */

import BrowserToolsManager from './browser-tools-manager';

class MCPBrowserToolsIntegration {
  private manager: BrowserToolsManager;
  private isRunning = false;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.manager = new BrowserToolsManager();
  }

  /**
   * Запуск интеграции
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️  Интеграция уже запущена');
      return;
    }

    console.log('🚀 Запуск MCP BrowserTools интеграции...');

    try {
      // Останавливаем все существующие процессы
      await this.manager.stopAll();

      // Запускаем новый сервер
      const processInfo = await this.manager.startServer(3025);

      // Запускаем мониторинг здоровья
      this.startHealthMonitoring();

      this.isRunning = true;
      console.log(`✅ MCP BrowserTools интеграция запущена на порту ${processInfo.port}`);

    } catch (error) {
      console.error(`❌ Ошибка запуска интеграции: ${error}`);
      throw error;
    }
  }

  /**
   * Остановка интеграции
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('⚠️  Интеграция не запущена');
      return;
    }

    console.log('🛑 Остановка MCP BrowserTools интеграции...');

    // Останавливаем мониторинг
    this.stopHealthMonitoring();

    // Останавливаем все процессы
    await this.manager.stopAll();

    this.isRunning = false;
    console.log('✅ MCP BrowserTools интеграция остановлена');
  }

  /**
   * Получение статуса
   */
  async getStatus(): Promise<{
    running: boolean;
    processes: any[];
    health: { healthy: boolean; issues: string[] };
  }> {
    const status = this.manager.getStatus();
    const health = await this.manager.healthCheck();

    return {
      running: this.isRunning,
      processes: status,
      health
    };
  }

  /**
   * Проверка готовности к работе
   */
  async isReady(): Promise<boolean> {
    try {
      const status = await this.getStatus();
      return status.running && status.health.healthy;
    } catch (error) {
      return false;
    }
  }

  /**
   * Запуск мониторинга здоровья
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const health = await this.manager.healthCheck();
        
        if (!health.healthy) {
          console.warn('⚠️  Обнаружены проблемы в системе:');
          health.issues.forEach(issue => console.warn(`  - ${issue}`));
          
          // Автоматическое восстановление
          await this.restartIfNeeded();
        }
      } catch (error) {
        console.error(`❌ Ошибка мониторинга здоровья: ${error}`);
      }
    }, 30000); // Проверка каждые 30 секунд
  }

  /**
   * Остановка мониторинга здоровья
   */
  private stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /**
   * Автоматическое восстановление при проблемах
   */
  private async restartIfNeeded(): Promise<void> {
    try {
      console.log('🔄 Попытка автоматического восстановления...');
      
      // Останавливаем все процессы
      await this.manager.stopAll();
      
      // Ждем немного
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Запускаем заново
      await this.manager.startServer(3025);
      
      console.log('✅ Автоматическое восстановление завершено');
    } catch (error) {
      console.error(`❌ Ошибка автоматического восстановления: ${error}`);
    }
  }
}

// CLI интерфейс
async function main() {
  const integration = new MCPBrowserToolsIntegration();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'start':
        await integration.start();
        break;
        
      case 'stop':
        await integration.stop();
        break;
        
      case 'status':
        const status = await integration.getStatus();
        console.log('📊 Статус MCP BrowserTools интеграции:');
        console.log(`  Запущена: ${status.running ? '✅' : '❌'}`);
        console.log(`  Процессы: ${status.processes.length}`);
        console.log(`  Здоровье: ${status.health.healthy ? '✅' : '❌'}`);
        
        if (!status.health.healthy) {
          console.log('  Проблемы:');
          status.health.issues.forEach(issue => console.log(`    - ${issue}`));
        }
        break;
        
      case 'ready':
        const ready = await integration.isReady();
        console.log(`Готовность: ${ready ? '✅' : '❌'}`);
        break;
        
      default:
        console.log(`
MCP BrowserTools Integration

Использование:
  tsx scripts/mcp-browser-tools.ts start   - Запуск интеграции
  tsx scripts/mcp-browser-tools.ts stop    - Остановка интеграции
  tsx scripts/mcp-browser-tools.ts status  - Статус интеграции
  tsx scripts/mcp-browser-tools.ts ready   - Проверка готовности
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

export default MCPBrowserToolsIntegration; 