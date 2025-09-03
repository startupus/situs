const fs = require('fs');
const path = require('path');

console.log('🚀 Быстрая миграция TailGrids компонентов...');

// Простой список компонентов для создания
const components = [
  {
    name: 'Pricing1',
    category: 'interactive',
    content: `import React, { useState } from 'react';

export interface Pricing1Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
}

const Pricing1: React.FC<Pricing1Props> = ({
  sectionTitle = "Simple Pricing",
  sectionSubtitle = "Choose your plan"
}) => {
  const [isYearly, setIsYearly] = useState(false);
  
  return (
    <section className="bg-white py-16 dark:bg-dark lg:py-20">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 
            contentEditable 
            suppressContentEditableWarning={true}
            className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl"
          >
            {sectionTitle}
          </h2>
          <p 
            contentEditable 
            suppressContentEditableWarning={true}
            className="text-lg text-body-color"
          >
            {sectionSubtitle}
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-dark-2">
            <h3 
              contentEditable 
              suppressContentEditableWarning={true}
              className="mb-4 text-2xl font-bold"
            >
              Basic
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$19</span>
              <span className="text-gray-500">/month</span>
            </div>
            <button className="w-full rounded-lg bg-primary py-3 text-white">
              <span contentEditable suppressContentEditableWarning={true}>
                Get Started
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing1;`,
  },

  {
    name: 'FAQ1',
    category: 'interactive',
    content: `import React, { useState } from 'react';

export interface FAQ1Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
}

const FAQ1: React.FC<FAQ1Props> = ({
  sectionTitle = "Frequently Asked Questions",
  sectionSubtitle = "Get answers to common questions"
}) => {
  const [openIndex, setOpenIndex] = useState(0);
  
  const faqs = [
    {
      question: "What is included in the basic plan?",
      answer: "Our basic plan includes all essential features you need to get started."
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time."
    }
  ];
  
  return (
    <section className="bg-gray-50 py-16 dark:bg-dark-2 lg:py-20">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 
            contentEditable 
            suppressContentEditableWarning={true}
            className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl"
          >
            {sectionTitle}
          </h2>
          <p 
            contentEditable 
            suppressContentEditableWarning={true}
            className="text-lg text-body-color"
          >
            {sectionSubtitle}
          </p>
        </div>
        
        <div className="mx-auto max-w-3xl">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 rounded-lg bg-white p-6 shadow-lg dark:bg-dark">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 
                  contentEditable 
                  suppressContentEditableWarning={true}
                  className="text-lg font-semibold"
                >
                  {faq.question}
                </h3>
                <span className="text-2xl">{openIndex === index ? '-' : '+'}</span>
              </button>
              {openIndex === index && (
                <p 
                  contentEditable 
                  suppressContentEditableWarning={true}
                  className="mt-4 text-body-color"
                >
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ1;`,
  },
];

// Создаем компоненты
let created = 0;

components.forEach((comp) => {
  const targetDir = `src/redactus-components/${comp.category}`;

  // Создаем папку если не существует
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, `${comp.name}.tsx`);

  // Создаем файл если не существует
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, comp.content);
    console.log(`✅ Создан: ${comp.name}.tsx`);
    created++;
  } else {
    console.log(`⏭️  Пропущен: ${comp.name}.tsx (уже существует)`);
  }
});

// Создаем/обновляем index.ts для interactive
const interactiveDir = 'src/redactus-components/interactive';
const indexPath = path.join(interactiveDir, 'index.ts');

const indexContent = `// Interactive Components (Auto-generated)
export { default as Pricing1 } from './Pricing1';
export { default as FAQ1 } from './FAQ1';

// Type exports
export type { Pricing1Props } from './Pricing1';
export type { FAQ1Props } from './FAQ1';`;

fs.writeFileSync(indexPath, indexContent);
console.log('📝 Создан/обновлен index.ts');

console.log(`🎉 Быстрая миграция завершена! Создано ${created} компонентов`);
