import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IService extends Document {
    name: string;
    description: string;
    category: Types.ObjectId;
    isActive: boolean;
}

const serviceSchema = new Schema<IService>(
    {
        name: {
            type: String,
            required: [true, "Service name is required"],
            unique: true,
            trim: true,
            minlength: [2, "Service name must contain at least 2 characters"],
            maxlength: [100, "Service name cannot exceed 100 characters"],
            index: true,
        },
        description: {
            type: String,
            required: [true, "Service description is required"],
            trim: true,
            maxlength: [500, "Service description cannot exceed 500 characters"],
        },
        category: {
            type: Types.ObjectId,
            ref: "Category",
            required: [true, "Service category is required"],
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>("Service", serviceSchema);

export default Service;