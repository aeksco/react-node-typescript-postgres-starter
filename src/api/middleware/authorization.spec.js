const httpMocks = require('node-mocks-http');
const assert = require('chai').assert;
const { JWT_HEADER, JWT_HEADER_ALT } = require('../../../test/utils');
const { requireAuthenticated, requireRole, requireAdmin } = require('./authorization')

// // // //

describe('Authorization middleware', () => {

  describe('valid token', () => {
    it('should define req.user', () => {
      // Defines mock request
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/profile',
        headers: {
          authorization: JWT_HEADER
        }
      });

      // Defines mock response
      const res = httpMocks.createResponse();

      // Tests middleware with mock request & response
      requireAuthenticated(req, res, () => {
        assert.exists(req.user);
      });
    });
  });

  // // // //

  describe('invalid token', () => {
    it('should return 403 Unauthorized', () => {
      // Defines an invalid token
      const invalid_token = 'SoMeGaRbLeDnOnEsEnSe'

      // Defines mock request
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/profile',
        headers: {
          authorization: invalid_token
        }
      });

      // Defines mock response
      const res = httpMocks.createResponse();

      // Tests middleware with mock request & response
      requireAuthenticated(req, res, () => {
        assert.notExists(req.user)
        assert.equal(403, res.statusCode);
      });
    });
  });

  // // // //

  describe('missing token', () => {
    it('should return 403 Unauthorized', () => {
      // Defines mock request
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/profile',
        headers: {
          authorization: ''
        }
      });

      // Defines mock response
      const res = httpMocks.createResponse();

      // Tests middleware with mock request & response
      requireAuthenticated(req, res, () => {
        assert.notExists(req.user)
        assert.equal(403, res.statusCode);
      });
    });
  });

  // // // //

  describe('malformed token', () => {
    it('should return 403 Unauthorized', () => {
      // Defines mock request
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/profile',
        headers: {
          authorization: 'JWT notevenclosetosometingvalid'
        }
      });

      // Defines mock response
      const res = httpMocks.createResponse();

      // Tests middleware with mock request & response
      requireAuthenticated(req, res, () => {
        assert.notExists(req.user)
        assert.equal(403, res.statusCode);
      });
    });
  });

  // // // //

  describe('requireRole', () => {
    it('non-admin user has USER role', () => {
      // Defines mock request
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/profile',
        headers: {
          authorization: JWT_HEADER_ALT
        }
      });

      // Defines mock response
      const res = httpMocks.createResponse();

      // Tests middleware with mock request & response
      requireAuthenticated(req, res, () => {
        requireRole('USER')(req, res, () => {
          assert.exists(req.user)
          assert.equal('USER', req.user.role)
        });
      });
    });

    // // // //

    it('non-admin user does not have RANDOM role', () => {
      // Defines mock request
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/profile',
        headers: {
          authorization: JWT_HEADER_ALT
        }
      });

      // Defines mock response
      const res = httpMocks.createResponse();

      // Tests middleware with mock request & response
      requireAuthenticated(req, res, () => {
        requireRole('RANDOM')(req, res, () => {
          assert.fail('User authorized via requireRole middleware', 'User should not be authorized', 'Error in requireRole middleware');
        });
      });
    });

    // // // //

    it('admin user always passes through requireRole', () => {
      // Defines mock request
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/profile',
        headers: {
          authorization: JWT_HEADER
        }
      });

      // Defines mock response
      const res = httpMocks.createResponse();

      // Tests middleware with mock request & response
      requireAuthenticated(req, res, () => {
        requireRole('RANDOM')(req, res, () => {
          assert.exists(req.user)
          assert.equal(true, req.user.admin)
        });
      });
    });

  });

  // // // //

  describe('requireAdmin', () => {
    it('user is an administrator', () => {
      // Defines mock request
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/profile',
        headers: {
          authorization: JWT_HEADER
        }
      });

      // Defines mock response
      const res = httpMocks.createResponse();

      // Tests middleware with mock request & response
      requireAuthenticated(req, res, () => {
        requireAdmin(req, res, () => {
          assert.exists(req.user)
          assert.equal(true, req.user.admin)
        });
      });
    });

    // // // //

    it('user is not an administrator', () => {
      // Defines mock request
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/profile',
        headers: {
          authorization: JWT_HEADER_ALT
        }
      });

      // Defines mock response
      const res = httpMocks.createResponse();

      // Tests middleware with mock request & response
      requireAuthenticated(req, res, () => {
        requireAdmin(req, res, () => {
          assert.fail('User authorized via requireAdmin middleware', 'User should not be authorized', 'Error in requireAdmin middleware');
        });
      });
    });

  });

});
