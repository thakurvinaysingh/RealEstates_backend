import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import connectDB from './config/dbConnect.js';
import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import adminRoutes from './routes/admin.js';
import errorHandler from './utils/errorHandler.js';
import investRoutes  from './routes/investRoutes.js';
import userRoutes from './routes/userRoutes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();
connectDB();

const app = express();
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500
});
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/investments',investRoutes);
app.use('/api/user', userRoutes);




//testing on server side

app.get('/', (req, res) => {
    res.send('API is working ✅');
  });
// Global Error Handler
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found ❌' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

