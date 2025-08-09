import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { ProjectTools } from './tools/project.tools';
import { ContentResources } from './resources/content.resources';
import { EditorPrompts } from './prompts/editor.prompts';

@Module({
  imports: [
    McpModule.forRoot({
      name: 'situs-mcp-http-server',
      version: '1.0.0',
      // HTTP+SSE транспорт для веб-интеграции
      transport: {
        type: 'http-sse',
        port: 3001,
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
export class SitusMcpHttpModule {}
