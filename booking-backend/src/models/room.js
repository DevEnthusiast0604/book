const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotels",
    },
    name: String,
    guestAllowed: Number,
    amenities: [String],
    price: Number,
    wasPrice: Number,
    roomAvailable: Number,
    cancellationPolicy: String,
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("rooms", roomSchema);
