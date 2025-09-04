// Временные заглушки для MCP декораторов
export const Tool = (config: any) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {};
export const Prompt = (config: any) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {};
export const Resource = (config: any) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {};
export const ResourceTemplate =
  (config: any) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {};
export type Context = any;
