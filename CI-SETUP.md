# CI/CD SEO Checks Setup Guide

This guide explains how to set up and run automated SEO checks for the Borz Detailing website.

## Overview

The CI/CD pipeline includes:
1. **Lighthouse CI** - Performance, best practices, and SEO scoring
2. **SEO Route Validation** - Checks title, description, canonical, and status codes
3. **Internal Link Checker** - Verifies all internal links are working
4. **Noindex Check** - Ensures production builds don't accidentally include noindex

---

## Prerequisites

- Node.js 18+ installed
- Python 3 (for local server)
- Git (for CI/CD)

---

## Local Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@lhci/cli` - Lighthouse CI
- `puppeteer` - Browser automation for testing
- `cheerio` - HTML parsing
- `glob` - File pattern matching

### 2. Start Local Server

In one terminal, start a local server:

```bash
npm run serve
# or
python3 -m http.server 8000
```

The server should be running at `http://localhost:8000`

### 3. Run SEO Checks Locally

#### Run All Checks
```bash
npm run test:all
```

#### Run Individual Checks

**SEO Validation:**
```bash
npm run test:seo
```
Checks that all routes have:
- Title tag
- Meta description
- Canonical URL
- Returns 200 status
- Exactly one H1 tag

**Link Checker:**
```bash
npm run test:links
```
Checks all internal links for broken links.

**Noindex Check:**
```bash
npm run test:noindex
```
Ensures no `noindex` meta tags are present in production files.

**Lighthouse CI:**
```bash
npm run lighthouse
```
Runs Lighthouse audits for performance, accessibility, best practices, and SEO.

---

## GitHub Actions Setup

### 1. Workflow File

The workflow is already configured in `.github/workflows/seo-checks.yml`

### 2. Required Secrets (Optional)

If you want to test against a deployed URL instead of localhost, add secrets in GitHub:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add the following secrets:

- `BASE_URL`: Your production/staging URL (e.g., `https://borzdetailing.com`)
- `LHCI_GITHUB_APP_TOKEN`: (Optional) For Lighthouse CI GitHub integration

### 3. Workflow Triggers

The workflow runs on:
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop`
- Weekly schedule (Mondays at 9 AM UTC)
- Manual trigger (workflow_dispatch)

### 4. View Results

After a workflow run:
1. Go to the "Actions" tab in your GitHub repository
2. Click on the latest workflow run
3. View results for each job:
   - **Lighthouse CI**: Performance scores and SEO metrics
   - **SEO Route Validation**: Route-by-route SEO checks
   - **Internal Link Checker**: Broken link report
   - **Noindex Check**: Production safety check

---

## Configuration

### Lighthouse CI Configuration

Edit `.lighthouserc.js` to:
- Add/remove URLs to test
- Adjust score thresholds
- Change server startup command
- Modify assertions

**Example:**
```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:8000/index.html',
        'http://localhost:8000/borzdetailing_owner_draft_today.html',
      ],
      // ... more config
    },
    assert: {
      assertions: {
        'categories:seo': ['error', { minScore: 0.95 }],
        // ... more assertions
      },
    },
  },
};
```

### SEO Validation Routes

Edit `scripts/validate-seo.js` to add/remove routes:

```javascript
const ROUTES = [
  '/index.html',
  '/borzdetailing_owner_draft_today.html',
  // Add more routes here
];
```

### Link Checker Configuration

Edit `scripts/check-links.js` to:
- Add/remove routes to check
- Adjust timeout values
- Modify link validation rules

---

## Understanding Results

### SEO Validation Results

Results are saved to `seo-results.json`:

```json
{
  "summary": {
    "total": 2,
    "passed": 2,
    "failed": 0
  },
  "routes": [
    {
      "route": "/index.html",
      "checks": {
        "hasTitle": true,
        "hasDescription": true,
        "hasCanonical": true,
        "returns200": true
      }
    }
  ]
}
```

### Link Checker Results

Results are saved to `link-results.json`:

```json
{
  "summary": {
    "total": 15,
    "working": 12,
    "broken": 0,
    "external": 3
  },
  "links": [
    {
      "href": "/services",
      "status": "working",
      "statusCode": 200
    }
  ]
}
```

### Lighthouse CI Results

Lighthouse CI generates:
- Performance scores (0-100)
- SEO scores (0-100)
- Best practices scores (0-100)
- Accessibility scores (0-100)
- Detailed audit reports

---

## Troubleshooting

### Issue: Puppeteer fails to launch

**Solution:**
```bash
# Install Chromium dependencies (Linux)
sudo apt-get install -y \
  libnss3 \
  libatk-bridge2.0-0 \
  libdrm2 \
  libxkbcommon0 \
  libgbm1 \
  libasound2
```

### Issue: Server doesn't start

**Solution:**
- Check if port 8000 is already in use
- Change port in `.lighthouserc.js` and scripts
- Use a different server command if needed

### Issue: Links timeout

**Solution:**
- Increase timeout in `scripts/check-links.js`:
  ```javascript
  timeout: 15000, // Increase from 10000
  ```

### Issue: Lighthouse CI fails

**Solution:**
- Check that server starts correctly
- Verify URLs are accessible
- Check Chrome flags in `.lighthouserc.js`

---

## Best Practices

1. **Run checks before committing:**
   ```bash
   npm run test:all
   ```

2. **Fix issues locally before pushing:**
   - All checks should pass locally
   - Review warnings even if checks pass

3. **Monitor CI results:**
   - Check GitHub Actions after each push
   - Review Lighthouse trends over time
   - Address failing checks immediately

4. **Update routes when adding pages:**
   - Add new routes to `scripts/validate-seo.js`
   - Add URLs to `.lighthouserc.js`
   - Update link checker routes if needed

---

## Advanced Usage

### Custom Assertions

Add custom SEO checks in `scripts/validate-seo.js`:

```javascript
// Check for specific meta tags
const viewport = await page.$eval('meta[name="viewport"]', (el) => el.content).catch(() => null);
if (!viewport) {
  routeResult.errors.push('Missing viewport meta tag');
}
```

### Exclude Routes

Modify scripts to exclude certain routes:

```javascript
const ROUTES = [
  '/index.html',
  '/borzdetailing_owner_draft_today.html',
].filter(route => !route.includes('/admin')); // Exclude admin routes
```

### Custom Lighthouse Thresholds

Adjust scores in `.lighthouserc.js`:

```javascript
assertions: {
  'categories:seo': ['error', { minScore: 0.98 }], // Stricter
  'categories:performance': ['warn', { minScore: 0.75 }], // More lenient
}
```

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review GitHub Actions logs
3. Check script output for detailed error messages

---

**Last Updated**: 2025-01-XX
**Status**: ✅ Ready for Use

