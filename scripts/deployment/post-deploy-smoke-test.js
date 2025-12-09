/**
 * Post-Deployment Smoke Test
 * 
 * Verifies application is running correctly after deployment
 * Tests critical functionality and user journeys
 */

class PostDeploymentSmokeTest {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  /**
   * Add test result
   */
  addResult(name, status, message) {
    this.results.tests.push({ name, status, message });
    if (status === 'passed') {
      this.results.passed++;
    } else {
      this.results.failed++;
    }
  }

  /**
   * Test health endpoint
   */
  async testHealthEndpoint() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      if (response.ok) {
        this.addResult('Health Endpoint', 'passed', 'API health check passed');
        return true;
      }
      this.addResult('Health Endpoint', 'failed', `Status ${response.status}`);
      return false;
    } catch (error) {
      this.addResult('Health Endpoint', 'failed', error.message);
      return false;
    }
  }

  /**
   * Test home page loads
   */
  async testHomePage() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        this.addResult('Home Page Load', 'failed', `Status ${response.status}`);
        return false;
      }
      const html = await response.text();
      if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
        this.addResult('Home Page Load', 'failed', 'Invalid HTML response');
        return false;
      }
      this.addResult('Home Page Load', 'passed', 'Home page loads successfully');
      return true;
    } catch (error) {
      this.addResult('Home Page Load', 'failed', error.message);
      return false;
    }
  }

  /**
   * Test API connectivity
   */
  async testAPIConnectivity() {
    try {
      const response = await fetch(`${this.baseUrl}/api/test`);
      // 404 is OK - we just want to verify API responds
      if (response.status === 404 || response.ok) {
        this.addResult('API Connectivity', 'passed', 'API is responding');
        return true;
      }
      this.addResult('API Connectivity', 'failed', `Status ${response.status}`);
      return false;
    } catch (error) {
      this.addResult('API Connectivity', 'failed', error.message);
      return false;
    }
  }

  /**
   * Test static assets
   */
  async testStaticAssets() {
    try {
      const response = await fetch(`${this.baseUrl}/index.html`);
      if (response.ok) {
        this.addResult('Static Assets', 'passed', 'Static assets are served');
        return true;
      }
      this.addResult('Static Assets', 'failed', `Status ${response.status}`);
      return false;
    } catch (error) {
      this.addResult('Static Assets', 'failed', error.message);
      return false;
    }
  }

  /**
   * Test response headers
   */
  async testResponseHeaders() {
    try {
      const response = await fetch(this.baseUrl);
      const contentType = response.headers.get('content-type');
      
      if (!contentType) {
        this.addResult('Response Headers', 'warning', 'Missing Content-Type header');
        return true;
      }

      if (contentType.includes('text/html')) {
        this.addResult('Response Headers', 'passed', 'Correct Content-Type header');
        return true;
      }

      this.addResult('Response Headers', 'failed', `Unexpected Content-Type: ${contentType}`);
      return false;
    } catch (error) {
      this.addResult('Response Headers', 'failed', error.message);
      return false;
    }
  }

  /**
   * Test error handling
   */
  async testErrorHandling() {
    try {
      const response = await fetch(`${this.baseUrl}/nonexistent-page`);
      
      // Should return 404
      if (response.status === 404) {
        this.addResult('Error Handling', 'passed', '404 errors handled correctly');
        return true;
      }

      // Or serve SPA fallback
      if (response.ok) {
        this.addResult('Error Handling', 'passed', '404 redirected to SPA (fallback)');
        return true;
      }

      this.addResult('Error Handling', 'failed', `Unexpected status: ${response.status}`);
      return false;
    } catch (error) {
      this.addResult('Error Handling', 'failed', error.message);
      return false;
    }
  }

  /**
   * Run all smoke tests
   */
  async runAllTests() {
    console.log(`\n🔥 SMOKE TESTS (${this.baseUrl})\n`);

    await this.testHealthEndpoint();
    await this.testHomePage();
    await this.testAPIConnectivity();
    await this.testStaticAssets();
    await this.testResponseHeaders();
    await this.testErrorHandling();

    return this.generateReport();
  }

  /**
   * Generate test report
   */
  generateReport() {
    const total = this.results.passed + this.results.failed;
    const percentage = total > 0 ? Math.round((this.results.passed / total) * 100) : 0;

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${this.results.passed}/${total} passed (${percentage}%)`);
    console.log('='.repeat(50) + '\n');

    this.results.tests.forEach(test => {
      const icon = test.status === 'passed' ? '✓' : '✗';
      console.log(`${icon} ${test.name}: ${test.message}`);
    });

    console.log('');

    const report = {
      success: this.results.failed === 0,
      summary: `${this.results.passed}/${total} tests passed`,
      passed: this.results.passed,
      failed: this.results.failed,
      details: this.results.tests
    };

    if (report.success) {
      console.log('✅ All smoke tests passed - deployment successful!\n');
    } else {
      console.log('❌ Some tests failed - check deployment\n');
    }

    return report;
  }
}

export default PostDeploymentSmokeTest;

// Run if executed directly (for Node.js environment)
if (import.meta.url === `file://${process.argv[1]}`) {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  const tester = new PostDeploymentSmokeTest(baseUrl);
  
  tester.runAllTests().then(report => {
    process.exit(report.success ? 0 : 1);
  }).catch(error => {
    console.error('Test error:', error);
    process.exit(1);
  });
}
