import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type ServicePriceType = "hourly" | "meters";

export interface IService extends Document {
  name: string;
  description: string;
  category: Types.ObjectId;
  priceType: ServicePriceType;
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
      required: [true, "Price type is required"],
    },

    hourlyPrice: {
      type: Number,
      min: [0, "Hourly price cannot be negative"],
      required: function (this: IService) {
        return this.priceType === "hourly";
      },
    },

    metersPrice: {
      type: Number,
      min: [0, "Meters price cannot be negative"],
      required: function (this: IService) {
        return this.priceType === "meters";
      },
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

// Prevent duplicate service names within the same category
serviceSchema.index(
  { category: 1, name: 1 },
  { unique: true }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", serviceSchema);

export default Service;