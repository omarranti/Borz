#!/usr/bin/env node

/**
 * Noindex Check Script
 * Ensures production builds do NOT include noindex meta tags
 */

const fs = require('fs');
const path = require('path');

// Patterns to search for noindex
const NOINDEX_PATTERNS = [
  /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["']/i,
  /<meta\s+content=["'][^"']*noindex[^"']*["']\s+name=["']robots["']/i,
  /X-Robots-Tag:\s*noindex/i,
];

// Recursively find HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Skip node_modules, .git, dist, build directories
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build', '.github', 'scripts'].includes(file)) {
        findHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Files to check (HTML files)
const HTML_FILES = findHtmlFiles(process.cwd()).map(file => 
  path.relative(process.cwd(), file)
);

const results = {
  timestamp: new Date().toISOString(),
  files: [],
  summary: {
    total: 0,
    checked: 0,
    found: 0,
    errors: [],
  },
};

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileResult = {
    file: filePath,
    hasNoindex: false,
    matches: [],
  };

  NOINDEX_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      fileResult.hasNoindex = true;
      fileResult.matches.push({
        pattern: index,
        match: matches[0],
      });
    }
  });

  return fileResult;
}

function main() {
  console.log('🔍 Checking for noindex tags in production...\n');

  if (HTML_FILES.length === 0) {
    console.log('⚠️  No HTML files found to check.');
    process.exit(0);
  }

  results.summary.total = HTML_FILES.length;

  HTML_FILES.forEach((file) => {
    console.log(`Checking ${file}...`);
    const result = checkFile(file);
    results.files.push(result);
    results.summary.checked++;

    if (result.hasNoindex) {
      results.summary.found++;
      results.summary.errors.push(file);
      console.log(`  ❌ Found noindex in ${file}`);
      result.matches.forEach((match) => {
        console.log(`    Match: ${match.match.substring(0, 80)}...`);
      });
    } else {
      console.log(`  ✅ No noindex found`);
    }
  });

  // Print summary
  console.log('\n📊 Summary:');
  console.log(`  Files checked: ${results.summary.checked}`);
  console.log(`  Files with noindex: ${results.summary.found}`);

  // Exit with error code if noindex found
  if (results.summary.found > 0) {
    console.log('\n❌ ERROR: noindex meta tags found in production files!');
    console.log('This will prevent search engines from indexing your site.');
    console.log('\nFiles with noindex:');
    results.summary.errors.forEach((file) => {
      console.log(`  - ${file}`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ No noindex tags found. Production build is safe!');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

