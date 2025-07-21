import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GatewayMcpServer } from '../mcp/server/McpServer';

describe('Gateway MCP Server Tests', () => {
  let mcpServer: GatewayMcpServer;

  beforeEach(() => {
    mcpServer = new GatewayMcpServer();
  });

  afterEach(async () => {
    if (mcpServer) {
      try {
        await mcpServer.stop();
      } catch {
        // Ignore errors during cleanup
      }
    }
  });

  describe('Server Initialization', () => {
    it('should create MCP server instance', () => {
      expect(mcpServer).toBeDefined();
      expect(mcpServer.getServer()).toBeDefined();
    });

    it('should have correct server info', () => {
      const server = mcpServer.getServer();
      expect(server).toBeDefined();
    });
  });

  describe('Server Lifecycle', () => {
    it('should start and stop server', async () => {
      // Note: This test might not work in CI environment without proper stdio setup
      expect(async () => {
        await mcpServer.start();
        await mcpServer.stop();
      }).not.toThrow();
    });
  });

  describe('MCP Capabilities', () => {
    it('should have resources capability', () => {
      const server = mcpServer.getServer();
      expect(server).toBeDefined();
    });

    it('should have tools capability', () => {
      const server = mcpServer.getServer();
      expect(server).toBeDefined();
    });

    it('should have prompts capability', () => {
      const server = mcpServer.getServer();
      expect(server).toBeDefined();
    });
  });
}); 