#!/usr/bin/env node

/**
 * SITUS PLATFORM - BUILD VALIDATION SCRIPT
 *
 * Автоматическая валидация сборки с уведомлениями об ошибках
 * для быстрой диагностики проблем на этапе сборки
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

// Colors for console output
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

// Validation results
const results = {
  passed: [],
  warnings: [],
  errors: [],
};

// Add result
const addResult = (type, check, message, details = null) => {
  const result = { check, message, details, timestamp: new Date().toISOString() };
  results[type].push(result);
};

/**
 * Check if file exists
 */
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
};

/**
 * Read JSON file safely
 */
const readJsonFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
};

/**
 * Execute command and capture output
 */
const runCommand = async (command, options = {}) => {
  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000, // 30 seconds timeout
      ...options,
    });
    return { success: true, stdout, stderr };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    };
  }
};

/**
 * Validate project structure
 */
const validateProjectStructure = () => {
  log.step('Validating project structure...');

  const requiredFiles = [
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'tailwind.config.js',
    'postcss.config.js',
    'prisma/schema.prisma',
    'src/main.tsx',
    'src/App.tsx',
  ];

  const requiredDirs = ['src', 'prisma', 'scripts', 'public'];

  let allFilesExist = true;
  let allDirsExist = true;

  // Check files
  for (const file of requiredFiles) {
    if (!fileExists(file)) {
      addResult('errors', 'project-structure', `Missing required file: ${file}`);
      allFilesExist = false;
    }
  }

  // Check directories
  for (const dir of requiredDirs) {
    if (!fileExists(dir) || !fs.statSync(dir).isDirectory()) {
      addResult('errors', 'project-structure', `Missing required directory: ${dir}`);
      allDirsExist = false;
    }
  }

  if (allFilesExist && allDirsExist) {
    addResult('passed', 'project-structure', 'All required files and directories exist');
  }
};

/**
 * Validate package.json
 */
const validatePackageJson = () => {
  log.step('Validating package.json...');

  const packageJson = readJsonFile('package.json');
  if (!packageJson) {
    addResult('errors', 'package-json', 'Cannot read package.json');
    return;
  }

  // Check required scripts
  const requiredScripts = ['dev', 'build', 'preview', 'dev:api:watch', 'nestjs:build', 'db:generate', 'db:push'];

  const missingScripts = requiredScripts.filter((script) => !packageJson.scripts?.[script]);
  if (missingScripts.length > 0) {
    addResult('warnings', 'package-json', `Missing scripts: ${missingScripts.join(', ')}`);
  } else {
    addResult('passed', 'package-json', 'All required scripts are present');
  }

  // Check dependencies
  const criticalDeps = ['react', 'vite', '@nestjs/core', 'prisma', '@prisma/client', 'tailwindcss'];

  const missingDeps = criticalDeps.filter(
    (dep) => !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep],
  );

  if (missingDeps.length > 0) {
    addResult('errors', 'package-json', `Missing critical dependencies: ${missingDeps.join(', ')}`);
  } else {
    addResult('passed', 'package-json', 'All critical dependencies are present');
  }
};

/**
 * Validate environment files
 */
const validateEnvironmentFiles = () => {
  log.step('Validating environment files...');

  const envFiles = ['env.development', 'env.production', 'env.docker', 'env.example'];
  const requiredVars = ['NODE_ENV', 'DATABASE_URL', 'JWT_SECRET', 'CORS_ORIGINS', 'VITE_ENV'];

  let hasValidEnvFile = false;

  for (const envFile of envFiles) {
    if (fileExists(envFile)) {
      hasValidEnvFile = true;

      const content = fs.readFileSync(envFile, 'utf8');
      const missingVars = requiredVars.filter((varName) => !content.includes(`${varName}=`));

      if (missingVars.length > 0) {
        addResult('warnings', 'environment', `${envFile} missing variables: ${missingVars.join(', ')}`);
      } else {
        addResult('passed', 'environment', `${envFile} has all required variables`);
      }
    }
  }

  if (!hasValidEnvFile) {
    addResult('errors', 'environment', 'No environment files found');
  }

  // Check .env file
  if (fileExists('.env')) {
    addResult('passed', 'environment', '.env file exists');
  } else {
    addResult('warnings', 'environment', '.env file not found - run scripts/setup-environment.sh');
  }
};

/**
 * Validate TypeScript configuration
 */
const validateTypeScriptConfig = async () => {
  log.step('Validating TypeScript configuration...');

  // Check tsconfig files
  const tsconfigs = ['tsconfig.json', 'tsconfig.server.json'];

  for (const tsconfig of tsconfigs) {
    if (fileExists(tsconfig)) {
      const config = readJsonFile(tsconfig);
      if (config) {
        addResult('passed', 'typescript', `${tsconfig} is valid JSON`);
      } else {
        addResult('errors', 'typescript', `${tsconfig} has invalid JSON`);
      }
    } else {
      addResult('errors', 'typescript', `Missing ${tsconfig}`);
    }
  }

  // Check TypeScript compilation
  const tscResult = await runCommand('npx tsc --noEmit --skipLibCheck');
  if (tscResult.success) {
    addResult('passed', 'typescript', 'TypeScript compilation check passed');
  } else {
    addResult('errors', 'typescript', 'TypeScript compilation errors', {
      stdout: tscResult.stdout,
      stderr: tscResult.stderr,
    });
  }
};

/**
 * Validate Prisma configuration
 */
const validatePrismaConfig = async () => {
  log.step('Validating Prisma configuration...');

  // Check schema file
  if (!fileExists('prisma/schema.prisma')) {
    addResult('errors', 'prisma', 'Missing prisma/schema.prisma');
    return;
  }

  // Validate schema
  const schemaResult = await runCommand('npx prisma validate');
  if (schemaResult.success) {
    addResult('passed', 'prisma', 'Prisma schema is valid');
  } else {
    addResult('errors', 'prisma', 'Prisma schema validation failed', {
      stderr: schemaResult.stderr,
    });
  }

  // Check if client can be generated
  const generateResult = await runCommand('npx prisma generate --dry-run');
  if (generateResult.success) {
    addResult('passed', 'prisma', 'Prisma client can be generated');
  } else {
    addResult('warnings', 'prisma', 'Prisma client generation issues', {
      stderr: generateResult.stderr,
    });
  }
};

/**
 * Validate Docker configuration
 */
const validateDockerConfig = () => {
  log.step('Validating Docker configuration...');

  const dockerFiles = ['Dockerfile', 'Dockerfile.web', 'docker-compose.yml'];

  for (const dockerFile of dockerFiles) {
    if (fileExists(dockerFile)) {
      addResult('passed', 'docker', `${dockerFile} exists`);

      // Basic validation for docker-compose.yml
      if (dockerFile === 'docker-compose.yml') {
        const content = fs.readFileSync(dockerFile, 'utf8');

        const requiredServices = ['postgres', 'redis', 'situs-api', 'situs-web'];
        const missingServices = requiredServices.filter((service) => !content.includes(`${service}:`));

        if (missingServices.length > 0) {
          addResult('warnings', 'docker', `docker-compose.yml missing services: ${missingServices.join(', ')}`);
        } else {
          addResult('passed', 'docker', 'docker-compose.yml has all required services');
        }
      }
    } else {
      addResult('warnings', 'docker', `Missing ${dockerFile}`);
    }
  }
};

/**
 * Validate build process
 */
const validateBuildProcess = async () => {
  log.step('Validating build process...');

  // Test Vite build
  const viteBuildResult = await runCommand('npm run build', { timeout: 120000 });
  if (viteBuildResult.success) {
    addResult('passed', 'build', 'Vite build successful');

    // Check if dist folder was created
    if (fileExists('dist') && fs.statSync('dist').isDirectory()) {
      addResult('passed', 'build', 'Build output directory created');
    } else {
      addResult('warnings', 'build', 'Build output directory not found');
    }
  } else {
    addResult('errors', 'build', 'Vite build failed', {
      stderr: viteBuildResult.stderr,
      stdout: viteBuildResult.stdout,
    });
  }

  // Test NestJS build
  const nestBuildResult = await runCommand('npm run nestjs:build');
  if (nestBuildResult.success) {
    addResult('passed', 'build', 'NestJS build successful');
  } else {
    addResult('errors', 'build', 'NestJS build failed', {
      stderr: nestBuildResult.stderr,
    });
  }
};

/**
 * Generate validation report
 */
const generateReport = () => {
  log.step('Generating validation report...');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.passed.length + results.warnings.length + results.errors.length,
      passed: results.passed.length,
      warnings: results.warnings.length,
      errors: results.errors.length,
    },
    results,
  };

  // Save report to file
  const reportPath = 'build-validation-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Display summary
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.cyan}BUILD VALIDATION REPORT${colors.reset}`);
  console.log('='.repeat(60));

  console.log(`Total Checks: ${report.summary.total}`);
  console.log(`${colors.green}Passed: ${report.summary.passed}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${report.summary.warnings}${colors.reset}`);
  console.log(`${colors.red}Errors: ${report.summary.errors}${colors.reset}`);

  // Show errors
  if (results.errors.length > 0) {
    console.log(`\n${colors.red}ERRORS:${colors.reset}`);
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. [${error.check}] ${error.message}`);
      if (error.details) {
        console.log(`   Details: ${JSON.stringify(error.details, null, 2)}`);
      }
    });
  }

  // Show warnings
  if (results.warnings.length > 0) {
    console.log(`\n${colors.yellow}WARNINGS:${colors.reset}`);
    results.warnings.forEach((warning, index) => {
      console.log(`${index + 1}. [${warning.check}] ${warning.message}`);
    });
  }

  console.log(`\nDetailed report saved to: ${reportPath}`);

  // Exit with appropriate code
  process.exit(results.errors.length > 0 ? 1 : 0);
};

/**
 * Main validation function
 */
const main = async () => {
  console.log(`${colors.cyan}SITUS PLATFORM - BUILD VALIDATION${colors.reset}`);
  console.log('Starting comprehensive build validation...\n');

  try {
    validateProjectStructure();
    validatePackageJson();
    validateEnvironmentFiles();
    await validateTypeScriptConfig();
    await validatePrismaConfig();
    validateDockerConfig();

    // Only run build validation if no critical errors
    if (results.errors.length === 0) {
      await validateBuildProcess();
    } else {
      log.warning('Skipping build validation due to critical errors');
    }
  } catch (error) {
    addResult('errors', 'validation', `Validation process failed: ${error.message}`);
  }

  generateReport();
};

// Handle CLI arguments
if (require.main === module) {
  main().catch((error) => {
    log.error(`Validation failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main, validateProjectStructure, validatePackageJson };
