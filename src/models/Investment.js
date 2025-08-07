// src/models/Investment.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const investmentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true
  },
  amount:   { type: Number, required: true },
  slots:    { type: Number, default: 1 },   // how many slots bought
  date:     { type: Date, default: Date.now }

  // Optional:
  // status: { type: String, enum: ['confirmed', 'pending', 'failed'], default: 'confirmed' }
}, {
  timestamps: true,
  versionKey: false
});

export default model('Investment', investmentSchema);



// src/models/Investment.js
// import mongoose from 'mongoose';
// const { Schema, model } = mongoose;

// const investmentSchema = new Schema({
//   user:     { type: Schema.Types.ObjectId, ref: 'User',     required: true },
//   property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
//   amount:   { type: Number, required: true },
//   slots:    { type: Number, default: 1 },   // how many slots bought
//   date:     { type: Date,   default: Date.now }
// },
// {
//     timestamps: true,
//     versionKey: false
//   }
// );

// export default model('Investment', investmentSchema);
