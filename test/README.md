# Watchlist Items Test Data

## Test Data Overview

This directory contains test data and test cases for the WatchlistItem CRUD API endpoints.

## Test Data Files

### fixtures/watchlist-items.json
Contains organized test data for different scenarios:
- `validItems`: Sample valid watchlist items for seeding the database
- `createPayloads`: Test data for CREATE operations
- `updatePayloads`: Test data for UPDATE operations
- `invalidItems`: Test data for validation error testing

## Running Tests

### Using Mocha
```bash
npm test
```

### Individual Test Suites
```bash
# Run only CREATE tests
npx mocha test/watchlist-items.test.js --grep "CREATE"

# Run only READ tests
npx mocha test/watchlist-items.test.js --grep "READ"

# Run only UPDATE tests
npx mocha test/watchlist-items.test.js --grep "UPDATE"

# Run only DELETE tests
npx mocha test/watchlist-items.test.js --grep "DELETE"
```

## API Endpoints Reference

### CREATE a new watchlist item
```bash
POST /api/watchlist-items
Content-Type: application/json

{
  "symbol": "AAPL",
  "userId": 1
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "symbol": "AAPL",
  "userId": 1,
  "addedAt": "2026-03-26T10:00:00.000Z"
}
```

### READ all watchlist items
```bash
GET /api/watchlist-items
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "symbol": "AAPL",
    "userId": 1,
    "addedAt": "2026-03-26T10:00:00.000Z"
  },
  {
    "id": 2,
    "symbol": "GOOGL",
    "userId": 1,
    "addedAt": "2026-03-26T11:00:00.000Z"
  }
]
```

### READ a specific watchlist item
```bash
GET /api/watchlist-items/{id}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "symbol": "AAPL",
  "userId": 1,
  "addedAt": "2026-03-26T10:00:00.000Z"
}
```

### READ with filtering by userId
```bash
GET /api/watchlist-items?filter={"where":{"userId":1}}
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "symbol": "AAPL",
    "userId": 1,
    "addedAt": "2026-03-26T10:00:00.000Z"
  }
]
```

### UPDATE a watchlist item
```bash
PATCH /api/watchlist-items/{id}
Content-Type: application/json

{
  "symbol": "GOOGL",
  "userId": 2
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "symbol": "GOOGL",
  "userId": 2,
  "addedAt": "2026-03-26T10:00:00.000Z"
}
```

### DELETE a watchlist item
```bash
DELETE /api/watchlist-items/{id}
```

**Expected Response (204 No Content):**
Empty body

## Test Scenarios

### Valid Test Cases
1. Create item with lowercase symbol (should convert to uppercase)
2. Create item with uppercase symbol
3. Create item without addedAt (should auto-generate)
4. Update symbol field
5. Update userId field
6. Delete existing item
7. Filter items by userId
8. Retrieve all items
9. Retrieve specific item by id

### Invalid Test Cases
1. Create without required symbol field → 422 Validation Error
2. Create without required userId field → 422 Validation Error
3. Create with empty symbol string → May fail or be rejected
4. Get non-existent item → 404 Not Found
5. Update non-existent item → 404 Not Found
6. Delete non-existent item → 404 Not Found

## Quick Test with cURL

### Create
```bash
curl -X POST http://localhost:3000/api/watchlist-items \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","userId":1}'
```

### Read All
```bash
curl http://localhost:3000/api/watchlist-items
```

### Read One
```bash
curl http://localhost:3000/api/watchlist-items/1
```

### Update
```bash
curl -X PATCH http://localhost:3000/api/watchlist-items/1 \
  -H "Content-Type: application/json" \
  -d '{"symbol":"GOOGL"}'
```

### Delete
```bash
curl -X DELETE http://localhost:3000/api/watchlist-items/1
```
