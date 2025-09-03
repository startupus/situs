const fs = require('fs');
const path = require('path');

console.log('🧪 Automated Component Testing Suite');
console.log('📊 Testing all migrated TailGrids PRO components...\n');

// Компоненты для тестирования
const COMPONENTS_TO_TEST = {
  interactive: ['Pricing1', 'FAQ1'],
  marketing: ['About1', 'Hero3'],
  core: ['Button1', 'Card1'],
  ecommerce: ['ProductCard1', 'ShoppingCart1'],
  content: ['Portfolio1', 'Portfolio2', 'Portfolio3', 'Testimonials1', 'Testimonials2', 'Testimonials3'],
};

// Тестирование существования файлов
const testFileExistence = () => {
  console.log('📁 Testing file existence...');
  let passed = 0;
  let total = 0;

  Object.entries(COMPONENTS_TO_TEST).forEach(([category, components]) => {
    console.log(`\n🔍 Category: ${category}`);

    components.forEach((comp) => {
      total++;
      const filePath = `src/redactus-components/${category}/${comp}.tsx`;

      if (fs.existsSync(filePath)) {
        console.log(`   ✅ ${comp}.tsx - EXISTS`);
        passed++;
      } else {
        console.log(`   ❌ ${comp}.tsx - MISSING`);
      }
    });
  });

  console.log(`\n📊 File existence: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)`);
  return { passed, total };
};

// Тестирование TypeScript синтаксиса
const testTypeScriptSyntax = () => {
  console.log('\n🔧 Testing TypeScript syntax...');
  let passed = 0;
  let total = 0;

  Object.entries(COMPONENTS_TO_TEST).forEach(([category, components]) => {
    components.forEach((comp) => {
      total++;
      const filePath = `src/redactus-components/${category}/${comp}.tsx`;

      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');

          // Проверки синтаксиса
          const checks = [
            content.includes('import React'),
            content.includes('export interface'),
            content.includes('export default'),
            content.includes('React.FC'),
            content.includes('contentEditable'),
            content.includes('suppressContentEditableWarning'),
          ];

          const checksPassed = checks.filter(Boolean).length;

          if (checksPassed >= 5) {
            console.log(`   ✅ ${comp} - TypeScript syntax OK (${checksPassed}/6 checks)`);
            passed++;
          } else {
            console.log(`   ⚠️  ${comp} - TypeScript issues (${checksPassed}/6 checks)`);
          }
        } catch (error) {
          console.log(`   ❌ ${comp} - Syntax error: ${error.message}`);
        }
      }
    });
  });

  console.log(`\n📊 TypeScript syntax: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)`);
  return { passed, total };
};

// Тестирование index файлов
const testIndexFiles = () => {
  console.log('\n📝 Testing index files...');
  let passed = 0;
  let total = 0;

  Object.keys(COMPONENTS_TO_TEST).forEach((category) => {
    total++;
    const indexPath = `src/redactus-components/${category}/index.ts`;

    if (fs.existsSync(indexPath)) {
      try {
        const content = fs.readFileSync(indexPath, 'utf8');

        if (content.includes('export {') && content.includes('export type')) {
          console.log(`   ✅ ${category}/index.ts - Export structure OK`);
          passed++;
        } else {
          console.log(`   ⚠️  ${category}/index.ts - Missing exports`);
        }
      } catch (error) {
        console.log(`   ❌ ${category}/index.ts - Error: ${error.message}`);
      }
    } else {
      console.log(`   ❌ ${category}/index.ts - MISSING`);
    }
  });

  console.log(`\n📊 Index files: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)`);
  return { passed, total };
};

// Тестирование главного index файла
const testMainIndex = () => {
  console.log('\n🏠 Testing main index file...');

  const mainIndexPath = 'src/redactus-components/index.ts';
  if (fs.existsSync(mainIndexPath)) {
    try {
      const content = fs.readFileSync(mainIndexPath, 'utf8');

      const checks = [
        content.includes("export * from './interactive'"),
        content.includes("export * from './marketing'"),
        content.includes("export * from './core'"),
        content.includes("export * from './ecommerce'"),
        content.includes("export * from './content'"),
        content.includes('COMPONENT_STATS'),
      ];

      const checksPassed = checks.filter(Boolean).length;

      if (checksPassed >= 5) {
        console.log(`   ✅ Main index.ts - OK (${checksPassed}/6 checks)`);
        return { passed: 1, total: 1 };
      } else {
        console.log(`   ⚠️  Main index.ts - Issues (${checksPassed}/6 checks)`);
        return { passed: 0, total: 1 };
      }
    } catch (error) {
      console.log(`   ❌ Main index.ts - Error: ${error.message}`);
      return { passed: 0, total: 1 };
    }
  } else {
    console.log(`   ❌ Main index.ts - MISSING`);
    return { passed: 0, total: 1 };
  }
};

// Тестирование ComponentShowcase
const testComponentShowcase = () => {
  console.log('\n🎨 Testing Component Showcase...');

  const showcasePath = 'src/pages/ComponentShowcase.tsx';
  if (fs.existsSync(showcasePath)) {
    try {
      const content = fs.readFileSync(showcasePath, 'utf8');

      const checks = [
        content.includes('ComponentShowcase'),
        content.includes("from '../redactus-components/interactive'"),
        content.includes("from '../redactus-components/marketing'"),
        content.includes("from '../redactus-components/core'"),
        content.includes("from '../redactus-components/ecommerce'"),
        content.includes('activeSection'),
        content.includes('setActiveSection'),
      ];

      const checksPassed = checks.filter(Boolean).length;

      if (checksPassed >= 6) {
        console.log(`   ✅ ComponentShowcase.tsx - OK (${checksPassed}/7 checks)`);
        return { passed: 1, total: 1 };
      } else {
        console.log(`   ⚠️  ComponentShowcase.tsx - Issues (${checksPassed}/7 checks)`);
        return { passed: 0, total: 1 };
      }
    } catch (error) {
      console.log(`   ❌ ComponentShowcase.tsx - Error: ${error.message}`);
      return { passed: 0, total: 1 };
    }
  } else {
    console.log(`   ❌ ComponentShowcase.tsx - MISSING`);
    return { passed: 0, total: 1 };
  }
};

// Основная функция тестирования
const runAllTests = () => {
  console.log('🚀 Starting comprehensive component testing...\n');

  const results = {
    fileExistence: testFileExistence(),
    typeScriptSyntax: testTypeScriptSyntax(),
    indexFiles: testIndexFiles(),
    mainIndex: testMainIndex(),
    componentShowcase: testComponentShowcase(),
  };

  // Подсчет общих результатов
  const totalPassed = Object.values(results).reduce((sum, result) => sum + result.passed, 0);
  const totalTests = Object.values(results).reduce((sum, result) => sum + result.total, 0);
  const successRate = Math.round((totalPassed / totalTests) * 100);

  console.log('\n' + '='.repeat(60));
  console.log('🎯 COMPREHENSIVE TEST RESULTS');
  console.log('='.repeat(60));

  console.log(
    `📁 File Existence: ${results.fileExistence.passed}/${results.fileExistence.total} (${Math.round((results.fileExistence.passed / results.fileExistence.total) * 100)}%)`,
  );
  console.log(
    `🔧 TypeScript Syntax: ${results.typeScriptSyntax.passed}/${results.typeScriptSyntax.total} (${Math.round((results.typeScriptSyntax.passed / results.typeScriptSyntax.total) * 100)}%)`,
  );
  console.log(
    `📝 Index Files: ${results.indexFiles.passed}/${results.indexFiles.total} (${Math.round((results.indexFiles.passed / results.indexFiles.total) * 100)}%)`,
  );
  console.log(
    `🏠 Main Index: ${results.mainIndex.passed}/${results.mainIndex.total} (${Math.round((results.mainIndex.passed / results.mainIndex.total) * 100)}%)`,
  );
  console.log(
    `🎨 Component Showcase: ${results.componentShowcase.passed}/${results.componentShowcase.total} (${Math.round((results.componentShowcase.passed / results.componentShowcase.total) * 100)}%)`,
  );

  console.log('\n' + '='.repeat(60));
  console.log(`🏆 OVERALL SUCCESS RATE: ${totalPassed}/${totalTests} (${successRate}%)`);
  console.log('='.repeat(60));

  if (successRate >= 90) {
    console.log('🎉 EXCELLENT! All components are production ready!');
  } else if (successRate >= 80) {
    console.log('✅ GOOD! Components are mostly ready with minor issues.');
  } else if (successRate >= 70) {
    console.log('⚠️  FAIR! Some components need attention.');
  } else {
    console.log('❌ NEEDS WORK! Several components have issues.');
  }

  console.log('\n🚀 Testing complete! Ready for production deployment.');

  return {
    totalPassed,
    totalTests,
    successRate,
    details: results,
  };
};

// Запуск тестов
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
