# Structured Data Validation Guide
**Date:** 2024-12-19  
**Site:** https://borzdetailing.com

---

## ✅ SYNTAX VALIDATION (Pre-Deployment)

### Schema 1: AutoWash (LocalBusiness)
**Location:** Lines 365-413  
**Status:** ✅ Valid JSON-LD syntax

**Required Fields Check:**
- ✅ `@context`: "https://schema.org"
- ✅ `@type`: "AutoWash"
- ✅ `name`: Present
- ✅ `address`: Complete PostalAddress
- ✅ `geo`: GeoCoordinates present
- ✅ `telephone`: Present
- ✅ `openingHoursSpecification`: Present

**Validation:** ✅ PASS

---

### Schema 2: Organization
**Location:** Lines 417-445  
**Status:** ✅ Valid JSON-LD syntax

**Required Fields Check:**
- ✅ `@context`: "https://schema.org"
- ✅ `@type`: "Organization"
- ✅ `@id`: "https://borzdetailing.com/#organization" (for referencing)
- ✅ `name`: Present
- ✅ `url`: Present
- ✅ `address`: Complete PostalAddress
- ✅ `geo`: GeoCoordinates present
- ✅ `telephone`: Present

**Validation:** ✅ PASS

---

### Schema 3: WebSite
**Location:** Lines 447-461  
**Status:** ✅ Valid JSON-LD syntax

**Required Fields Check:**
- ✅ `@context`: "https://schema.org"
- ✅ `@type`: "WebSite"
- ✅ `@id`: "https://borzdetailing.com/#website" (for referencing)
- ✅ `name`: Present
- ✅ `url`: Present
- ✅ `publisher`: References Organization via @id ✅

**Validation:** ✅ PASS

---

### Schema 4: BreadcrumbList
**Location:** Lines 463-477  
**Status:** ✅ Valid JSON-LD syntax

**Required Fields Check:**
- ✅ `@context`: "https://schema.org"
- ✅ `@type`: "BreadcrumbList"
- ✅ `itemListElement`: Array present
- ✅ `ListItem.position`: Present (1)
- ✅ `ListItem.name`: Present ("Home")
- ✅ `ListItem.item`: Present (URL)

**Validation:** ✅ PASS

---

### Schema 5: FAQPage
**Location:** Lines 1790-1828  
**Status:** ✅ Valid JSON-LD syntax

**Required Fields Check:**
- ✅ `@context`: "https://schema.org"
- ✅ `@type`: "FAQPage"
- ✅ `mainEntity`: Array present
- ✅ Each Question has:
  - ✅ `@type`: "Question"
  - ✅ `name`: Present (question text)
  - ✅ `acceptedAnswer`: Present
  - ✅ `acceptedAnswer.@type`: "Answer"
  - ✅ `acceptedAnswer.text`: Present (answer text)

**FAQ Count:** 4 questions (matches visible content) ✅

**Validation:** ✅ PASS

---

## 🧪 GOOGLE RICH RESULTS TEST

### Step 1: Access the Tool
**URL:** https://search.google.com/test/rich-results

### Step 2: Test Your Page
1. Enter URL: `https://borzdetailing.com` (or your deployed URL)
2. Click "Test URL"
3. Wait for validation (may take 10-30 seconds)

### Step 3: Review Results

**Expected Results:**
- ✅ **5 schemas detected:**
  - AutoWash (LocalBusiness)
  - Organization
  - WebSite
  - BreadcrumbList
  - FAQPage

**What to Look For:**
- ✅ All schemas show "Valid" status
- ✅ No errors or warnings
- ✅ FAQPage shows 4 questions
- ✅ Organization and WebSite are linked correctly

---

## 📋 VALIDATION CHECKLIST

### Pre-Deployment Checks
- [x] All JSON-LD syntax is valid
- [x] All required fields present
- [x] All URLs are absolute (https://borzdetailing.com)
- [x] FAQ content matches visible content exactly
- [x] No duplicate schemas
- [x] @id references are correct

### Post-Deployment Checks
- [ ] Test with Google Rich Results Test
- [ ] Verify all 5 schemas appear
- [ ] Check for any errors or warnings
- [ ] Verify FAQPage shows 4 questions
- [ ] Test with deployed URL (not localhost)

---

## 🔍 MANUAL VALIDATION STEPS

### 1. Check JSON-LD Syntax
**Method:** View page source, copy JSON-LD blocks, validate with JSONLint

**Tools:**
- https://jsonlint.com/
- Browser DevTools Console (will show JSON parse errors)

**What to Check:**
- No trailing commas
- All strings properly quoted
- All brackets/braces matched
- No syntax errors

---

### 2. Verify Schema.org Compliance
**Method:** Check against Schema.org documentation

**Resources:**
- Organization: https://schema.org/Organization
- WebSite: https://schema.org/WebSite
- FAQPage: https://schema.org/FAQPage
- BreadcrumbList: https://schema.org/BreadcrumbList
- AutoWash: https://schema.org/AutoWash

**What to Check:**
- Required properties present
- Property types correct (string, number, object, array)
- Nested objects properly structured

---

### 3. Content Accuracy Check
**Method:** Compare schema content with visible page content

**FAQ Verification:**
1. Count visible FAQs on page: Should be 4
2. Compare each question/answer in schema with visible content
3. Ensure exact text match (no paraphrasing)

**Organization Verification:**
1. Check company name matches
2. Verify address matches contact section
3. Confirm phone number matches
4. Verify social links match

---

## 🚨 COMMON ERRORS TO WATCH FOR

### Error 1: Invalid JSON Syntax
**Symptom:** Google Rich Results Test shows "Invalid JSON"
**Fix:** Check for:
- Trailing commas
- Unclosed brackets/braces
- Unescaped quotes in strings

### Error 2: Missing Required Properties
**Symptom:** Schema shows warnings about missing fields
**Fix:** Add required properties per Schema.org spec

### Error 3: FAQ Content Mismatch
**Symptom:** FAQ schema doesn't match visible content
**Fix:** Ensure schema questions/answers match HTML exactly

### Error 4: Invalid URL References
**Symptom:** @id references don't resolve
**Fix:** Ensure all @id values are correct and referenced schemas exist

### Error 5: Deprecated Schema Types ⚠️
**Symptom:** Schema types losing Google Search Console rich-result support
**Deprecated Types (as of Jan 2026):**
- `PracticeProblem` - Losing rich-result reporting support
- `Dataset` - Losing rich-result reporting support for search results

**Fix:** 
- Remove deprecated schemas
- Replace with supported alternatives:
  - PracticeProblem → Use `Question` within `FAQPage` or `QAPage`
  - Dataset (for rich results) → Use content-specific schemas (Article, Product, etc.)

**See:** `STRUCTURED-DATA-DEPRECATION-AUDIT.md` for full audit details

---

## 📊 EXPECTED GOOGLE RICH RESULTS TEST OUTPUT

### Successful Validation Should Show:

```
✅ Valid
  - AutoWash (LocalBusiness)
  - Organization  
  - WebSite
  - BreadcrumbList
  - FAQPage (4 questions)

No errors or warnings
```

### Rich Snippet Eligibility:

- **LocalBusiness:** Eligible for Google Business Profile integration
- **Organization:** Eligible for Knowledge Panel
- **WebSite:** Eligible for sitelinks
- **FAQPage:** Eligible for FAQ rich snippets in search results
- **BreadcrumbList:** Eligible for breadcrumb display in search results

---

## 🔧 TROUBLESHOOTING

### If Google Rich Results Test Shows Errors:

1. **Check JSON Syntax**
   - Copy JSON-LD block
   - Paste into https://jsonlint.com/
   - Fix any syntax errors

2. **Verify Required Fields**
   - Check Schema.org documentation
   - Ensure all required properties present
   - Add missing properties

3. **Check Content Match**
   - Verify FAQ content matches exactly
   - Ensure no extra/missing FAQs
   - Check for typos or mismatches

4. **Test with Different Tools**
   - Schema.org Validator: https://validator.schema.org/
   - Google's Structured Data Testing Tool (legacy)
   - Browser DevTools (check for console errors)

---

## 📝 POST-DEPLOYMENT MONITORING

### Google Search Console

1. **Navigate to:** Search Console → Enhancements → Structured Data
2. **Check for:**
   - Any errors or warnings
   - Schema coverage report
   - Rich result eligibility

### Monitor These Metrics:

- **Structured Data Errors:** Should be 0
- **FAQ Rich Snippets:** Check if appearing in search results
- **Knowledge Panel:** Monitor for Organization panel eligibility
- **Sitelinks:** Check if WebSite schema enables sitelinks

### Search Result Monitoring:

1. Search: `site:borzdetailing.com FAQ`
2. Look for: FAQ rich snippets (expandable Q&A)
3. Search: `borzdetailing.com`
4. Look for: Knowledge panel, sitelinks, breadcrumbs

---

## ✅ VALIDATION SUMMARY

### Pre-Deployment Status: ✅ ALL SCHEMAS VALID

| Schema | Syntax | Required Fields | Content Match | Status |
|--------|--------|-----------------|---------------|--------|
| AutoWash | ✅ | ✅ | ✅ | ✅ PASS |
| Organization | ✅ | ✅ | ✅ | ✅ PASS |
| WebSite | ✅ | ✅ | ✅ | ✅ PASS |
| BreadcrumbList | ✅ | ✅ | ✅ | ✅ PASS |
| FAQPage | ✅ | ✅ | ✅ | ✅ PASS |

### Next Steps:

1. **Deploy to production**
2. **Test with Google Rich Results Test** (use deployed URL)
3. **Submit to Google Search Console**
4. **Monitor for rich snippets** (may take days/weeks to appear)
5. **Check Search Console** for any errors

---

**Note:** Rich snippets may take 1-2 weeks to appear in search results after Google crawls and indexes the updated structured data.

