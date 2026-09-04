import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ICooperativeService extends Document {
  cooperative: Types.ObjectId;
  service: Types.ObjectId;
  isActive: boolean;
  priceType: "hourly" | "fixed";
  HourlyPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

const cooperativeServiceSchema = new Schema<ICooperativeService>(
  {
    cooperative: {
      type: Schema.Types.ObjectId,
      ref: "Cooperative",
      required: [true, "Cooperative reference is required"],
      index: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service reference is required"],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    priceType: {
      type: String,
      enum: ["hourly", "fixed"],
      required: [true, "Price type is required (hourly or fixed)"],
    },
    HourlyPrice: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cooperativeServiceSchema.index({ cooperative: 1, service: 1 }, { unique: true });

const CooperativeService: Model<ICooperativeService> =
  mongoose.models.CooperativeService ||
  mongoose.model<ICooperativeService>("CooperativeService", cooperativeServiceSchema);

export default CooperativeService;