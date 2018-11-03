// Load configs when the NODE_ENV is development or test
var env = process.env.NODE_ENV || 'development';

// For production environments use environment variables directly.
if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}


