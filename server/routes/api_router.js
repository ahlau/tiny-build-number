const express = require('express');
const apiRouter = express.Router();
const _ = require('lodash');
const {BuildNumber} = require('../models/build_number');

apiRouter.get('/read', async (req, res) => {
    let bundleId = req.query.bundle_id;

    if (typeof(bundleId) === "undefined") {
      res.status(404).send();
    } else {
      try {
        const build = await BuildNumber.findOne({'bundle_id': bundleId});
        if(build === null) {
          console.log("buildNumber returned null", bundleId);
          res.status(404).send();
        } else {
          res.send({number: build.number});
        }
      } catch(e) {
        console.log(e);
        res.status(404).send(e);
      }
    }
  })
  .post('/set', async (req, res) => {
    let body = _.pick(req.body, ['bundle_id', 'number'])
    let bundle_id = body.bundle_id;
    let number = body.number;

    if((typeof(bundle_id) === "undefined") || (typeof(number) === "undefined")) {
      console.log("params", req.params);
      res.status(400).send();
    }
    try {
      let build = await BuildNumber.findOne({ bundle_id, number});
      if (!build) {
        //create build
        build = new BuildNumber({bundle_id, number});
        res.status(200)
      } else if (number > build.number) {
        // biz logic: only assign new number if it's greater than existing
        // number
        build.number = number;
        res.status(200)
      } else {
        // existing number is >= new number so return 400
        res.status(400)
      }

      await build.save();
    } catch(e) {
      res.status(400).send(e);
    }
    res.send();
  });

module.exports = apiRouter;
