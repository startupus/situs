-- CreateTable
CREATE TABLE "admin_screens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT,
    "category" TEXT,
    "productId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "admin_screens_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "admin_screens_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "web_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "alias" TEXT NOT NULL DEFAULT '',
    "level" INTEGER NOT NULL DEFAULT 1,
    "parentId" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT '*',
    "accessLevel" TEXT NOT NULL DEFAULT 'PUBLIC',
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "web_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "web_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "web_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "page_web_categories" (
    "pageId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("pageId", "categoryId"),
    CONSTRAINT "page_web_categories_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "page_web_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "web_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "instanceKey" TEXT NOT NULL DEFAULT 'default',
    "title" TEXT,
    "version" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DISABLED',
    "config" JSONB,
    "secrets" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "integrations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "integration_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "integrationId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "integration_events_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT,
    "pageType" TEXT NOT NULL DEFAULT 'PAGE',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isHomePage" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "template" TEXT,
    "layout" TEXT,
    "accessLevel" TEXT NOT NULL DEFAULT 'PUBLIC',
    "customAccessLevelId" TEXT,
    "productId" TEXT NOT NULL,
    "primaryCategoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "pages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "pages_primaryCategoryId_fkey" FOREIGN KEY ("primaryCategoryId") REFERENCES "web_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_pages" ("accessLevel", "content", "createdAt", "customAccessLevelId", "id", "isHomePage", "layout", "metaDescription", "metaKeywords", "metaTitle", "orderIndex", "pageType", "productId", "slug", "status", "template", "title", "updatedAt") SELECT "accessLevel", "content", "createdAt", "customAccessLevelId", "id", "isHomePage", "layout", "metaDescription", "metaKeywords", "metaTitle", "orderIndex", "pageType", "productId", "slug", "status", "template", "title", "updatedAt" FROM "pages";
DROP TABLE "pages";
ALTER TABLE "new_pages" RENAME TO "pages";
CREATE UNIQUE INDEX "pages_productId_slug_key" ON "pages"("productId", "slug");
CREATE TABLE "new_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "isSystemAdmin" BOOLEAN NOT NULL DEFAULT false,
    "domain" TEXT,
    "customDomain" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "settings" TEXT DEFAULT '{"theme":"auto","language":"ru"}',
    "theme" TEXT DEFAULT '{"primaryColor":"#3B82F6","secondaryColor":"#8B5CF6"}',
    "accessLevel" TEXT NOT NULL DEFAULT 'PUBLIC',
    "customAccessLevelId" TEXT,
    "ownerId" TEXT NOT NULL,
    "accountId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "projects_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_projects" ("accessLevel", "accountId", "createdAt", "customAccessLevelId", "customDomain", "description", "domain", "id", "isPublished", "name", "ownerId", "settings", "slug", "status", "theme", "updatedAt") SELECT "accessLevel", "accountId", "createdAt", "customAccessLevelId", "customDomain", "description", "domain", "id", "isPublished", "name", "ownerId", "settings", "slug", "status", "theme", "updatedAt" FROM "projects";
DROP TABLE "projects";
ALTER TABLE "new_projects" RENAME TO "projects";
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "admin_screens_projectId_alias_key" ON "admin_screens"("projectId", "alias");

-- CreateIndex
CREATE UNIQUE INDEX "admin_screens_projectId_path_key" ON "admin_screens"("projectId", "path");

-- CreateIndex
CREATE UNIQUE INDEX "web_categories_productId_slug_key" ON "web_categories"("productId", "slug");

-- CreateIndex
CREATE INDEX "integrations_projectId_idx" ON "integrations"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_projectId_provider_instanceKey_key" ON "integrations"("projectId", "provider", "instanceKey");

-- CreateIndex
CREATE INDEX "integration_events_integrationId_idx" ON "integration_events"("integrationId");
