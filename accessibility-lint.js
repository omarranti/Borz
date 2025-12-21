#!/usr/bin/env node
/**
 * Accessibility & Semantic HTML Linting Rules
 * Run with: node accessibility-lint.js index.html
 */

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Check 1: Single H1 tag
  const h1Matches = content.match(/<h1[^>]*>/gi);
  if (!h1Matches || h1Matches.length === 0) {
    errors.push('❌ No H1 tag found. Page must have exactly one H1.');
  } else if (h1Matches.length > 1) {
    errors.push(`❌ Multiple H1 tags found (${h1Matches.length}). Should be exactly one.`);
  }

  // Check 2: Heading hierarchy (no skipping levels)
  let lastHeadingLevel = 0;
  lines.forEach((line, index) => {
    const hMatch = line.match(/<h([1-6])[^>]*>/i);
    if (hMatch) {
      const level = parseInt(hMatch[1]);
      if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
        warnings.push(`⚠️  Line ${index + 1}: Heading level skipped (H${lastHeadingLevel} → H${level}). Consider using H${lastHeadingLevel + 1} instead.`);
      }
      lastHeadingLevel = level;
    }
  });

  // Check 3: Landmark regions
  if (!content.includes('<header')) {
    errors.push('❌ No <header> landmark found.');
  }
  if (!content.includes('<nav')) {
    errors.push('❌ No <nav> landmark found.');
  }
  if (!content.includes('<main')) {
    errors.push('❌ No <main> landmark found.');
  }
  if (!content.includes('<footer')) {
    errors.push('❌ No <footer> landmark found.');
  }

  // Check 4: HTML lang attribute
  if (!content.match(/<html[^>]*lang=["']/i)) {
    errors.push('❌ HTML element missing lang attribute.');
  }

  // Check 5: Form labels
  const labelMatches = content.match(/<label[^>]*for=["']([^"']+)["']/gi);
  const inputMatches = content.match(/<input[^>]*id=["']([^"']+)["']/gi);
  const selectMatches = content.match(/<select[^>]*id=["']([^"']+)["']/gi);
  const textareaMatches = content.match(/<textarea[^>]*id=["']([^"']+)["']/gi);

  const allInputIds = new Set();
  if (inputMatches) {
    inputMatches.forEach(match => {
      const idMatch = match.match(/id=["']([^"']+)["']/i);
      if (idMatch) allInputIds.add(idMatch[1]);
    });
  }
  if (selectMatches) {
    selectMatches.forEach(match => {
      const idMatch = match.match(/id=["']([^"']+)["']/i);
      if (idMatch) allInputIds.add(idMatch[1]);
    });
  }
  if (textareaMatches) {
    textareaMatches.forEach(match => {
      const idMatch = match.match(/id=["']([^"']+)["']/i);
      if (idMatch) allInputIds.add(idMatch[1]);
    });
  }

  if (labelMatches) {
    labelMatches.forEach((match, index) => {
      const forMatch = match.match(/for=["']([^"']+)["']/i);
      if (forMatch && !allInputIds.has(forMatch[1])) {
        errors.push(`❌ Label with for="${forMatch[1]}" has no matching input/select/textarea id.`);
      }
    });
  }

  // Check 6: Buttons vs Links
  const buttonWithHref = content.match(/<button[^>]*href=/gi);
  if (buttonWithHref) {
    errors.push('❌ Found <button> with href attribute. Use <a> for navigation.');
  }

  const linkWithTypeButton = content.match(/<a[^>]*type=["']button["']/gi);
  if (linkWithTypeButton) {
    errors.push('❌ Found <a> with type="button". Use <button> for actions.');
  }

  // Check 7: Images with alt attributes
  const imgWithoutAlt = content.match(/<img[^>]*(?!alt=)[^>]*>/gi);
  if (imgWithoutAlt) {
    imgWithoutAlt.forEach((img, index) => {
      if (!img.includes('alt=')) {
        warnings.push(`⚠️  Image found without alt attribute. Decorative images should have alt="".`);
      }
    });
  }

  // Check 8: Interactive elements have accessible names
  const buttonsWithoutAria = content.match(/<button[^>]*(?!aria-label)(?!aria-labelledby)[^>]*>/gi);
  if (buttonsWithoutAria) {
    buttonsWithoutAria.forEach((btn, index) => {
      if (!btn.match(/>[^<]+</) && !btn.includes('aria-label') && !btn.includes('aria-labelledby')) {
        warnings.push(`⚠️  Button found without accessible name (aria-label or text content).`);
      }
    });
  }

  // Check 9: Navigation has aria-label
  const navWithoutLabel = content.match(/<nav[^>]*(?!aria-label)[^>]*>/gi);
  if (navWithoutLabel) {
    navWithoutLabel.forEach((nav, index) => {
      if (!nav.includes('aria-label') && !nav.includes('aria-labelledby')) {
        warnings.push(`⚠️  <nav> element found without aria-label. Add aria-label for screen readers.`);
      }
    });
  }
}

// Main execution
const filePath = process.argv[2] || 'index.html';

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

console.log(`\n🔍 Checking accessibility and semantic HTML: ${filePath}\n`);
checkFile(filePath);

// Report results
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All accessibility checks passed!\n');
  process.exit(0);
}

if (errors.length > 0) {
  console.log('❌ ERRORS (must fix):\n');
  errors.forEach(err => console.log(`  ${err}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS (should fix):\n');
  warnings.forEach(warn => console.log(`  ${warn}`));
  console.log('');
}

process.exit(errors.length > 0 ? 1 : 0);

