# tiny-build-number
A webservice that tracks iOS builds given a bundle_id written in NodeJS.

# Install
```
git clone git@github.com:ahlau/tiny-build-number.git
cd tiny-build-number
npm install
```

Ensure MongoDB is available. For *development* and *test*, default configurations are stored in `server/config/config.json`. These can be overwritten using the environment variables `PORT` and `MONGODB_URI`


# Start

To start run the following in the app's root directory:
```
pm2 start server/server.js
```
Or with custom environment vars:
```
PORT=8080 MONGODB_URI=https://example.com/my_mongo_db pm2 start server/server.js
```

To run tests:
```
npm run test
```
To make requests to the service, make requests to the following end-points. For POST requests, supply the params as JSON, or url-encoded values.
```
GET  /api/read?bundle_id=com.example.app
POST /api/set, { bundle_id: "com.example.app", number: 1 }
POST /api/bump, { bundle_id: "com.example.app" }
```
