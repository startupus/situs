import { registerAs } from '@nestjs/config';

function parseOrigins(input: string | undefined): string[] {
  if (!input) return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export const corsConfig = registerAs('cors', () => ({
  origins: parseOrigins(process.env.CORS_ORIGINS),
}));
