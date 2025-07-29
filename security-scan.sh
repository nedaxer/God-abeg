#!/bin/bash

echo "🔒 COMPREHENSIVE SECURITY SCAN STARTING..."
echo "=========================================="

# Create reports directory
mkdir -p security-reports

# 1. ESLint Security Scan
echo "📋 1. Running ESLint Security Analysis..."
npx eslint --ext .ts,.tsx,.js,.jsx server/ client/src/ --format json > security-reports/eslint-security.json 2>/dev/null || true
npx eslint --ext .ts,.tsx,.js,.jsx server/ client/src/ > security-reports/eslint-security.txt 2>/dev/null || true
echo "✅ ESLint security scan completed"

# 2. NPM Audit
echo "📋 2. Running NPM Audit..."
npm audit --json > security-reports/npm-audit.json 2>/dev/null || true
npm audit > security-reports/npm-audit.txt 2>/dev/null || true
echo "✅ NPM audit completed"

# 3. Retire.js (JavaScript vulnerability scanner)
echo "📋 3. Running Retire.js vulnerability scan..."
npx retire --outputformat json --outputpath security-reports/retire-js.json . 2>/dev/null || true
npx retire --outputpath security-reports/retire-js.txt . 2>/dev/null || true
echo "✅ Retire.js scan completed"

# 4. Dependency Check
echo "📋 4. Running dependency analysis..."
npm ls --depth=0 > security-reports/dependencies.txt 2>/dev/null || true
npm outdated > security-reports/outdated-packages.txt 2>/dev/null || true
echo "✅ Dependency analysis completed"

# 5. Custom Security Checks
echo "📋 5. Running custom security checks..."

# Check for hardcoded secrets
echo "Checking for hardcoded secrets..." > security-reports/hardcoded-secrets.txt
grep -r -i "password\s*=\s*['\"]" server/ client/src/ >> security-reports/hardcoded-secrets.txt 2>/dev/null || true
grep -r -i "api_key\s*=\s*['\"]" server/ client/src/ >> security-reports/hardcoded-secrets.txt 2>/dev/null || true
grep -r -i "secret\s*=\s*['\"]" server/ client/src/ >> security-reports/hardcoded-secrets.txt 2>/dev/null || true
grep -r -i "token\s*=\s*['\"]" server/ client/src/ >> security-reports/hardcoded-secrets.txt 2>/dev/null || true

# Check for console.log statements in production code
echo "Checking for console.log statements..." > security-reports/console-logs.txt
grep -r "console\.log" server/ client/src/ >> security-reports/console-logs.txt 2>/dev/null || true

# Check for eval usage
echo "Checking for eval usage..." > security-reports/eval-usage.txt
grep -r "eval(" server/ client/src/ >> security-reports/eval-usage.txt 2>/dev/null || true

# Check for unsafe innerHTML usage
echo "Checking for unsafe innerHTML usage..." > security-reports/innerHTML-usage.txt
grep -r "innerHTML" client/src/ >> security-reports/innerHTML-usage.txt 2>/dev/null || true

echo "✅ Custom security checks completed"

# 6. Generate Summary Report
echo "📋 6. Generating summary report..."
cat > security-reports/security-summary.md << 'EOF'
# Security Scan Summary Report

## Scan Overview
This report contains the results of a comprehensive security analysis performed on the cryptocurrency platform.

## Scans Performed
1. **ESLint Security Analysis** - Static code analysis for security vulnerabilities
2. **NPM Audit** - Check for known vulnerabilities in dependencies
3. **Retire.js** - JavaScript library vulnerability scanner
4. **Dependency Analysis** - Review of project dependencies and outdated packages
5. **Custom Security Checks** - Application-specific security patterns

## Files Generated
- `eslint-security.json/txt` - ESLint security findings
- `npm-audit.json/txt` - NPM audit results
- `retire-js.json/txt` - Retire.js vulnerability findings
- `dependencies.txt` - Current dependency tree
- `outdated-packages.txt` - Outdated package information
- `hardcoded-secrets.txt` - Potential hardcoded sensitive data
- `console-logs.txt` - Console.log statements in code
- `eval-usage.txt` - Dangerous eval() usage
- `innerHTML-usage.txt` - Potential XSS vulnerabilities

## Review Instructions
1. Check npm-audit.txt for critical and high severity vulnerabilities
2. Review eslint-security.txt for security-related code issues
3. Examine hardcoded-secrets.txt for any exposed sensitive information
4. Validate that console-logs.txt entries are appropriate for production
5. Ensure eval-usage.txt and innerHTML-usage.txt show no unsafe patterns

## Recommended Actions
- Fix all critical and high severity vulnerabilities immediately
- Implement proper secret management
- Remove or secure console.log statements
- Replace innerHTML with safer alternatives like textContent
- Update outdated packages with security patches
EOF

echo "✅ Security summary report generated"

echo ""
echo "🔒 SECURITY SCAN COMPLETED"
echo "=========================="
echo "📁 All reports saved to: security-reports/"
echo "📄 Review security-reports/security-summary.md for overview"
echo ""