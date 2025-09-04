import { Module } from '@nestjs/common';
// import { any as any } from '@rekog/mcp-nest';
import { ProjectTools } from './tools/project.tools';
import { ContentResources } from './resources/content.resources';
import { EditorPrompts } from './prompts/editor.prompts';

@Module({
  imports: [
    // MCP модуль временно отключен
  ],
  providers: [ProjectTools, ContentResources, EditorPrompts],
  exports: [],
})
export class SitusMcpModule {}
