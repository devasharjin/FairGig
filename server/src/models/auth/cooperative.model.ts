import mongoose, { Document, Model, Schema } from "mongoose";
import { VerificationStatus } from "./worker.model";

export interface ICooperative extends Document {
  userId: mongoose.Types.ObjectId;
  cooperativeName: string;
  cooperativeDescription?: string;
  cooperativeAddress?: string;
  cooperativePhone?: string;
  cooperativeEmail?: string;
  cooperativeLogo?: string;
  members: mongoose.Types.ObjectId[];
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const cooperativeSchema = new Schema<ICooperative>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },
    cooperativeName: {
      type: String,
      required: [true, "Cooperative name is required"],
      trim: true,
    },
    cooperativeDescription: {
      type: String,
      trim: true,
    },
    cooperativeAddress: {
      type: String,
      trim: true,
    },
    cooperativePhone: {
      type: String,
      trim: true,
    },
    cooperativeEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    cooperativeLogo: {
      type: String,
      trim: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Worker",
      },
    ],
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

const Cooperative: Model<ICooperative> =
  mongoose.models.Cooperative ||
  mongoose.model<ICooperative>("Cooperative", cooperativeSchema);

export default Cooperative;