import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const propertySchema = new Schema({
  // ── Core fields ─────────────────────────────
  title: { type: String, required: true, index: true },
  address:          String,
  location:         { type: String, index: true },
  startDate:        Date,
  endDate:          Date,
  goalAmount:       Number, // goalAmount: how much to raise via investment
  currentAmount:    { type: Number, default: 0 },
  investorsCount:   { type: Number, default: 0 },
  propertyType:     { type: String, index: true },
  distribution:     String,
  maxTerm:          String,
  annualReturn:     String,

  // ── Images ───────────────────────────────────
  images:           [String],  // cover images
  gallery:          [String],  // extra images

  // ── Embedded “details” ───────────────────────
  projectDescription: String,
  reasonsToInvest:    [String],
  financialTerms: {
    maxLoanTerm:     String,
    security:        String,
    annualReturn:    String
  },
  tieredReturn:       [{ range: String, rate: String }],
  capitalGrowthSplit: [{ party: String, pct: String }],
  owner: {
    name:             String,
    bio:              String,
    avatarUrl:        String
  },
  faqs:               [{ question: String, answer: String }],
  risks:              String,
  mapEmbedUrl:        String,
  occupancyOptions:   [String],
  investmentOverview: String,
  keyUpdates:         [{ date: Date, text: String, link: String }],
  reports:            [{ title: String, desc: String, label: String, url: String }],

   // ── Slot logic ───────────────────────────────
   totalUnits:    { type: Number, required: true },      // e.g. 1000
   slotsCount:    { type: Number, required: true },      // e.g. 20
   slotsSold:     { type: Number, default: 0 },          // increments on each buy
   totalValue:    { type: Number, required: true }        // totalValue: full market value of the property
}, {
    timestamps: true,
    versionKey: false
});

export default model('Property', propertySchema);


