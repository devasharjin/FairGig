import mongoose, { Document, Model, Schema, Types } from "mongoose";

export enum ContractStatus {
  OPEN = "OPEN",
  BID_SUBMITTED = "BID_SUBMITTED",
  AWARDED = "AWARDED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum BidStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface ICooperativeBid {
  _id?: Types.ObjectId;
  cooperative: Types.ObjectId;
  proposedAmount: number;
  proposedWorkersCount: number;
  proposalNotes: string;
  status: BidStatus;
  submittedAt: Date;
}

export interface IInstitutionalContract extends Document {
  contractNumber: string;
  title: string;
  clientName: string;
  clientType: "Residential Society" | "Corporate / Commercial" | "Government / Municipal" | "Educational Institution" | "Other";
  category?: Types.ObjectId;
  description: string;
  scopeOfWork: string[];
  location: string;
  budget: number;
  requiredWorkers: number;
  tradeRequired: string;
  durationDays: number;
  deadlineDate: Date;
  startDate?: Date;
  status: ContractStatus;
  bids: ICooperativeBid[];
  awardedCooperative?: Types.ObjectId;
  allocatedWorkers: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CooperativeBidSchema = new Schema<ICooperativeBid>(
  {
    cooperative: {
      type: Schema.Types.ObjectId,
      ref: "Cooperative",
      required: true,
    },
    proposedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    proposedWorkersCount: {
      type: Number,
      required: true,
      min: 1,
    },
    proposalNotes: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(BidStatus),
      default: BidStatus.PENDING,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const InstitutionalContractSchema = new Schema<IInstitutionalContract>(
  {
    contractNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientType: {
      type: String,
      required: true,
      enum: [
        "Residential Society",
        "Corporate / Commercial",
        "Government / Municipal",
        "Educational Institution",
        "Other",
      ],
      default: "Residential Society",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    scopeOfWork: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    requiredWorkers: {
      type: Number,
      required: true,
      min: 1,
    },
    tradeRequired: {
      type: String,
      required: true,
      trim: true,
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },
    deadlineDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(ContractStatus),
      default: ContractStatus.OPEN,
      index: true,
    },
    bids: [CooperativeBidSchema],
    awardedCooperative: {
      type: Schema.Types.ObjectId,
      ref: "Cooperative",
      index: true,
    },
    allocatedWorkers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Worker",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const InstitutionalContract: Model<IInstitutionalContract> =
  mongoose.models.InstitutionalContract ||
  mongoose.model<IInstitutionalContract>(
    "InstitutionalContract",
    InstitutionalContractSchema
  );

export default InstitutionalContract;
