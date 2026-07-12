import mongoose from "mongoose";
const checkpointSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["arrived", "in_transit", "out_for_delivery", "delivered"],
      required: true,
    },
    timestamps: {
      type: Date,
      default: Date.now,
    },
    updateBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const parcelSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    senderName: {
      type: String,
      require: true,
      trim: true,
    },
    senderPhone: {
      type: String,
      require: true,
      trim: true,
    },
    senderAddress: {
      type: String,
      require: true,
      trim: true,
    },
    receiverName: {
      type: String,
      require: true,
      trim: true,
    },
    receiverPhone: {
      type: String,
      require: true,
      trim: true,
    },
    receiverAddress: {
      type: String,
      require: true,
      trim: true,
    },
    shipmentType: {
      type: String,
      enum: ["national", "international"],
      required: true,
    },
    originCity: {
      type: String,
      require: true,
      trim: true,
    },
    destinationCity: {
      type: String,
      require: true,
      trim: true,
    },
    deliverType: {
      type: String,
      enum: ["sameDay", "overnight", "standard"],
      required: true,
    },
    parcelCategory: {
      type: String,
      enum: [
        "clothing",
        "food",
        "medicine",
        "cosmetics",
        "books",
        "small_package",
        "large_package",
      ],
      required: true,
      trim: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    checkpoints: [checkpointSchema],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const Parcel = mongoose.model("Parcel", parcelSchema);
