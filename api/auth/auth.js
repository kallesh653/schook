// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware =(roles=[])=>{return (req, res, next) => {
    const authHeader = req.header('Authorization');
    let token = authHeader;

    // Handle both "Bearer token" and direct token formats
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach the decoded token to the request object
      // Check if the user's role is allowed to access the route
      if (roles.length && !roles.includes(req.user.role)) {
        console.log(`❌ Access denied - Route: ${req.method} ${req.path} - User role: ${req.user.role}, Required roles: ${roles.join(', ')}`);
        return res.status(403).json({ message: `Access denied. Your role (${req.user.role}) is not authorized for this endpoint.` });
      }

      next(); // Call the next middleware or route handler
    } catch (error) {
        console.log("❌ Token verification error:", error.message)
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
}


module.exports = authMiddleware;

