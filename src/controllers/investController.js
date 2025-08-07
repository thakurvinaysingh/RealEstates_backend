// src/controllers/investController.js
import mongoose from 'mongoose';
import Property   from '../models/Property.js';
import Investment from '../models/Investment.js';


export const buySlot = async (req, res) => {
  try {
    const userId = req.user._id;
    const propertyId = req.params.id;
    const slots = parseInt(req.body.slots || 1);

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }

    if (slots <= 0) {
      return res.status(400).json({ message: 'Slot count must be greater than 0' });
    }

    const prop = await Property.findById(propertyId);
    if (!prop) return res.status(404).json({ message: 'Property not found' });

    if (prop.slotsSold + slots > prop.slotsCount) {
      return res.status(400).json({ message: 'Not enough slots available' });
    }

    const pricePerSlot = prop.totalValue / prop.slotsCount;
    const totalPrice = pricePerSlot * slots;

    const alreadyInvested = await Investment.exists({ user: userId, property: propertyId });
    if (!alreadyInvested) {
      prop.investorsCount += 1;
    }

    prop.slotsSold += slots;
    prop.currentAmount += totalPrice;
    await prop.save();

    const inv = await Investment.create({
      user: userId,
      property: propertyId,
      amount: totalPrice,
      slots
    });

    res.status(201).json({
      message: `You bought ${slots} slot(s) successfully`,
      pricePerSlot,
      totalPrice,
      slotsRemaining: prop.slotsCount - prop.slotsSold,
      investment: inv,
      property: {
        currentAmount: prop.currentAmount,
        investorsCount: prop.investorsCount,
        slotsSold: prop.slotsSold
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



export const listUserInvestments = async (req, res) => {
    try {
      const invs = await Investment
        .find({ user: req.user._id })
        .populate('property', 'title location images');
      res.json(invs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // — Shared: get a single investment (user or admin)
  // GET /api/investments/:id      (user)
  // GET /api/admin/investments/:id (admin)
  export const getInvestment = async (req, res) => {
    try {
      const inv = await Investment
        .findById(req.params.id)
        .populate('property', 'title location')
        .populate('user',     'name email');
      if (!inv) return res.status(404).json({ message: 'Not found' });
  
      // If non-admin, ensure owner
      if (req.user.role !== 'admin' &&
          inv.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      res.json(inv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // — Admin: list all investments
  // GET /api/admin/investments?page=&limit=
  export const listAllInvestments = async (req, res) => {
    try {
      const page  = Number(req.query.page)  || 1;
      const limit = Number(req.query.limit) || 20;
      const skip  = (page - 1) * limit;
  
      const total = await Investment.countDocuments();
      const data  = await Investment
        .find()
        .sort('-date')
        .skip(skip)
        .limit(limit)
        .populate('property', 'title')
        .populate('user',     'name email');
  
      res.json({
        total,
        page,
        pages: Math.ceil(total/limit),
        data
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };






  // export const buySlot = async (req, res) => {
    //   const userId     = req.user._id;
    //   const propertyId = req.params.id;
    
    //   // 1) fetch
    //   const prop = await Property.findById(propertyId);
    //   if (!prop) return res.status(404).json({ message: 'Property not found' });
    
    //   // 2) check availability
    //   if (prop.slotsSold >= prop.slotsCount) {
    //     return res.status(400).json({ message: 'All slots sold out' });
    //   }
    
    //   // 3) compute price
    //   const unitsPerSlot = prop.totalUnits / prop.slotsCount;
    //   const pricePerUnit = prop.totalValue / prop.totalUnits;
    //   const pricePerSlot = unitsPerSlot * pricePerUnit;  // equivalently: prop.totalValue / prop.slotsCount
    
    //   // 4) update property totals
    //   prop.slotsSold       += 1;
    //   prop.currentAmount   += pricePerSlot;
    //   prop.investorsCount  += 1;
    //   await prop.save();
    
    //   // 5) record the investment
    //   const inv = await Investment.create({
    //     user:     userId,
    //     property: propertyId,
    //     amount:   pricePerSlot,
    //     slots:    1
    //   });
    
    //   // 6) respond
    //   res.status(201).json({
    //     message:      'Slot purchased successfully',
    //     pricePerSlot,
    //     slotsRemaining: prop.slotsCount - prop.slotsSold,
    //     investment:   inv,
    //     property: {
    //       currentAmount:  prop.currentAmount,
    //       investorsCount: prop.investorsCount,
    //       slotsSold:      prop.slotsSold
    //     }
    //   });
    // };