#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * 🔒 CRITICAL SQL INJECTION AUDIT
 *
 * This script audits all services for:
 * 1. Raw SQL queries with user input interpolation
 * 2. Unsafe $queryRaw usage in Prisma
 * 3. String concatenation in database queries
 * 4. Missing parameterized queries
 *
 * Author: Startupus Security Team
 * Date: 2025-07-09
 */

export class SQLInjectionAuditor {
  constructor() {
    this.servicesDir = path.join(__dirname, '../../services');
    this.vulnerabilities = [];
    this.services = [];
    this.criticalVulnerabilities = 0;
    this.highVulnerabilities = 0;
    this.mediumVulnerabilities = 0;
  }

  async audit() {
    void console.log(chalk.blue.bold('\n💉 STARTING CRITICAL SQL INJECTION AUDIT\n'));

    this.discoverServices();

    for (const service of this.services) {
      void console.log(chalk.yellow(`\n📋 Auditing ${service} for SQL injection...`));
      await this.auditService(service);
    }

    this.generateReport();
  }

  discoverServices() {
    try {
      this.services = fs.readdirSync(this.servicesDir).filter((dir) => {
        const servicePath = path.join(this.servicesDir, dir);
        return fs.statSync(servicePath).isDirectory() && fs.existsSync(path.join(servicePath, 'package.json'));
      });

      void console.log(chalk.green(`📦 Discovered ${this.services.length} services: ${this.services.join(', ')}`));
    } catch (error) {
      console.error(chalk.red('❌ Failed to discover services:'), error.message);
      process.exit(1);
    }
  }

  async auditService(serviceName) {
    const servicePath = path.join(this.servicesDir, serviceName);

    // Check for unsafe raw SQL queries
    await this.checkUnsafeRawQueries(serviceName, servicePath);

    // Check for string concatenation in queries
    await this.checkStringConcatenation(serviceName, servicePath);

    // Check for unsafe Prisma usage
    await this.checkUnsafePrismaQueries(serviceName, servicePath);

    // Check for dynamic query construction
    await this.checkDynamicQueryConstruction(serviceName, servicePath);
  }

  async checkUnsafeRawQueries(serviceName, servicePath) {
    const unsafePatterns = [
      // Raw SQL with template literals containing variables
      /\$queryRaw`[^`]*\$\{[^}]+\}[^`]*`/g,

      // Raw SQL with string concatenation
      /\$queryRaw\([^)]*\+[^)]*\)/g,

      // Execute raw with user input
      /\$executeRaw`[^`]*\$\{[^}]+\}[^`]*`/g,

      // Raw database queries with interpolation
      /query\s*\(\s*`[^`]*\$\{[^}]+\}[^`]*`\s*\)/g,
    ];

    this.scanDirectory(servicePath, unsafePatterns, (file, matches) => {
      matches.forEach((match) => {
        // Skip if it's using Prisma.sql template
        if (match[0].includes('Prisma.sql')) return;

        this.addVulnerability({
          service: serviceName,
          type: 'CRITICAL',
          category: 'SQL Injection via Raw Query',
          file: path.relative(servicePath, file),
          code: match[0].substring(0, 100) + '...',
          message: 'Raw SQL query with user input interpolation detected',
          recommendation: 'Use Prisma.sql template or parameterized queries instead',
        });
        this.criticalVulnerabilities++;
      });
    });
  }

  async checkStringConcatenation(serviceName, servicePath) {
    const concatenationPatterns = [
      // String concatenation in WHERE clauses
      /WHERE\s+[^=]+\s*=\s*['"][^'"]*['"]\s*\+\s*\w+/gi,

      // Dynamic SQL construction with concatenation
      /"SELECT\s+[^"]*"\s*\+[^;]+/gi,
      /"INSERT\s+[^"]*"\s*\+[^;]+/gi,
      /"UPDATE\s+[^"]*"\s*\+[^;]+/gi,
      /"DELETE\s+[^"]*"\s*\+[^;]+/gi,

      // Template literal concatenation
      /`[^`]*\$\{[^}]*\+[^}]*\}[^`]*`/g,
    ];

    this.scanDirectory(servicePath, concatenationPatterns, (file, matches) => {
      matches.forEach((match) => {
        this.addVulnerability({
          service: serviceName,
          type: 'HIGH',
          category: 'SQL Injection via String Concatenation',
          file: path.relative(servicePath, file),
          code: match[0].substring(0, 100) + '...',
          message: 'SQL query using string concatenation with user input',
          recommendation: 'Use parameterized queries or prepared statements',
        });
        this.highVulnerabilities++;
      });
    });
  }

  async checkUnsafePrismaQueries(serviceName, servicePath) {
    const unsafePrismaPatterns = [
      // $queryRaw without Prisma.sql
      /\$queryRaw\s*`[^`]*\$\{(?!.*Prisma\.sql)[^}]+\}[^`]*`/g,

      // $executeRaw without Prisma.sql
      /\$executeRaw\s*`[^`]*\$\{(?!.*Prisma\.sql)[^}]+\}[^`]*`/g,

      // Raw queries with user input in template literals
      /prisma\.\w+\.\$queryRaw`[^`]*\$\{[^}]*req\.[^}]*\}[^`]*`/g,
      /prisma\.\w+\.\$queryRaw`[^`]*\$\{[^}]*params\.[^}]*\}[^`]*`/g,
      /prisma\.\w+\.\$queryRaw`[^`]*\$\{[^}]*body\.[^}]*\}[^`]*`/g,
    ];

    this.scanDirectory(servicePath, unsafePrismaPatterns, (file, matches) => {
      matches.forEach((match) => {
        this.addVulnerability({
          service: serviceName,
          type: 'CRITICAL',
          category: 'Unsafe Prisma Raw Query',
          file: path.relative(servicePath, file),
          code: match[0].substring(0, 100) + '...',
          message: 'Prisma raw query without proper SQL template usage',
          recommendation: 'Use Prisma.sql template: Prisma.sql`${value}`',
        });
        this.criticalVulnerabilities++;
      });
    });
  }

  async checkDynamicQueryConstruction(serviceName, servicePath) {
    const dynamicPatterns = [
      // Dynamic WHERE clause construction
      /let\s+whereClause\s*=\s*['"][^'"]*['"]\s*\+/g,
      /const\s+whereClause\s*=\s*['"][^'"]*['"]\s*\+/g,

      // Dynamic ORDER BY construction
      /ORDER\s+BY\s*\$\{[^}]*\}/gi,

      // Dynamic table/column names
      /FROM\s*\$\{[^}]*\}/gi,
      /SELECT\s*\$\{[^}]*\}/gi,

      // Query building with user input
      /query\s*\+=.*req\./g,
      /query\s*\+=.*params\./g,
    ];

    this.scanDirectory(servicePath, dynamicPatterns, (file, matches) => {
      matches.forEach((match) => {
        this.addVulnerability({
          service: serviceName,
          type: 'HIGH',
          category: 'Dynamic SQL Construction',
          file: path.relative(servicePath, file),
          code: match[0].substring(0, 80) + '...',
          message: 'Dynamic SQL query construction detected',
          recommendation: 'Use query builders or validate/whitelist dynamic parts',
        });
        this.highVulnerabilities++;
      });
    });
  }

  scanDirectory(dirPath, patterns, callback) {
    const extensions = ['.ts', '.js'];

    const scanFile = (filePath: any): any => {
      if (!extensions.some((ext) => filePath.endsWith(ext))) return;

      try {
        const content = fs.readFileSync(filePath, 'utf8');
        patterns.forEach((pattern) => {
          const matches = [...content.matchAll(pattern)];
          if (matches.length > 0) {
            callback(filePath, matches);
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    };

    const traverse = (currentPath: any): any => {
      try {
        const items = fs.readdirSync(currentPath);

        for (const item of items) {
          const itemPath = path.join(currentPath, item);

          // Skip node_modules and other irrelevant directories
          if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'build') {
            continue;
          }

          const stat = fs.statSync(itemPath);

          if (stat.isDirectory()) {
            traverse(itemPath);
          } else {
            scanFile(itemPath);
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    };

    traverse(dirPath);
  }

  addVulnerability(vulnerability) {
    this.vulnerabilities.push(vulnerability);
  }

  generateReport() {
    void console.log(chalk.blue.bold('\n📊 SQL INJECTION AUDIT REPORT'));
    void console.log(chalk.gray('═'.repeat(60)));

    // Summary
    const total = this.vulnerabilities.length;
    void console.log(chalk.white(`\n📈 SUMMARY:`));
    void console.log(chalk.red(`   🔴 Critical: ${this.criticalVulnerabilities}`));
    void console.log(chalk.yellow(`   🟡 High: ${this.highVulnerabilities}`));
    void console.log(chalk.blue(`   🔵 Medium: ${this.mediumVulnerabilities}`));
    void console.log(chalk.white(`   📊 Total: ${total}`));

    // Risk Assessment
    let riskLevel = 'LOW';
    let riskColor = chalk.green;

    if (this.criticalVulnerabilities > 0) {
      riskLevel = 'CRITICAL';
      riskColor = chalk.red.bold;
    } else if (this.highVulnerabilities > 3) {
      riskLevel = 'HIGH';
      riskColor = chalk.yellow.bold;
    } else if (this.highVulnerabilities > 0) {
      riskLevel = 'MEDIUM';
      riskColor = chalk.yellow;
    }

    void console.log(riskColor(`\n🚨 OVERALL SQL INJECTION RISK: ${riskLevel}`));

    // Detailed vulnerabilities
    if (total > 0) {
      void console.log(chalk.white('\n🔍 DETAILED FINDINGS:'));

      this.vulnerabilities
        .sort((a, b) => {
          const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 };
          return order[a.type] - order[b.type];
        })
        .forEach((vuln, index) => {
          const typeColor = vuln.type === 'CRITICAL' ? chalk.red : vuln.type === 'HIGH' ? chalk.yellow : chalk.blue;

          void console.log(chalk.gray(`\n${index + 1}. ${vuln.service}`));
          void console.log(typeColor(`   ${vuln.type}: ${vuln.category}`));
          void console.log(chalk.white(`   File: ${vuln.file}`));
          void console.log(chalk.gray(`   Code: ${vuln.code}`));
          void console.log(chalk.cyan(`   Issue: ${vuln.message}`));
          void console.log(chalk.green(`   Fix: ${vuln.recommendation}`));
        });
    }

    // Secure coding examples
    void console.log(chalk.blue.bold('\n✅ SECURE CODING EXAMPLES:'));
    void console.log(
      chalk.green(`
   // ❌ UNSAFE - SQL Injection Risk
   await prisma.$queryRaw\`SELECT * FROM users WHERE id = \${userId}\`;
   
   // ✅ SAFE - Using Prisma.sql template
   await prisma.$queryRaw\`SELECT * FROM users WHERE id = \${Prisma.sql\`\${userId}\`}\`;
   
   // ✅ BETTER - Use Prisma's type-safe queries
   await prisma.user.findUnique({ where: { id: userId } });
    `),
    );

    // Action Items
    void console.log(chalk.blue.bold('\n🎯 IMMEDIATE ACTION ITEMS:'));

    if (this.criticalVulnerabilities > 0) {
      void console.log(chalk.red('   🔴 CRITICAL: Replace unsafe raw queries immediately'));
      void console.log(chalk.red('   🔴 CRITICAL: Use Prisma.sql templates for all raw queries'));
    }

    if (this.highVulnerabilities > 0) {
      void console.log(chalk.yellow('   🟡 HIGH: Eliminate string concatenation in SQL'));
      void console.log(chalk.yellow('   🟡 HIGH: Implement input validation and sanitization'));
    }

    void console.log(chalk.gray('\n═'.repeat(60)));

    if (this.criticalVulnerabilities > 0) {
      void console.log(chalk.red.bold('❌ AUDIT FAILED: Critical SQL injection vulnerabilities detected!'));
      process.exit(1);
    } else {
      void console.log(chalk.green.bold('✅ AUDIT PASSED: No critical SQL injection vulnerabilities detected.'));
    }
  }
}

// Execute audit
const auditor = new SQLInjectionAuditor();
auditor.audit().catch((error) => {
  console.error(chalk.red('💥 SQL injection audit failed:'), error);
  process.exit(1);
});
