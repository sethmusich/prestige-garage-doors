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

test('home sections in Speck order', () => {
  const page = loadPage('/');
  const heads = page.querySelectorAll('main h1, main h2').map((h) => h.textContent.trim().toLowerCase());
  const want = ['trusted garage door service', 'call now', 'who we are', 'our services', 'why choose us', 'rated 4.9', 'frequently asked', 'service areas'];
  let at = -1;
  for (const w of want) {
    const idx = heads.findIndex((h, i) => i > at && h.includes(w));
    assert.ok(idx > at, `"${w}" missing or out of order in: ${heads.join(' | ')}`);
    at = idx;
  }
});

test('home links each service', () => {
  const hrefs = loadPage('/').querySelectorAll('a').map((a) => a.getAttribute('href'));
  for (const s of ['tune-ups', 'repair', 'free-estimates']) {
    assert.ok(hrefs.includes(`/prestige-garage-doors/services/${s}/`), `missing link to ${s}`);
  }
});

test('home lists approved claims', () => {
  const text = visibleText(loadPage('/'));
  for (const claim of ['Licensed & Insured', 'Same-Day', 'Free Estimates']) {
    assert.ok(text.includes(claim), `missing claim: ${claim}`);
  }
});

const BOOKING_URL =
  'https://book.housecallpro.com/book/Prestige-Garage-Doors/6a27e72806254cf3ae84c4cd25c6b0b9?v2=true';

test('each service page has its copy', () => {
  const cases = { 'tune-ups': '40-point inspection', repair: 'fully stocked trucks', 'free-estimates': 'multiple options for doors' };
  for (const [slug, phrase] of Object.entries(cases)) {
    const page = loadPage(`/services/${slug}/`);
    assert.ok(visibleText(page).includes(phrase), `${slug} missing "${phrase}"`);
    assert.ok(page.querySelector('a[href="tel:+17202953221"]'), `${slug} missing tel link`);
    assert.ok(page.querySelectorAll('a').some((a) => a.getAttribute('href') === BOOKING_URL), `${slug} missing booking link`);
  }
});

test('service areas lists Castle Rock and Longmont', () => {
  const page = loadPage('/service-areas/');
  const text = visibleText(page);
  assert.ok(text.includes('Castle Rock') && text.includes('Longmont'));
  assert.ok(page.querySelector('iframe'), 'map iframe missing');
});

test('about names the owner', () => {
  assert.ok(visibleText(loadPage('/about/')).includes('Kevin Reynoso'));
});

test('gallery renders photos', () => {
  assert.ok(loadPage('/gallery/').querySelectorAll('main img').length >= 6);
});

test('faq page has every question', async () => {
  const page = loadPage('/faq/');
  assert.ok(page.querySelectorAll('main details').length >= 8);
});

test('contact form posts without JS', () => {
  const page = loadPage('/contact/');
  const form = page.querySelector('main form');
  assert.ok(form, 'form missing');
  assert.equal(form.getAttribute('method'), 'POST');
  assert.equal(form.getAttribute('action'), 'https://api.web3forms.com/submit');
  for (const name of ['first_name', 'last_name', 'phone', 'email', 'city', 'message']) {
    const el = form.querySelector(`[name="${name}"]`);
    assert.ok(el, `${name} missing`);
    assert.ok(el.hasAttribute('required'), `${name} not required`);
  }
  const opts = form.querySelectorAll('select[name="service"] option').map((o) => o.textContent.trim());
  assert.deepEqual(opts, ['Tune-Up', 'Repair', 'Free Estimate on New Door', 'Other']);
  assert.ok(form.querySelector('input[type="hidden"][name="access_key"]'), 'access key missing');
  assert.equal(
    form.querySelector('input[name="redirect"]').getAttribute('value'),
    'https://sethmusich.github.io/prestige-garage-doors/thanks/',
  );
  assert.ok(form.querySelector('[name="botcheck"]'), 'honeypot missing');
});

test('book page links Housecall Pro', () => {
  const page = loadPage('/book/');
  assert.ok(page.querySelectorAll('a').some((a) => a.getAttribute('href') === BOOKING_URL), 'booking link missing');
  assert.ok(page.querySelector('a[href="tel:+17202953221"]'), 'tel link missing');
});

test('thanks page', () => {
  const page = loadPage('/thanks/');
  assert.ok(visibleText(page).includes("We'll be in touch shortly"));
  assert.equal(page.querySelector('meta[name="robots"]').getAttribute('content'), 'noindex');
});

test('reviews render from data', () => {
  assert.ok(loadPage('/reviews/').querySelectorAll('main figure.review').length >= 12, 'reviews page needs all reviews');
  assert.equal(loadPage('/').querySelectorAll('main figure.review').length, 6, 'home shows 6 reviews');
  assert.ok(visibleText(loadPage('/reviews/')).includes('Jake H.'));
});
