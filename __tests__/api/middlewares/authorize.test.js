const authorize = require('../../../api/middlewares/authorize');

describe('Authorization Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {}, // Default empty user object
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should return 403 if no user roles are assigned', async () => {
    req.user.Roles = []; // No roles assigned

    // Call the authorize middleware
    await authorize('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Forbidden, no roles assigned to user',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user does not have the required role', async () => {
    req.user.Roles = [{ name: 'user' }]; // User has 'user' role but not 'admin'

    // Call the authorize middleware
    await authorize('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Forbidden, insufficient role',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user has the required role', async () => {
    req.user.Roles = [{ name: 'admin' }]; // User has 'admin' role

    // Call the authorize middleware with 'admin' as required role
    await authorize('admin')(req, res, next);

    expect(next).toHaveBeenCalled(); // User should be authorized and the next middleware should be called
    expect(res.status).not.toHaveBeenCalled(); // No response should be sent
    expect(res.json).not.toHaveBeenCalled(); // No response should be sent
  });

  it('should return 403 if user does not have any of the required roles (array)', async () => {
    req.user.Roles = [{ name: 'user' }]; // User has 'user' role but not 'admin' or 'manager'

    // Call the authorize middleware with multiple roles
    await authorize(['admin', 'manager'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Forbidden, insufficient role',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user has one of the required roles (array)', async () => {
    req.user.Roles = [{ name: 'admin' }]; // User has 'admin' role

    // Call the authorize middleware with multiple roles
    await authorize(['admin', 'manager'])(req, res, next);

    expect(next).toHaveBeenCalled(); // User should be authorized and the next middleware should be called
    expect(res.status).not.toHaveBeenCalled(); // No response should be sent
    expect(res.json).not.toHaveBeenCalled(); // No response should be sent
  });

  it('should handle roles as a string', async () => {
    req.user.Roles = [{ name: 'admin' }]; // User has 'admin' role

    // Call the authorize middleware with a single role as string
    await authorize('admin')(req, res, next);

    expect(next).toHaveBeenCalled(); // User should be authorized and the next middleware should be called
    expect(res.status).not.toHaveBeenCalled(); // No response should be sent
    expect(res.json).not.toHaveBeenCalled(); // No response should be sent
  });
});
