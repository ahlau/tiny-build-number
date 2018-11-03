# tiny-build-number
A webservice that tracks iOS builds given a bundle_id written in NodeJS.

# Start

To start run:
```
git clone git@github.com:ahlau/tiny-build-number.git
cd tiny-build-number
npm install
pm2 start server/server.js
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
