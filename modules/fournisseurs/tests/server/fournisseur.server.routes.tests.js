'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Fournisseur = mongoose.model('Fournisseur'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  fournisseur;

/**
 * Fournisseur routes tests
 */
describe('Fournisseur CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Fournisseur
    user.save(function () {
      fournisseur = {
        name: 'Fournisseur name'
      };

      done();
    });
  });

  it('should be able to save a Fournisseur if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Fournisseur
        agent.post('/api/fournisseurs')
          .send(fournisseur)
          .expect(200)
          .end(function (fournisseurSaveErr, fournisseurSaveRes) {
            // Handle Fournisseur save error
            if (fournisseurSaveErr) {
              return done(fournisseurSaveErr);
            }

            // Get a list of Fournisseurs
            agent.get('/api/fournisseurs')
              .end(function (fournisseursGetErr, fournisseursGetRes) {
                // Handle Fournisseurs save error
                if (fournisseursGetErr) {
                  return done(fournisseursGetErr);
                }

                // Get Fournisseurs list
                var fournisseurs = fournisseursGetRes.body;

                // Set assertions
                (fournisseurs[0].user._id).should.equal(userId);
                (fournisseurs[0].name).should.match('Fournisseur name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Fournisseur if not logged in', function (done) {
    agent.post('/api/fournisseurs')
      .send(fournisseur)
      .expect(403)
      .end(function (fournisseurSaveErr, fournisseurSaveRes) {
        // Call the assertion callback
        done(fournisseurSaveErr);
      });
  });

  it('should not be able to save an Fournisseur if no name is provided', function (done) {
    // Invalidate name field
    fournisseur.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Fournisseur
        agent.post('/api/fournisseurs')
          .send(fournisseur)
          .expect(400)
          .end(function (fournisseurSaveErr, fournisseurSaveRes) {
            // Set message assertion
            (fournisseurSaveRes.body.message).should.match('Please fill Fournisseur name');

            // Handle Fournisseur save error
            done(fournisseurSaveErr);
          });
      });
  });

  it('should be able to update an Fournisseur if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Fournisseur
        agent.post('/api/fournisseurs')
          .send(fournisseur)
          .expect(200)
          .end(function (fournisseurSaveErr, fournisseurSaveRes) {
            // Handle Fournisseur save error
            if (fournisseurSaveErr) {
              return done(fournisseurSaveErr);
            }

            // Update Fournisseur name
            fournisseur.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Fournisseur
            agent.put('/api/fournisseurs/' + fournisseurSaveRes.body._id)
              .send(fournisseur)
              .expect(200)
              .end(function (fournisseurUpdateErr, fournisseurUpdateRes) {
                // Handle Fournisseur update error
                if (fournisseurUpdateErr) {
                  return done(fournisseurUpdateErr);
                }

                // Set assertions
                (fournisseurUpdateRes.body._id).should.equal(fournisseurSaveRes.body._id);
                (fournisseurUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Fournisseurs if not signed in', function (done) {
    // Create new Fournisseur model instance
    var fournisseurObj = new Fournisseur(fournisseur);

    // Save the fournisseur
    fournisseurObj.save(function () {
      // Request Fournisseurs
      request(app).get('/api/fournisseurs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Fournisseur if not signed in', function (done) {
    // Create new Fournisseur model instance
    var fournisseurObj = new Fournisseur(fournisseur);

    // Save the Fournisseur
    fournisseurObj.save(function () {
      request(app).get('/api/fournisseurs/' + fournisseurObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', fournisseur.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Fournisseur with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/fournisseurs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Fournisseur is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Fournisseur which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Fournisseur
    request(app).get('/api/fournisseurs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Fournisseur with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Fournisseur if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Fournisseur
        agent.post('/api/fournisseurs')
          .send(fournisseur)
          .expect(200)
          .end(function (fournisseurSaveErr, fournisseurSaveRes) {
            // Handle Fournisseur save error
            if (fournisseurSaveErr) {
              return done(fournisseurSaveErr);
            }

            // Delete an existing Fournisseur
            agent.delete('/api/fournisseurs/' + fournisseurSaveRes.body._id)
              .send(fournisseur)
              .expect(200)
              .end(function (fournisseurDeleteErr, fournisseurDeleteRes) {
                // Handle fournisseur error error
                if (fournisseurDeleteErr) {
                  return done(fournisseurDeleteErr);
                }

                // Set assertions
                (fournisseurDeleteRes.body._id).should.equal(fournisseurSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Fournisseur if not signed in', function (done) {
    // Set Fournisseur user
    fournisseur.user = user;

    // Create new Fournisseur model instance
    var fournisseurObj = new Fournisseur(fournisseur);

    // Save the Fournisseur
    fournisseurObj.save(function () {
      // Try deleting Fournisseur
      request(app).delete('/api/fournisseurs/' + fournisseurObj._id)
        .expect(403)
        .end(function (fournisseurDeleteErr, fournisseurDeleteRes) {
          // Set message assertion
          (fournisseurDeleteRes.body.message).should.match('User is not authorized');

          // Handle Fournisseur error error
          done(fournisseurDeleteErr);
        });

    });
  });

  it('should be able to get a single Fournisseur that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Fournisseur
          agent.post('/api/fournisseurs')
            .send(fournisseur)
            .expect(200)
            .end(function (fournisseurSaveErr, fournisseurSaveRes) {
              // Handle Fournisseur save error
              if (fournisseurSaveErr) {
                return done(fournisseurSaveErr);
              }

              // Set assertions on new Fournisseur
              (fournisseurSaveRes.body.name).should.equal(fournisseur.name);
              should.exist(fournisseurSaveRes.body.user);
              should.equal(fournisseurSaveRes.body.user._id, orphanId);

              // force the Fournisseur to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Fournisseur
                    agent.get('/api/fournisseurs/' + fournisseurSaveRes.body._id)
                      .expect(200)
                      .end(function (fournisseurInfoErr, fournisseurInfoRes) {
                        // Handle Fournisseur error
                        if (fournisseurInfoErr) {
                          return done(fournisseurInfoErr);
                        }

                        // Set assertions
                        (fournisseurInfoRes.body._id).should.equal(fournisseurSaveRes.body._id);
                        (fournisseurInfoRes.body.name).should.equal(fournisseur.name);
                        should.equal(fournisseurInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Fournisseur.remove().exec(done);
    });
  });
});
