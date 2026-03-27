// server/create-tables.js
// Run this script ONCE to create all tables in PostgreSQL
// Command: node server/create-tables.js

'use strict';
require('dotenv').config();

var app = require('./server');

// Wait for the app to fully boot before touching the DB
app.on('booted', function() {
  var ds = app.dataSources.stockwatchDb;

  // List every model that should have a table in PostgreSQL
  // IMPORTANT: Only include models actually attached to this datasource
  // User and AccessToken are on the 'db' datasource, not 'stockwatchDb'
  var modelsToMigrate = [
    'WatchlistItem'
  ];

  // autoupdate: creates tables if they don't exist, alters columns if model changed
  // SAFE — does not drop existing data
  ds.autoupdate(modelsToMigrate, function(err) {
    if (err) {
      console.error('Migration failed:', err);
      process.exit(1);
    }

    console.log('Tables created/updated successfully:');
    modelsToMigrate.forEach(function(m) {
      console.log('  ✓', m);
    });

    ds.disconnect();
    process.exit(0);
  });
});