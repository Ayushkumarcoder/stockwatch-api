const assert = require('assert');
const testData = require('../fixtures/watchlist-items.json');

// Assuming the app is available in the test context
// If using mocha with LoopBack testing utilities, adjust accordingly
describe('WatchlistItem CRUD Routes', function() {
  let app;
  let request;
  let WatchlistItem;
  let createdItems = [];

  before(function(done) {
    // Load the app (adjust path based on your setup)
    app = require('../../server/server');
    request = require('supertest')(app);
    WatchlistItem = app.models.WatchlistItem;

    // Clear existing data
    WatchlistItem.deleteAll(function(err) {
      if (err) return done(err);
      done();
    });
  });

  after(function(done) {
    // Cleanup: remove all created test items
    WatchlistItem.deleteAll(function(err) {
      if (err) return done(err);
      done();
    });
  });

  describe('CREATE - POST /api/watchlist-items', function() {
    it('should create a watchlist item with valid data', function(done) {
      const payload = testData.createPayloads[0]; // NVDA
      
      request
        .post('/api/watchlist-items')
        .send({ symbol: payload.symbol, userId: payload.userId })
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          assert(res.body.id, 'Should return item with id');
          assert.strictEqual(res.body.symbol, 'NVDA', 'Symbol should be uppercase');
          assert.strictEqual(res.body.userId, payload.userId);
          assert(res.body.addedAt, 'Should have addedAt timestamp');
          
          createdItems.push(res.body.id);
          done();
        });
    });

    it('should create multiple items', function(done) {
      WatchlistItem.create(testData.validItems.slice(0, 3), function(err, items) {
        if (err) return done(err);
        
        assert.strictEqual(items.length, 3, 'Should create 3 items');
        items.forEach(item => {
          assert(item.id);
          assert.strictEqual(item.symbol, item.symbol.toUpperCase());
          createdItems.push(item.id);
        });
        done();
      });
    });

    it('should convert lowercase symbol to uppercase', function(done) {
      const payload = testData.createPayloads[2]; // AMD
      
      request
        .post('/api/watchlist-items')
        .send({ symbol: payload.symbol, userId: payload.userId })
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          assert.strictEqual(res.body.symbol, 'AMD', 'Symbol should be uppercase');
          createdItems.push(res.body.id);
          done();
        });
    });

    it('should fail without required symbol', function(done) {
      request
        .post('/api/watchlist-items')
        .send({ userId: 1 })
        .expect(422) // Validation error
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body.error, 'Should return error message');
          done();
        });
    });

    it('should fail without required userId', function(done) {
      request
        .post('/api/watchlist-items')
        .send({ symbol: 'AAPL' })
        .expect(422) // Validation error
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body.error, 'Should return error message');
          done();
        });
    });
  });

  describe('READ - GET /api/watchlist-items', function() {
    let testItemId;

    before(function(done) {
      // Create a test item
      WatchlistItem.create({ symbol: 'TEST', userId: 1 }, function(err, item) {
        if (err) return done(err);
        testItemId = item.id;
        createdItems.push(item.id);
        done();
      });
    });

    it('should retrieve all watchlist items', function(done) {
      request
        .get('/api/watchlist-items')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          assert(Array.isArray(res.body), 'Response should be an array');
          assert(res.body.length > 0, 'Should have at least one item');
          done();
        });
    });

    it('should retrieve a specific watchlist item by id', function(done) {
      request
        .get(`/api/watchlist-items/${testItemId}`)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          assert.strictEqual(res.body.id, testItemId);
          assert.strictEqual(res.body.symbol, 'TEST');
          assert.strictEqual(res.body.userId, 1);
          done();
        });
    });

    it('should filter items by userId', function(done) {
      request
        .get('/api/watchlist-items?filter={"where":{"userId":1}}')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          assert(Array.isArray(res.body));
          res.body.forEach(item => {
            assert.strictEqual(item.userId, 1, 'All items should have userId 1');
          });
          done();
        });
    });

    it('should return 404 for non-existent item', function(done) {
      request
        .get('/api/watchlist-items/999999')
        .expect(404)
        .end(done);
    });
  });

  describe('UPDATE - PATCH/PUT /api/watchlist-items', function() {
    let updateTestItemId;

    before(function(done) {
      WatchlistItem.create({ symbol: 'UPDATETEST', userId: 1 }, function(err, item) {
        if (err) return done(err);
        updateTestItemId = item.id;
        createdItems.push(item.id);
        done();
      });
    });

    it('should update a watchlist item', function(done) {
      const updatePayload = { symbol: 'UPDATED' };
      
      request
        .patch(`/api/watchlist-items/${updateTestItemId}`)
        .send(updatePayload)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          assert.strictEqual(res.body.symbol, 'UPDATED');
          done();
        });
    });

    it('should update userId field', function(done) {
      request
        .patch(`/api/watchlist-items/${updateTestItemId}`)
        .send({ userId: 5 })
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          assert.strictEqual(res.body.userId, 5);
          done();
        });
    });

    it('should return 404 when updating non-existent item', function(done) {
      request
        .patch('/api/watchlist-items/999999')
        .send({ symbol: 'TEST' })
        .expect(404)
        .end(done);
    });
  });

  describe('DELETE - DELETE /api/watchlist-items', function() {
    let deleteTestItemId;

    before(function(done) {
      WatchlistItem.create({ symbol: 'DELETETEST', userId: 1 }, function(err, item) {
        if (err) return done(err);
        deleteTestItemId = item.id;
        done();
      });
    });

    it('should delete a watchlist item by id', function(done) {
      request
        .delete(`/api/watchlist-items/${deleteTestItemId}`)
        .expect(204)
        .end(function(err, res) {
          if (err) return done(err);
          
          // Verify it's deleted
          WatchlistItem.findById(deleteTestItemId, function(err, item) {
            assert(!item, 'Item should be deleted');
            done();
          });
        });
    });

    it('should return 404 when deleting non-existent item', function(done) {
      request
        .delete('/api/watchlist-items/999999')
        .expect(404)
        .end(done);
    });
  });

  describe('Bulk Operations', function() {
    it('should create multiple items from fixture data', function(done) {
      WatchlistItem.create(testData.validItems, function(err, items) {
        if (err) return done(err);
        
        assert.strictEqual(items.length, testData.validItems.length);
        items.forEach(item => {
          assert(item.id);
          createdItems.push(item.id);
        });
        done();
      });
    });

    it('should count all items', function(done) {
      WatchlistItem.count(function(err, count) {
        if (err) return done(err);
        
        assert(count > 0, 'Should have at least one item in database');
        done();
      });
    });

    it('should count items by userId', function(done) {
      WatchlistItem.count({ userId: 1 }, function(err, count) {
        if (err) return done(err);
        
        assert(count > 0, 'Should have items for userId 1');
        done();
      });
    });
  });
});
