/** Prefix a root-relative path with the site's base path. External URLs pass through. */
export function url(path: string): string {
  if (/^([a-z]+:|#)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`.replace(/\/{2,}/g, '/') || '/';
}
