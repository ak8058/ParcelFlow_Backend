import joi from "joi";

// Login validation
export const loginValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const addUserValidation = joi.object({
  name: joi.string().min(2).max(100).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const createParcelValidation = joi.object({
  senderName: joi.string().min(2).max(100).required(),
  senderPhone: joi.string().required(),
  senderAddress: joi.string().required(),

  receiverName: joi.string().min(2).max(100).required(),
  receiverPhone: joi.string().required(),
  receiverAddress: joi.string().required(),

  shipmentType: joi.string().valid("national", "international").required(),

  originCity: joi.string().required(),
  destinationCity: joi.string().required(),

  deliverType: joi
    .string()
    .valid("sameDay", "overnight", "standard")
    .required(),

  parcelCategory: joi
    .string()
    .valid(
      "clothing",
      "food",
      "medicine",
      "cosmetics",
      "books",
      "small_package",
      "large_package",
    )
    .required(),

  weight: joi.number().positive().required(),
});

export const addCheckpointValidation = joi.object({
  location: joi.string().min(2).max(200).required(),
  title: joi.string().min(2).max(200).required(),
  description: joi.string().allow("", null),
  status: joi
    .string()
    .valid("arrived", "in_transit", "out_for_delivery", "delivered")
    .required(),
});
