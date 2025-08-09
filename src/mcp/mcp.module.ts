import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { ProjectTools } from './tools/project.tools';
import { ContentResources } from './resources/content.resources';
import { EditorPrompts } from './prompts/editor.prompts';

@Module({
  imports: [
    McpModule.forRoot({
      name: 'situs-mcp-server',
      version: '1.0.0',
      // STDIO транспорт для Cursor интеграции
      transport: {
        type: 'stdio',
      },
    }),
  ],
  providers: [
    ProjectTools,
    ContentResources,
    EditorPrompts,
  ],
  exports: [McpModule],
})
export class SitusMcpModule {}
