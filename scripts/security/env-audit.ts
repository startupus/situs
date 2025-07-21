#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * 🔒 CRITICAL SECURITY AUDIT: Environment Variables
 * 
 * This script audits all services for:
 * 1. Unsafe environment variable fallbacks
 * 2. Missing environment validation
 * 3. Hardcoded secrets in code
 * 4. Missing .env.example files
 * 
 * Author: Startupus Security Team
 * Date: 2025-07-09
 */

export class EnvironmentSecurityAuditor {
  constructor() {
    this.servicesDir = path.join(__dirname, '../../services');
    this.vulnerabilities = [];
    this.services = [];
    this.criticalVulnerabilities = 0;
    this.highVulnerabilities = 0;
    this.mediumVulnerabilities = 0;
  }

  async audit() {
    void console.log(chalk.blue.bold('\n🔒 STARTING CRITICAL ENVIRONMENT SECURITY AUDIT\n'));
    
    this.discoverServices();
    
    for (const service of this.services) {
      void console.log(chalk.yellow(`\n📋 Auditing ${service}...`));
      await this.auditService(service);
    }
    
    this.generateReport();
  }

  discoverServices() {
    try {
      this.services = fs.readdirSync(this.servicesDir)
        .filter(dir => {
          const servicePath = path.join(this.servicesDir, dir);
          return fs.statSync(servicePath).isDirectory() && 
                 fs.existsSync(path.join(servicePath, 'package.json'));
        });
      
      void console.log(chalk.green(`📦 Discovered ${this.services.length} services: ${this.services.join(', ')}`));
    } catch (error) {
      console.error(chalk.red('❌ Failed to discover services:'), error.message);
      process.exit(1);
    }
  }

  async auditService(serviceName) {
    const servicePath = path.join(this.servicesDir, serviceName);
    
    // Check for unsafe environment variable patterns
    await this.checkUnsafeEnvironmentUsage(serviceName, servicePath);
    
    // Check for missing environment validation
    await this.checkEnvironmentValidation(serviceName, servicePath);
    
    // Check for hardcoded secrets
    await this.checkHardcodedSecrets(serviceName, servicePath);
    
    // Check for .env.example
    await this.checkEnvironmentExamples(serviceName, servicePath);
  }

  async checkUnsafeEnvironmentUsage(serviceName, servicePath) {
    const unsafePatterns = [
      /process\.env\.\w+\s*\|\|\s*['"][^'"]*['"]/g,  // process.env.VAR || 'default'
      /process\.env\.\w+\s*\?\?\s*['"][^'"]*['"]/g,  // process.env.VAR ?? 'default'
      /process\.env\.\w+\s*\|\|\s*['"].*secret.*['"]/gi, // secrets with fallbacks
      /process\.env\.\w+\s*\|\|\s*['"].*password.*['"]/gi, // passwords with fallbacks
      /process\.env\.\w+\s*\|\|\s*['"].*key.*['"]/gi, // keys with fallbacks
    ];

    this.scanDirectory(servicePath, unsafePatterns, (file, matches) => {
      matches.forEach(match => {
        this.addVulnerability({
          service: serviceName,
          type: 'CRITICAL',
          category: 'Unsafe Environment Fallback',
          file: path.relative(servicePath, file),
          code: match[0],
          message: 'Environment variable has unsafe fallback that could expose secrets',
          recommendation: 'Use environment validation with zod schema instead'
        });
        this.criticalVulnerabilities++;
      });
    });
  }

  async checkEnvironmentValidation(serviceName, servicePath) {
    const configFiles = [
      'config/environment.ts',
      'src/config/environment.ts',
      'config/env.ts',
      'src/config/env.ts'
    ];

    const hasValidation = configFiles.some(file => 
      fs.existsSync(path.join(servicePath, file))
    );

    if (!hasValidation) {
      this.addVulnerability({
        service: serviceName,
        type: 'HIGH',
        category: 'Missing Environment Validation',
        file: 'N/A',
        code: '',
        message: 'Service lacks centralized environment variable validation',
        recommendation: 'Implement zod-based environment validation in config/environment.ts'
      });
      this.highVulnerabilities++;
    }
  }

  async checkHardcodedSecrets(serviceName, servicePath) {
    const secretPatterns = [
      /['"][A-Za-z0-9+/]{40,}['"]/g, // Base64 encoded secrets
      /['"]sk_[a-zA-Z0-9]{24,}['"]/g, // Stripe secret keys
      /['"]pk_[a-zA-Z0-9]{24,}['"]/g, // Stripe public keys
      /['"][a-zA-Z0-9]{32,}['"]/g, // Generic long strings
      /password\s*[:=]\s*['"][^'"]+['"]/gi, // Hardcoded passwords
      /secret\s*[:=]\s*['"][^'"]+['"]/gi, // Hardcoded secrets
    ];

    this.scanDirectory(servicePath, secretPatterns, (file, matches) => {
      matches.forEach(match => {
        if (!match[0].includes('YOUR_') && !match[0].includes('REPLACE_')) {
          this.addVulnerability({
            service: serviceName,
            type: 'CRITICAL',
            category: 'Hardcoded Secret',
            file: path.relative(servicePath, file),
            code: match[0].substring(0, 20) + '...',
            message: 'Potential hardcoded secret detected in source code',
            recommendation: 'Move secret to environment variable'
          });
          this.criticalVulnerabilities++;
        }
      });
    });
  }

  async checkEnvironmentExamples(serviceName, servicePath) {
    const envExample = path.join(servicePath, '.env.example');
    if (!fs.existsSync(envExample)) {
      this.addVulnerability({
        service: serviceName,
        type: 'MEDIUM',
        category: 'Missing Environment Example',
        file: '.env.example',
        code: '',
        message: 'Service lacks .env.example file for development setup',
        recommendation: 'Create .env.example with all required environment variables'
      });
      this.mediumVulnerabilities++;
    }
  }

  scanDirectory(dirPath, patterns, callback) {
    const extensions = ['.ts', '.js', '.json'];
    
    const scanFile = (filePath: any): any => {
      if (!extensions.some(ext => filePath.endsWith(ext))) return;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        patterns.forEach(pattern => {
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
    void console.log(chalk.blue.bold('\n📊 ENVIRONMENT SECURITY AUDIT REPORT'));
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

    void console.log(riskColor(`\n🚨 OVERALL RISK LEVEL: ${riskLevel}`));

    // Detailed vulnerabilities
    if (total > 0) {
      void console.log(chalk.white('\n🔍 DETAILED FINDINGS:'));
      
      this.vulnerabilities
        .sort((a, b) => {
          const order = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2 };
          return order[a.type] - order[b.type];
        })
        .forEach((vuln, index) => {
          const typeColor = vuln.type === 'CRITICAL' ? chalk.red : 
                           vuln.type === 'HIGH' ? chalk.yellow : chalk.blue;
          
          void console.log(chalk.gray(`\n${index + 1}. ${vuln.service}`));
          void console.log(typeColor(`   ${vuln.type}: ${vuln.category}`));
          void console.log(chalk.white(`   File: ${vuln.file}`));
          if (vuln.code) {
            void console.log(chalk.gray(`   Code: ${vuln.code}`));
          }
          void console.log(chalk.cyan(`   Issue: ${vuln.message}`));
          void console.log(chalk.green(`   Fix: ${vuln.recommendation}`));
        });
    }

    // Action Items
    void console.log(chalk.blue.bold('\n🎯 IMMEDIATE ACTION ITEMS:'));
    
    if (this.criticalVulnerabilities > 0) {
      void console.log(chalk.red('   🔴 CRITICAL: Fix environment fallbacks immediately'));
      void console.log(chalk.red('   🔴 CRITICAL: Remove any hardcoded secrets'));
    }
    
    if (this.highVulnerabilities > 0) {
      void console.log(chalk.yellow('   🟡 HIGH: Implement environment validation with zod'));
    }
    
    if (this.mediumVulnerabilities > 0) {
      void console.log(chalk.blue('   🔵 MEDIUM: Create .env.example files'));
    }

    void console.log(chalk.gray('\n═'.repeat(60)));
    
    if (this.criticalVulnerabilities > 0) {
      void console.log(chalk.red.bold('❌ AUDIT FAILED: Critical security vulnerabilities detected!'));
      process.exit(1);
    } else {
      void console.log(chalk.green.bold('✅ AUDIT PASSED: No critical vulnerabilities detected.'));
    }
  }
}

// Execute audit
const auditor = new EnvironmentSecurityAuditor();
auditor.audit().catch(error => {
  console.error(chalk.red('💥 Audit failed:'), error);
  process.exit(1);
});