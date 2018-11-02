const {ObjectID} = require('mongodb');
const {BuildNumber} = require('./../../models/build_number');

const buildNumbers = [
  {
    _id: new ObjectID(),
    bundle_id: "com.sagomini.HomeworkChallenge",
    number: 10
  },
  {
    _id: new ObjectID(),
    bundle_id: "com.starwars.deathstar",
    number: 20
  },
  {
    _id: new ObjectID(),
    bundle_id: "com.starwars.jediapp",
    number: 30
  }
]

const populateBuildNumbers = (done) => {
  BuildNumber.deleteMany({}).then(() => {
    return BuildNumber.insertMany(buildNumbers);
  }).then(() => done());
};

module.exports = { buildNumbers, populateBuildNumbers };
