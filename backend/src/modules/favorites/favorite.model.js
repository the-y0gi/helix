const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ["hotel"], //in future add adventure
      required: true,
      default: "hotel",
    },
  },
  { timestamps: true },
);

favoriteSchema.index({ user: 1, itemId: 1, itemType: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
