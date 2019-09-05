'use strict';

/**
 * Module dependencies
 */

var jwt = require('jsonwebtoken');
var passport = require('passport'),
   AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2').Strategy,
   users = require('../../controllers/users.server.controller');

module.exports = function (config) {
   passport.use(new AzureAdOAuth2Strategy({
      clientID: '05e59d12-f7bc-4610-b1aa-100491b3fefd',
      clientSecret: 'tata',
      callbackURL: 'http://localhost:3000/authentication/success',
      resource: '00000002-0000-0000-c000-000000000000',
      tenant: '901cb4ca-b862-4029-9306-e5cd0f6d9f86'
   },
   function(accessToken, refresh_token, params, profile, done) {
      // currently we can't find a way to exchange access token by user info (see userProfile implementation), so
      // you will need a jwt-package like https://github.com/auth0/node-jsonwebtoken to decode id_token and get waad profile
      var waadProfile = profile || jwt.decode(params.id_token);

   // this is just an example: here you would provide a model *User* with the function *findOrCreate*
      User.findOrCreate({ "05e59d12-f7bc-4610-b1aa-100491b3fefd": waadProfile.upn }, function(err, user) {
         done(err, user);
      });
   }));

};