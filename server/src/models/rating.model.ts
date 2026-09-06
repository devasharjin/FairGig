import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IRating extends Document {
  booking: Types.ObjectId;
  bookingId?: Types.ObjectId;
  customer: Types.ObjectId;
  customerId?: Types.ObjectId;
  worker: Types.ObjectId;
  workerId?: Types.ObjectId;
  service?: Types.ObjectId;
  serviceId?: Types.ObjectId;
  cooperative?: Types.ObjectId;
  cooperativeId?: Types.ObjectId;

  rating: number; // 1 to 5
  review?: string; // Optional customer feedback / comment

  createdAt: Date;
  updatedAt: Date;
}

export interface IRatingModel extends Model<IRating> {
  calculateAverageRating(workerId: Types.ObjectId | string): Promise<void>;
}

const ratingSchema = new Schema<IRating, IRatingModel>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking reference is required"],
      unique: true,
      index: true,
      alias: "bookingId",
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer reference is required"],
      index: true,
      alias: "customerId",
    },

    worker: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: [true, "Worker reference is required"],
      index: true,
      alias: "workerId",
    },

    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      index: true,
      alias: "serviceId",
    },

    cooperative: {
      type: Schema.Types.ObjectId,
      ref: "Cooperative",
      index: true,
      alias: "cooperativeId",
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    review: {
      type: String,
      trim: true,
      maxlength: [1000, "Review cannot exceed 1000 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast retrieval
ratingSchema.index({ worker: 1, rating: -1 });
ratingSchema.index({ customer: 1, createdAt: -1 });
ratingSchema.index({ service: 1 });
ratingSchema.index({ cooperative: 1 });

// Static method to calculate worker average rating
ratingSchema.statics.calculateAverageRating = async function (
  workerId: Types.ObjectId | string
) {
  try {
    const stats = await this.aggregate([
      {
        $match: {
          worker: new Types.ObjectId(workerId.toString()),
        },
      },
      {
        $group: {
          _id: "$worker",
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await mongoose.model("Worker").findByIdAndUpdate(workerId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
      });
    } else {
      await mongoose.model("Worker").findByIdAndUpdate(workerId, {
        rating: 0,
      });
    }
  } catch (error) {
    console.error("Error updating worker average rating:", error);
  }
};

// Post-save hook to recalculate worker average rating
ratingSchema.post("save", async function () {
  try {
    const RatingModel = this.constructor as IRatingModel;
    if (this.worker) {
      await RatingModel.calculateAverageRating(this.worker);
    }
  } catch (error) {
    console.error("Error in rating post-save hook:", error);
  }
});

const Rating: IRatingModel =
  (mongoose.models.Rating as IRatingModel) ||
  mongoose.model<IRating, IRatingModel>("Rating", ratingSchema);

export default Rating;
