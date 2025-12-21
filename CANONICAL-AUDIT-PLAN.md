# Canonicalization Audit & Implementation Plan
**Date:** 2024-12-19  
**Site:** https://borzdetailing.com

---

## 🔍 CURRENT STATE ANALYSIS

### ✅ What's Working

1. **Canonical tag present** on main page
   - File: `index.html:15`
   - Current: `<link rel="canonical" href="https://borzdetailing.com" />`
   - Status: ✅ Correct (HTTPS, non-www, no trailing slash)

2. **No pagination** - Single page site, no pagination issues

3. **OG/Twitter URLs** match canonical
   - `og:url`: `https://borzdetailing.com` ✅
   - `twitter:url`: `https://borzdetailing.com` ✅

### ❌ ISSUES FOUND

#### Issue 1: Missing HTTP → HTTPS Redirect
**Problem:** No redirect from HTTP to HTTPS. Both versions accessible:
- `http://borzdetailing.com` → Should redirect to `https://borzdetailing.com`
- `http://www.borzdetailing.com` → Should redirect to `https://borzdetailing.com`

**Impact:** Duplicate content, security risk, SEO penalty

**Current Status:**
- No redirect rules for HTTP → HTTPS
- Netlify may handle this automatically, but should be explicit

---

#### Issue 2: Missing WWW → Non-WWW Redirect
**Problem:** No redirect from www to non-www. Both versions accessible:
- `https://www.borzdetailing.com` → Should redirect to `https://borzdetailing.com`
- `http://www.borzdetailing.com` → Should redirect to `https://borzdetailing.com`

**Impact:** Duplicate content, split link equity

**Current Status:**
- Canonical uses non-www ✅
- But no redirect to enforce it

---

#### Issue 3: Missing Trailing Slash Handling
**Problem:** Both `/` and `/index.html` serve same content, but no canonicalization:
- `https://borzdetailing.com/` → Same content
- `https://borzdetailing.com/index.html` → Same content

**Impact:** Potential duplicate content

**Current Status:**
- Netlify catch-all redirect: `/* → /index.html` (200 rewrite)
- But `/index.html` is still accessible as separate URL

---

#### Issue 4: Query Parameters Not Stripped
**Problem:** Query parameters create duplicate URLs:
- `https://borzdetailing.com/?utm_source=google`
- `https://borzdetailing.com/?ref=facebook`
- `https://borzdetailing.com/?page=1`

**Impact:** Duplicate content, tracking parameters create multiple URLs

**Current Status:**
- No redirect rules to strip query parameters
- Canonical should handle this, but redirects are better

---

#### Issue 5: Draft File Has Canonical to Main Site
**Problem:** Draft file points canonical to main site (correct) but file itself should be noindex.

**Impact:** Minor - file is blocked in robots.txt, but meta robots should also be noindex

**Current Status:**
- `borzdetailing_owner_draft_today.html` has canonical to main site ✅
- But file should have `noindex` meta robots (separate issue)

---

## 📋 CANONICAL RULES MAP

### Preferred Canonical URL
**Primary:** `https://borzdetailing.com` (HTTPS, non-www, no trailing slash, no query params)

### Redirect Rules Required

| From (Variant) | To (Canonical) | Type | Priority |
|----------------|----------------|------|----------|
| `http://borzdetailing.com` | `https://borzdetailing.com` | 301 | HIGH |
| `http://borzdetailing.com/*` | `https://borzdetailing.com/*` | 301 | HIGH |
| `https://www.borzdetailing.com` | `https://borzdetailing.com` | 301 | HIGH |
| `https://www.borzdetailing.com/*` | `https://borzdetailing.com/*` | 301 | HIGH |
| `http://www.borzdetailing.com` | `https://borzdetailing.com` | 301 | HIGH |
| `http://www.borzdetailing.com/*` | `https://borzdetailing.com/*` | 301 | HIGH |
| `/index.html` | `/` | 301 | MEDIUM |
| `/*?*` (query params) | `/*` (strip params) | 301 | MEDIUM |
| `/*/` (trailing slash) | `/*` (remove slash) | 301 | LOW |

---

## 🎯 IMPLEMENTATION PLAN

### Step 1: Update netlify.toml Redirects

**File:** `netlify.toml`

**Current:**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Proposed:** Add redirects BEFORE the catch-all:
```toml
# HTTP → HTTPS redirects (Netlify may handle this automatically, but explicit is better)
[[redirects]]
  from = "http://borzdetailing.com/*"
  to = "https://borzdetailing.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.borzdetailing.com/*"
  to = "https://borzdetailing.com/:splat"
  status = 301
  force = true

# WWW → Non-WWW redirects
[[redirects]]
  from = "https://www.borzdetailing.com/*"
  to = "https://borzdetailing.com/:splat"
  status = 301
  force = true

# Redirect /index.html to root (must be before catch-all)
[[redirects]]
  from = "/index.html"
  to = "/"
  status = 301
  force = false

# Remove trailing slash (except root - handled separately)
[[redirects]]
  from = "/*/"
  to = "/:splat"
  status = 301
  force = false

# Catch-all: serve index.html for all other routes (SPA support)
# This must be LAST
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
```

**Note on Query Parameters:**
- Netlify doesn't easily support query parameter stripping in redirects
- Canonical tag already handles this (canonical URL has no params)
- If needed, we can add a header rule to set canonical via X-Robots-Tag
- For now, canonical tag is sufficient for query param handling

**Note:** Netlify processes redirects in order. More specific rules must come first.

---

### Step 2: Update _redirects File (Alternative/Backup)

**File:** `_redirects`

**Current:**
```
/*    /index.html   200
```

**Proposed:**
```
# HTTP → HTTPS
http://borzdetailing.com/*    https://borzdetailing.com/:splat    301!
http://www.borzdetailing.com/*    https://borzdetailing.com/:splat    301!

# WWW → Non-WWW
https://www.borzdetailing.com/*    https://borzdetailing.com/:splat    301!

# Remove trailing slash
/*/    /:splat    301

# Redirect /index.html to root
/index.html    /    301

# Catch-all for SPA
/*    /index.html   200
```

**Note:** `_redirects` file is simpler but less flexible than `netlify.toml`. We'll use `netlify.toml` as primary.

---

### Step 3: Verify Canonical Tag

**File:** `index.html`

**Current:** ✅ Already correct
```html
<link rel="canonical" href="https://borzdetailing.com" />
```

**Action:** No change needed, but verify it's using absolute URL (it is ✅)

---

### Step 4: Add Canonical to Other HTML Files (if they should be indexed)

**Files to check:**
- `download.html` - Should have canonical to itself (but file should be noindex)
- `borzdetailing_owner_draft_today.html` - Already has canonical to main site ✅
- `borzdetailing_index_chatgptpro_v2.html` - Should have canonical to main site

---

## 📊 IMPACTED ROUTES

### Routes That Will Redirect:

| Route | Redirects To | Status Code |
|-------|--------------|-------------|
| `http://borzdetailing.com` | `https://borzdetailing.com` | 301 |
| `http://borzdetailing.com/` | `https://borzdetailing.com/` | 301 |
| `http://borzdetailing.com/index.html` | `https://borzdetailing.com/` | 301 |
| `https://www.borzdetailing.com` | `https://borzdetailing.com` | 301 |
| `https://www.borzdetailing.com/` | `https://borzdetailing.com/` | 301 |
| `http://www.borzdetailing.com` | `https://borzdetailing.com` | 301 |
| `https://borzdetailing.com/index.html` | `https://borzdetailing.com/` | 301 |
| `https://borzdetailing.com/?utm_source=google` | `https://borzdetailing.com/` | 301 |
| `https://borzdetailing.com/services/` | `https://borzdetailing.com/services` | 301 |

### Routes That Will Serve Content (200):

| Route | Serves | Notes |
|-------|--------|-------|
| `https://borzdetailing.com` | `index.html` | Canonical URL |
| `https://borzdetailing.com/` | `index.html` | Same content, will redirect to no slash |
| `https://borzdetailing.com/services` | `index.html` | SPA route |
| `https://borzdetailing.com/gallery` | `index.html` | SPA route |

---

## ⚠️ IMPORTANT NOTES

### Query Parameter Handling

**Decision:** Strip ALL query parameters by default.

**Rationale:**
- Tracking parameters (utm_*, ref, etc.) create duplicate URLs
- Canonical tag handles this, but redirects are better for SEO
- If you need to preserve specific params, we can whitelist them

**Alternative:** If you want to preserve tracking params for analytics:
- Keep query params but ensure canonical tag is always without params
- This is acceptable but less ideal

### Trailing Slash Handling

**Decision:** Remove trailing slashes (except for root `/`).

**Rationale:**
- Canonical URL is `https://borzdetailing.com` (no trailing slash)
- Consistent with modern best practices
- Root `/` is acceptable with or without trailing slash, but we'll standardize

### Netlify Redirect Order

**Critical:** Redirects are processed in order. More specific rules must come first:
1. HTTP → HTTPS (most specific, must be first)
2. WWW → Non-WWW
3. Query param stripping
4. Trailing slash removal
5. `/index.html` → `/`
6. Catch-all SPA route (last)

---

## ✅ VERIFICATION CHECKLIST

After implementation, test:

- [ ] `http://borzdetailing.com` → 301 to `https://borzdetailing.com`
- [ ] `https://www.borzdetailing.com` → 301 to `https://borzdetailing.com`
- [ ] `https://borzdetailing.com/index.html` → 301 to `https://borzdetailing.com/`
- [ ] `https://borzdetailing.com/?utm_source=test` → 301 to `https://borzdetailing.com/`
- [ ] `https://borzdetailing.com/services/` → 301 to `https://borzdetailing.com/services`
- [ ] `https://borzdetailing.com/` → Serves content (200)
- [ ] Canonical tag present and correct
- [ ] Test with curl: `curl -I http://borzdetailing.com`
- [ ] Test with curl: `curl -I https://www.borzdetailing.com`
- [ ] Verify in Google Search Console after deployment

---

## 🚨 RISK ASSESSMENT

**Risk Level:** 🟡 **MEDIUM**

**Risks:**
- Incorrect redirect order could break site
- Query param stripping might break analytics (if relying on URL params)
- Trailing slash redirects might affect internal links

**Mitigation:**
- Test redirects thoroughly before deployment
- Monitor analytics after deployment
- Keep backup of original `netlify.toml`

**Rollback Plan:**
- Revert `netlify.toml` to previous version
- Revert `_redirects` to previous version

---

**Ready to implement?** Review this plan and confirm before proceeding.

