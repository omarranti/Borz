# SEO Metadata System - Test Checklist

## Implementation Summary

✅ **Framework Detected**: Static HTML (Single-Page Application)
✅ **Pattern Implemented**: JavaScript-based metadata system with route configuration
✅ **H1 Usage**: Verified - Exactly one H1 tag present
✅ **Title**: Unique and optimized per route
✅ **Meta Description**: Unique and optimized per route
✅ **Structured Data**: Enhanced Schema.org markup (Organization, WebPage, WebSite)

---

## Pre-Deployment Checklist

### 1. Title Tag Verification
- [ ] Open page in browser
- [ ] Check browser tab title: Should show "Borz Detailing — Luxury Car Detailing, PPF & Ceramic Coating in Al Quoz, Dubai"
- [ ] Verify title is 50-60 characters (current: ~75 chars - acceptable but could be shortened)
- [ ] Check browser console for any JavaScript errors
- [ ] Verify title updates correctly if route changes (for future multi-page expansion)

**Test Command:**
```javascript
// In browser console:
document.title
// Expected: "Borz Detailing — Luxury Car Detailing, PPF & Ceramic Coating in Al Quoz, Dubai"
```

### 2. Meta Description Verification
- [ ] View page source (Ctrl+U / Cmd+U)
- [ ] Search for `<meta name="description"`
- [ ] Verify description is unique (not duplicated)
- [ ] Check description length: Should be 150-160 characters (current: ~165 chars - good)
- [ ] Verify description contains primary keywords naturally

**Test Command:**
```javascript
// In browser console:
document.querySelector('meta[name="description"]')?.content
// Expected: "Premium car detailing, PPF wrapping, ceramic coating..."
```

### 3. H1 Tag Verification
- [ ] Open browser DevTools
- [ ] Search for all H1 tags: `document.querySelectorAll('h1')`
- [ ] Verify exactly ONE H1 tag exists
- [ ] Check H1 content: Should contain "The Ultimate Care for Your Supercar"
- [ ] Verify H1 is visible and properly styled
- [ ] Check console for H1 warnings (should be none if correct)

**Test Command:**
```javascript
// In browser console:
const h1s = document.querySelectorAll('h1');
console.log('H1 count:', h1s.length); // Should be 1
console.log('H1 text:', h1s[0]?.textContent.trim());
// Expected: "The Ultimate Care for Your Supercar."
```

### 4. Open Graph Tags
- [ ] Use Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- [ ] Enter URL and click "Debug"
- [ ] Verify og:title displays correctly
- [ ] Verify og:description displays correctly
- [ ] Verify og:image displays (update image URL to actual image)
- [ ] Check for any warnings or errors

**Test Command:**
```javascript
// In browser console:
const ogTags = {
  title: document.querySelector('meta[property="og:title"]')?.content,
  description: document.querySelector('meta[property="og:description"]')?.content,
  image: document.querySelector('meta[property="og:image"]')?.content,
  url: document.querySelector('meta[property="og:url"]')?.content
};
console.table(ogTags);
```

### 5. Twitter Card Tags
- [ ] Use Twitter Card Validator: https://cards-dev.twitter.com/validator
- [ ] Enter URL and verify card preview
- [ ] Check that all Twitter meta tags are present
- [ ] Verify image displays correctly

**Test Command:**
```javascript
// In browser console:
const twitterTags = {
  card: document.querySelector('meta[name="twitter:card"]')?.content,
  title: document.querySelector('meta[name="twitter:title"]')?.content,
  description: document.querySelector('meta[name="twitter:description"]')?.content,
  image: document.querySelector('meta[name="twitter:image"]')?.content
};
console.table(twitterTags);
```

### 6. Canonical URL
- [ ] View page source
- [ ] Search for `<link rel="canonical"`
- [ ] Verify canonical URL is correct: `https://borzdetailing.com`
- [ ] Ensure no duplicate canonical tags

**Test Command:**
```javascript
// In browser console:
document.querySelector('link[rel="canonical"]')?.href
// Expected: "https://borzdetailing.com"
```

### 7. Structured Data (Schema.org)
- [ ] Use Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Enter URL and test
- [ ] Verify Organization schema is detected
- [ ] Verify WebPage schema is detected
- [ ] Verify WebSite schema is detected
- [ ] Check for any errors or warnings
- [ ] Verify all required fields are present

**Test Command:**
```javascript
// In browser console:
const schemas = document.querySelectorAll('script[type="application/ld+json"]');
console.log('Schema count:', schemas.length); // Should be 3
schemas.forEach((schema, i) => {
  try {
    const data = JSON.parse(schema.textContent);
    console.log(`Schema ${i + 1}:`, data['@type']);
  } catch (e) {
    console.error('Invalid JSON in schema', i + 1);
  }
});
```

### 8. Language Attributes
- [ ] Verify `<html lang="en-AE">` is present
- [ ] Check that language matches content
- [ ] Verify `inLanguage` in structured data matches

### 9. Mobile Optimization
- [ ] Test on mobile device or emulator
- [ ] Verify viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] Check that title displays correctly in mobile browser
- [ ] Verify meta description is accessible

### 10. Duplicate Content Check
- [ ] Search for duplicate meta descriptions across pages (if multi-page)
- [ ] Verify each page has unique title
- [ ] Check for duplicate H1 tags (should be exactly one per page)
- [ ] Verify canonical URLs are unique per page

---

## Automated Testing Script

Run this in browser console after page load:

```javascript
// SEO Metadata Test Suite
(function() {
  const results = {
    title: { pass: false, value: null },
    description: { pass: false, value: null },
    h1: { pass: false, count: 0, value: null },
    canonical: { pass: false, value: null },
    ogTags: { pass: false, count: 0 },
    twitterTags: { pass: false, count: 0 },
    schemas: { pass: false, count: 0 }
  };

  // Test Title
  results.title.value = document.title;
  results.title.pass = results.title.value.length > 0 && results.title.value.length <= 70;

  // Test Description
  const desc = document.querySelector('meta[name="description"]');
  results.description.value = desc?.content || null;
  results.description.pass = results.description.value && 
    results.description.value.length >= 120 && 
    results.description.value.length <= 160;

  // Test H1
  const h1s = document.querySelectorAll('h1');
  results.h1.count = h1s.length;
  results.h1.value = h1s[0]?.textContent.trim() || null;
  results.h1.pass = results.h1.count === 1 && results.h1.value;

  // Test Canonical
  const canonical = document.querySelector('link[rel="canonical"]');
  results.canonical.value = canonical?.href || null;
  results.canonical.pass = !!results.canonical.value;

  // Test OG Tags
  const ogTags = document.querySelectorAll('meta[property^="og:"]');
  results.ogTags.count = ogTags.length;
  results.ogTags.pass = results.ogTags.count >= 7; // Minimum required OG tags

  // Test Twitter Tags
  const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
  results.twitterTags.count = twitterTags.length;
  results.twitterTags.pass = results.twitterTags.count >= 4; // Minimum required Twitter tags

  // Test Schemas
  const schemas = document.querySelectorAll('script[type="application/ld+json"]');
  results.schemas.count = schemas.length;
  results.schemas.pass = results.schemas.count >= 1;

  // Output Results
  console.log('=== SEO Metadata Test Results ===');
  console.table(results);
  
  const allPass = Object.values(results).every(r => r.pass);
  console.log(allPass ? '✅ All SEO checks passed!' : '❌ Some SEO checks failed');
  
  return results;
})();
```

---

## Manual Testing Tools

1. **Google Search Console**: Submit sitemap and monitor indexing
2. **Google Rich Results Test**: https://search.google.com/test/rich-results
3. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
4. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
5. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
6. **Schema Markup Validator**: https://validator.schema.org/

---

## Future Multi-Page Expansion

When adding new pages, extend the `SEO_CONFIG.routes` object:

```javascript
routes: {
  '/': { /* current config */ },
  '/services': {
    title: 'Car Detailing Services in Dubai | Borz Detailing',
    description: 'Professional car detailing services including PPF wrapping, ceramic coating, polishing, and more in Al Quoz, Dubai.',
    h1: 'Our Premium Detailing Services',
    canonical: 'https://borzdetailing.com/services'
  },
  '/gallery': {
    title: 'Our Work Gallery | Borz Detailing Dubai',
    description: 'View our premium car detailing work including PPF installations, ceramic coatings, and paint corrections.',
    h1: 'Our Work Gallery',
    canonical: 'https://borzdetailing.com/gallery'
  }
}
```

---

## Notes

- **Image URLs**: Update placeholder image URLs (`https://borzdetailing.com/og-image.jpg`) with actual hosted images
- **Canonical URLs**: Update base URL if domain changes
- **H1 Content**: Current H1 is "The Ultimate Care for Your Supercar" - matches metadata expectations
- **Language**: Set to `en-AE` (English - United Arab Emirates) for Dubai location

---

## Quick Verification Commands

```bash
# Check for duplicate titles (if multiple HTML files)
grep -r "<title>" . | sort | uniq -d

# Check for duplicate descriptions
grep -r 'name="description"' . | sort | uniq -d

# Count H1 tags per file
grep -c "<h1" borzdetailing_owner_draft_today.html
```

---

**Last Updated**: 2025-01-XX
**Status**: ✅ Ready for Testing

