// controllers/user.controller.js
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Investment from '../models/Investment.js';
// use your helper to build absolute URL
import { getImageUrl } from '../middleware/upload.js';

const ok = (message, data=null) => ({ success:true, message, data });
const fail = (res, code, message) => res.status(code).json({ success:false, message, data:null });

// GET /api/user/me
export const getMe = async (req, res) => {
  try {
    const me = await User.findById(req.user._id || req.user.id)
      .select('-password -emailOtpCode -emailOtpExpires')
      .lean();
    return res.json(ok('Profile fetched', me));
  } catch (e) { return fail(res, 500, e.message); }
};

// PATCH /api/user/me   (supports multipart form-data; field name: avatar)
export const updateMe = async (req, res) => {
  try {
    const update = {};
    if (req.body.name) update.name = req.body.name;

    // accept either dotted or bracket notation
    const cc = req.body['mobile.countryCode'] ?? req.body['mobile[countryCode]'] ?? req.body?.mobile?.countryCode;
    const pn = req.body['mobile.phoneNumber'] ?? req.body['mobile[phoneNumber]'] ?? req.body?.mobile?.phoneNumber;
    if (cc) update['mobile.countryCode'] = cc;
    if (pn) update['mobile.phoneNumber'] = pn;

    if (req.file?.filename) {
      update.avatarUrl = getImageUrl(req.file.filename);   // -> http://host:port/uploads/filename.ext
    }

    const user = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      { $set: update },
      { new: true, runValidators: true, select: '-password -emailOtpCode -emailOtpExpires' }
    );
    return res.json(ok('Profile updated', user));
  } catch (e) { return fail(res, 400, e.message); }
};

// PATCH /api/user/me/password  { currentPassword, newPassword }
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) return fail(res, 400, 'currentPassword and newPassword are required');

    const user = await User.findById(req.user._id || req.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return fail(res, 400, 'Current password is incorrect');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json(ok('Password changed successfully'));
  } catch (e) { return fail(res, 500, e.message); }
};

// GET /api/user/me/investments?page=&limit=
export const getMyInvestments = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '10', 10)));
    const skip  = (page - 1) * limit;

    const userId = new mongoose.Types.ObjectId(String(req.user._id || req.user.id));

    const [items, total, totalsAgg] = await Promise.all([
      Investment.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit)
        .populate({ path: 'property', select: 'title startDate endDate annualReturn' })
        .lean(),
      Investment.countDocuments({ user: userId }),
      Investment.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, sum: { $sum: '$amount' }, count: { $sum: 1 }, properties: { $addToSet: '$property' } } }
      ])
    ]);

    const totalInvested    = totalsAgg?.[0]?.sum || 0;
    const totalInvestments = totalsAgg?.[0]?.count || 0;
    const totalProperties  = totalsAgg?.[0]?.properties?.length || 0;

    const investments = items.map(i => ({
      investmentId: i._id,
      propertyId: i.property?._id,
      propertyTitle: i.property?.title,
      startDate: i.property?.startDate,
      endDate: i.property?.endDate,
      amountInvested: i.amount,
      slotsPurchased: i.slots,
    }));

    return res.json(ok('Investments fetched', {
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total/limit)) },
      totals: { totalInvested, totalInvestments, totalProperties },
      investments
    }));
  } catch (e) { return fail(res, 500, e.message); }
};

// GET /api/user/me/stats
export const getMyStats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const invs = await Investment.find({ user: userId }).populate({ path: 'property', select: 'annualReturn' }).lean();

    const totalInvested   = invs.reduce((s, i) => s + (i.amount || 0), 0);
    const totalProperties = new Set(invs.map(i => String(i.property))).size;

    // naive monthly income estimate from annualReturn like "7.5% + 3%"
    let monthlyIncome = 0;
    for (const i of invs) {
      const raw = i.property?.annualReturn;
      const nums = typeof raw === 'string' ? raw.match(/([0-9]+(?:\\.[0-9]+)?)/g) : null;
      const apr = nums ? nums.map(Number).reduce((a,b)=>a+b,0) : 0;
      monthlyIncome += (i.amount || 0) * (apr/100) / 12;
    }

    const portfolioValue = totalInvested;
    const roi = totalInvested ? Number(((monthlyIncome*12)/totalInvested*100).toFixed(2)) : 0;

    return res.json(ok('Stats fetched', { totalProperties, totalInvested, portfolioValue, monthlyIncome: Math.round(monthlyIncome), roi }));
  } catch (e) { return fail(res, 500, e.message); }
};
