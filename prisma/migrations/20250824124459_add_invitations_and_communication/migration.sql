/*
  Warnings:

  - You are about to drop the `balances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `currencies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `caption` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `folder` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `pages` table. All the data in the column will be lost.
  - You are about to drop the column `editorUrl` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `fontFamily` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `hasAnalytics` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `hasBlog` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `hasContactForm` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `hasEcommerce` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `primaryColor` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryColor` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - Added the required column `uploadedBy` to the `media` table without a default value. This is not possible if the table is not empty.
  - Made the column `projectId` on table `media` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `productId` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX IF EXISTS "balances_userId_currencyId_key";

-- DropIndex
DROP INDEX IF EXISTS "currencies_code_key";

-- DropTable
DROP TABLE IF EXISTS "balances" CASCADE;

-- DropTable
DROP TABLE IF EXISTS "currencies" CASCADE;

-- DropTable
DROP TABLE IF EXISTS "transactions" CASCADE;

-- CreateTable
CREATE TABLE "user_groups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isCore" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_groups_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "user_groups" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_group_map" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    CONSTRAINT "user_group_map_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_group_map_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "user_groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "view_levels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ordering" INTEGER NOT NULL DEFAULT 0,
    "groupIds" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "user_auth_providers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_auth_providers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'BUSINESS',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "message" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'EMAIL',
    "invitedBy" TEXT NOT NULL,
    "acceptedBy" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "invitations_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invitations_acceptedBy_fkey" FOREIGN KEY ("acceptedBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "communication_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channel" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB NOT NULL,
    "inviteTemplate" TEXT,
    "reminderTemplate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "user_invitations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "token" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "role" TEXT,
    "accountId" TEXT,
    "projectId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3),
    "acceptedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_invitations_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_accesses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "grantedBy" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_accesses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "project_accesses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "project_accesses_grantedBy_fkey" FOREIGN KEY ("grantedBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "accounts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account_memberships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "account_memberships_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "account_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "agency_clients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agencyAccountId" TEXT NOT NULL,
    "clientAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "agency_clients_agencyAccountId_fkey" FOREIGN KEY ("agencyAccountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "agency_clients_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "alias" TEXT NOT NULL DEFAULT '',
    "image" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "parentId" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT '*',
    "accessLevel" TEXT NOT NULL DEFAULT 'PUBLIC',
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "price" DECIMAL NOT NULL DEFAULT 0,
    "comparePrice" DECIMAL,
    "costPrice" DECIMAL,
    "sku" TEXT,
    "barcode" TEXT,
    "trackQuantity" BOOLEAN NOT NULL DEFAULT true,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER,
    "images" TEXT NOT NULL DEFAULT '[]',
    "content" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isDigital" BOOLEAN NOT NULL DEFAULT false,
    "weight" DECIMAL,
    "dimensions" TEXT,
    "categoryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "menu_types" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "menu_types_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'COMPONENT',
    "level" INTEGER NOT NULL DEFAULT 1,
    "parentId" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "component" TEXT,
    "view" TEXT,
    "layout" TEXT,
    "targetId" TEXT,
    "externalUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "accessLevel" TEXT NOT NULL DEFAULT 'PUBLIC',
    "language" TEXT NOT NULL DEFAULT '*',
    "parameters" TEXT NOT NULL DEFAULT '{}',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "cssClass" TEXT,
    "menuImage" TEXT,
    "menuTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "menu_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "menu_items" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "menu_items_menuTypeId_fkey" FOREIGN KEY ("menuTypeId") REFERENCES "menu_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "custom_access_levels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "allowedRoles" TEXT NOT NULL DEFAULT '[]',
    "conditions" TEXT NOT NULL DEFAULT '{}',
    "projectId" TEXT,
    "accountId" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "custom_access_levels_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "custom_access_levels_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables (PostgreSQL)
CREATE TABLE "new_media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "alt" TEXT,
    "title" TEXT,
    "description" TEXT,
    "projectId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "media_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "media_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_media" ("alt", "createdAt", "filename", "id", "mimeType", "originalName", "projectId", "size", "updatedAt", "url") SELECT "alt", "createdAt", "filename", "id", "mimeType", "originalName", "projectId", "size", "updatedAt", "url" FROM "media";
DROP TABLE IF EXISTS "media" CASCADE;
ALTER TABLE "new_media" RENAME TO "media";
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "pages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_pages" ("content", "createdAt", "id", "isHomePage", "layout", "metaDescription", "metaKeywords", "metaTitle", "pageType", "slug", "status", "template", "title", "updatedAt") SELECT "content", "createdAt", "id", "isHomePage", "layout", "metaDescription", "metaKeywords", "metaTitle", "pageType", "slug", "status", "template", "title", "updatedAt" FROM "pages";
DROP TABLE IF EXISTS "pages" CASCADE;
ALTER TABLE "new_pages" RENAME TO "pages";
CREATE UNIQUE INDEX "pages_productId_slug_key" ON "pages"("productId", "slug");
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "subdomain" TEXT,
    "pathPrefix" TEXT,
    "settings" TEXT DEFAULT '{}',
    "pricingPlan" TEXT DEFAULT 'basic',
    "accessLevel" TEXT NOT NULL DEFAULT 'PUBLIC',
    "customAccessLevelId" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "products_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_products" ("createdAt", "description", "id", "name", "projectId", "settings", "status", "type", "updatedAt") SELECT "createdAt", "description", "id", "name", "projectId", "settings", "status", "type", "updatedAt" FROM "products";
DROP TABLE IF EXISTS "products" CASCADE;
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_projectId_name_key" ON "products"("projectId", "name");
CREATE TABLE "new_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "projects_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_projects" ("createdAt", "customDomain", "description", "domain", "id", "isPublished", "name", "ownerId", "settings", "slug", "status", "updatedAt") SELECT "createdAt", "customDomain", "description", "domain", "id", "isPublished", "name", "ownerId", "settings", "slug", "status", "updatedAt" FROM "projects";
DROP TABLE IF EXISTS "projects" CASCADE;
ALTER TABLE "new_projects" RENAME TO "projects";
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "globalRole" TEXT NOT NULL DEFAULT 'BUSINESS',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "subscriptionPlan" TEXT DEFAULT 'basic',
    "limits" TEXT DEFAULT '{"projects":1,"products":2,"aiTokens":1000}',
    "profile" TEXT DEFAULT '{"name":"","avatar":"","bio":""}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "id", "password", "profile", "status", "updatedAt", "username") SELECT "createdAt", "email", "id", "password", "profile", "status", "updatedAt", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
-- End RedefineTables

-- CreateIndex
CREATE UNIQUE INDEX "user_groups_title_key" ON "user_groups"("title");

-- CreateIndex
CREATE UNIQUE INDEX "user_group_map_userId_groupId_key" ON "user_group_map"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "view_levels_title_key" ON "view_levels"("title");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_providers_provider_providerUserId_key" ON "user_auth_providers"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_key" ON "invitations"("token");

-- CreateIndex
CREATE UNIQUE INDEX "communication_settings_channel_key" ON "communication_settings"("channel");

-- CreateIndex
CREATE UNIQUE INDEX "user_invitations_token_key" ON "user_invitations"("token");

-- CreateIndex
CREATE UNIQUE INDEX "project_accesses_projectId_userId_key" ON "project_accesses"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "account_memberships_accountId_userId_key" ON "account_memberships"("accountId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "agency_clients_agencyAccountId_clientAccountId_key" ON "agency_clients"("agencyAccountId", "clientAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_productId_slug_key" ON "categories"("productId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_productId_alias_key" ON "categories"("productId", "alias");

-- CreateIndex
CREATE UNIQUE INDEX "items_productId_slug_key" ON "items"("productId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "menu_types_projectId_name_key" ON "menu_types"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_menuTypeId_alias_key" ON "menu_items"("menuTypeId", "alias");

-- CreateIndex
CREATE UNIQUE INDEX "custom_access_levels_projectId_name_key" ON "custom_access_levels"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "custom_access_levels_accountId_name_key" ON "custom_access_levels"("accountId", "name");
