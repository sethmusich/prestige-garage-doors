import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';

export const DIST = new URL('../dist/', import.meta.url).pathname;
export const BASE = '/prestige-garage-doors';

/** Parsed HTML for a route like '/' or '/services/repair/'. */
export function loadPage(route) {
  const file = join(DIST, route, route.endsWith('.html') ? '' : 'index.html');
  return parse(readFileSync(file, 'utf8'), { comment: false });
}

/** Every route in dist that has an index.html (plus 404.html). */
export function allPages(dir = DIST, prefix = '/') {
  const routes = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name.startsWith('_')) continue;
      routes.push(...allPages(full, `${prefix}${name}/`));
    } else if (name === 'index.html') {
      routes.push(prefix);
    } else if (name === '404.html' && prefix === '/') {
      routes.push('/404.html');
    }
  }
  return routes;
}

/** All root-relative href/src/srcset values in a parsed page. */
export function internalRefs(root) {
  const refs = [];
  for (const el of root.querySelectorAll('[href],[src],[srcset]')) {
    for (const attr of ['href', 'src']) {
      const v = el.getAttribute(attr);
      if (v && v.startsWith('/') && !v.startsWith('//')) refs.push(v);
    }
    const srcset = el.getAttribute('srcset');
    if (srcset) {
      for (const part of srcset.split(',')) {
        const v = part.trim().split(/\s+/)[0];
        if (v.startsWith('/') && !v.startsWith('//')) refs.push(v);
      }
    }
  }
  return refs;
}

/** True if a root-relative ref maps to a file in dist. */
export function resolves(ref) {
  if (!ref.startsWith(`${BASE}/`)) return false;
  let p = decodeURIComponent(ref.slice(BASE.length).split('#')[0].split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  return existsSync(join(DIST, p));
}

/** Visible body text, scripts/styles removed. */
export function visibleText(root) {
  const body = root.querySelector('body').clone();
  for (const el of body.querySelectorAll('script,style,noscript,template')) el.remove();
  return body.textContent.replace(/\s+/g, ' ');
}
