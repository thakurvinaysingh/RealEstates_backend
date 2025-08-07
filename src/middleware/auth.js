//middleware/auth.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect any route
// export const protect = async (req, res, next) => {
//   const header = req.headers.authorization?.split(' ');
//   if (header?.[0] !== 'Bearer' || !header[1]) {
//     return res.status(401).json({ message: 'Not authorized' });
//   }
//   try {
//     const decoded = jwt.verify(header[1], process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//   } catch {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization?.split(' ');
  if (authHeader?.[0] !== 'Bearer' || !authHeader[1]) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(authHeader[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT Error:', err);
    const isExpired = err.name === 'TokenExpiredError';
    res.status(401).json({
      message: isExpired ? 'Token expired' : 'Invalid token',
    });
  }
};


// Admin only
export const admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};
