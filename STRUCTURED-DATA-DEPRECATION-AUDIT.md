# Structured Data Deprecation Audit
**Date:** 2024-12-19  
**Site:** https://borzdetailing.com  
**Audit Purpose:** Check for deprecated schema types losing Google Search Console rich-result reporting support starting January 2026

---

## 🎯 AUDIT SCOPE

This audit checks for the following deprecated structured data types that are losing Google Search Console rich-result reporting support:

1. **PracticeProblem** markup
2. **Dataset** markup used expecting Google Search rich results

---

## ✅ AUDIT RESULTS

### Status: **NO DEPRECATED SCHEMAS FOUND**

After comprehensive review of all HTML files and structured data:

- ✅ **PracticeProblem**: Not found in any files
- ✅ **Dataset**: Not found in any files

---

## 📋 SCHEMAS CURRENTLY IN USE

All schemas currently implemented are **valid and supported** by Google:

### 1. AutoWash (LocalBusiness)
- **Status:** ✅ Valid
- **Location:** `index.html` lines 364-414
- **Purpose:** Local business information for Google Business Profile integration
- **Rich Result Support:** ✅ Supported

### 2. Organization
- **Status:** ✅ Valid
- **Location:** `index.html` (in borzdetailing_owner_draft_today.html)
- **Purpose:** Company entity information
- **Rich Result Support:** ✅ Supported

### 3. WebSite
- **Status:** ✅ Valid
- **Location:** `index.html` (in borzdetailing_owner_draft_today.html)
- **Purpose:** Site-wide information, enables sitelinks
- **Rich Result Support:** ✅ Supported

### 4. BreadcrumbList
- **Status:** ✅ Valid
- **Location:** `index.html`
- **Purpose:** Navigation structure for breadcrumb display
- **Rich Result Support:** ✅ Supported

### 5. FAQPage
- **Status:** ✅ Valid
- **Location:** `index.html`
- **Purpose:** FAQ rich snippets in search results
- **Rich Result Support:** ✅ Supported

### 6. Question / Answer
- **Status:** ✅ Valid
- **Location:** Within FAQPage schema
- **Purpose:** Individual FAQ questions and answers
- **Rich Result Support:** ✅ Supported

### 7. PostalAddress
- **Status:** ✅ Valid
- **Location:** Within Organization/AutoWash schemas
- **Purpose:** Address information
- **Rich Result Support:** ✅ Supported (nested type)

### 8. GeoCoordinates
- **Status:** ✅ Valid
- **Location:** Within Organization/AutoWash schemas
- **Purpose:** Geographic location
- **Rich Result Support:** ✅ Supported (nested type)

### 9. OpeningHoursSpecification
- **Status:** ✅ Valid
- **Location:** Within AutoWash schema
- **Purpose:** Business hours
- **Rich Result Support:** ✅ Supported (nested type)

### 10. AggregateRating
- **Status:** ✅ Valid
- **Location:** Within AutoWash schema
- **Purpose:** Business ratings
- **Rich Result Support:** ✅ Supported (nested type)

### 11. OfferCatalog / Offer / Service
- **Status:** ✅ Valid
- **Location:** Within AutoWash schema (in borzdetailing_owner_draft_today.html)
- **Purpose:** Service offerings
- **Rich Result Support:** ✅ Supported

---

## 🔍 FILES AUDITED

The following files were checked for deprecated schemas:

1. ✅ `index.html` - Main production page
2. ✅ `borzdetailing_owner_draft_today.html` - Draft/owner version
3. ✅ `borzdetailing_index_chatgptpro_v2.html` - Development version
4. ✅ `download.html` - Utility page (no structured data)

**Total JSON-LD blocks checked:** 5+ across all files

---

## 📝 DEPRECATED SCHEMAS REFERENCE

### PracticeProblem
- **Deprecation Date:** January 2026
- **Impact:** Will lose Google Search Console rich-result reporting support
- **Recommendation:** If found, remove or replace with alternative schema types
- **Status in this codebase:** ✅ Not found

### Dataset (for Google Search rich results)
- **Deprecation Date:** January 2026
- **Impact:** Will lose Google Search Console rich-result reporting support
- **Note:** Dataset schema is still valid for other purposes (data catalogs, etc.), but will no longer generate rich results in Google Search
- **Recommendation:** If found and used for rich results, remove or replace
- **Status in this codebase:** ✅ Not found

---

## ✅ VALIDATION RECOMMENDATIONS

### Current Status: **CLEAN**

No action required. All structured data is using supported schema types.

### Future Prevention

1. **Before adding new schemas:**
   - Check Google's [Structured Data Documentation](https://developers.google.com/search/docs/appearance/structured-data)
   - Verify schema type is still supported for rich results
   - Review deprecation notices

2. **Regular audits:**
   - Run validation scripts (see `validate-schemas.js`)
   - Check Google Search Console for deprecation warnings
   - Monitor Google's structured data updates

3. **When adding new content types:**
   - Use supported alternatives:
     - Instead of PracticeProblem: Use `Question` within `FAQPage` or `QAPage`
     - Instead of Dataset for rich results: Use appropriate content-specific schemas (Article, Product, etc.)

---

## 🔧 VALIDATION SCRIPTS

Updated validation scripts now include deprecation checks:

- `validate-schemas.js` - Browser console script (updated)
- `scripts/validate-seo.js` - Node.js validation script (updated)

Both scripts now flag deprecated schema types if found.

---

## 📊 GOOGLE SEARCH CONSOLE MONITORING

### What to Monitor:

1. **Structured Data Report:**
   - Navigate to: Search Console → Enhancements → Structured Data
   - Check for deprecation warnings
   - Monitor for new error types

2. **Rich Results Test:**
   - URL: https://search.google.com/test/rich-results
   - Test your pages regularly
   - Verify all schemas show as "Valid"

3. **Search Performance:**
   - Monitor rich result appearance in search results
   - Track any drops in rich result visibility

---

## 🚨 ACTION ITEMS

### Immediate Actions: ✅ NONE REQUIRED

No deprecated schemas found. No cleanup needed.

### Ongoing Maintenance:

- [x] Audit completed (2024-12-19)
- [ ] Set calendar reminder for Q2 2025 audit
- [ ] Monitor Google Search Console for deprecation warnings
- [ ] Review Google's structured data updates quarterly

---

## 📚 REFERENCES

- [Google Structured Data Documentation](https://developers.google.com/search/docs/appearance/structured-data)
- [Schema.org PracticeProblem](https://schema.org/PracticeProblem) - Deprecated for rich results
- [Schema.org Dataset](https://schema.org/Dataset) - Still valid, but not for Google Search rich results
- [Google Search Central Blog](https://developers.google.com/search/blog) - For deprecation announcements

---

## ✅ AUDIT SUMMARY

| Check | Status | Details |
|-------|--------|---------|
| PracticeProblem markup | ✅ Not found | No instances detected |
| Dataset for rich results | ✅ Not found | No instances detected |
| All current schemas valid | ✅ Valid | All 11 schema types are supported |
| Validation scripts updated | ✅ Updated | Deprecation checks added |

**Overall Status:** ✅ **CLEAN - NO ACTION REQUIRED**

---

**Audit Completed:** 2024-12-19  
**Next Audit Recommended:** Q2 2025  
**Auditor Notes:** All structured data is using supported schema types. No deprecated schemas detected. Validation scripts have been updated to prevent future issues.

