/**
 * Seed data for watchlist-items
 * Usage: Load this in a boot script or use the data in your tests
 */

module.exports = function(app) {
  const WatchlistItem = app.models.WatchlistItem;
  
  const seedData = [
    {
      symbol: 'AAPL',
      userId: 1,
      addedAt: new Date('2026-01-15T10:00:00Z')
    },
    {
      symbol: 'GOOGL',
      userId: 1,
      addedAt: new Date('2026-01-20T14:30:00Z')
    },
    {
      symbol: 'MSFT',
      userId: 1,
      addedAt: new Date('2026-02-05T09:15:00Z')
    },
    {
      symbol: 'TSLA',
      userId: 2,
      addedAt: new Date('2026-02-10T11:45:00Z')
    },
    {
      symbol: 'AMZN',
      userId: 2,
      addedAt: new Date('2026-02-15T16:20:00Z')
    },
    {
      symbol: 'META',
      userId: 3,
      addedAt: new Date('2026-02-20T12:00:00Z')
    },
    {
      symbol: 'NFLX',
      userId: 3,
      addedAt: new Date('2026-03-01T08:30:00Z')
    },
    {
      symbol: 'NVDA',
      userId: 1,
      addedAt: new Date('2026-03-10T15:45:00Z')
    }
  ];

  WatchlistItem.deleteAll(function(err) {
    if (err) {
      console.error('Error clearing WatchlistItem:', err);
      return;
    }

    WatchlistItem.create(seedData, function(err, items) {
      if (err) {
        console.error('Error seeding WatchlistItem:', err);
        return;
      }
      
      console.log('✓ Seeded', items.length, 'watchlist items');
      items.forEach(item => {
        console.log(`  - ${item.symbol} (User ${item.userId})`);
      });
    });
  });
};
