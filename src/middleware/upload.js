import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Directory and base URL configurable via environment
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const BASE_URL   = process.env.SERVER_URL || '';

// Multer storage: save files with timestamped names
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}`;
    cb(null, `${name}${ext}`);
  }
});

// File filter: only images
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = ['.png', '.jpg', '.jpeg', '.gif'];
  const ok = allowed.includes(ext);
  cb(ok ? null : new Error('Only images allowed'), ok);
};

// Multer upload middleware
export const uploadImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

/**
 * Build full URL for a given uploaded filename
 * @param {string} filename
 * @returns {string}
 */
export function getImageUrl(filename) {
  return `${BASE_URL}/${UPLOAD_DIR}/${filename}`;
}

/**
 * Convert an array of multer file objects to full URLs
 * @param {Array} files
 * @returns {string[]}
 */
export function getImageUrls(files) {
  if (!files) return [];
  return files.map(file => getImageUrl(file.filename));
}

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!/image\/(png|jpe?g|webp)/.test(file.mimetype)) {
      return cb(new Error('Only PNG/JPG/WEBP allowed'));
    }
    cb(null, true);
  }
});

// // src/middleware/upload.js
// import multer from 'multer';
// import path from 'path';

// // store uploads in ./uploads and only accept images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename:    (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
//   }
// });

// export const uploadImages = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const ok = ['.png','.jpg','.jpeg','.gif'].includes(path.extname(file.originalname).toLowerCase());
//     cb(ok ? null : new Error('Only images allowed'), ok);
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }  // 5MB max per file
// });
