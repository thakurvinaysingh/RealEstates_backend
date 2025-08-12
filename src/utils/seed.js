// // scripts/backfillSlugs.js  (or src/utils/backfillSlugs.js)
// import dotenv from 'dotenv';
// import connectDB from '../config/dbConnect.js';
// import Property from '../models/Property.js';
// import slugify from 'slugify';
// import mongoose from 'mongoose';

// dotenv.config();

// const run = async () => {
//   try {
//     console.log('🔌 Connecting to MongoDB…');
//     await connectDB(); // <-- IMPORTANT
//     console.log('✅ Connected');

//     // find docs missing slug or empty slug
//     const props = await Property.find({
//       $or: [{ slug: { $exists: false } }, { slug: '' }]
//     });

//     console.log(`Found ${props.length} properties to backfill`);

//     for (const p of props) {
//       const base = slugify(p.title || '', { lower: true, strict: true });
//       if (!base) continue;

//       // ensure unique slug by suffixing -2, -3, ...
//       let slug = base, n = 2;
//       // exclude current doc _id
//       // eslint-disable-next-line no-await-in-loop
//       while (await Property.exists({ slug, _id: { $ne: p._id } })) {
//         slug = `${base}-${n++}`;
//       }

//       p.slug = slug;
//       // eslint-disable-next-line no-await-in-loop
//       await p.save();
//       console.log(`↳ ${p.title} → ${p.slug}`);
//     }

//     console.log('🎉 Backfill complete');
//   } catch (e) {
//     console.error('❌ Backfill error:', e);
//   } finally {
//     await mongoose.disconnect();
//     process.exit(0);
//   }
// };

// run();



// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import Property from '../models/Property.js';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const runSeed = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('✅ Connected to MongoDB');

//     const filePath = join(__dirname, 'properties_seed_data.json');
//     const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//     await Property.deleteMany(); // optional
//     const inserted = await Property.insertMany(data);

//     console.log(`✅ Inserted ${inserted.length} properties`);
//     process.exit();
//   } catch (err) {
//     console.error('❌ Seed error:', err);
//     process.exit(1);
//   }
// };

// runSeed();
