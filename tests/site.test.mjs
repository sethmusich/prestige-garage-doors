import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPage, allPages, internalRefs, resolves, visibleText } from './helpers.mjs';

const BOOKING =
  'https://book.housecallpro.com/book/Prestige-Garage-Doors/6a27e72806254cf3ae84c4cd25c6b0b9?v2=true';

test('home has tap-to-call', () => {
  const page = loadPage('/');
  const links = page.querySelectorAll('a[href="tel:+17202953221"]');
  assert.ok(links.some((a) => a.textContent.includes('(720) 295-3221')));
});

test('home has Housecall Pro booking link', () => {
  const page = loadPage('/');
  const a = page.querySelectorAll('a').find((x) => x.getAttribute('href') === BOOKING);
  assert.ok(a, 'booking link missing');
  assert.equal(a.getAttribute('target'), '_blank');
});

test('header shows Google rating', () => {
  const header = loadPage('/').querySelector('header');
  assert.match(header.textContent, /4\.9/);
  assert.match(header.textContent, /53/);
});

test('internal links resolve', () => {
  const broken = [];
  for (const route of allPages()) {
    for (const ref of internalRefs(loadPage(route))) {
      if (!resolves(ref)) broken.push(`${route} -> ${ref}`);
    }
  }
  assert.deepEqual(broken, []);
});

test('no visible placeholders', () => {
  const problems = [];
  for (const route of allPages()) {
    const page = loadPage(route);
    const text = visibleText(page);
    for (const bad of [/\bTODO\b/, /lorem/i, /\bundefined\b/, /\bnull\b/, /\bNaN\b/]) {
      if (bad.test(text)) problems.push(`${route}: ${bad}`);
    }
    for (const a of page.querySelectorAll('a')) {
      const h = a.getAttribute('href');
      if (h === '' || h === 'null' || h === 'undefined' || h === null) problems.push(`${route}: bad href "${h}"`);
    }
  }
  assert.deepEqual(problems, []);
});

test('logo and favicon present', () => {
  const page = loadPage('/');
  const imgs = page.querySelector('header').querySelectorAll('img');
  assert.ok(imgs.some((i) => i.getAttribute('alt') === 'Prestige Garage Doors'), 'header logo img missing');
  assert.ok(page.querySelector('link[rel="icon"]'), 'favicon link missing');
  assert.ok(page.querySelector('meta[property="og:image"]'), 'og:image missing');
});
