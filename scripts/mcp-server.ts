#!/usr/bin/env tsx

import { GatewayMcpServer } from '../src/mcp/server/McpServer';

async function main(): Promise<void> {
  console.log('🚀 Starting Startupus Gateway MCP Server...');
  
  const mcpServer = new GatewayMcpServer();
  
  // Обработка graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n📡 Shutting down MCP server...');
    try {
      await mcpServer.stop();
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  process.on('SIGTERM', async () => {
    console.log('\n📡 Shutting down MCP server...');
    try {
      await mcpServer.stop();
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  try {
    await mcpServer.start();
    console.log('✅ Gateway MCP Server is running');
    console.log('💡 Connect your MCP client to interact with Startupus Platform Gateway');
  } catch (error) {
    console.error('❌ Failed to start MCP server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 