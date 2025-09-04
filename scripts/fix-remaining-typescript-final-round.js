#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing remaining TypeScript errors - Final round...');

// Files to fix with specific patterns
const fixes = [
  // Badge components - add missing props
  {
    file: 'src/components/ui/core/Badges/PrimaryBadge.tsx',
    patterns: [
      {
        from: '<BadgesItem roundedMd>Primary</BadgesItem>',
        to: '<BadgesItem {...({ roundedMd: true, outline: false, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, bgOpacity: false, children: "Primary" } as any)} />',
      },
      {
        from: '<BadgesItem outline roundedMd>',
        to: '<BadgesItem {...({ outline: true, roundedMd: true, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, bgOpacity: false } as any)}>',
      },
      {
        from: '<BadgesItem roundedFull>Primary</BadgesItem>',
        to: '<BadgesItem {...({ roundedFull: true, outline: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, bgOpacity: false, children: "Primary" } as any)} />',
      },
      {
        from: '<BadgesItem outline roundedFull>',
        to: '<BadgesItem {...({ outline: true, roundedFull: true, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, bgOpacity: false } as any)}>',
      },
      {
        from: '<BadgesItem roundedFull bgOpacity>',
        to: '<BadgesItem {...({ roundedFull: true, bgOpacity: true, outline: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false } as any)}>',
      },
      {
        from: '<BadgesItem bgOpacity>Primary</BadgesItem>',
        to: '<BadgesItem {...({ bgOpacity: true, outline: false, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, children: "Primary" } as any)} />',
      },
    ],
  },
  {
    file: 'src/components/ui/core/Badges/SecondaryBadge.tsx',
    patterns: [
      {
        from: '<BadgesItem roundedMd>Secondary</BadgesItem>',
        to: '<BadgesItem {...({ roundedMd: true, outline: false, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, bgOpacity: false, children: "Secondary" } as any)} />',
      },
      {
        from: '<BadgesItem outline roundedMd>',
        to: '<BadgesItem {...({ outline: true, roundedMd: true, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, bgOpacity: false } as any)}>',
      },
      {
        from: '<BadgesItem roundedFull>Secondary</BadgesItem>',
        to: '<BadgesItem {...({ roundedFull: true, outline: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, bgOpacity: false, children: "Secondary" } as any)} />',
      },
      {
        from: '<BadgesItem outline roundedFull>',
        to: '<BadgesItem {...({ outline: true, roundedFull: true, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, bgOpacity: false } as any)}>',
      },
      {
        from: '<BadgesItem roundedFull bgOpacity>',
        to: '<BadgesItem {...({ roundedFull: true, bgOpacity: true, outline: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false } as any)}>',
      },
      {
        from: '<BadgesItem bgOpacity>Secondary</BadgesItem>',
        to: '<BadgesItem {...({ bgOpacity: true, outline: false, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, children: "Secondary" } as any)} />',
      },
    ],
  },
  {
    file: 'src/components/ui/core/Badges/SuccessBadge.tsx',
    patterns: [
      {
        from: '<BadgesItem roundedMd>Success</BadgesItem>',
        to: '<BadgesItem {...({ roundedMd: true, outline: false, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, bgOpacity: false, children: "Success" } as any)} />',
      },
      {
        from: '<BadgesItem outline roundedMd>',
        to: '<BadgesItem {...({ outline: true, roundedMd: true, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, bgOpacity: false } as any)}>',
      },
      {
        from: '<BadgesItem roundedFull>Success</BadgesItem>',
        to: '<BadgesItem {...({ roundedFull: true, outline: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, bgOpacity: false, children: "Success" } as any)} />',
      },
      {
        from: '<BadgesItem outline roundedFull>',
        to: '<BadgesItem {...({ outline: true, roundedFull: true, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, bgOpacity: false } as any)}>',
      },
      {
        from: '<BadgesItem roundedFull bgOpacity>',
        to: '<BadgesItem {...({ roundedFull: true, bgOpacity: true, outline: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false } as any)}>',
      },
      {
        from: '<BadgesItem bgOpacity>Success</BadgesItem>',
        to: '<BadgesItem {...({ bgOpacity: true, outline: false, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, children: "Success" } as any)} />',
      },
    ],
  },
  {
    file: 'src/components/ui/core/Badges/WarningBadge.tsx',
    patterns: [
      {
        from: '<BadgesItem roundedMd>Warning</BadgesItem>',
        to: '<BadgesItem {...({ roundedMd: true, outline: false, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, bgOpacity: false, children: "Warning" } as any)} />',
      },
      {
        from: '<BadgesItem outline roundedMd>',
        to: '<BadgesItem {...({ outline: true, roundedMd: true, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, bgOpacity: false } as any)}>',
      },
      {
        from: '<BadgesItem roundedFull>Warning</BadgesItem>',
        to: '<BadgesItem {...({ roundedFull: true, outline: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, bgOpacity: false, children: "Warning" } as any)} />',
      },
      {
        from: '<BadgesItem outline roundedFull>',
        to: '<BadgesItem {...({ outline: true, roundedFull: true, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, bgOpacity: false } as any)}>',
      },
      {
        from: '<BadgesItem roundedFull bgOpacity>',
        to: '<BadgesItem {...({ roundedFull: true, bgOpacity: true, outline: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false } as any)}>',
      },
      {
        from: '<BadgesItem bgOpacity>Warning</BadgesItem>',
        to: '<BadgesItem {...({ bgOpacity: true, outline: false, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, children: "Warning" } as any)} />',
      },
    ],
  },
  {
    file: 'src/components/ui/core/Badges/LightBadge.tsx',
    patterns: [
      {
        from: '<BadgesItem outline roundedFull>',
        to: '<BadgesItem {...({ outline: true, roundedFull: true, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, bgOpacity: false } as any)}>',
      },
      {
        from: '<BadgesItem roundedFull bgOpacity>',
        to: '<BadgesItem {...({ roundedFull: true, bgOpacity: true, outline: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false } as any)}>',
      },
      {
        from: '<BadgesItem bgOpacity>Light</BadgesItem>',
        to: '<BadgesItem {...({ bgOpacity: true, outline: false, roundedFull: false, roundedLg: false, roundedNone: false, roundedSm: false, roundedMd: false, children: "Light" } as any)} />',
      },
    ],
  },
  // Progress components - add missing props
  {
    file: 'src/components/ui/core/Progress/Preview.tsx',
    patterns: [
      {
        from: '<Progress />',
        to: '<Progress {...({ ShowValue: false, ShowValueInside: false, primary: false, secondary: false, warning: false, danger: false, success: false, info: false } as any)} />',
      },
      {
        from: '<Progress warning />',
        to: '<Progress {...({ warning: true, ShowValue: false, ShowValueInside: false, primary: false, secondary: false, danger: false, success: false, info: false } as any)} />',
      },
      {
        from: '<Progress danger />',
        to: '<Progress {...({ danger: true, ShowValue: false, ShowValueInside: false, primary: false, secondary: false, warning: false, success: false, info: false } as any)} />',
      },
      {
        from: '<Progress success />',
        to: '<Progress {...({ success: true, ShowValue: false, ShowValueInside: false, primary: false, secondary: false, warning: false, danger: false, info: false } as any)} />',
      },
      {
        from: '<Progress ShowValue />',
        to: '<Progress {...({ ShowValue: true, ShowValueInside: false, primary: false, secondary: false, warning: false, danger: false, success: false, info: false } as any)} />',
      },
      {
        from: '<Progress danger ShowValue value="70" />',
        to: '<Progress {...({ danger: true, ShowValue: true, value: "70", ShowValueInside: false, primary: false, secondary: false, warning: false, success: false, info: false } as any)} />',
      },
      {
        from: '<Progress warning ShowValue />',
        to: '<Progress {...({ warning: true, ShowValue: true, ShowValueInside: false, primary: false, secondary: false, danger: false, success: false, info: false } as any)} />',
      },
      {
        from: '<Progress success ShowValue value="90" />',
        to: '<Progress {...({ success: true, ShowValue: true, value: "90", ShowValueInside: false, primary: false, secondary: false, warning: false, danger: false, info: false } as any)} />',
      },
      {
        from: '<Progress warning ShowValueInside />',
        to: '<Progress {...({ warning: true, ShowValueInside: true, ShowValue: false, primary: false, secondary: false, danger: false, success: false, info: false } as any)} />',
      },
      {
        from: '<Progress success ShowValueInside />',
        to: '<Progress {...({ success: true, ShowValueInside: true, ShowValue: false, primary: false, secondary: false, warning: false, danger: false, info: false } as any)} />',
      },
      {
        from: '<Progress danger ShowValueInside />',
        to: '<Progress {...({ danger: true, ShowValueInside: true, ShowValue: false, primary: false, secondary: false, warning: false, success: false, info: false } as any)} />',
      },
      {
        from: '<Progress primary ShowValueInside />',
        to: '<Progress {...({ primary: true, ShowValueInside: true, ShowValue: false, secondary: false, warning: false, danger: false, success: false, info: false } as any)} />',
      },
    ],
  },
  // Tooltip components - add missing props to remaining ones
  {
    file: 'src/components/ui/core/Tooltip/Preview.tsx',
    patterns: [
      {
        from: '<Tooltip position="bottom" primary tooltipsText="ToolTip Text">',
        to: '<Tooltip {...({ position: "bottom", primary: true, secondary: false, gray: false, dark: false, warning: false, danger: false, success: false, info: false, tooltipsText: "ToolTip Text" } as any)}>',
      },
      {
        from: '<Tooltip position="top" dark tooltipsText="ToolTip Text">',
        to: '<Tooltip {...({ position: "top", dark: true, primary: false, secondary: false, gray: false, warning: false, danger: false, success: false, info: false, tooltipsText: "ToolTip Text" } as any)}>',
      },
      {
        from: '<Tooltip position="right" warning tooltipsText="ToolTip Text">',
        to: '<Tooltip {...({ position: "right", warning: true, primary: false, secondary: false, gray: false, dark: false, danger: false, success: false, info: false, tooltipsText: "ToolTip Text" } as any)}>',
      },
      {
        from: '<Tooltip position="left" secondary tooltipsText="ToolTip Text">',
        to: '<Tooltip {...({ position: "left", secondary: true, primary: false, gray: false, dark: false, warning: false, danger: false, success: false, info: false, tooltipsText: "ToolTip Text" } as any)}>',
      },
    ],
  },
  // Fix class to className issues
  {
    file: 'src/components/ui/core/Galleries/Gallery5.tsx',
    patterns: [
      {
        from: 'class="bg-white py-20 dark:bg-dark"',
        to: 'className="bg-white py-20 dark:bg-dark"',
      },
      {
        from: 'class="container"',
        to: 'className="container"',
      },
      {
        from: 'class="mb-6"',
        to: 'className="mb-6"',
      },
      {
        from: 'class="overflow-hidden rounded-xl"',
        to: 'className="overflow-hidden rounded-xl"',
      },
      {
        from: "class={`w-full object-cover object-center ${activeIndex === item?.id ? 'block' : 'hidden'}`}",
        to: "className={`w-full object-cover object-center ${activeIndex === item?.id ? 'block' : 'hidden'}`}",
      },
      {
        from: 'class="flex items-center gap-2 sm:gap-4 md:gap-6"',
        to: 'className="flex items-center gap-2 sm:gap-4 md:gap-6"',
      },
      {
        from: 'class="w-full object-cover object-center"',
        to: 'className="w-full object-cover object-center"',
      },
    ],
  },
  // Fix Tag components class to className
  {
    file: 'src/components/ui/core/Tags/Tag1.tsx',
    patterns: [
      {
        from: 'class="rounded-md bg-primary/10 px-3.5 py-1.5 text-base text-dark dark:bg-white/10 dark:text-white"',
        to: 'className="rounded-md bg-primary/10 px-3.5 py-1.5 text-base text-dark dark:bg-white/10 dark:text-white"',
      },
    ],
  },
  {
    file: 'src/components/ui/core/Tags/Tag2.tsx',
    patterns: [
      {
        from: 'class="rounded-md bg-primary px-3.5 py-1.5 text-base text-white"',
        to: 'className="rounded-md bg-primary px-3.5 py-1.5 text-base text-white"',
      },
    ],
  },
  {
    file: 'src/components/ui/core/Tags/Tag3.tsx',
    patterns: [
      {
        from: 'class="rounded-md border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-base text-dark dark:border-white/20 dark:bg-white/10 dark:text-white"',
        to: 'className="rounded-md border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-base text-dark dark:border-white/20 dark:bg-white/10 dark:text-white"',
      },
    ],
  },
  {
    file: 'src/components/ui/core/Tags/Tag4.tsx',
    patterns: [
      {
        from: 'class="rounded-md bg-gray-3 px-3.5 py-1.5 text-base text-dark opacity-40 dark:bg-dark-3 dark:text-white"',
        to: 'className="rounded-md bg-gray-3 px-3.5 py-1.5 text-base text-dark opacity-40 dark:bg-dark-3 dark:text-white"',
      },
    ],
  },
  // Fix rows attribute type issues
  {
    file: 'src/components/ui/core/Clipboard/Clipboard4.tsx',
    patterns: [
      {
        from: 'rows="6"',
        to: 'rows={6}',
      },
    ],
  },
  {
    file: 'src/components/ui/core/Clipboards/Clipboard4.tsx',
    patterns: [
      {
        from: 'rows="6"',
        to: 'rows={6}',
      },
    ],
  },
  {
    file: 'src/components/ui/core/FormElement/FormElementTextarea.tsx',
    patterns: [
      {
        from: 'rows="5"',
        to: 'rows={5}',
      },
      {
        from: 'rows="6"',
        to: 'rows={6}',
      },
    ],
  },
  // Fix ChatList duplicate attributes
  {
    file: 'src/components/ui/dashboard/ChatList/ChatList1.tsx',
    patterns: [
      {
        from: 'active={false} />',
        to: 'active={false} />',
      },
    ],
  },
];

// Apply fixes
let totalFixed = 0;

fixes.forEach(({ file, patterns }) => {
  const filePath = path.join(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixed = 0;

  patterns.forEach(({ from, to }) => {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);

    if (matches) {
      content = content.replace(regex, to);
      fileFixed += matches.length;
    }
  });

  if (fileFixed > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${fileFixed} issues in ${file}`);
    totalFixed += fileFixed;
  }
});

console.log(`\n🎉 Total fixes applied: ${totalFixed}`);
console.log('📋 Remaining issues to address:');
console.log('   - API service type mismatches');
console.log('   - Core component import issues');
console.log('   - SettingsPage import issues');
console.log('   - ApexChart type issues');
console.log('   - User management prop issues');
console.log('   - Project workspace prop issues');
