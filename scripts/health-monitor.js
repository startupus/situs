#!/usr/bin/env node

/**
 * SITUS PLATFORM - HEALTH MONITORING SCRIPT
 *
 * Автоматический мониторинг здоровья всех сервисов
 * с уведомлениями и детальной диагностикой
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

// Configuration
const config = {
  services: [
    {
      name: 'API Health',
      url: 'http://localhost:3002/health',
      timeout: 5000,
      expectedStatus: 200,
      expectedBody: { status: 'ok' },
    },
    {
      name: 'Frontend',
      url: 'http://localhost:5177',
      timeout: 5000,
      expectedStatus: 200,
    },
    {
      name: 'Prisma Studio',
      url: 'http://localhost:5555',
      timeout: 5000,
      expectedStatus: 200,
    },
  ],
  dockerServices: ['situs-postgres', 'situs-redis', 'situs-api', 'situs-web', 'situs-prisma-studio'],
  retryCount: 3,
  retryDelay: 2000,
};

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Logging functions
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}[STEP]${colors.reset} ${msg}`),
};

/**
 * Make HTTP request with timeout
 */
const makeRequest = (url, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;

    const request = protocol.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.setTimeout(timeout, () => {
      request.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });
  });
};

/**
 * Check single service health
 */
const checkServiceHealth = async (service, attempt = 1) => {
  try {
    log.info(`Checking ${service.name} (attempt ${attempt}/${config.retryCount})...`);

    const response = await makeRequest(service.url, service.timeout);

    // Check status code
    if (response.status !== service.expectedStatus) {
      throw new Error(`Expected status ${service.expectedStatus}, got ${response.status}`);
    }

    // Check response body if specified
    if (service.expectedBody) {
      let body;
      try {
        body = JSON.parse(response.body);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${response.body}`);
      }

      for (const [key, expectedValue] of Object.entries(service.expectedBody)) {
        if (body[key] !== expectedValue) {
          throw new Error(`Expected ${key}=${expectedValue}, got ${body[key]}`);
        }
      }
    }

    log.success(`${service.name} is healthy`);
    return { success: true, service: service.name, response };
  } catch (error) {
    if (attempt < config.retryCount) {
      log.warning(`${service.name} check failed, retrying in ${config.retryDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, config.retryDelay));
      return checkServiceHealth(service, attempt + 1);
    }

    log.error(`${service.name} health check failed: ${error.message}`);
    return { success: false, service: service.name, error: error.message };
  }
};

/**
 * Check Docker containers status
 */
const checkDockerServices = async () => {
  log.step('Checking Docker services...');

  try {
    const { stdout } = await execAsync('docker compose ps --format json');
    const containers = stdout
      .trim()
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));

    const results = [];

    for (const serviceName of config.dockerServices) {
      const container = containers.find((c) => c.Name === serviceName);

      if (!container) {
        log.warning(`Docker service ${serviceName} not found`);
        results.push({ service: serviceName, status: 'not-found' });
        continue;
      }

      const isHealthy = container.State === 'running' && (!container.Health || container.Health === 'healthy');

      if (isHealthy) {
        log.success(`Docker service ${serviceName} is running`);
        results.push({ service: serviceName, status: 'healthy', state: container.State });
      } else {
        log.error(`Docker service ${serviceName} is unhealthy: ${container.State}`);
        results.push({
          service: serviceName,
          status: 'unhealthy',
          state: container.State,
          health: container.Health,
        });
      }
    }

    return results;
  } catch (error) {
    log.error(`Failed to check Docker services: ${error.message}`);
    return [];
  }
};

/**
 * Check system resources
 */
const checkSystemResources = async () => {
  log.step('Checking system resources...');

  try {
    // Check disk space
    const { stdout: dfOutput } = await execAsync('df -h .');
    const diskUsage = dfOutput.split('\n')[1].split(/\s+/)[4];

    log.info(`Disk usage: ${diskUsage}`);

    // Check memory usage (macOS specific)
    try {
      const { stdout: memOutput } = await execAsync('vm_stat');
      log.info('Memory check completed');
    } catch (e) {
      log.warning('Memory check not available on this system');
    }

    // Check Node.js version
    const { stdout: nodeVersion } = await execAsync('node --version');
    log.info(`Node.js version: ${nodeVersion.trim()}`);

    // Check npm version
    const { stdout: npmVersion } = await execAsync('npm --version');
    log.info(`npm version: ${npmVersion.trim()}`);

    return { success: true };
  } catch (error) {
    log.warning(`System resource check failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Generate health report
 */
const generateHealthReport = (serviceResults, dockerResults, systemResults) => {
  const report = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    services: serviceResults,
    docker: dockerResults,
    system: systemResults,
    summary: {
      servicesHealthy: serviceResults.filter((r) => r.success).length,
      servicesTotal: serviceResults.length,
      dockerHealthy: dockerResults.filter((r) => r.status === 'healthy').length,
      dockerTotal: dockerResults.length,
      overallHealth: serviceResults.every((r) => r.success) && dockerResults.every((r) => r.status === 'healthy'),
    },
  };

  // Save report
  const reportPath = 'health-report.json';
  require('fs').writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Display summary
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.magenta}HEALTH MONITORING REPORT${colors.reset}`);
  console.log('='.repeat(60));

  console.log(`Environment: ${report.environment}`);
  console.log(`Timestamp: ${report.timestamp}`);
  console.log(`Services: ${report.summary.servicesHealthy}/${report.summary.servicesTotal} healthy`);
  console.log(`Docker: ${report.summary.dockerHealthy}/${report.summary.dockerTotal} healthy`);

  const overallStatus = report.summary.overallHealth
    ? `${colors.green}HEALTHY${colors.reset}`
    : `${colors.red}UNHEALTHY${colors.reset}`;
  console.log(`Overall Status: ${overallStatus}`);

  console.log(`\nDetailed report saved to: ${reportPath}`);

  return report.summary.overallHealth;
};

/**
 * Main monitoring function
 */
const main = async () => {
  console.log(`${colors.magenta}SITUS PLATFORM - HEALTH MONITOR${colors.reset}`);
  console.log('Starting comprehensive health check...\n');

  try {
    // Check all services
    const serviceResults = [];
    for (const service of config.services) {
      const result = await checkServiceHealth(service);
      serviceResults.push(result);
    }

    // Check Docker services
    const dockerResults = await checkDockerServices();

    // Check system resources
    const systemResults = await checkSystemResources();

    // Generate report
    const isHealthy = generateHealthReport(serviceResults, dockerResults, systemResults);

    // Exit with appropriate code
    process.exit(isHealthy ? 0 : 1);
  } catch (error) {
    log.error(`Health monitoring failed: ${error.message}`);
    process.exit(1);
  }
};

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node scripts/health-monitor.js [--continuous]');
    console.log('');
    console.log('Options:');
    console.log('  --continuous  Run health checks every 30 seconds');
    console.log('  --help, -h    Show this help message');
    process.exit(0);
  }

  if (args.includes('--continuous')) {
    log.info('Starting continuous health monitoring...');

    const runCheck = async () => {
      try {
        await main();
      } catch (error) {
        log.error(`Health check failed: ${error.message}`);
      }
    };

    // Run initial check
    runCheck();

    // Schedule periodic checks
    setInterval(runCheck, 30000); // Every 30 seconds
  } else {
    main();
  }
}

module.exports = { main, checkServiceHealth, checkDockerServices };
