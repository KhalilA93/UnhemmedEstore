const https = require('https');
const http = require('http');

// Performance testing script for static vs database product loading
class PerformanceTester {
  constructor(baseUrl = 'http://localhost:3002') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async makeRequest(endpoint) {
    return new Promise((resolve, reject) => {
      const startTime = process.hrtime.bigint();
      const url = `${this.baseUrl}${endpoint}`;
      
      const protocol = url.startsWith('https') ? https : http;
      
      protocol.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const endTime = process.hrtime.bigint();
          const responseTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
          
          resolve({
            endpoint,
            statusCode: res.statusCode,
            responseTime,
            dataSize: Buffer.byteLength(data, 'utf8'),
            success: res.statusCode === 200
          });
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  async runTest(endpoint, iterations = 5) {
    console.log(`\n🧪 Testing ${endpoint} (${iterations} iterations)...`);
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
      try {
        const result = await this.makeRequest(endpoint);
        results.push(result);
        console.log(`  Iteration ${i + 1}: ${result.responseTime.toFixed(2)}ms`);
      } catch (error) {
        console.error(`  Iteration ${i + 1}: ERROR - ${error.message}`);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (results.length > 0) {
      const avgTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
      const minTime = Math.min(...results.map(r => r.responseTime));
      const maxTime = Math.max(...results.map(r => r.responseTime));
      
      console.log(`  ✅ Average: ${avgTime.toFixed(2)}ms | Min: ${minTime.toFixed(2)}ms | Max: ${maxTime.toFixed(2)}ms`);
      
      return {
        endpoint,
        iterations: results.length,
        averageTime: avgTime,
        minTime,
        maxTime,
        results
      };
    }
    
    return null;
  }

  async runAllTests() {
    console.log('🚀 Starting Performance Tests - STATIC MODE ONLY');
    console.log('=' .repeat(60));
    
    const endpoints = [
      '/api/products',
      '/api/products?category=Men',
      '/api/products?category=Women',
      '/api/products/featured',
      '/api/products/categories',
      '/api/products/search?q=shirt',
      '/',
      '/products',
      '/men',
      '/women'
    ];
    
    const testResults = [];
    
    for (const endpoint of endpoints) {
      const result = await this.runTest(endpoint, 5);
      if (result) {
        testResults.push(result);
      }
    }
    
    console.log('\n📊 PERFORMANCE SUMMARY - STATIC MODE');
    console.log('=' .repeat(60));
    
    testResults.forEach(result => {
      console.log(`${result.endpoint.padEnd(30)} | Avg: ${result.averageTime.toFixed(2)}ms | Min: ${result.minTime.toFixed(2)}ms | Max: ${result.maxTime.toFixed(2)}ms`);
    });
    
    const overallAvg = testResults.reduce((sum, r) => sum + r.averageTime, 0) / testResults.length;
    console.log(`\n🎯 Overall Average Response Time: ${overallAvg.toFixed(2)}ms`);
    
    console.log('\n💡 This baseline will help identify database performance bottlenecks when you re-enable the database.');
    console.log('💡 Compare these times with database-enabled mode to isolate the performance issue.');
    
    return testResults;
  }
}

// Run the tests
const tester = new PerformanceTester();
tester.runAllTests().catch(console.error);
