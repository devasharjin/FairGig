import mongoose, { Document, Model, Schema } from "mongoose";
import { VerificationStatus } from "./worker.model";

export interface IFederative extends Document {
  userId: mongoose.Types.ObjectId;
  federativeName: string;
  federativeDescription?: string;
  federativeAddress?: string;
  federativePhone?: string;
  federativeEmail?: string;
  federativeLogo?: string;
  members: mongoose.Types.ObjectId[];
  services: string[];
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const federativeSchema = new Schema<IFederative>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },
    federativeName: {
      type: String,
      required: [true, "Federative name is required"],
      trim: true,
    },
    federativeDescription: {
      type: String,
      trim: true,
    },
    federativeAddress: {
      type: String,
      trim: true,
    },
    federativePhone: {
      type: String,
      trim: true,
    },
    federativeEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    federativeLogo: {
      type: String,
      trim: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cooperative",
      },
    ],
    services: {
      type: [String],
      default: [],
    },
    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Federative: Model<IFederative> =
  mongoose.models.Federative ||
  mongoose.model<IFederative>("Federative", federativeSchema);

export default Federative;