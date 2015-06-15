// Set the env to prod to avoid sample-data population
process.env.NODE_ENV = 'prod';
var app = require('../server');

if (app.dataSources.db) {
  console.log('Auto-updating database: %j', app.dataSources.db.settings);
  app.dataSources.db.autoupdate(function(err) {
    if (err)
      return console.error('Error in setting database: %j', err);
    console.log('Database setup successful');
    app.dataSources.db.disconnect();
  });
}
