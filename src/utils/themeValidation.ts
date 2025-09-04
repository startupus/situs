const HEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export function validateThemeColors(obj: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const check = (variant: any, label: string) => {
    if (!variant) { errors.push(`Отсутствует ${label}`); return; }
    const keys = ['primary','primaryHover','primaryActive','secondary','accent','success','warning','error','info','background','surface','text','textSecondary','border','borderLight'];
    for (const k of keys) {
      const val = variant[k];
      if (typeof val !== 'string' || !HEX.test(val)) errors.push(`${label}.${k} некорректный цвет`);
    }
  };
  try {
    check(obj?.colors?.light, 'colors.light');
    check(obj?.colors?.dark, 'colors.dark');
  } catch {}
  return { valid: errors.length === 0, errors };
}

export function sanitizeCustomCss(css: string): string {
  let out = String(css || '');
  out = out.replace(/@import[^;]+;?/gi, '');
  out = out.replace(/url\(([^)]+)\)/gi, (_m, p1) => {
    const val = String(p1 || '').replace(/["']/g, '').trim();
    if (/^javascript:/i.test(val)) return 'url(about:blank)';
    return `url(${p1})`;
  });
  if (out.length > 8000) out = out.slice(0, 8000);
  return out;
}

