# WAR ROOM TESTING STRATEGY
**Version**: 1.0  
**Date**: September 1, 2025  
**Target Coverage**: 80% minimum  
**Philosophy**: Test Everything, Trust Nothing, Ship Confidently  

## 1. TESTING PHILOSOPHY

### Core Principles
1. **Prevention Over Detection**: Tests prevent bugs from reaching production
2. **Fast Feedback**: Tests run in seconds, not minutes
3. **Confidence Through Coverage**: 80% coverage minimum
4. **Real-World Scenarios**: Test actual user workflows
5. **Continuous Testing**: Every commit, every deploy

### Testing Pyramid
```
         /\
        /E2E\        5% - Critical user journeys
       /------\
      /  Integ  \    15% - API & service integration  
     /------------\
    /     Unit     \ 80% - Component & function logic
   /----------------\
```

## 2. UNIT TESTING

### 2.1 Frontend Unit Tests (Vitest)
```typescript
// Component testing example
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { SWOTRadar } from '../components/SWOTRadar';

describe('SWOTRadar Component', () => {
  const mockData = {
    strengths: [{ label: 'Strong support', value: 75 }],
    weaknesses: [{ label: 'Low funding', value: 45 }],
    opportunities: [{ label: 'Viral moment', value: 80 }],
    threats: [{ label: 'Scandal risk', value: 60 }]
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('renders with mock data', () => {
    render(<SWOTRadar data={mockData} />);
    
    expect(screen.getByText('Strong support')).toBeInTheDocument();
    expect(screen.getByText('Low funding')).toBeInTheDocument();
  });
  
  test('updates when data changes', async () => {
    const { rerender } = render(<SWOTRadar data={mockData} />);
    
    const newData = {
      ...mockData,
      strengths: [{ label: 'New strength', value: 90 }]
    };
    
    rerender(<SWOTRadar data={newData} />);
    
    await waitFor(() => {
      expect(screen.getByText('New strength')).toBeInTheDocument();
    });
  });
  
  test('handles empty data gracefully', () => {
    render(<SWOTRadar data={null} />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
  
  test('triggers drill-down on click', async () => {
    const onDrillDown = vi.fn();
    render(<SWOTRadar data={mockData} onDrillDown={onDrillDown} />);
    
    const strengthSection = screen.getByTestId('swot-strengths');
    fireEvent.click(strengthSection);
    
    expect(onDrillDown).toHaveBeenCalledWith('strengths', mockData.strengths);
  });
});
```

### 2.2 Service Testing
```typescript
// Service unit tests
import { MentionlyticsService } from '../services/mentionlyticsService';
import { vi } from 'vitest';

describe('MentionlyticsService', () => {
  let service: MentionlyticsService;
  let fetchMock: any;
  
  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
    service = new MentionlyticsService();
  });
  
  describe('getSentiment', () => {
    test('returns sentiment data on success', async () => {
      const mockResponse = {
        positive: 45,
        negative: 30,
        neutral: 25
      };
      
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await service.getSentiment();
      
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/sentiment'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
    });
    
    test('handles pagination correctly', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ mentions: [], hasMore: true })
      });
      
      const result = await service.getMentions(0);
      
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('limit=50&page_no=0'),
        expect.any(Object)
      );
    });
    
    test('throws on API error', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401
      });
      
      await expect(service.getSentiment()).rejects.toThrow('401');
    });
    
    test('retries on network failure', async () => {
      fetchMock
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sentiment: 'positive' })
        });
      
      const result = await service.getSentiment();
      
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ sentiment: 'positive' });
    });
  });
});
```

### 2.3 Redux Store Testing
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { campaignSlice } from '../store/campaignSlice';

describe('Campaign Redux Store', () => {
  let store: any;
  
  beforeEach(() => {
    store = configureStore({
      reducer: {
        campaign: campaignSlice.reducer
      }
    });
  });
  
  test('initial state', () => {
    const state = store.getState().campaign;
    
    expect(state).toEqual({
      current: null,
      loading: false,
      error: null,
      setupComplete: false
    });
  });
  
  test('handles campaign setup', () => {
    const campaignData = {
      name: 'Test Campaign',
      candidate: 'John Doe',
      keywords: ['election', 'change']
    };
    
    store.dispatch(campaignSlice.actions.setupCampaign(campaignData));
    
    const state = store.getState().campaign;
    expect(state.current).toEqual(campaignData);
    expect(state.setupComplete).toBe(true);
  });
  
  test('handles async loading states', async () => {
    store.dispatch(campaignSlice.actions.fetchStart());
    expect(store.getState().campaign.loading).toBe(true);
    
    store.dispatch(campaignSlice.actions.fetchSuccess({ id: 1 }));
    expect(store.getState().campaign.loading).toBe(false);
    expect(store.getState().campaign.current).toEqual({ id: 1 });
  });
});
```

## 3. INTEGRATION TESTING

### 3.1 API Integration Tests
```typescript
import request from 'supertest';
import { app } from '../app';
import { database } from '../database';

describe('API Integration Tests', () => {
  beforeAll(async () => {
    await database.migrate.latest();
  });
  
  afterAll(async () => {
    await database.destroy();
  });
  
  describe('POST /api/campaigns', () => {
    test('creates campaign with valid data', async () => {
      const campaignData = {
        name: 'Test Campaign 2024',
        candidateName: 'Jane Smith',
        party: 'Independent',
        keywords: ['reform', 'progress']
      };
      
      const response = await request(app)
        .post('/api/campaigns')
        .set('Authorization', 'Bearer valid-token')
        .send(campaignData)
        .expect(201);
      
      expect(response.body).toMatchObject({
        id: expect.any(String),
        ...campaignData
      });
      
      // Verify in database
      const campaign = await database('campaigns')
        .where({ id: response.body.id })
        .first();
      
      expect(campaign).toBeTruthy();
    });
    
    test('validates required fields', async () => {
      const response = await request(app)
        .post('/api/campaigns')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Only Name' })
        .expect(400);
      
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'candidateName',
          message: expect.stringContaining('required')
        })
      );
    });
    
    test('requires authentication', async () => {
      await request(app)
        .post('/api/campaigns')
        .send({ name: 'Test' })
        .expect(401);
    });
  });
  
  describe('Mentionlytics Integration', () => {
    test('proxies requests correctly', async () => {
      const response = await request(app)
        .get('/api/mentionlytics/sentiment')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);
      
      expect(response.body).toHaveProperty('positive');
      expect(response.body).toHaveProperty('negative');
      expect(response.body).toHaveProperty('neutral');
    });
    
    test('handles Mentionlytics errors gracefully', async () => {
      // Simulate Mentionlytics being down
      process.env.MENTIONLYTICS_API_URL = 'http://invalid-url';
      
      const response = await request(app)
        .get('/api/mentionlytics/sentiment')
        .set('Authorization', 'Bearer valid-token')
        .expect(200); // Should still return 200 with mock data
      
      expect(response.body.mock).toBe(true);
    });
  });
});
```

### 3.2 WebSocket Integration Tests
```typescript
import { io, Socket } from 'socket.io-client';
import { server } from '../server';

describe('WebSocket Integration', () => {
  let clientSocket: Socket;
  let serverSocket: any;
  
  beforeAll((done) => {
    server.listen(() => {
      const port = server.address().port;
      clientSocket = io(`http://localhost:${port}`, {
        auth: {
          token: 'valid-jwt-token'
        }
      });
      
      server.on('connection', (socket) => {
        serverSocket = socket;
      });
      
      clientSocket.on('connect', done);
    });
  });
  
  afterAll(() => {
    server.close();
    clientSocket.close();
  });
  
  test('receives real-time updates', (done) => {
    clientSocket.on('crisis-alert', (data) => {
      expect(data).toEqual({
        type: 'crisis',
        severity: 'high',
        message: 'Test crisis'
      });
      done();
    });
    
    serverSocket.emit('crisis-alert', {
      type: 'crisis',
      severity: 'high',
      message: 'Test crisis'
    });
  });
  
  test('heartbeat keeps connection alive', (done) => {
    let heartbeatCount = 0;
    
    clientSocket.on('heartbeat', () => {
      heartbeatCount++;
      if (heartbeatCount === 2) {
        expect(heartbeatCount).toBe(2);
        done();
      }
    });
    
    // Trigger heartbeats
    setInterval(() => {
      clientSocket.emit('heartbeat');
    }, 100);
  });
});
```

## 4. END-TO-END TESTING

### 4.1 Critical User Journeys (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test.describe('War Room E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });
  
  test('New user onboarding flow', async ({ page }) => {
    // 1. Sign up
    await page.click('text=Get Started');
    await page.fill('[name=email]', 'test@campaign.com');
    await page.fill('[name=password]', 'SecurePass123!');
    await page.click('button[type=submit]');
    
    // 2. Campaign setup should trigger
    await expect(page.locator('.campaign-setup-modal')).toBeVisible();
    
    // 3. Complete campaign setup
    await page.fill('[name=campaignName]', 'Test Campaign 2024');
    await page.fill('[name=candidateName]', 'John Doe');
    await page.selectOption('[name=party]', 'independent');
    
    // Add keywords
    await page.fill('[name=keyword]', 'reform');
    await page.press('[name=keyword]', 'Enter');
    await page.fill('[name=keyword]', 'change');
    await page.press('[name=keyword]', 'Enter');
    
    // Add opponent
    await page.click('text=Add Opponent');
    await page.fill('[name=opponentName]', 'Jane Smith');
    
    await page.click('text=Complete Setup');
    
    // 4. Verify dashboard loads with data
    await expect(page.locator('.dashboard')).toBeVisible();
    await expect(page.locator('.swot-radar')).toBeVisible();
    await expect(page.locator('.ticker-tape')).toBeVisible();
  });
  
  test('Crisis alert flow', async ({ page }) => {
    // Login
    await loginAsTestUser(page);
    
    // Trigger test crisis
    await page.evaluate(() => {
      fetch('/api/crisis/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Scandal breaking',
          severity: 'critical'
        })
      });
    });
    
    // Verify alert appears
    await expect(page.locator('.crisis-alert')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.crisis-alert')).toContainText('Scandal breaking');
    
    // Verify SMS notification badge
    await expect(page.locator('.notification-badge')).toContainText('1');
    
    // Respond to crisis
    await page.click('.crisis-alert');
    await page.click('text=Respond Now');
    await page.selectOption('[name=template]', 'denial');
    await page.click('text=Send Response');
    
    // Verify response sent
    await expect(page.locator('.toast-success')).toContainText('Response sent');
  });
  
  test('Live data toggle', async ({ page }) => {
    await loginAsTestUser(page);
    
    // Verify mock mode indicator
    await expect(page.locator('.data-mode-indicator')).toContainText('MOCK');
    
    // Toggle to live mode
    await page.click('.data-mode-toggle');
    
    // Verify switch to live
    await expect(page.locator('.data-mode-indicator')).toContainText('LIVE');
    
    // Verify data updates
    await page.waitForResponse('**/api/mentionlytics/**');
    await expect(page.locator('.sentiment-value')).not.toContainText('--');
  });
});

async function loginAsTestUser(page: any) {
  await page.fill('[name=email]', 'test@warroom.app');
  await page.fill('[name=password]', 'TestPass123!');
  await page.click('button[type=submit]');
  await page.waitForURL('**/dashboard');
}
```

### 4.2 Performance Testing
```typescript
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('Dashboard loads within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
    
    // Verify all critical elements loaded
    await expect(page.locator('.dashboard-kpis')).toBeVisible();
    await expect(page.locator('.swot-radar')).toBeVisible();
    await expect(page.locator('.ticker-tape')).toBeVisible();
  });
  
  test('API responses within 500ms', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    
    const responseTime = await page.evaluate(async () => {
      const start = performance.now();
      await fetch('/api/mentionlytics/sentiment');
      return performance.now() - start;
    });
    
    expect(responseTime).toBeLessThan(500);
  });
  
  test('Handles 100 concurrent WebSocket connections', async ({ page }) => {
    const connections = [];
    
    for (let i = 0; i < 100; i++) {
      const ws = await page.evaluateHandle(() => {
        return new WebSocket('ws://localhost:5173/ws');
      });
      connections.push(ws);
    }
    
    // Wait for all connections
    await page.waitForTimeout(2000);
    
    // Verify all connected
    for (const ws of connections) {
      const state = await ws.evaluate(w => w.readyState);
      expect(state).toBe(1); // OPEN
    }
  });
});
```

## 5. SECURITY TESTING

### 5.1 Security Test Suite
```typescript
describe('Security Tests', () => {
  test('prevents SQL injection', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const response = await request(app)
      .get(`/api/search?q=${encodeURIComponent(maliciousInput)}`)
      .expect(200);
    
    // Should return empty results, not error
    expect(response.body.results).toEqual([]);
    
    // Verify table still exists
    const tableExists = await database.schema.hasTable('users');
    expect(tableExists).toBe(true);
  });
  
  test('prevents XSS attacks', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    
    const response = await request(app)
      .post('/api/campaigns')
      .set('Authorization', 'Bearer valid-token')
      .send({
        name: xssPayload,
        candidateName: 'Test'
      })
      .expect(201);
    
    // Verify payload is escaped
    expect(response.body.name).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
  });
  
  test('enforces rate limiting', async () => {
    const requests = [];
    
    // Make 6 requests (limit is 5)
    for (let i = 0; i < 6; i++) {
      requests.push(
        request(app)
          .post('/api/auth/login')
          .send({ email: 'test@test.com', password: 'wrong' })
      );
    }
    
    const responses = await Promise.all(requests);
    const lastResponse = responses[5];
    
    expect(lastResponse.status).toBe(429);
    expect(lastResponse.body.error).toContain('Too many requests');
  });
  
  test('validates JWT tokens', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid';
    
    await request(app)
      .get('/api/campaigns')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);
  });
});
```

## 6. LOAD TESTING

### 6.1 Load Test Configuration (k6)
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Spike to 200
    { duration: '5m', target: 200 },  // Stay at 200
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    errors: ['rate<0.1'],              // Error rate under 10%
  },
};

export default function () {
  // Test dashboard load
  const dashboardRes = http.get('http://localhost:5173/api/dashboard');
  check(dashboardRes, {
    'dashboard status 200': (r) => r.status === 200,
    'dashboard response time OK': (r) => r.timings.duration < 500,
  });
  errorRate.add(dashboardRes.status !== 200);
  
  // Test Mentionlytics API
  const mentionRes = http.get('http://localhost:5173/api/mentionlytics/sentiment');
  check(mentionRes, {
    'mentions status 200': (r) => r.status === 200,
  });
  
  // Simulate WebSocket connection
  const ws = http.ws('ws://localhost:5173/ws');
  ws.on('open', () => {
    ws.send(JSON.stringify({ type: 'HEARTBEAT' }));
  });
  
  sleep(1);
}
```

## 7. TEST AUTOMATION

### 7.1 CI/CD Pipeline (GitHub Actions)
```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit
        env:
          CI: true
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost/testdb
          REDIS_URL: redis://localhost:6379
      
      - name: Run E2E tests
        run: |
          npm run build
          npm run preview &
          npx wait-on http://localhost:5173
          npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
      
      - name: Check coverage threshold
        run: |
          coverage=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$coverage < 80" | bc -l) )); then
            echo "Coverage is below 80%: $coverage%"
            exit 1
          fi
```

### 7.2 Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run test:unit"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "vitest related --run"
    ]
  }
}
```

## 8. TEST DATA MANAGEMENT

### 8.1 Test Data Factories
```typescript
import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

const CampaignFactory = Factory.define(({ sequence }) => ({
  id: sequence,
  name: faker.company.name() + ' Campaign 2024',
  candidateName: faker.person.fullName(),
  party: faker.helpers.arrayElement(['Democrat', 'Republican', 'Independent']),
  keywords: faker.helpers.arrayElements([
    'reform', 'change', 'progress', 'security', 'economy'
  ], 3),
  setupComplete: true,
  createdAt: faker.date.recent()
}));

const MentionFactory = Factory.define(() => ({
  id: faker.string.uuid(),
  text: faker.lorem.paragraph(),
  sentiment: faker.helpers.arrayElement(['positive', 'negative', 'neutral']),
  source: faker.helpers.arrayElement(['twitter', 'facebook', 'news']),
  author: faker.internet.userName(),
  reach: faker.number.int({ min: 100, max: 10000 }),
  timestamp: faker.date.recent()
}));

// Usage in tests
const campaign = CampaignFactory.build();
const mentions = MentionFactory.buildList(50);
```

### 8.2 Database Seeding
```typescript
class TestSeeder {
  async seed() {
    // Clear existing data
    await database('campaigns').del();
    await database('users').del();
    
    // Create test users
    const users = await database('users').insert([
      {
        email: 'admin@warroom.app',
        password: await hash('admin123'),
        role: 'admin'
      },
      {
        email: 'user@warroom.app',
        password: await hash('user123'),
        role: 'user'
      }
    ]).returning('*');
    
    // Create test campaigns
    const campaigns = await database('campaigns').insert(
      CampaignFactory.buildList(5).map(c => ({
        ...c,
        user_id: users[0].id
      }))
    ).returning('*');
    
    // Add test mentions
    for (const campaign of campaigns) {
      await database('mentions').insert(
        MentionFactory.buildList(100).map(m => ({
          ...m,
          campaign_id: campaign.id
        }))
      );
    }
  }
}
```

## 9. TEST REPORTING

### 9.1 Coverage Reports
```typescript
// vitest.config.ts
export default {
  test: {
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        '*.config.js',
        '**/types/**'
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
};
```

### 9.2 Test Results Dashboard
```html
<!-- test-results.html -->
<!DOCTYPE html>
<html>
<head>
  <title>War Room Test Results</title>
</head>
<body>
  <h1>Test Results Dashboard</h1>
  
  <div class="metrics">
    <div class="metric">
      <h3>Coverage</h3>
      <div class="coverage-bar" data-percent="85">85%</div>
    </div>
    
    <div class="metric">
      <h3>Tests Passed</h3>
      <div class="test-count">245/250</div>
    </div>
    
    <div class="metric">
      <h3>Performance</h3>
      <div class="perf-score">92/100</div>
    </div>
  </div>
  
  <div class="recent-runs">
    <h2>Recent Test Runs</h2>
    <table>
      <tr>
        <th>Commit</th>
        <th>Branch</th>
        <th>Status</th>
        <th>Coverage</th>
        <th>Duration</th>
      </tr>
      <!-- Test run data -->
    </table>
  </div>
</body>
</html>
```

## 10. TESTING CHECKLIST

### Before Commit
- [ ] All unit tests pass
- [ ] Coverage above 80%
- [ ] No linting errors
- [ ] Type checking passes

### Before Merge
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Security tests pass
- [ ] Performance benchmarks met

### Before Deploy
- [ ] Full test suite passes
- [ ] Load tests successful
- [ ] Manual smoke test completed
- [ ] Rollback plan tested

### After Deploy
- [ ] Production smoke tests
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify critical flows

## 11. TESTING COMMANDS

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run security tests
npm run test:security

# Run load tests
npm run test:load

# Watch mode for development
npm run test:watch

# Run specific test file
npm test -- SWOTRadar.test.tsx

# Run tests matching pattern
npm test -- --grep "crisis"

# Update snapshots
npm test -- -u
```

---

**Remember**: A test is not just about finding bugs - it's about building confidence. Every test you write is a promise that the feature will work tomorrow, next week, and next year.

*"Code without tests is broken by design."*