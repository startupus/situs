-- Migration: Add Multi-Tenant Support with PostgreSQL RLS
-- Date: 2025-01-03
-- Description: Add tenant_id to all tables and enable Row-Level Security

-- Add tenant_id column to all main tables
ALTER TABLE users ADD COLUMN tenant_id TEXT;
ALTER TABLE projects ADD COLUMN tenant_id TEXT;
ALTER TABLE products ADD COLUMN tenant_id TEXT;
ALTER TABLE pages ADD COLUMN tenant_id TEXT;
ALTER TABLE categories ADD COLUMN tenant_id TEXT;
ALTER TABLE web_categories ADD COLUMN tenant_id TEXT;
ALTER TABLE items ADD COLUMN tenant_id TEXT;
ALTER TABLE menu_types ADD COLUMN tenant_id TEXT;
ALTER TABLE menu_items ADD COLUMN tenant_id TEXT;
ALTER TABLE media ADD COLUMN tenant_id TEXT;
ALTER TABLE accounts ADD COLUMN tenant_id TEXT;
ALTER TABLE integrations ADD COLUMN tenant_id TEXT;

-- Create indexes for tenant_id for performance
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_projects_tenant_id ON projects(tenant_id);
CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_pages_tenant_id ON pages(tenant_id);
CREATE INDEX idx_categories_tenant_id ON categories(tenant_id);
CREATE INDEX idx_web_categories_tenant_id ON web_categories(tenant_id);
CREATE INDEX idx_items_tenant_id ON items(tenant_id);
CREATE INDEX idx_menu_types_tenant_id ON menu_types(tenant_id);
CREATE INDEX idx_menu_items_tenant_id ON menu_items(tenant_id);
CREATE INDEX idx_media_tenant_id ON media(tenant_id);
CREATE INDEX idx_accounts_tenant_id ON accounts(tenant_id);
CREATE INDEX idx_integrations_tenant_id ON integrations(tenant_id);

-- Enable Row-Level Security on all tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY tenant_isolation_users ON users
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create RLS policies for projects table
CREATE POLICY tenant_isolation_projects ON projects
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create RLS policies for products table
CREATE POLICY tenant_isolation_products ON products
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create RLS policies for pages table
CREATE POLICY tenant_isolation_pages ON pages
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create RLS policies for categories table
CREATE POLICY tenant_isolation_categories ON categories
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create RLS policies for web_categories table
CREATE POLICY tenant_isolation_web_categories ON web_categories
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create RLS policies for items table
CREATE POLICY tenant_isolation_items ON items
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create RLS policies for menu_types table
CREATE POLICY tenant_isolation_menu_types ON menu_types
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create RLS policies for menu_items table
CREATE POLICY tenant_isolation_menu_items ON menu_items
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create RLS policies for media table
CREATE POLICY tenant_isolation_media ON media
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create RLS policies for accounts table
CREATE POLICY tenant_isolation_accounts ON accounts
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create RLS policies for integrations table
CREATE POLICY tenant_isolation_integrations ON integrations
    FOR ALL
    TO PUBLIC
    USING (tenant_id = current_setting('app.current_tenant_id', true));

-- Create function to set tenant context
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', tenant_id, true);
END;
$$ LANGUAGE plpgsql;

-- Create function to get current tenant
CREATE OR REPLACE FUNCTION get_current_tenant()
RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('app.current_tenant_id', true);
END;
$$ LANGUAGE plpgsql;

-- Create function to validate tenant access
CREATE OR REPLACE FUNCTION validate_tenant_access(user_id TEXT, tenant_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_tenant_id TEXT;
BEGIN
    SELECT u.tenant_id INTO user_tenant_id
    FROM users u
    WHERE u.id = user_id;
    
    RETURN user_tenant_id = tenant_id;
END;
$$ LANGUAGE plpgsql;
