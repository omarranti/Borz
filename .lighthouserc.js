module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:8000/index.html',
        'http://localhost:8000/borzdetailing_owner_draft_today.html',
      ],
      startServerCommand: 'python3 -m http.server 8000',
      startServerReadyPattern: 'Serving HTTP',
      startServerReadyTimeout: 10000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-gpu',
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        // SEO-specific assertions
        'meta-description': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'link-text': 'error',
        'is-crawlable': 'error',
        'robots-txt': 'error',
        'hreflang': 'off',
        'canonical': 'error',
        // Performance assertions
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

