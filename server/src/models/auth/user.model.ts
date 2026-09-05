import mongoose, { Document, Model, Schema } from "mongoose";

export enum UserRole {
  WORKER = "WORKER",
  CUSTOMER = "CUSTOMER",
  COOPERATIVE = "COOPERATIVE",
  SUPERADMIN = "SUPERADMIN",
}

export enum AccountStatus {
  SUSPEND = "SUSPEND",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;

  role: UserRole[];

  profilePicture?: string;

  isEmailVerified: boolean;
  isActive: boolean;

  emailVerificationToken?: string;
  emailVerificationExpires?: Date;

  passwordResetToken?: string;
  passwordResetExpires?: Date;

  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  location?: {
    type: string;
    coordinates: [number, number];
  };

  accountStatus: AccountStatus;

  lastLoginAt?: Date;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
    },

    role: {
      type: [String],
      enum: Object.values(UserRole),
      required: true,
      default: [UserRole.CUSTOMER],
      index: true,
    },

    profilePicture: {
      type: String,
      trim: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zip: { type: String, default: "" },
      country: { type: String, default: "" },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;