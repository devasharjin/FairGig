import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { FIXED_TRANSPORT_FEE } from "../services/billing.service";

export type ServicePriceType = "hourly" | "meters";

export interface IService extends Document {
  name: string;
  description: string;
  category: Types.ObjectId;
  priceType: ServicePriceType;
  firstHourRate: number;
  additionalHourRate: number;
  transportFee: number;
  cooperativeShare: number; // percentage 0-100
  insuranceShare: number;   // percentage 0-100
  hourlyPrice?: number;
  metersPrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [2, "Service name must be at least 2 characters"],
      maxlength: [100, "Service name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      maxlength: [1000, "Service description cannot exceed 1000 characters"],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Service category is required"],
      index: true,
    },

    priceType: {
      type: String,
      enum: {
        values: ["hourly", "meters"],
        message: "Price type must be either hourly or meters",
      },
      default: "hourly",
      required: [true, "Price type is required"],
    },

    firstHourRate: {
      type: Number,
      min: [0, "First hour rate cannot be negative"],
      default: function (this: IService) {
        return this.hourlyPrice ?? 0;
      },
    },

    additionalHourRate: {
      type: Number,
      min: [0, "Additional hour rate cannot be negative"],
      default: function (this: IService) {
        return this.firstHourRate ?? this.hourlyPrice ?? 0;
      },
    },

    transportFee: {
      type: Number,
      default: FIXED_TRANSPORT_FEE,
      immutable: true, // Fixed centrally at ₹30
    },

    cooperativeShare: {
      type: Number,
      min: [0, "Cooperative admin share cannot be negative"],
      max: [100, "Cooperative admin share cannot exceed 100%"],
      default: 10,
    },

    insuranceShare: {
      type: Number,
      min: [0, "Insurance share cannot be negative"],
      max: [100, "Insurance share cannot exceed 100%"],
      default: 5,
    },

    hourlyPrice: {
      type: Number,
      min: [0, "Hourly price cannot be negative"],
    },

    metersPrice: {
      type: Number,
      min: [0, "Meters price cannot be negative"],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validate combined cooperative and insurance share percentages
serviceSchema.pre("validate", function () {
  const coop = this.cooperativeShare ?? 0;
  const ins = this.insuranceShare ?? 0;
  if (coop + ins > 100) {
    throw new Error("Combined cooperative and insurance share cannot exceed 100%");
  }
});

// Prevent duplicate service names within the same category
serviceSchema.index(
  { category: 1, name: 1 },
  { unique: true }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", serviceSchema);

export default Service;