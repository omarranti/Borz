# Automated SEO Checks - Quick Start

This repository includes automated SEO checks that run in CI/CD and can be run locally.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Server
```bash
npm run serve
```

### 3. Run All Checks (in another terminal)
```bash
npm run test:all
```

## What Gets Checked

✅ **Lighthouse CI**: Performance, accessibility, best practices, and SEO scores  
✅ **SEO Validation**: Title, description, canonical, H1, and status codes  
✅ **Link Checker**: All internal links are working  
✅ **Noindex Check**: Production builds don't include noindex tags  

## CI/CD

Checks run automatically on:
- Push to main/master/develop
- Pull requests
- Weekly schedule
- Manual trigger

See `.github/workflows/seo-checks.yml` for details.

## Documentation

For detailed setup and configuration, see [CI-SETUP.md](./CI-SETUP.md)

## Scripts

- `npm run test:seo` - Validate SEO metadata
- `npm run test:links` - Check internal links
- `npm run test:noindex` - Check for noindex tags
- `npm run test:all` - Run all checks
- `npm run lighthouse` - Run Lighthouse CI
- `npm run serve` - Start local server

