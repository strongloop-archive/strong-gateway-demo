module.exports = function(server, cb) {
  server.models.note.create([
    {title: 'First note', content: 'Hello, World!'},
    {title: 'Second note', content: 'StrongLoop Gateway'}
  ], function(err, notes) {
    if (!err) {
      console.log('Notes created: %j', notes);
    }
    cb(err);
  });
};
