const expect = require('expect');
const request = require('supertest');

const {BuildNumber} = require('./../models/build_number');
const {app} = require("./../app");
const {buildNumbers, populateBuildNumbers } = require('./seed/seed');

beforeEach(populateBuildNumbers);

describe('GET /api/read', (done) => {
  it("should return the correct build number", (done) => {
    request(app)
      .get(`/api/read?bundle_id=${buildNumbers[2].bundle_id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({number: buildNumbers[2].number});
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        done();
      });
  });

  it("should not return a build number when bundle_id not provided", (done) => {
    request(app)
      .get(`/api/read`)
      .expect(404)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        done();
      });
  });

  it("should not return a number when bundle_id does not exist", (done) => {
    request(app)
      .get(`/api/read?bundle_id=com.empire.strikesback`)
      .expect(404)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        done();
      });
  });
});

describe('POST /api/set', (done) => {
  it("should return success code given a new bundle_id", (done) => {
    request(app)
      .post('/api/set')
      .send({bundle_id: 'com.empirestrikes.back', number: 40})
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        BuildNumber.find({bundle_id: "com.empirestrikes.back"})
          .then((builds) => {
            expect(builds.length).toBe(1);
            expect(builds[0].number).toBe(40);
            done();
          }).catch((e) => done(e));
      });
  });

  it("should not overwrite existing value if number param < old number", (done) => {
    let existingBuild = buildNumbers[0]
    request(app)
      .post('/api/set')
      .send({bundle_id: existingBuild.bundle_id, number: existingBuild.number-1})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        BuildNumber.find({bundle_id: existingBuild.bundle_id}).then((builds) => {
          expect(builds.length).toBe(1);
          expect(builds[0].number).toBe(existingBuild.number);
          done();
          }).catch((e) => done(e));
        });
  }); // request

  it("should overwrite existing value if number param > old number", (done) => {
    let existingBuild = buildNumbers[0]
    request(app)
      .post('/api/set')
      .send({bundle_id: existingBuild.bundle_id, number: existingBuild.number+1})
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        BuildNumber.find({bundle_id: existingBuild.bundle_id}).then((builds) => {
          expect(builds.length).toBe(1);
          expect(builds[0].number).toBe(existingBuild.number+1);
          done();
        }).catch((e) => done(e));
      });
  }); // request

  it("should return status 400 if missing params", (done) => {
      BuildNumber.find({bundle_id: buildNumbers[2].bundle_id}).then((builds) => {
        expect(builds).toExist()
        expect(builds.length).toBe(1);
      }).catch((e) => {
        done(e);
      });
    request(app)
      .post('/api/set')
      .expect(400)
      .end(done);
  });

  it("should return status 400 with bad params", (done) => {
      BuildNumber.find({bundle_id: buildNumbers[2].bundle_id}).then((builds) => {
        expect(builds).toExist()
        expect(builds.length).toBe(1);
      }).catch((e) => {
        done(e);
      });
    request(app)
      .post('/api/set')
      .send({bundle_id: buildNumbers[2].bundle_id})
      .expect(400)
      .end(done);
  });

});

// INDEX on build numbers?
