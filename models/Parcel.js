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
      requiredd: true,
      unique: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderPhone: {
      type: String,
      required: true,
      trim: true,
    },
    senderAddress: {
      type: String,
      required: true,
      trim: true,
    },
    receiverName: {
      type: String,
      requiredd: true,
      trim: true,
    },
    receiverPhone: {
      type: String,
      requiredd: true,
      trim: true,
    },
    receiverAddress: {
      type: String,
      requiredd: true,
      trim: true,
    },
    shipmentType: {
      type: String,
      enum: ["national", "international"],
      requiredd: true,
    },
    originCity: {
      type: String,
      required: true,
      trim: true,
    },
    destinationCity: {
      type: String,
      required: true,
      trim: true,
    },
    deliverType: {
      type: String,
      enum: ["sameDay", "overnight", "standard"],
      requiredd: true,
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
      requiredd: true,
      trim: true,
    },
    weight: {
      type: Number,
      requiredd: true,
      min: 0,
    },
    price: {
      type: Number,
      requiredd: true,
      min: 0,
    },
    checkpoints: [checkpointSchema],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const Parcel = mongoose.model("Parcel", parcelSchema);
