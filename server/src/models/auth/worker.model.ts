import mongoose, { Document, Model, Schema } from "mongoose";

export enum AvailabilityStatus {
  FULL_TIME = "Full-Time",
  PART_TIME = "Part-Time",
}

export enum VerificationStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export interface IWorker extends Document {
  userId: mongoose.Types.ObjectId;
  cooperativeId?: mongoose.Types.ObjectId;
  skills: string[];
  availability: AvailabilityStatus;
  yearsOfExperience: number;
  verificationStatus: VerificationStatus;
  rating: number;
  address?: {
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const workerSchema = new Schema<IWorker>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },

    cooperativeId: {
      type: Schema.Types.ObjectId,
      ref: "Cooperative",
      index: true,
    },


    skills: {
      type: [String],
      default: [],
    },

    availability: {
      type: String,
      enum: Object.values(AvailabilityStatus),
      default: AvailabilityStatus.FULL_TIME,
    },

    yearsOfExperience: {
      type: Number,
      default: 0,
      min: [0, "Years of experience cannot be negative"],
    },
    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
      index: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },

    address: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Worker: Model<IWorker> =
  mongoose.models.Worker || mongoose.model<IWorker>("Worker", workerSchema);

export default Worker;