#!/usr/bin/env node

/**
 * Internal Link Checker
 * Checks all internal links on the site for broken links
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const ROUTES = [
  '/index.html',
  '/borzdetailing_owner_draft_today.html',
];

const results = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  links: [],
  summary: {
    total: 0,
    working: 0,
    broken: 0,
    external: 0,
    skipped: 0,
  },
};

function isInternalLink(href, baseUrl) {
  if (!href) return false;
  
  try {
    const url = new URL(href, baseUrl);
    const base = new URL(baseUrl);
    return url.origin === base.origin;
  } catch {
    // Relative URL or anchor
    return href.startsWith('/') || href.startsWith('#') || !href.includes('://');
  }
}

function normalizeUrl(href, baseUrl, currentPath) {
  if (!href) return null;
  
  try {
    // Absolute URL
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return new URL(href).href;
    }
    
    // Anchor link
    if (href.startsWith('#')) {
      return `${baseUrl}${currentPath}${href}`;
    }
    
    // Relative URL
    if (href.startsWith('/')) {
      return new URL(href, baseUrl).href;
    }
    
    // Relative path
    const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') || 0) || '/';
    return new URL(href, `${baseUrl}${currentDir}/`).href;
  } catch {
    return null;
  }
}

async function checkLink(page, href, baseUrl, currentPath) {
  const normalizedUrl = normalizeUrl(href, baseUrl, currentPath);
  if (!normalizedUrl) {
    return {
      href,
      normalizedUrl: null,
      status: 'skipped',
      error: 'Invalid URL format',
    };
  }

  const linkResult = {
    href,
    normalizedUrl,
    status: 'unknown',
    statusCode: null,
    error: null,
  };

  // Skip external links
  if (!isInternalLink(href, baseUrl)) {
    linkResult.status = 'external';
    return linkResult;
  }

  // Skip anchor links (fragment only)
  if (href.startsWith('#')) {
    linkResult.status = 'skipped';
    linkResult.note = 'Anchor link';
    return linkResult;
  }

  try {
    const response = await page.goto(normalizedUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    }).catch((error) => {
      linkResult.status = 'broken';
      linkResult.error = error.message;
      return null;
    });

    if (response) {
      linkResult.statusCode = response.status();
      if (response.status() >= 200 && response.status() < 400) {
        linkResult.status = 'working';
      } else {
        linkResult.status = 'broken';
        linkResult.error = `HTTP ${response.status()}`;
      }
    }
  } catch (error) {
    linkResult.status = 'broken';
    linkResult.error = error.message;
  }

  return linkResult;
}

async function checkRoute(browser, route) {
  const url = `${BASE_URL}${route}`;
  const page = await browser.newPage();
  const routeLinks = [];

  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Get all links on the page
    const links = await page.$$eval('a[href]', (els) =>
      els.map((el) => ({
        href: el.getAttribute('href'),
        text: el.textContent.trim().substring(0, 50),
      }))
    );

    console.log(`  Found ${links.length} links on ${route}`);

    // Check each link
    for (const link of links) {
      const result = await checkLink(page, link.href, BASE_URL, route);
      result.route = route;
      result.linkText = link.text;
      routeLinks.push(result);
      results.summary.total++;

      switch (result.status) {
        case 'working':
          results.summary.working++;
          break;
        case 'broken':
          results.summary.broken++;
          console.log(`    ❌ Broken: ${link.href} - ${result.error}`);
          break;
        case 'external':
          results.summary.external++;
          break;
        case 'skipped':
          results.summary.skipped++;
          break;
      }
    }
  } catch (error) {
    console.error(`Error checking route ${route}:`, error.message);
  } finally {
    await page.close();
  }

  return routeLinks;
}

async function main() {
  console.log('🔗 Starting internal link checker...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Routes to check: ${ROUTES.length}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const route of ROUTES) {
      console.log(`Checking links on ${route}...`);
      const links = await checkRoute(browser, route);
      results.links.push(...links);
    }
  } finally {
    await browser.close();
  }

  // Save results
  const resultsPath = path.join(__dirname, '..', 'link-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  // Print summary
  console.log('\n📊 Summary:');
  console.log(`  Total links: ${results.summary.total}`);
  console.log(`  ✅ Working: ${results.summary.working}`);
  console.log(`  ❌ Broken: ${results.summary.broken}`);
  console.log(`  🌐 External: ${results.summary.external}`);
  console.log(`  ⏭️  Skipped: ${results.summary.skipped}`);

  // List broken links
  const brokenLinks = results.links.filter((l) => l.status === 'broken');
  if (brokenLinks.length > 0) {
    console.log('\n❌ Broken Links:');
    brokenLinks.forEach((link) => {
      console.log(`  - ${link.href} (${link.route})`);
      if (link.error) console.log(`    Error: ${link.error}`);
    });
  }

  // Exit with error code if any broken links
  if (results.summary.broken > 0) {
    console.log('\n❌ Link check failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All links are working!');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

