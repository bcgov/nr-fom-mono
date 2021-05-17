// TODO: COPIED from ACRFD, will likely be refactored into AuthService
'use strict';

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const defaultLog = require('./logger')('auth');

const ISSUER = process.env.SSO_ISSUER || 'https://dev.oidc.gov.bc.ca/auth/realms/prc';
const JWKSURI =
  process.env.SSO_JWKSURI || 'https://dev.oidc.gov.bc.ca/auth/realms/prc/protocol/openid-connect/certs';
const JWT_SIGN_EXPIRY = process.env.JWT_SIGN_EXPIRY || '1440'; // 24 hours in minutes.
const SECRET = process.env.SECRET || 'defaultSecret';
const KEYCLOAK_ENABLED = process.env.KEYCLOAK_ENABLED || 'true';

exports.verifyToken = function(req, authOrSecDef, token, callback) {
  defaultLog.info('verifying token');
  defaultLog.debug('token:', token);
  // scopes/roles defined for the current endpoint
  var currentScopes = req.swagger.operation['x-security-scopes'];
  function sendError() {
    return req.res.status(403).json({ message: 'Error: Access Denied' });
  }

  // validate the 'Authorization' header. it should have the following format:
  //'Bearer tokenString'
  if (token && token.indexOf('Bearer ') == 0) {
    var tokenString = token.split(' ')[1];

    // If Keycloak is enabled, get the JWKSURI and process accordingly.  Else
    // use local environment JWT configuration.
    if (KEYCLOAK_ENABLED === 'true') {
      defaultLog.debug('Keycloak Enabled, remote JWT verification.');
      const client = jwksClient({
        strictSsl: true, // Default value
        jwksUri: JWKSURI
      });

      const kid = jwt.decode(tokenString, { complete: true }).header.kid;

      client.getSigningKey(kid, (err, key) => {
        if (err) {
          defaultLog.error('Signing Key Error:', err);
          callback(sendError());
        } else {
          const signingKey = key.publicKey || key.rsaPublicKey;

          _verifySecret(currentScopes, tokenString, signingKey, req, callback, sendError);
        }
      });
    } else {
      defaultLog.debug('proceeding with local JWT verification:', tokenString);
      _verifySecret(currentScopes, tokenString, SECRET, req, callback, sendError);
    }
  } else {
    defaultLog.warn("Token didn't have a bearer.");
    return callback(sendError());
  }
};

function _verifySecret(currentScopes, tokenString, secret, req, callback, sendError) {
  jwt.verify(tokenString, secret, function(verificationError, decodedToken) {
    // defaultLog.info("verificationError:", verificationError);
    // defaultLog.info("decodedToken:", decodedToken);

    // check if the JWT was verified correctly
    if (verificationError == null && Array.isArray(currentScopes) && decodedToken && decodedToken.realm_access.roles) {
      defaultLog.info('JWT decoded.');
      defaultLog.debug('JWT token:', decodedToken);

      // check if the role is valid for this endpoint
      var roleMatch = currentScopes.some(r => decodedToken.realm_access.roles.indexOf(r) >= 0);
      defaultLog.debug('currentScopes', JSON.stringify(currentScopes));
      defaultLog.debug('decodedToken.realm_access.roles', decodedToken.realm_access.roles);
      defaultLog.debug('role match', roleMatch);

      // check if the dissuer matches
      var issuerMatch = decodedToken.iss == ISSUER;
      defaultLog.debug('decodedToken.iss', decodedToken.iss);
      defaultLog.debug('ISSUER', ISSUER);
      defaultLog.debug('issuerMatch', issuerMatch);

      if (roleMatch && issuerMatch) {
        // add the token to the request so that we can access it in the endpoint code if necessary
        req.swagger.params.auth_payload = decodedToken;
        defaultLog.info('JWT Verified.');
        return callback(null);
      } else {
        defaultLog.info('JWT Role/Issuer mismatch.');
        return callback(sendError());
      }
    } else {
      // return the error in the callback if the JWT was not verified
      defaultLog.warn('JWT Verification Error:', verificationError);
      return callback(sendError());
    }
  });
}

exports.issueToken = function(user, deviceId, scopes) {
  defaultLog.info('user:', user);
  defaultLog.info('deviceId:', deviceId);
  defaultLog.info('scopes:', scopes);
  var crypto = require('crypto');
  var randomString = crypto.randomBytes(32).toString('hex');
  var jti = crypto
    .createHash('sha256')
    .update(user.username + deviceId + randomString)
    .digest('hex');
  defaultLog.info('JTI:', jti);

  var payload = {
    name: user.username,
    preferred_username: user.username,
    userID: user._id,
    deviceId: deviceId,
    jti: jti,
    iss: ISSUER,
    realm_access: {
      roles: scopes
    }
  };

  var token = jwt.sign(payload, SECRET, { expiresIn: JWT_SIGN_EXPIRY + 'm' });
  defaultLog.info('ISSUING NEW TOKEN:expiresIn:', JWT_SIGN_EXPIRY + 'm');

  return token;
};

var hashPassword = function(user, password) {
  if (user.salt && password) {
    var crypto = require('crypto');
    return crypto.pbkdf2Sync(password, Buffer.from(user.salt, 'base64'), 10000, 64, 'sha1').toString('base64');
  } else {
    return password;
  }
};

exports.setPassword = function(user) {
  var bcrypt = require('bcrypt-nodejs');
  user.salt = bcrypt.genSaltSync(16);
  user.password = hashPassword(user, user.password);
  return user;
};
/**
 * Create instance method for authenticating user
 */
var authenticate = function(user, password) {
  defaultLog.info('HASH:', hashPassword(user, password));
  defaultLog.info('user.password:', user.password);
  return user.password === hashPassword(user, password);
};

exports.checkAuthentication = function(username, password, cb) {
  defaultLog.info('authStrategy loading');
  var User = require('mongoose').model('User');

  // Look this user up in the db and hash their password to see if it's correct.
  User.findOne(
    {
      username: username.toLowerCase()
    },
    function(err, user) {
      if (err) {
        defaultLog.info('ERR:', err);
        return cb(err);
      }
      defaultLog.info('continuing');
      if (!user || !authenticate(user, password)) {
        defaultLog.info('bad username or password!');
        return cb(null, false, {
          message: 'Invalid username or password'
        });
      }
      defaultLog.info('YAY');
      return cb(null, user);
    }
  );
};