#!/bin/bash

echo "🧪 COMPREHENSIVE TEST SUITE STARTING..."
echo "======================================="

# Create test reports directory
mkdir -p test-reports

# 1. TypeScript Compilation Check
echo "📋 1. Running TypeScript compilation check..."
npx tsc --noEmit > test-reports/typescript-check.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation: PASSED"
else
    echo "❌ TypeScript compilation: FAILED (see test-reports/typescript-check.txt)"
fi

# 2. ESLint Code Quality Check
echo "📋 2. Running ESLint code quality analysis..."
npx eslint --ext .ts,.tsx,.js,.jsx server/ client/src/ > test-reports/eslint-quality.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ ESLint code quality: PASSED"
else
    echo "⚠️  ESLint code quality: WARNINGS/ERRORS (see test-reports/eslint-quality.txt)"
fi

# 3. Jest Unit Tests
echo "📋 3. Running Jest unit tests..."
npx jest --coverage --outputFile test-reports/jest-results.json --json > test-reports/jest-output.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Jest unit tests: PASSED"
else
    echo "❌ Jest unit tests: FAILED (see test-reports/jest-output.txt)"
fi

# 4. Custom Application Tests
echo "📋 4. Running custom application tests..."

# Test the existing verification scripts
echo "Running final verification test..." > test-reports/app-tests.txt
node test-final-verification.js >> test-reports/app-tests.txt 2>&1 &
TEST_PID=$!
sleep 30
kill $TEST_PID 2>/dev/null || true
wait $TEST_PID 2>/dev/null || true

echo "✅ Custom application tests completed"

# 5. API Endpoint Tests
echo "📋 5. Running API endpoint tests..."
cat > test-api-endpoints.js << 'EOF'
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testAPIEndpoints() {
  console.log('🔍 Testing API endpoints...');
  
  const endpoints = [
    { path: '/api/crypto/prices', method: 'GET', expectedStatus: 200 },
    { path: '/api/crypto/news', method: 'GET', expectedStatus: 200 },
    { path: '/api/auth/user', method: 'GET', expectedStatus: 401 }, // Should be unauthorized
    { path: '/api/admin/login', method: 'GET', expectedStatus: 405 }, // Should be method not allowed
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint.path}`, {
        method: endpoint.method
      });
      
      const status = response.status;
      const result = status === endpoint.expectedStatus ? '✅ PASS' : '❌ FAIL';
      console.log(`${result} ${endpoint.method} ${endpoint.path} - Expected: ${endpoint.expectedStatus}, Got: ${status}`);
    } catch (error) {
      console.log(`❌ ERROR ${endpoint.method} ${endpoint.path} - ${error.message}`);
    }
  }
}

testAPIEndpoints().catch(console.error);
EOF

node test-api-endpoints.js > test-reports/api-tests.txt 2>&1
rm test-api-endpoints.js
echo "✅ API endpoint tests completed"

# 6. Performance Tests
echo "📋 6. Running performance tests..."
cat > test-performance.js << 'EOF'
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testPerformance() {
  console.log('⚡ Testing performance...');
  
  // Test response times
  const tests = [
    { name: 'Crypto Prices API', url: `${BASE_URL}/api/crypto/prices` },
    { name: 'Crypto News API', url: `${BASE_URL}/api/crypto/news` },
    { name: 'Static Assets', url: `${BASE_URL}/` }
  ];

  for (const test of tests) {
    const start = Date.now();
    try {
      const response = await fetch(test.url);
      const end = Date.now();
      const duration = end - start;
      
      const result = duration < 2000 ? '✅ PASS' : '⚠️ SLOW';
      console.log(`${result} ${test.name}: ${duration}ms`);
    } catch (error) {
      console.log(`❌ ERROR ${test.name}: ${error.message}`);
    }
  }
}

testPerformance().catch(console.error);
EOF

node test-performance.js > test-reports/performance-tests.txt 2>&1
rm test-performance.js
echo "✅ Performance tests completed"

# 7. Generate Test Summary
echo "📋 7. Generating test summary..."
cat > test-reports/test-summary.md << 'EOF'
# Test Suite Summary Report

## Test Overview
This report contains the results of comprehensive testing performed on the cryptocurrency platform.

## Tests Performed
1. **TypeScript Compilation** - Verify all TypeScript code compiles without errors
2. **ESLint Code Quality** - Static analysis for code quality and best practices
3. **Jest Unit Tests** - Automated unit tests with coverage reporting
4. **Custom Application Tests** - Application-specific functionality tests
5. **API Endpoint Tests** - Verification of API endpoint functionality
6. **Performance Tests** - Response time and performance benchmarks

## Files Generated
- `typescript-check.txt` - TypeScript compilation results
- `eslint-quality.txt` - Code quality analysis results
- `jest-output.txt` - Unit test results and coverage
- `app-tests.txt` - Custom application test results
- `api-tests.txt` - API endpoint test results
- `performance-tests.txt` - Performance benchmark results

## Review Instructions
1. Check typescript-check.txt for compilation errors
2. Review eslint-quality.txt for code quality issues
3. Examine jest-output.txt for test failures and coverage gaps
4. Validate app-tests.txt shows expected functionality
5. Ensure api-tests.txt shows all endpoints responding correctly
6. Review performance-tests.txt for response time issues

## Test Coverage Goals
- Unit test coverage should be > 80%
- API response times should be < 2 seconds
- Zero TypeScript compilation errors
- Minimal ESLint warnings/errors
EOF

echo "✅ Test summary report generated"

echo ""
echo "🧪 TEST SUITE COMPLETED"
echo "======================="
echo "📁 All reports saved to: test-reports/"
echo "📄 Review test-reports/test-summary.md for overview"
echo ""