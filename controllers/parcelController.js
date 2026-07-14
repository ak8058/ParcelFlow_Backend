import { Parcel } from "../models/Parcel.js";
import { calculateCost } from "../services/calculateCost.js";
import { generateTrackingId } from "../services/genetateTrackingId.js";
import {
  createParcelValidation,
  addCheckpointValidation,
} from "../validations/validations.js";

export const createParcel = async (req, res, next) => {
  try {
    const { error, value } = createParcelValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const priceInfo = calculateCost({
      originCity: value.originCity,
      destinationCity: value.destinationCity,
      shipmentType: value.shipmentType,
      parcelCategory: value.parcelCategory,
      weight: value.weight,
      deliverType: value.deliverType,
    });

    let trackingId = generateTrackingId();

    if (!trackingId) {
      return res
        .status(500)
        .json({ message: "Failed to generate unique tracking ID" });
    }
    const parcel = await Parcel.create({
      ...value,
      trackingId,
      price: priceInfo.price,
      checkpoints: [
        {
          location: value.originCity,
          status: "arrived",
          title: `Parcel arrived at ${value.originCity} Branch`,
          description: `Your parcel has arrived at our ${value.originCity} branch and is being processed for the next step in its journey `,
          updateBy: req.user ? req.user.name : "system",
        },
      ],
    });
    res.status(201).json(parcel);
  } catch (error) {
    next(error);
  }
};

export const getParcelByTrackingId = async (req, res, next) => {
  try {
    const { trackingId } = req.params;
    const parcel = await Parcel.findOne({ trackingId });
    if (!parcel) {
      return res.status(400).json({ message: "Parcel not found" });
    }
    res.status(200).json(parcel);
  } catch (error) {
    next(error);
  }
};

export const addCheckpoint = async (req, res, next) => {
  try {
    const { trackingId } = req.params;
    const { error, value } = addCheckpointValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const parcel = await Parcel.findOne({ trackingId });
    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }
    const checkpoint = {
      ...value,
      updateBy: req.user ? req.user.name : "system",
      timestamp: new Date(),
    };
    parcel.checkpoints.push(checkpoint);
    parcel.status = value.status;
    await parcel.save();
    res.status(201).json(parcel);
  } catch (error) {
    next(error);
  }
};

export const getAllParcels = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status;
    const search = req.query.search;
    const matchStage = {};
    if (status) {
      matchStage["lastCheckpoint.status"] = status;
    }
    if (search) {
      matchStage.trackingId = { $regex: search, $options: "i" };
    }
    const skip = (page - 1) * limit;
    const [parcels, total] = await Promise.all([
      Parcel.aggregate([
        {
          $addFields: {
            lastCheckpoint: { $arrayElemAt: ["$checkpoints", -1] },
          },
        },
        {
          $match: matchStage,
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]),
      Parcel.aggregate([
        {
          $addFields: {
            lastCheckpoint: { $arrayElemAt: ["$checkpoints", -1] },
          },
        },
        {
          $match: matchStage,
        },
        {
          $count: "total",
        },
      ]),
    ]);

    const totalCount = total.length > 0 ? total[0].total : 0;
    res.status(200).json({
      data: parcels,
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};
