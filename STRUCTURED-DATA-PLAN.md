# Structured Data Implementation Plan
**Date:** 2024-12-19  
**Site:** https://borzdetailing.com

---

## 🔍 CURRENT STATE ANALYSIS

### ✅ Existing Structured Data

1. **AutoWash Schema** (Line 365-413)
   - Type: `AutoWash` (LocalBusiness subtype)
   - Contains: Address, geo, hours, phone, rating, services
   - Status: ✅ Exists but needs enhancement

### ❌ Missing Structured Data

1. **WebSite Schema** - Not present
   - Needed for: Site search, sitelinks, organization connection
   - Should include: Site name, URL, potential search action

2. **Organization Schema** - Not separate from AutoWash
   - Current: AutoWash acts as organization
   - Should add: Separate Organization schema for better structure

3. **FAQPage Schema** - Not present
   - FAQ section exists with 4 Q&A pairs (lines 1683-1722)
   - Should add: FAQPage schema matching visible content

4. **BreadcrumbList Schema** - Not present
   - No visible breadcrumb UI, but useful for SEO
   - Should add: Breadcrumb for single-page navigation

### ✅ Content Verification

- **Blog/Articles:** ❌ No blog exists (confirmed - "article" tags are service cards)
- **FAQ Content:** ✅ 4 questions visible on page (lines 1683-1722)
- **Breadcrumbs:** ❌ No visible breadcrumb UI (but can add schema for SEO)

---

## 📋 IMPLEMENTATION PLAN

### Page: `index.html` (Main Page)

#### Schema 1: Organization (Enhanced)
**Location:** After existing AutoWash schema  
**Type:** `Organization`  
**Purpose:** Separate organization entity from LocalBusiness

**Content to Match:**
- Name: "Borz Detailing Car Polish Services L.L.C"
- URL: "https://borzdetailing.com"
- Logo: Main logo image
- SameAs: Instagram link
- Contact: Phone, address

---

#### Schema 2: WebSite
**Location:** After Organization schema  
**Type:** `WebSite`  
**Purpose:** Site-wide information, potential search action

**Content to Match:**
- Name: "Borz Detailing"
- URL: "https://borzdetailing.com"
- Publisher: References Organization
- Description: Site description

---

#### Schema 3: FAQPage
**Location:** Near FAQ section (before closing </section> tag)  
**Type:** `FAQPage`  
**Purpose:** Enable FAQ rich snippets

**Content to Match (4 Q&A pairs):**
1. Q: "Do you offer warranty on PPF & coating?"
   A: "Yes — warranty options are available depending on the package and materials selected. Message us to confirm coverage."

2. Q: "How long does a full detail take?"
   A: "Timing depends on vehicle size and condition. We'll give an accurate estimate when you send photos on WhatsApp or Telegram."

3. Q: "Can I wait while the work is done?"
   A: "Yes — there's a lounge area upstairs with tea and coffee while you wait."

4. Q: "Do you support English / Arabic / Russian?"
   A: "Yes — our team can support English, Arabic, and Russian speaking clients."

---

#### Schema 4: BreadcrumbList
**Location:** In <head> section (after other schemas)  
**Type:** `BreadcrumbList`  
**Purpose:** Help search engines understand page structure

**Content:**
- Single breadcrumb: Home → Current Page
- For single-page site, this is minimal but useful

---

### Page: Other HTML Files

- **download.html** - No structured data needed (utility page, noindex)
- **borzdetailing_owner_draft_today.html** - No structured data needed (draft, noindex)
- **borzdetailing_index_chatgptpro_v2.html** - No structured data needed (dev file, noindex)

---

## 🎯 SCHEMA STRUCTURE

### 1. Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://borzdetailing.com/#organization",
  "name": "Borz Detailing Car Polish Services L.L.C",
  "alternateName": "Borz Detailing",
  "url": "https://borzdetailing.com",
  "logo": "https://borzdetailing.com/public/images/optimized/Main Logo.jpg",
  "image": "https://borzdetailing.com/public/images/Website landing with logo.png",
  "description": "Premium car detailing, PPF wrapping, ceramic coating, polishing, tinting, and vehicle painting in Al Quoz, Dubai.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Al Quoz Ind. Third - Al Quoz",
    "addressLocality": "Dubai",
    "addressRegion": "Dubai",
    "addressCountry": "AE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "25.2048",
    "longitude": "55.2708"
  },
  "telephone": "+971563299615",
  "sameAs": [
    "https://instagram.com/borz_detailing_uae/?hl=en"
  ]
}
```

### 2. WebSite Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://borzdetailing.com/#website",
  "name": "Borz Detailing",
  "url": "https://borzdetailing.com",
  "description": "Luxury car detailing services in Dubai - PPF wrapping, ceramic coating, and premium car care",
  "publisher": {
    "@id": "https://borzdetailing.com/#organization"
  },
  "inLanguage": "en-AE"
}
```

### 3. FAQPage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you offer warranty on PPF & coating?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — warranty options are available depending on the package and materials selected. Message us to confirm coverage."
      }
    },
    {
      "@type": "Question",
      "name": "How long does a full detail take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Timing depends on vehicle size and condition. We'll give an accurate estimate when you send photos on WhatsApp or Telegram."
      }
    },
    {
      "@type": "Question",
      "name": "Can I wait while the work is done?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — there's a lounge area upstairs with tea and coffee while you wait."
      }
    },
    {
      "@type": "Question",
      "name": "Do you support English / Arabic / Russian?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — our team can support English, Arabic, and Russian speaking clients."
      }
    }
  ]
}
```

### 4. BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://borzdetailing.com"
    }
  ]
}
```

---

## 📊 IMPLEMENTATION SUMMARY

### Files to Modify:

| File | Schemas to Add | Location |
|------|----------------|----------|
| `index.html` | Organization, WebSite, FAQPage, BreadcrumbList | In `<head>` section |

### Schema Count:

- **Organization:** 1 (new, separate from AutoWash)
- **WebSite:** 1 (new)
- **FAQPage:** 1 (new, matches 4 visible FAQs)
- **BreadcrumbList:** 1 (new, minimal for single-page)
- **AutoWash:** 1 (existing, keep as-is)

**Total:** 5 schemas on main page

---

## ✅ VERIFICATION CHECKLIST

After implementation:

- [ ] Test with Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Verify Organization schema validates
- [ ] Verify WebSite schema validates
- [ ] Verify FAQPage schema validates (should show 4 questions)
- [ ] Verify BreadcrumbList schema validates
- [ ] Check that FAQ content matches visible content exactly
- [ ] Ensure no duplicate schemas
- [ ] Verify all URLs are absolute (https://borzdetailing.com)
- [ ] Check that schemas reference each other correctly (@id references)

---

## 🚨 IMPORTANT NOTES

1. **FAQ Content Must Match Exactly**
   - Schema questions/answers must match visible HTML content
   - No adding extra FAQs that aren't on the page
   - No removing FAQs that are visible

2. **No Blog/Article Schema**
   - Confirmed: No blog exists
   - "article" HTML tags are for service cards, not blog posts
   - Do NOT add Article schema

3. **AutoWash vs Organization**
   - Keep AutoWash for LocalBusiness features (hours, services)
   - Add Organization for general company info
   - They can coexist and reference each other

4. **BreadcrumbList for Single Page**
   - Minimal breadcrumb (just Home)
   - Still useful for SEO even without visible UI
   - Can be expanded if site grows to multiple pages

---

**Ready to implement?** Review this plan and confirm before proceeding.

