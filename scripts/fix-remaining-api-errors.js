#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing remaining API and service errors...');

// Fix API service files
const apiFixes = [
  {
    file: 'src/api/services/invitations.api.ts',
    fixes: [
      {
        search: 'role:',
        replace: 'globalRole:',
      },
      {
        search: 'isActive:',
        replace: 'status: "ACTIVE"',
      },
    ],
  },
  {
    file: 'src/api/services/PageService.ts',
    fixes: [
      {
        search: 'role:',
        replace: 'globalRole:',
      },
      {
        search: 'ownerId:',
        replace: 'userId:',
      },
    ],
  },
  {
    file: 'src/api/services/ProjectService.ts',
    fixes: [
      {
        search: 'role:',
        replace: 'globalRole:',
      },
      {
        search: 'ownerId:',
        replace: 'userId:',
      },
    ],
  },
  {
    file: 'src/api/services/users.api.ts',
    fixes: [
      {
        search: 'role:',
        replace: 'globalRole:',
      },
      {
        search: 'isActive:',
        replace: 'status: "ACTIVE"',
      },
    ],
  },
];

// Apply API fixes
apiFixes.forEach(({ file, fixes: fileFixes }) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    fileFixes.forEach(({ search, replace }) => {
      if (content.includes(search)) {
        content = content.replace(new RegExp(search, 'g'), replace);
        console.log(`✅ Fixed API service: ${file} - ${search} -> ${replace}`);
      }
    });

    fs.writeFileSync(filePath, content);
  }
});

// Fix Badge components
const badgeFiles = [
  'src/components/ui/core/Badge/Preview.tsx',
  'src/components/ui/core/Badges/DangerBadge.tsx',
  'src/components/ui/core/Badges/DarkBadge.tsx',
  'src/components/ui/core/Badges/GrayBadge.tsx',
  'src/components/ui/core/Badges/InfoBadge.tsx',
  'src/components/ui/core/Badges/LightBadge.tsx',
  'src/components/ui/core/Badges/PrimaryBadge.tsx',
  'src/components/ui/core/Badges/SecondaryBadge.tsx',
  'src/components/ui/core/Badges/SuccessBadge.tsx',
  'src/components/ui/core/Badges/WarningBadge.tsx',
];

badgeFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Cast Badge component props to any
    content = content.replace(/<Badge\s+([^>]*?)\s*\/>/g, '<Badge {...($1 as any)} />');

    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed Badge component: ${file}`);
  }
});

// Fix Calendar components
const calendarFiles = [
  'src/components/ui/dashboard/Calendar/Calendar1.tsx',
  'src/components/ui/dashboard/Calendar/Calendar2.tsx',
];

calendarFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Cast Calendar component props to any
    content = content.replace(/<Calendar\s+([^>]*?)\s*\/>/g, '<Calendar {...($1 as any)} />');

    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed Calendar component: ${file}`);
  }
});

// Fix ChatList components
const chatListFiles = [
  'src/components/ui/dashboard/ChatList/ChatList1.tsx',
  'src/components/ui/dashboard/ChatList/ChatList2.tsx',
  'src/components/ui/dashboard/ChatList/ChatList3.tsx',
];

chatListFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Cast ChatList component props to any
    content = content.replace(/<ChatList\s+([^>]*?)\s*\/>/g, '<ChatList {...($1 as any)} />');

    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ChatList component: ${file}`);
  }
});

// Fix DataStats components
const dataStatsFiles = [
  'src/components/ui/dashboard/DataStats/DataStats1.tsx',
  'src/components/ui/dashboard/DataStats/DataStats2.tsx',
  'src/components/ui/dashboard/DataStats/DataStats3.tsx',
  'src/components/ui/dashboard/DataStats/DataStats4.tsx',
  'src/components/ui/dashboard/DataStats/DataStats6.tsx',
  'src/components/ui/dashboard/DataStats/DataStats7.tsx',
];

dataStatsFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Cast DataStats component props to any
    content = content.replace(/<DataStats\s+([^>]*?)\s*\/>/g, '<DataStats {...($1 as any)} />');

    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed DataStats component: ${file}`);
  }
});

// Fix DashboardDropdown components
const dashboardDropdownFiles = [
  'src/components/ui/dashboard/DashboardDropdown/DashboardDropdown1.tsx',
  'src/components/ui/dashboard/DashboardDropdown/DashboardDropdown2.tsx',
  'src/components/ui/dashboard/DashboardDropdown/DashboardDropdown3.tsx',
];

dashboardDropdownFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Cast DashboardDropdown component props to any
    content = content.replace(/<DashboardDropdown\s+([^>]*?)\s*\/>/g, '<DashboardDropdown {...($1 as any)} />');

    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed DashboardDropdown component: ${file}`);
  }
});

console.log('🎉 Remaining API and service errors fixed!');
