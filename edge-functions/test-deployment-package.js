/**
 * Check the deployment package for missing dependencies
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

console.log('=== Checking Deployment Package ===');

// Check what's in the dist/functions directory
const distPath = 'f:\\apps\\EO_vpn_co\\edge-functions\\dist\\functions';

function checkDirectory(path, level = 0) {
  const items = readdirSync(path, { withFileTypes: true });
  const indent = '  '.repeat(level);
  
  for (const item of items) {
    if (item.isDirectory()) {
      console.log(`${indent}📁 ${item.name}/`);
      checkDirectory(join(path, item.name), level + 1);
    } else {
      console.log(`${indent}📄 ${item.name}`);
      if (item.name.endsWith('.js')) {
        checkFileForIssues(join(path, item.name));
      }
    }
  }
}

function checkFileForIssues(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    
    // Check for potential issues
    const issues = [];
    
    if (content.includes('import') && !content.includes('import.meta')) {
      // Check for relative imports that might break
      const importMatches = content.match(/import\s+.*?from\s+['"](.*?)['"]/g) || [];
      for (const match of importMatches) {
        const importPath = match.match(/['"](.*?)['"]/)[1];
        if (importPath.startsWith('./') || importPath.startsWith('../')) {
          // This is a relative import, check if the file exists
          const resolvedPath = join(filePath, '..', importPath);
          try {
            require.resolve(resolvedPath);
          } catch (e) {
            issues.push(`Missing import: ${importPath}`);
          }
        }
      }
    }
    
    // Check for Node.js specific APIs that might not be available
    if (content.includes('require(') && !content.includes('require.resolve')) {
      issues.push('Uses require() instead of import');
    }
    
    if (content.includes('process.env') && !content.includes('env.')) {
      issues.push('Uses process.env instead of env parameter');
    }
    
    if (content.includes('Buffer') && !content.includes('ArrayBuffer')) {
      issues.push('Uses Node.js Buffer');
    }
    
    if (content.includes('fs.') || content.includes('path.')) {
      issues.push('Uses Node.js fs/path modules');
    }
    
    if (content.includes('console.log') || content.includes('console.error')) {
      // This is actually OK for debugging, but let's note it
      // issues.push('Contains console statements');
    }
    
    if (issues.length > 0) {
      console.log(`    ⚠️  Issues in ${filePath}:`, issues);
    }
    
  } catch (error) {
    console.error(`❌ Error checking ${filePath}:`, error.message);
  }
}

console.log('Checking deployment package structure...');
checkDirectory(distPath);

console.log('\n=== Checking for Common EdgeOne Functions Issues ===');

// Check for common issues that cause 545 errors
const commonIssues = [
  {
    name: 'Missing JWT_SECRET handling',
    check: (content) => content.includes('JWT_SECRET') && !content.includes('!JWT_SECRET'),
    severity: 'high'
  },
  {
    name: 'Unhandled promise rejections',
    check: (content) => content.includes('async') && !content.includes('try') && !content.includes('catch'),
    severity: 'medium'
  },
  {
    name: 'Missing error handling in middleware',
    check: (content) => content.includes('middleware') && !content.includes('catch'),
    severity: 'high'
  },
  {
    name: 'Using Node.js specific APIs',
    check: (content) => content.includes('process.') || content.includes('Buffer') || content.includes('require('),
    severity: 'critical'
  }
];

console.log('Checking for common EdgeOne Functions issues...');

// Check key files
const keyFiles = [
  'f:\\apps\\EO_vpn_co\\edge-functions\\dist\\functions\\api\\proxy\\auth.js',
  'f:\\apps\\EO_vpn_co\\edge-functions\\dist\\functions\\api\\subscription\\status.js',
  'f:\\apps\\EO_vpn_co\\edge-functions\\dist\\functions\\lib\\middleware.js',
  'f:\\apps\\EO_vpn_co\\edge-functions\\dist\\functions\\lib\\auth-simple.js'
];

for (const filePath of keyFiles) {
  try {
    const content = readFileSync(filePath, 'utf8');
    console.log(`\n📋 Checking ${filePath}:`);
    
    for (const issue of commonIssues) {
      if (issue.check(content)) {
        console.log(`  ${issue.severity === 'critical' ? '❌' : '⚠️'} ${issue.name} (${issue.severity})`);
      }
    }
    
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
  }
}

console.log('\n=== Deployment Package Analysis Complete ===');