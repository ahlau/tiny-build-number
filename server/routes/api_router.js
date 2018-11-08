// API ROUTER
//
// Define our API here for the application.

const express = require('express');
const apiRouter = express.Router();
const _ = require('lodash');
const {BuildNumber} = require('../models/build_number');

// GET /read
//  - Given param bundle_id, return the build number if it exists.
//  Otherwise return a 404 response status.
apiRouter.get('/read', async (req, res) => {
    let bundleId = req.query.bundle_id;
    console.log(req.query);
    if (typeof(bundleId) === "undefined") {
      // Return a BAD Request
      console.log("No bundleId");
      res.status(400).send();
    } else {
      try {
        // Find a BuildNumber given the bundle_id
        const build = await BuildNumber.findOne({'bundle_id': bundleId});
        if(build === null) {
          // Return 404 if build with bundle_id not found
          console.log("No build found");
          res.status(404).send();
        } else {
          // Found, return the bundle_id and build_number as an object
          // We could just send back the number but JSON is more readable
          console.log("Data found!");
          res.send({bundle_id: build.bundleId , number: build.number});
        }
      } catch(e) {
        console.log(e);
        res.status(404).send(e);
      }
    }
  })
  // POST /set
  //   - set the build's number to a new value if it exists and is greater than
  //   the previous value
  //   - create a build if the bundle does not exist and assign it the value 0
  .post('/set', async (req, res) => {
    // extract only the params we need from the request.
    let body = _.pick(req.body, ['bundle_id', 'number'])
    let bundle_id = body.bundle_id;
    let number = body.number;

    // if we don't get the bundle_id or number params, then return a 400 BAD REQUEST
    if((typeof(bundle_id) === "undefined") || (typeof(number) === "undefined")) {
      res.status(400).send();
      return;
    }
    try {
      // Lookout our BuildNumber from the Request, wait until it returns
      let build = await BuildNumber.findOne({ bundle_id });
      if (!build) {
        //create a BuildNumber if we can't find one
        build = new BuildNumber({bundle_id, number: 0});
        console.log("SET new build created")
        res.status(200);
      } else if (number > build.number) {
        // biz logic: only assign new number if it's greater than an existing
        // build's number
        build.number = number;
        console.log("SET setting new build number " + build.number);
        res.status(200);
      } else {
        // existing number is >= new number so return 400
        console.log("SET number must be greater than existing number");
        res.status(400).send();
        return;
      }
      // Save the new/dirty build, and wait until it finishes
      await build.save();
    } catch(e) {
      // Return an error if one occurs
      console.log(e);
      res.status(400).send(e);
    }
    // Send back the response
    res.send();
  })
  // POST /bump
  //   - increment a build number if it exists, otherwise
  //   - create a new build with bundle_id if not found with build number 0
  .post('/bump', async (req, res) => {
    let bundle_id = req.body.bundle_id;

    if(typeof(bundle_id) === "undefined") {
      console.log("BUMP bundle_id undefined");
      res.status(400).send();
      return;
    }
    try {
      let build = await BuildNumber.findOne({ bundle_id });
      if (!build) {
        //create build
        console.log("BUMP created new bundle");
        build = new BuildNumber({bundle_id, number: 0});
        res.status(200);
      } else {
        // biz logic: only assign new number if it's greater than existing
        // number
        console.log("BUMP incrementing build number");
        build.number++;
        res.status(200);
      }
      // Save build and wait for request to complete
      await build.save();
    } catch(e) {
      console.log(e);
      res.status(400).send(e);
      return;
    }
    res.send();
  });

module.exports = apiRouter;
