// Server.js
//
// Server's entry point. Use this file to start the server
//
const { app } = require('./app');
const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Started server on port ${port}`);
});
