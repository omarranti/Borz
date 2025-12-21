#!/usr/bin/env node

/**
 * SEO Validation Script
 * Checks that all public routes have:
 * - Title tag
 * - Meta description
 * - Canonical URL
 * - Returns 200 status
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const ROUTES = [
  '/index.html',
  '/borzdetailing_owner_draft_today.html',
];

const results = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  routes: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    errors: [],
  },
};

async function validateRoute(browser, route) {
  const url = `${BASE_URL}${route}`;
  const page = await browser.newPage();
  const routeResult = {
    route,
    url,
    status: null,
    checks: {
      hasTitle: false,
      hasDescription: false,
      hasCanonical: false,
      returns200: false,
    },
    errors: [],
    warnings: [],
  };

  try {
    // Navigate to page
    const response = await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    routeResult.status = response.status();
    routeResult.returns200 = response.status() === 200;

    if (!routeResult.returns200) {
      routeResult.errors.push(`Expected 200, got ${response.status()}`);
    }

    // Get page content
    const html = await page.content();

    // Check for title tag
    const title = await page.$eval('title', (el) => el.textContent).catch(() => null);
    if (title && title.trim().length > 0) {
      routeResult.checks.hasTitle = true;
      if (title.length < 30) {
        routeResult.warnings.push(`Title is too short (${title.length} chars). Recommended: 50-60 chars.`);
      }
      if (title.length > 70) {
        routeResult.warnings.push(`Title is too long (${title.length} chars). Recommended: 50-60 chars.`);
      }
    } else {
      routeResult.errors.push('Missing or empty <title> tag');
    }

    // Check for meta description
    const description = await page.$eval('meta[name="description"]', (el) => el.content).catch(() => null);
    if (description && description.trim().length > 0) {
      routeResult.checks.hasDescription = true;
      if (description.length < 120) {
        routeResult.warnings.push(`Description is too short (${description.length} chars). Recommended: 150-160 chars.`);
      }
      if (description.length > 160) {
        routeResult.warnings.push(`Description is too long (${description.length} chars). Recommended: 150-160 chars.`);
      }
    } else {
      routeResult.errors.push('Missing or empty meta description');
    }

    // Check for canonical URL
    const canonical = await page.$eval('link[rel="canonical"]', (el) => el.href).catch(() => null);
    if (canonical && canonical.trim().length > 0) {
      routeResult.checks.hasCanonical = true;
      if (!canonical.startsWith('http')) {
        routeResult.warnings.push(`Canonical URL should be absolute: ${canonical}`);
      }
    } else {
      routeResult.errors.push('Missing canonical URL');
    }

    // Check for H1 tag (should be exactly one)
    const h1Count = await page.$$eval('h1', (els) => els.length).catch(() => 0);
    if (h1Count === 0) {
      routeResult.errors.push('Missing H1 tag');
    } else if (h1Count > 1) {
      routeResult.errors.push(`Multiple H1 tags found (${h1Count}). Should be exactly one.`);
    }

    // Check for Open Graph tags
    const ogTitle = await page.$eval('meta[property="og:title"]', (el) => el.content).catch(() => null);
    if (!ogTitle) {
      routeResult.warnings.push('Missing Open Graph title');
    }

    const ogDescription = await page.$eval('meta[property="og:description"]', (el) => el.content).catch(() => null);
    if (!ogDescription) {
      routeResult.warnings.push('Missing Open Graph description');
    }

    // Check for structured data
    const schemas = await page.$$eval('script[type="application/ld+json"]', (els) => els.length).catch(() => 0);
    if (schemas === 0) {
      routeResult.warnings.push('No structured data (Schema.org) found');
    } else {
      // Check for deprecated schema types
      const schemaTypes = await page.$$eval('script[type="application/ld+json"]', (els) => {
        return els.map(el => {
          try {
            const json = JSON.parse(el.textContent);
            return json['@type'] || 'Unknown';
          } catch {
            return 'Invalid';
          }
        });
      }).catch(() => []);
      
      const DEPRECATED_TYPES = ['PracticeProblem', 'Dataset'];
      const foundDeprecated = schemaTypes.filter(type => DEPRECATED_TYPES.includes(type));
      
      if (foundDeprecated.length > 0) {
        routeResult.errors.push(
          `Deprecated schema types found: ${foundDeprecated.join(', ')}. ` +
          'These will lose Google Search Console rich-result reporting support starting January 2026.'
        );
      }
    }

  } catch (error) {
    routeResult.errors.push(`Error validating route: ${error.message}`);
  } finally {
    await page.close();
  }

  // Determine if route passed
  const allChecksPass = 
    routeResult.checks.hasTitle &&
    routeResult.checks.hasDescription &&
    routeResult.checks.hasCanonical &&
    routeResult.returns200 &&
    routeResult.errors.length === 0;

  routeResult.passed = allChecksPass;

  return routeResult;
}

async function main() {
  console.log('🔍 Starting SEO validation...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Routes to check: ${ROUTES.length}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const route of ROUTES) {
      console.log(`Checking ${route}...`);
      const result = await validateRoute(browser, route);
      results.routes.push(result);
      results.summary.total++;

      if (result.passed) {
        results.summary.passed++;
        console.log(`  ✅ Passed\n`);
      } else {
        results.summary.failed++;
        console.log(`  ❌ Failed`);
        if (result.errors.length > 0) {
          result.errors.forEach((error) => console.log(`    - ${error}`));
        }
        if (result.warnings.length > 0) {
          result.warnings.forEach((warning) => console.log(`    ⚠️  ${warning}`));
        }
        console.log();
        results.summary.errors.push(...result.errors.map((e) => `${route}: ${e}`));
      }
    }
  } finally {
    await browser.close();
  }

  // Save results
  const resultsPath = path.join(__dirname, '..', 'seo-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  // Print summary
  console.log('\n📊 Summary:');
  console.log(`  Total routes: ${results.summary.total}`);
  console.log(`  ✅ Passed: ${results.summary.passed}`);
  console.log(`  ❌ Failed: ${results.summary.failed}`);

  // Exit with error code if any failed
  if (results.summary.failed > 0) {
    console.log('\n❌ SEO validation failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All SEO checks passed!');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

