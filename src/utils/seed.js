import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/Property.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const filePath = join(__dirname, 'properties_seed_data.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    await Property.deleteMany(); // optional
    const inserted = await Property.insertMany(data);

    console.log(`✅ Inserted ${inserted.length} properties`);
    process.exit();
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

runSeed();
