/**
 * Document Validation Script
 * Validates project documentation meets quality standards
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const isStrict = args.includes('--strict');

const requiredDocs = [
  'README.md',
  'ARCHITECTURE.md',
  'DESIGN_SYSTEM_AND_DOC_INDEX.md',
  'DIRECTORY_TREE_TEMPLATE.md',
];

const projectDocs = [
  'documentation-standards/projects/damieus-awwwards-poc/USER_JOURNEY_DOCUMENT.md',
  'documentation-standards/projects/damieus-awwwards-poc/DESIGN_SYSTEM_AND_DOC_INDEX.md',
  'documentation-standards/projects/damieus-awwwards-poc/DIRECTORY_TREE_TEMPLATE.md',
];

console.log('📋 Validating Documentation...\n');

let passed = 0;
let failed = 0;

// Check project root docs
requiredDocs.forEach((doc) => {
  const filePath = path.join(__dirname, '..', doc);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${doc}`);
    passed++;
  } else {
    console.log(`❌ ${doc} - NOT FOUND`);
    failed++;
  }
});

console.log(`\n📚 Project Documentation:\n`);

// Check project-specific docs in documentation-standards
projectDocs.forEach((doc) => {
  const basePath = path.join(__dirname, '../..', doc);
  const exists = fs.existsSync(basePath);
  if (exists) {
    console.log(`✅ ${path.basename(doc)}`);
    passed++;
  } else {
    console.log(`⚠️  ${path.basename(doc)} - Not in documentation-standards`);
  }
});

console.log(`\n${passed} passed, ${failed} failed\n`);

if (isStrict && failed > 0) {
  process.exit(1);
}

if (failed === 0) {
  console.log('✅ All documentation checks passed!');
  process.exit(0);
} else {
  console.log('⚠️  Some documentation is missing.');
  process.exit(failed > 0 && isStrict ? 1 : 0);
}
