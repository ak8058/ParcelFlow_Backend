import express from "express";
import {
  createParcel,
  getParcelByTrackingId,
  addCheckpoint,
  getAllParcels
} from "../controllers/parcelController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/parcels:
 *   post:
 *     summary: Create a new parcel
 *     tags:
 *       - Parcel
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderName
 *               - senderPhone
 *               - senderAddress
 *               - receiverName
 *               - receiverPhone
 *               - receiverAddress
 *               - shipmentType
 *               - originCity
 *               - destinationCity
 *               - deliverType
 *               - parcelCategory
 *               - weight
 *             properties:
 *               senderName:
 *                 type: string
 *                 example: Rahul Sharma
 *               senderPhone:
 *                 type: string
 *                 example: "9876543210"
 *               senderAddress:
 *                 type: string
 *                 example: Jaipur, Rajasthan
 *               receiverName:
 *                 type: string
 *                 example: Amit Verma
 *               receiverPhone:
 *                 type: string
 *                 example: "9123456789"
 *               receiverAddress:
 *                 type: string
 *                 example: Delhi, India
 *               shipmentType:
 *                 type: string
 *                 enum:
 *                   - national
 *                   - international
 *               originCity:
 *                 type: string
 *                 example: Jaipur
 *               destinationCity:
 *                 type: string
 *                 example: Delhi
 *               deliverType:
 *                 type: string
 *                 enum:
 *                   - sameDay
 *                   - overnight
 *                   - standard
 *               parcelCategory:
 *                 type: string
 *                 enum:
 *                   - clothing
 *                   - food
 *                   - medicine
 *                   - cosmetics
 *                   - books
 *                   - small_package
 *                   - large_package
 *               weight:
 *                 type: number
 *                 example: 2.5
 *     responses:
 *       201:
 *         description: Parcel created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router.post("/", protect, adminOnly, createParcel);

/**
 * @swagger
 * /api/parcels/track/{trackingId}:
 *   get:
 *     summary: Track a parcel using Tracking ID
 *     tags:
 *       - Parcel
 *     parameters:
 *       - in: path
 *         name: trackingId
 *         required: true
 *         schema:
 *           type: string
 *         example: PF123456789
 *         description: Unique parcel tracking ID
 *     responses:
 *       200:
 *         description: Parcel details fetched successfully
 *       404:
 *         description: Parcel not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/track/:trackingId", getParcelByTrackingId);
/**
 * @swagger
 * /api/parcels/{trackingId}/checkpoint:
 *   put:
 *     summary: Add a checkpoint to a parcel
 *     tags:
 *       - Parcel
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique Parcel Tracking ID
 *         example: IND-CRR-526270785
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - title
 *               - status
 *             properties:
 *               location:
 *                 type: string
 *                 example: Delhi Hub
 *               title:
 *                 type: string
 *                 example: Parcel reached Delhi Hub
 *               description:
 *                 type: string
 *                 example: Parcel has arrived at the Delhi sorting center.
 *               status:
 *                 type: string
 *                 enum:
 *                   - arrived
 *                   - in_transit
 *                   - out_for_delivery
 *                   - delivered
 *     responses:
 *       200:
 *         description: Checkpoint added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Parcel not found
 *       500:
 *         description: Internal Server Error
 */

router.put("/:trackingId/checkpoint", protect, adminOnly, addCheckpoint);

/**
 * @swagger
 * /api/parcels:
 *   get:
 *     summary: Get all parcels with pagination, status filter and search
 *     tags:
 *       - Parcel
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - arrived
 *             - in_transit
 *             - out_for_delivery
 *             - delivered
 *         description: Filter parcels by current status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search parcel by tracking ID
 *         example: IND-CRR-526270785
 *     responses:
 *       200:
 *         description: Parcels fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router.get("/", protect, adminOnly, getAllParcels);

export default router;
