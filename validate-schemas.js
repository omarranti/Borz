/**
 * Structured Data Validation Script
 * Run this in browser console on your deployed site to validate JSON-LD schemas
 * 
 * Usage:
 * 1. Open your deployed site in browser
 * 2. Open DevTools Console (F12)
 * 3. Paste this script and run
 */

(function() {
  console.log('🔍 Validating Structured Data...\n');
  
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const results = {
    total: scripts.length,
    valid: 0,
    invalid: 0,
    schemas: []
  };

  scripts.forEach((script, index) => {
    try {
      const json = JSON.parse(script.textContent);
      const schemaType = json['@type'] || 'Unknown';
      
      results.schemas.push({
        index: index + 1,
        type: schemaType,
        valid: true,
        errors: [],
        warnings: []
      });
      
      results.valid++;
      
      // Validate required fields based on type
      const validationResult = validateSchema(json, schemaType);
      const errors = validationResult.errors || [];
      const warnings = validationResult.warnings || [];
      
      if (errors.length > 0) {
        results.schemas[results.schemas.length - 1].errors = errors;
        results.schemas[results.schemas.length - 1].valid = false;
        results.valid--;
        results.invalid++;
      }
      
      if (warnings.length > 0) {
        results.schemas[results.schemas.length - 1].warnings = warnings;
        warnings.forEach(warning => console.warn(warning));
      }
      
      console.log(`✅ Schema ${index + 1}: ${schemaType} - Valid JSON`);
      
    } catch (error) {
      results.invalid++;
      results.schemas.push({
        index: index + 1,
        type: 'Unknown',
        valid: false,
        errors: [`JSON Parse Error: ${error.message}`]
      });
      console.error(`❌ Schema ${index + 1}: Invalid JSON - ${error.message}`);
    }
  });

  // Deprecated schema types (losing Google Search Console rich-result support Jan 2026)
  const DEPRECATED_TYPES = {
    'PracticeProblem': {
      reason: 'Losing Google Search Console rich-result reporting support starting January 2026',
      recommendation: 'Remove or replace with Question/FAQPage schema'
    },
    'Dataset': {
      reason: 'Losing Google Search Console rich-result reporting support for search results starting January 2026',
      note: 'Dataset is still valid for data catalogs, but will not generate rich results in Google Search',
      recommendation: 'Remove if used for rich results, or replace with content-specific schemas'
    }
  };

  // Validation functions
  function validateSchema(json, type) {
    const errors = [];
    const warnings = [];
    
    // Check for deprecated types
    if (DEPRECATED_TYPES[type]) {
      warnings.push(`⚠️ DEPRECATED: ${type} - ${DEPRECATED_TYPES[type].reason}`);
      if (DEPRECATED_TYPES[type].recommendation) {
        warnings.push(`   Recommendation: ${DEPRECATED_TYPES[type].recommendation}`);
      }
    }
    
    // Common validations
    if (!json['@context'] || json['@context'] !== 'https://schema.org') {
      errors.push('Missing or invalid @context');
    }
    
    if (!json['@type']) {
      errors.push('Missing @type');
    }
    
    // Type-specific validations
    switch(type) {
      case 'Organization':
        if (!json.name) errors.push('Missing name');
        if (!json.url) errors.push('Missing url');
        break;
        
      case 'WebSite':
        if (!json.name) errors.push('Missing name');
        if (!json.url) errors.push('Missing url');
        if (!json.publisher || !json.publisher['@id']) {
          errors.push('Missing publisher @id reference');
        }
        break;
        
      case 'FAQPage':
        if (!json.mainEntity || !Array.isArray(json.mainEntity)) {
          errors.push('Missing or invalid mainEntity array');
        } else {
          json.mainEntity.forEach((item, i) => {
            if (!item['@type'] || item['@type'] !== 'Question') {
              errors.push(`mainEntity[${i}]: Missing or invalid @type`);
            }
            if (!item.name) {
              errors.push(`mainEntity[${i}]: Missing name`);
            }
            if (!item.acceptedAnswer || !item.acceptedAnswer['@type'] || item.acceptedAnswer['@type'] !== 'Answer') {
              errors.push(`mainEntity[${i}]: Missing or invalid acceptedAnswer`);
            }
            if (!item.acceptedAnswer || !item.acceptedAnswer.text) {
              errors.push(`mainEntity[${i}]: Missing answer text`);
            }
          });
        }
        break;
        
      case 'BreadcrumbList':
        if (!json.itemListElement || !Array.isArray(json.itemListElement)) {
          errors.push('Missing or invalid itemListElement array');
        } else {
          json.itemListElement.forEach((item, i) => {
            if (!item['@type'] || item['@type'] !== 'ListItem') {
              errors.push(`itemListElement[${i}]: Missing or invalid @type`);
            }
            if (!item.position) {
              errors.push(`itemListElement[${i}]: Missing position`);
            }
            if (!item.name) {
              errors.push(`itemListElement[${i}]: Missing name`);
            }
            if (!item.item) {
              errors.push(`itemListElement[${i}]: Missing item URL`);
            }
          });
        }
        break;
        
      case 'AutoWash':
        if (!json.name) errors.push('Missing name');
        if (!json.address) errors.push('Missing address');
        if (!json.telephone) errors.push('Missing telephone');
        break;
    }
    
    return { errors, warnings };
  }

  // Print summary
  console.log('\n📊 Validation Summary:');
  console.log(`Total Schemas: ${results.total}`);
  console.log(`✅ Valid: ${results.valid}`);
  console.log(`❌ Invalid: ${results.invalid}`);
  
  // Check for deprecated schemas
  const deprecatedSchemas = results.schemas.filter(s => s.warnings && s.warnings.length > 0);
  if (deprecatedSchemas.length > 0) {
    console.log('\n⚠️ DEPRECATED SCHEMAS FOUND:');
    deprecatedSchemas.forEach(schema => {
      console.warn(`\nSchema ${schema.index} (${schema.type}):`);
      schema.warnings.forEach(warning => console.warn(`  ${warning}`));
    });
    console.log('\n⚠️ These schema types will lose Google Search Console rich-result reporting support starting January 2026.');
    console.log('   Please remove or replace them with supported alternatives.\n');
  }
  
  if (results.invalid > 0) {
    console.log('\n❌ Errors Found:');
    results.schemas.forEach(schema => {
      if (!schema.valid && schema.errors.length > 0) {
        console.error(`\nSchema ${schema.index} (${schema.type}):`);
        schema.errors.forEach(error => console.error(`  - ${error}`));
      }
    });
  } else if (deprecatedSchemas.length === 0) {
    console.log('\n✅ All schemas are valid and supported!');
  }
  
  // Expected schemas check
  const expectedTypes = ['AutoWash', 'Organization', 'WebSite', 'BreadcrumbList', 'FAQPage'];
  const foundTypes = results.schemas.map(s => s.type).filter(t => expectedTypes.includes(t));
  
  console.log('\n📋 Schema Coverage:');
  expectedTypes.forEach(type => {
    const found = foundTypes.includes(type);
    console.log(`${found ? '✅' : '❌'} ${type}: ${found ? 'Found' : 'Missing'}`);
  });
  
  // FAQ count check
  const faqSchema = results.schemas.find(s => s.type === 'FAQPage');
  if (faqSchema) {
    try {
      const faqScript = Array.from(scripts).find(s => {
        try {
          return JSON.parse(s.textContent)['@type'] === 'FAQPage';
        } catch { return false; }
      });
      if (faqScript) {
        const faqJson = JSON.parse(faqScript.textContent);
        const faqCount = faqJson.mainEntity ? faqJson.mainEntity.length : 0;
        console.log(`\n❓ FAQ Count: ${faqCount} (Expected: 4)`);
        if (faqCount === 4) {
          console.log('✅ FAQ count matches visible content');
        } else {
          console.warn('⚠️ FAQ count does not match visible content');
        }
      }
    } catch (e) {
      console.error('Error checking FAQ count:', e);
    }
  }
  
  return results;
})();

