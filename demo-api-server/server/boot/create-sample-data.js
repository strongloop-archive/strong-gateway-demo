module.exports = function(app, cb) {
  app.models.Note.create([
    {content: 'Buy eggs'},
    {content: 'Buy milk'},
    {content: 'Buy sausages'}
  ], function(err, notes) {
    if (err) throw err;
    console.log('Notes created: %j', notes);
    cb();
  });
};
