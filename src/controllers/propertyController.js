// controllers/propertyController.js
import mongoose from 'mongoose';
import Property from '../models/Property.js';

// GET /api/properties?limit=6
export const listProperties = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : null;
    const now = new Date();

    let query = Property.find().sort({ createdAt: -1 });
    if (limit) query = query.limit(limit);

    const props = await query;

    const data = props.map(p => {
      const timeLeft = p.endDate
        ? Math.max(0, Math.floor((new Date(p.endDate) - now) / (1000 * 60 * 60 * 24))) + 'd'
        : 'N/A';

      return {
        id:         p._id,
        title:      p.title,
        slug:       p.slug, 
        img:        p.images?.[0] || '',
        location:   p.location,
        investors:  p.investorsCount,
        invested:   p.currentAmount,
        percent:    p.goalAmount
                      ? ((p.currentAmount / p.goalAmount) * 100).toFixed(2)
                      : '0',
        returnRate: p.annualReturn,
        type:       p.propertyType,
        goalAmount: p.goalAmount,
        maxTerm:    p.maxTerm,
        timeLeft    // ⏳ Days remaining
      };
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error in listProperties:', error.message);
    res.status(500).json({ error: 'Server error while fetching properties' });
  }
};

// GET /api/properties/:id
export const getProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const prop = await Property.findById(id);
    if (!prop) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(prop);
  } catch (error) {
    console.error('Error in getProperty:', error.message);
    res.status(500).json({ error: 'Server error while fetching property' });
  }
};


// controllers/propertyController.js
export const getPropertyBySlug = async (req, res) => {
  try {
    const prop = await Property.findOne({ slug: req.params.slug });
    if (!prop) return res.status(404).json({ error: 'Property not found' });
    res.json(prop);
  } catch (e) {
    console.error('Error in getPropertyBySlug:', e);
    res.status(500).json({ error: 'Server error while fetching property' });
  }
};





// //controllers/propertyController.js

// import mongoose from 'mongoose';
// import Property from '../models/Property.js';



// // GET /api/properties?limit=6
// export const listProperties = async (req, res) => {
//   try {
//     const limit = req.query.limit ? Number(req.query.limit) : null;

//     let query = Property.find().sort({ createdAt: -1 });
//     if (limit) query = query.limit(limit);

//     const props = await query;

//     const data = props.map(p => ({
//       id:         p._id,
//       title:      p.title,
//       img:        p.images?.[0] || '',
//       location:   p.location,
//       investors:  p.investorsCount,
//       invested:   p.currentAmount,
//       percent:    p.goalAmount
//                     ? ((p.currentAmount / p.goalAmount) * 100).toFixed(2)
//                     : '0',
//       returnRate: p.annualReturn,
//       type:       p.propertyType
//     }));

//     res.status(200).json(data);
//   } catch (error) {
//     console.error('Error in listProperties:', error.message);
//     res.status(500).json({ error: 'Server error while fetching properties' });
//   }
// };

// // GET /api/properties/:id
// export const getProperty = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check for valid ObjectId before querying
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: 'Invalid property ID' });
//     }

//     const prop = await Property.findById(id);

//     if (!prop) {
//       return res.status(404).json({ error: 'Property not found' });
//     }

//     res.status(200).json(prop);
//   } catch (error) {
//     console.error('Error in getProperty:', error.message);
//     res.status(500).json({ error: 'Server error while fetching property' });
//   }
// };

