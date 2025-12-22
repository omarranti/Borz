/**
 * Test script for Penguin Intro Animation
 * Run this in Node.js to verify the integration
 */

const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlFile, 'utf8');

console.log('🧪 Testing Penguin Intro Animation Integration...\n');

// Test 1: Check if Three.js CDN is included
console.log('Test 1: Checking Three.js CDN link...');
if (htmlContent.includes('cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js')) {
  console.log('✅ PASS: Three.js CDN link found\n');
} else {
  console.log('❌ FAIL: Three.js CDN link not found\n');
  process.exit(1);
}

// Test 2: Check if CSS styles are included
console.log('Test 2: Checking CSS styles...');
if (htmlContent.includes('#penguin-intro-overlay') && 
    htmlContent.includes('#skip-intro-btn') &&
    htmlContent.includes('#penguin-canvas')) {
  console.log('✅ PASS: CSS styles found\n');
} else {
  console.log('❌ FAIL: CSS styles not found\n');
  process.exit(1);
}

// Test 3: Check if HTML overlay structure is included
console.log('Test 3: Checking HTML overlay structure...');
if (htmlContent.includes('id="penguin-intro-overlay"') &&
    htmlContent.includes('id="skip-intro-btn"') &&
    htmlContent.includes('id="penguin-canvas"')) {
  console.log('✅ PASS: HTML overlay structure found\n');
} else {
  console.log('❌ FAIL: HTML overlay structure not found\n');
  process.exit(1);
}

// Test 4: Check if JavaScript animation code is included
console.log('Test 4: Checking JavaScript animation code...');
if (htmlContent.includes('initPenguinAnimation') &&
    htmlContent.includes('createPenguin') &&
    (htmlContent.includes('createHighway') || htmlContent.includes('createSkiSlopes')) &&
    htmlContent.includes('createSnow')) {
  console.log('✅ PASS: JavaScript animation code found\n');
} else {
  console.log('❌ FAIL: JavaScript animation code not found\n');
  process.exit(1);
}

// Test 5: Check if configuration is present
console.log('Test 5: Checking animation configuration...');
if (htmlContent.includes('duration: 6000') &&
    htmlContent.includes('skipMobile: true')) {
  console.log('✅ PASS: Animation configuration found\n');
} else {
  console.log('❌ FAIL: Animation configuration not found\n');
  process.exit(1);
}

// Test 6: Check if cleanup code is present
console.log('Test 6: Checking resource cleanup code...');
if (htmlContent.includes('renderer.dispose()') &&
    htmlContent.includes('geometry.dispose()') &&
    htmlContent.includes('material.dispose()')) {
  console.log('✅ PASS: Resource cleanup code found\n');
} else {
  console.log('❌ FAIL: Resource cleanup code not found\n');
  process.exit(1);
}

console.log('🎉 All tests passed! The penguin intro animation is properly integrated.\n');
console.log('📝 Next steps:');
console.log('   1. Open index.html in a browser');
console.log('   2. The animation should play automatically on page load');
console.log('   3. Click "Skip Intro" to test the skip functionality');
console.log('   4. The animation should fade out after 6 seconds\n');

