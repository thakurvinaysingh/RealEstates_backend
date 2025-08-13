// src/controllers/adminUser.controller.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import Investment from '../models/Investment.js';

// GET /api/admin/users?status=active|blocked
export const listUsers = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { role: 'user' };
    if (status) {
      if (!['active','blocked'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status. Use active|blocked', data: null });
      }
      filter.status = status;
    }

    const users = await User.find(filter)
      .select('-password -emailOtpCode -emailOtpExpires')
      .sort({ createdAt: -1 });

    return res.json({ success: true, message: 'User list', data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users', data: null });
  }
};

// PATCH /api/admin/users/:id/status  { status: "active" | "blocked" }
export const setUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id', data: null });
    }

    const { status } = req.body || {};
    if (!['active','blocked'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be "active" or "blocked"', data: null });
    }

    const user = await User.findById(id).select('_id role status name email');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot change status of an admin', data: null });
    }

    user.status = status;
    await user.save();

    return res.json({
      success: true,
      message: `User ${status}`,
      data: { id: user._id, name: user.name, email: user.email, status: user.status }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update user status', data: null });
  }
};

// GET /api/admin/users/:userId/investments
export const getUserInvestmentDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user id', data: null });
    }

    const user = await User.findById(userId).select('_id name email status role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }
    if (user.role !== 'user') {
      return res.status(400).json({ success: false, message: 'Target must have role "user"', data: null });
    }

    const investments = await Investment.find({ user: userId })
      .populate({ path: 'property', select: 'title startDate endDate' })
      .sort({ createdAt: -1 });

    const totalInvestments = investments.length;
    const totalInvestedAmount = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);

    const details = investments.map(inv => ({
      investmentId: inv._id,
      propertyTitle: inv.property?.title || null,
      startDate: inv.property?.startDate || null,
      endDate: inv.property?.endDate || null,
      amountInvested: inv.amount,
      slotsPurchased: inv.slots,
      investedOn: inv.createdAt
    }));

    return res.json({
      success: true,
      message: 'User investment details',
      data: {
        user: { id: user._id, name: user.name, email: user.email, status: user.status },
        totalInvestments,
        totalInvestedAmount,
        investments: details
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user investment details', data: null });
  }
};
