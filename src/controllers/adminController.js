import Property from '../models/Property.js';
import { getImageUrls } from '../middleware/upload.js';

const parseJSONField = (field, fallback = []) => {
  try {
    if (!field) return fallback;
    return typeof field === "string" ? JSON.parse(field) : field;
  } catch {
    return fallback;
  }
};

// ✅ CREATE
export const createProperty = async (req, res) => {
  try {
    const { title, totalUnits, slotsCount, totalValue } = req.body;

    if (!title || !totalUnits || !slotsCount || !totalValue) {
      return res.status(400).json({
        error: 'Missing required fields: title, totalUnits, slotsCount, totalValue',
      });
    }

    let images = [];
    if (req.files?.images) {
      images = getImageUrls(req.files.images);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images)
        ? req.body.images
        : req.body.images.split(',');
    }

    let gallery = [];
    if (req.files?.gallery) {
      gallery = getImageUrls(req.files.gallery);
    } else if (req.body.gallery) {
      gallery = Array.isArray(req.body.gallery)
        ? req.body.gallery
        : req.body.gallery.split(',');
    }

    const prop = new Property({
      ...req.body,
      images,
      gallery,
      reasonsToInvest: parseJSONField(req.body.reasonsToInvest),
      financialTerms: parseJSONField(req.body.financialTerms, {}),
      tieredReturn: parseJSONField(req.body.tieredReturn),
      capitalGrowthSplit: parseJSONField(req.body.capitalGrowthSplit),
      owner: parseJSONField(req.body.owner, {}),
      faqs: parseJSONField(req.body.faqs),
      occupancyOptions: parseJSONField(req.body.occupancyOptions),
      keyUpdates: parseJSONField(req.body.keyUpdates),
      reports: parseJSONField(req.body.reports),
    });

    await prop.save();

    res.status(201).json({
      id: prop._id,
      message: 'Property created successfully',
      property: prop,
    });
  } catch (error) {
    console.error('Error in createProperty:', error);
    res.status(500).json({ error: 'Server error while creating property' });
  }
};

// ✅ UPDATE
export const updateProperty = async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Not found' });

    Object.assign(prop, req.body);

    if (req.files) {
      const more = req.files.map(f => `/uploads/${f.filename}`);
      prop.images.push(...more);
    }

    await prop.save();
    res.json(prop);
  } catch (err) {
    console.error('Error in updateProperty:', err);
    res.status(500).json({ message: 'Server error while updating property' });
  }
};

// ✅ DELETE
export const deleteProperty = async (req, res) => {
  try {
    const prop = await Property.findByIdAndDelete(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error in deleteProperty:', err);
    res.status(500).json({ message: 'Server error while deleting property' });
  }
};





// import Property from '../models/Property.js';
// import { getImageUrls } from '../middleware/upload.js'; 


// // Utility to extract image URLs (if you use multer or similar)
// // function getImageUrls(files) {
// //   if (!files || !Array.isArray(files)) return [];
// //   return files.map(file => file.path || file.url || file.filename); // Adapt as needed
// // }

// export const createProperty = async (req, res) => {
//   try {
//     // Parse and validate essential fields
//     const {
//       title, totalUnits, slotsCount, totalValue
//     } = req.body;

//     // Basic backend validation for required fields
//     if (!title || !totalUnits || !slotsCount || !totalValue) {
//       return res.status(400).json({
//         error: 'Missing required fields: title, totalUnits, slotsCount, totalValue'
//       });
//     }

//     // Get images array if uploaded (multer with "images" field as array)
//     let images = [];
//     if (req.files && req.files.images) {
//       images = getImageUrls(req.files.images);
//     } else if (req.body.images) {
//       // If images sent as array of URLs in body (for frontends sending URLs)
//       if (Array.isArray(req.body.images)) images = req.body.images;
//       else if (typeof req.body.images === "string") images = req.body.images.split(",");
//     }

//     // Same for gallery, if present
//     let gallery = [];
//     if (req.files && req.files.gallery) {
//       gallery = getImageUrls(req.files.gallery);
//     } else if (req.body.gallery) {
//       if (Array.isArray(req.body.gallery)) gallery = req.body.gallery;
//       else if (typeof req.body.gallery === "string") gallery = req.body.gallery.split(",");
//     }

//     // Parse arrays/objects fields if sent as JSON strings (common with form submissions)
//     const parseJSONField = (field, fallback = []) => {
//       try {
//         if (!field) return fallback;
//         return typeof field === "string" ? JSON.parse(field) : field;
//       } catch (e) {
//         return fallback;
//       }
//     };

//     // Build property document, parsing nested fields if needed
//     const prop = new Property({
//       ...req.body,
//       images,
//       gallery,
//       reasonsToInvest: parseJSONField(req.body.reasonsToInvest, []),
//       financialTerms: parseJSONField(req.body.financialTerms, {}),
//       tieredReturn:   parseJSONField(req.body.tieredReturn, []),
//       capitalGrowthSplit: parseJSONField(req.body.capitalGrowthSplit, []),
//       owner:          parseJSONField(req.body.owner, {}),
//       faqs:           parseJSONField(req.body.faqs, []),
//       occupancyOptions: parseJSONField(req.body.occupancyOptions, []),
//       keyUpdates:     parseJSONField(req.body.keyUpdates, []),
//       reports:        parseJSONField(req.body.reports, []),
//     });

//     // Save to DB
//     await prop.save();

//     // Send minimal, safe response
//     res.status(201).json({
//       id: prop._id,
//       message: "Property created successfully",
//       property: prop,
//     });
//   } catch (error) {
//     console.error('Error in createProperty:', error);
//     res.status(500).json({ error: "Server error while creating property" });
//   }
// };



// // PUT    /api/admin/properties/:id
// export const updateProperty = async (req, res) => {
//   const prop = await Property.findById(req.params.id);
//   if (!prop) return res.status(404).json({ message: 'Not found' });

//   Object.assign(prop, req.body);
//   if (req.files) {
//     const more = req.files.map(f => `/uploads/${f.filename}`);
//     prop.images.push(...more);
//   }
//   await prop.save();
//   res.json(prop);
// };

// // DELETE /api/admin/properties/:id
// export const deleteProperty = async (req, res) => {
//   const prop = await Property.findByIdAndDelete(req.params.id);
//   if (!prop) return res.status(404).json({ message: 'Not found' });
//   res.json({ message: 'Deleted' });
// };
