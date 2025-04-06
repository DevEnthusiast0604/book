const mongoose = require("mongoose");

// Define the Note model Schema
const spotSchema = new mongoose.Schema(
  {
    name: String,
    identifier: String,
    description: String,
    type: String,
    location: String,
    position: {
      lat: Number,
      lng: Number,
    },
    amenities: [String],
    entrancePolicies: [String],
    closingPolicies: [String],
    openingDays: [String],
    images: [String],
    fee: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("spots", spotSchema);
