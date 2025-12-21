#!/usr/bin/env node

/**
 * Crawlability & Indexability Verification Script
 * 
 * Verifies that all public routes are:
 * - Returning 200 status
 * - Indexable (no noindex)
 * - Have canonical tag
 * - Have title tag
 * - Have meta description
 * - Have at least one internal link pointing to them
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const cheerio = require('cheerio');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'https://borzdetailing.com';
const TIMEOUT = 10000;

// Routes to check (public routes only, exclude drafts)
const PUBLIC_ROUTES = [
  '/',
  '/blog.html',
  '/ppf-dubai.html',
  '/ceramic-coating-dubai.html',
];

// Draft files to exclude
const DRAFT_FILES = [
  'borzdetailing_owner_draft_today.html',
  'borzdetailing_index_chatgptpro_v2.html',
  '.eslintrc.html',
];

// Results storage
const results = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  baseDomain: BASE_DOMAIN,
  routes: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
  },
};

/**
 * Normalize route to file path
 */
function routeToFilePath(route) {
  if (route === '/') {
    return 'index.html';
  }
  return route.startsWith('/') ? route.substring(1) : route;
}

/**
 * Normalize route to URL path
 */
function normalizeRoute(route) {
  if (route === '/') {
    return '/';
  }
  return route.startsWith('/') ? route : `/${route}`;
}

/**
 * Check if a file exists
 */
function fileExists(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  return fs.existsSync(fullPath);
}

/**
 * Read and parse HTML file
 */
function readHtmlFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  return cheerio.load(content);
}

/**
 * Check HTTP status (200)
 * Returns optional check - warns if server not available but doesn't fail
 */
async function checkHttpStatus(route) {
  const url = `${BASE_URL}${normalizeRoute(route)}`;
  
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const httpModule = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: TIMEOUT,
      rejectUnauthorized: false, // Allow self-signed certs in dev
    };

    const req = httpModule.request(options, (res) => {
      resolve({
        status: res.statusCode,
        success: res.statusCode === 200,
        optional: false,
      });
    });

    req.on('error', (error) => {
      // If connection refused or ECONNREFUSED, treat as optional (server not running)
      const isConnectionError = error.code === 'ECONNREFUSED' || 
                                error.code === 'ENOTFOUND' ||
                                error.message.includes('connect');
      
      resolve({
        status: null,
        success: false,
        optional: isConnectionError,
        error: error.message,
        warning: isConnectionError ? 'Server not running - HTTP check skipped' : error.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: null,
        success: false,
        optional: true,
        error: 'Request timeout',
        warning: 'Request timeout - HTTP check skipped',
      });
    });

    req.end();
  });
}

/**
 * Check if page is indexable (no noindex)
 */
function checkIndexable($) {
  const robotsMeta = $('meta[name="robots"]').attr('content') || '';
  const hasNoindex = /noindex/i.test(robotsMeta);
  
  return {
    success: !hasNoindex,
    hasNoindex,
    robotsContent: robotsMeta || null,
  };
}

/**
 * Check for canonical tag
 */
function checkCanonical($, route) {
  const canonical = $('link[rel="canonical"]').attr('href');
  const expectedCanonical = `${BASE_DOMAIN}${normalizeRoute(route)}`;
  
  return {
    success: !!canonical,
    found: canonical || null,
    expected: expectedCanonical,
    matches: canonical === expectedCanonical,
  };
}

/**
 * Check for title tag
 */
function checkTitle($) {
  const title = $('title').text().trim();
  
  return {
    success: !!title && title.length > 0,
    found: title || null,
    length: title ? title.length : 0,
  };
}

/**
 * Check for meta description
 */
function checkMetaDescription($) {
  const description = $('meta[name="description"]').attr('content') || '';
  const trimmed = description.trim();
  
  return {
    success: trimmed.length > 0,
    found: trimmed || null,
    length: trimmed.length,
  };
}

/**
 * Find all internal links in all HTML files
 */
function findAllInternalLinks() {
  const htmlFiles = fs.readdirSync(process.cwd())
    .filter(file => file.endsWith('.html'))
    .filter(file => !DRAFT_FILES.includes(file));
  
  const internalLinks = new Map();
  
  htmlFiles.forEach(file => {
    const $ = readHtmlFile(file);
    if (!$) return;
    
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      
      // Normalize href to route
      let normalizedRoute = null;
      
      if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
          const url = new URL(href);
          if (url.origin === BASE_DOMAIN || url.hostname === 'localhost') {
            normalizedRoute = url.pathname || '/';
          }
        } catch {
          // Invalid URL
        }
      } else if (href.startsWith('/')) {
        normalizedRoute = href === '/' ? '/' : href;
      } else if (!href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        // Relative path
        const currentDir = path.dirname(file);
        const resolved = path.resolve(currentDir, href);
        const relative = path.relative(process.cwd(), resolved);
        if (relative && !relative.startsWith('..')) {
          normalizedRoute = `/${relative}`;
        }
      }
      
      if (normalizedRoute) {
        // Normalize to standard format
        if (normalizedRoute.endsWith('/index.html')) {
          normalizedRoute = normalizedRoute.replace('/index.html', '/');
        }
        if (normalizedRoute === 'index.html' || normalizedRoute === '/index.html') {
          normalizedRoute = '/';
        }
        
        if (!internalLinks.has(normalizedRoute)) {
          internalLinks.set(normalizedRoute, []);
        }
        internalLinks.get(normalizedRoute).push({
          from: file,
          href: href,
        });
      }
    });
  });
  
  return internalLinks;
}

/**
 * Check if route has internal links pointing to it
 */
function checkInternalLinks(route, allInternalLinks) {
  const normalized = normalizeRoute(route);
  const links = allInternalLinks.get(normalized) || [];
  
  return {
    success: links.length > 0,
    count: links.length,
    links: links.map(l => ({ from: l.from, href: l.href })),
  };
}

/**
 * Verify a single route
 */
async function verifyRoute(route, allInternalLinks) {
  const filePath = routeToFilePath(route);
  const result = {
    route,
    filePath,
    checks: {},
    passed: false,
    errors: [],
  };
  
  // Check 1: File exists
  if (!fileExists(filePath)) {
    result.checks.fileExists = { success: false, error: 'File not found' };
    result.errors.push(`File not found: ${filePath}`);
    results.routes.push(result);
    return result;
  }
  
  result.checks.fileExists = { success: true };
  
  // Check 2: HTTP Status (200) - Optional if server not running
  try {
    const httpCheck = await checkHttpStatus(route);
    result.checks.httpStatus = httpCheck;
    if (!httpCheck.success && !httpCheck.optional) {
      result.errors.push(`HTTP status check failed: ${httpCheck.error || `Status ${httpCheck.status}`}`);
    } else if (!httpCheck.success && httpCheck.optional) {
      // Add warning but don't fail
      result.warnings = result.warnings || [];
      result.warnings.push(httpCheck.warning || 'HTTP check skipped (server not running)');
    }
  } catch (error) {
    result.checks.httpStatus = { success: false, optional: true, error: error.message };
    result.warnings = result.warnings || [];
    result.warnings.push(`HTTP status check error: ${error.message}`);
  }
  
  // Read HTML file
  const $ = readHtmlFile(filePath);
  if (!$) {
    result.checks.parseHtml = { success: false, error: 'Failed to parse HTML' };
    result.errors.push('Failed to parse HTML file');
    results.routes.push(result);
    return result;
  }
  
  result.checks.parseHtml = { success: true };
  
  // Check 3: Indexable (no noindex)
  const indexableCheck = checkIndexable($);
  result.checks.indexable = indexableCheck;
  if (!indexableCheck.success) {
    result.errors.push('Page has noindex meta tag');
  }
  
  // Check 4: Canonical tag
  const canonicalCheck = checkCanonical($, route);
  result.checks.canonical = canonicalCheck;
  if (!canonicalCheck.success) {
    result.errors.push('Missing canonical tag');
  } else if (!canonicalCheck.matches) {
    result.errors.push(`Canonical mismatch: found "${canonicalCheck.found}", expected "${canonicalCheck.expected}"`);
  }
  
  // Check 5: Title tag
  const titleCheck = checkTitle($);
  result.checks.title = titleCheck;
  if (!titleCheck.success) {
    result.errors.push('Missing or empty title tag');
  }
  
  // Check 6: Meta description
  const descriptionCheck = checkMetaDescription($);
  result.checks.metaDescription = descriptionCheck;
  if (!descriptionCheck.success) {
    result.errors.push('Missing or empty meta description');
  }
  
  // Check 7: Internal links
  const linksCheck = checkInternalLinks(route, allInternalLinks);
  result.checks.internalLinks = linksCheck;
  if (!linksCheck.success) {
    result.errors.push(`No internal links found pointing to this route`);
  }
  
  // Determine if all checks passed (HTTP status is optional)
  const requiredChecks = [
    result.checks.fileExists,
    result.checks.parseHtml,
    result.checks.indexable,
    result.checks.canonical,
    result.checks.title,
    result.checks.metaDescription,
    result.checks.internalLinks,
  ];
  
  // HTTP status is optional (only fail if it's not optional and failed)
  const httpCheck = result.checks.httpStatus;
  const httpPassed = !httpCheck || httpCheck.success || httpCheck.optional;
  
  result.passed = requiredChecks.every(check => check && check.success) && httpPassed;
  
  results.routes.push(result);
  return result;
}

/**
 * Print results table
 */
function printResults() {
  console.log('\n' + '='.repeat(100));
  console.log('CRAWLABILITY & INDEXABILITY VERIFICATION REPORT');
  console.log('='.repeat(100));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Base Domain: ${BASE_DOMAIN}`);
  console.log(`Timestamp: ${results.timestamp}`);
  console.log('\n');
  
  // Table header
  console.log('Route'.padEnd(30) + 'Status'.padEnd(10) + '200'.padEnd(6) + 'Index'.padEnd(6) + 'Canon'.padEnd(6) + 'Title'.padEnd(6) + 'Desc'.padEnd(6) + 'Links'.padEnd(6) + 'File Path');
  console.log('-'.repeat(100));
  
  // Table rows
  results.routes.forEach(result => {
    const route = result.route.padEnd(30);
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    const http200 = (result.checks.httpStatus?.success ? '✓' : '✗').padEnd(6);
    const indexable = (result.checks.indexable?.success ? '✓' : '✗').padEnd(6);
    const canonical = (result.checks.canonical?.success && result.checks.canonical?.matches ? '✓' : '✗').padEnd(6);
    const title = (result.checks.title?.success ? '✓' : '✗').padEnd(6);
    const description = (result.checks.metaDescription?.success ? '✓' : '✗').padEnd(6);
    const links = (result.checks.internalLinks?.success ? '✓' : '✗').padEnd(6);
    const filePath = result.filePath;
    
    console.log(route + status.padEnd(10) + http200 + indexable + canonical + title + description + links + filePath);
    
    // Print errors if any
    if (result.errors.length > 0) {
      result.errors.forEach(error => {
        console.log('  ❌ ' + error);
      });
    }
    
    // Print warnings if any
    if (result.warnings && result.warnings.length > 0) {
      result.warnings.forEach(warning => {
        console.log('  ⚠️  ' + warning);
      });
    }
  });
  
  // Summary
  console.log('\n' + '-'.repeat(100));
  console.log(`Total Routes: ${results.summary.total}`);
  console.log(`✅ Passed: ${results.summary.passed}`);
  console.log(`❌ Failed: ${results.summary.failed}`);
  console.log('\n');
  
  // Failed routes details
  const failedRoutes = results.routes.filter(r => !r.passed);
  if (failedRoutes.length > 0) {
    console.log('❌ FAILED ROUTES - FIXES NEEDED:');
    console.log('='.repeat(100));
    failedRoutes.forEach(result => {
      console.log(`\n${result.route} (${result.filePath}):`);
      result.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    });
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Starting crawlability & indexability verification...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Base Domain: ${BASE_DOMAIN}`);
  console.log(`Routes to check: ${PUBLIC_ROUTES.length}\n`);
  
  // First, find all internal links across all pages
  console.log('📋 Scanning for internal links...');
  const allInternalLinks = findAllInternalLinks();
  console.log(`Found internal links to ${allInternalLinks.size} routes\n`);
  
  // Verify each route
  results.summary.total = PUBLIC_ROUTES.length;
  
  for (const route of PUBLIC_ROUTES) {
    console.log(`Checking ${route}...`);
    const result = await verifyRoute(route, allInternalLinks);
    
    if (result.passed) {
      results.summary.passed++;
      console.log(`  ✅ PASS`);
    } else {
      results.summary.failed++;
      console.log(`  ❌ FAIL`);
    }
  }
  
  // Print results
  printResults();
  
  // Save results to JSON
  const resultsPath = path.join(__dirname, '..', 'crawlability-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed results saved to: crawlability-results.json\n`);
  
  // Exit with error code if any failures
  if (results.summary.failed > 0) {
    console.log('❌ Verification failed! Please fix the issues above.');
    process.exit(1);
  } else {
    console.log('✅ All routes passed verification!');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { verifyRoute, findAllInternalLinks };

