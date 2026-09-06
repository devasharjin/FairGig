import { Request, Response } from "express";
import mongoose from "mongoose";
import Booking, {
  BookingStatus,
  CancelledByRole,
} from "../../models/booking.model";
import Worker from "../../models/auth/worker.model";
import User from "../../models/auth/user.model";
import { fail, ok } from "../../shared/envelope";

export async function getAvailableGigs(req: Request, res: Response) {
  const userId = (req.user as any)?.userId || (req.user as any)?._id;
  const worker = await Worker.findOne({ userId })
    .select("_id skills cooperativeId")
    .lean();

  if (!worker) {
    return fail(res, "Worker profile not found", null, 404);
  }

  const query: Record<string, any> = {
    status: BookingStatus.PENDING,
    $or: [{ worker: null }, { worker: { $exists: false } }],
  };

  // If worker has registered skills or cooperative, filter relevant gigs
  if (worker.skills && worker.skills.length > 0) {
    query.$or = [
      { service: { $in: worker.skills } },
      ...(worker.cooperativeId ? [{ cooperative: worker.cooperativeId }] : []),
    ];
    query.status = BookingStatus.PENDING;
    query.worker = null;
  }

  const gigs = await Booking.find(query)
    .populate("service", "name description priceType hourlyPrice metersPrice")
    .populate("category", "name icon slug")
    .populate("customer", "name phone profilePicture address")
    .sort({ scheduledDate: 1, createdAt: -1 })
    .lean();

  return ok(res, gigs, "Available gigs retrieved successfully");
}

export async function getMyJobs(req: Request, res: Response) {
  const userId = (req.user as any)?.userId || (req.user as any)?._id;
  const worker = await Worker.findOne({ userId }).select("_id").lean();

  if (!worker) {
    return fail(res, "Worker profile not found", null, 404);
  }

  const { status } = req.query;
  const filter: Record<string, any> = { worker: worker._id };

  if (status && typeof status === "string" && status !== "all") {
    if (status === "active") {
      filter.status = {
        $in: [
          BookingStatus.CONFIRMED,
          BookingStatus.ASSIGNED,
          BookingStatus.IN_PROGRESS,
        ],
      };
    } else if (status === "completed") {
      filter.status = BookingStatus.COMPLETED;
    } else if (status === "cancelled") {
      filter.status = BookingStatus.CANCELLED;
    } else {
      filter.status = status.toUpperCase();
    }
  }

  const jobs = await Booking.find(filter)
    .populate("service", "name description priceType hourlyPrice metersPrice")
    .populate("category", "name icon slug")
    .populate("customer", "name phone profilePicture address")
    .populate("rating")
    .sort({ scheduledDate: -1, createdAt: -1 })
    .lean();

  return ok(res, jobs, "Worker jobs retrieved successfully");
}

export async function getWorkerJobById(req: Request, res: Response) {
  const userId = (req.user as any)?.userId || (req.user as any)?._id;
  const worker = await Worker.findOne({ userId }).select("_id").lean();

  if (!worker) {
    return fail(res, "Worker profile not found", null, 404);
  }

  const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, "Invalid job ID", null, 400);
  }

  const job = await Booking.findById(id)
    .populate("service", "name description priceType hourlyPrice metersPrice")
    .populate("category", "name icon slug")
    .populate("customer", "name phone profilePicture address")
    .populate("rating")
    .lean();

  if (!job) {
    return fail(res, "Job not found", null, 404);
  }

  return ok(res, job, "Job retrieved successfully");
}

export async function acceptGig(req: Request, res: Response) {
  const userId = (req.user as any)?.userId || (req.user as any)?._id;
  const worker = await Worker.findOne({ userId }).select("_id skills cooperativeId");

  if (!worker) {
    return fail(res, "Worker profile not found", null, 404);
  }

  const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, "Invalid gig ID", null, 400);
  }

  // Atomically find pending and unassigned gig
  const booking = await Booking.findOne({
    _id: id,
    status: BookingStatus.PENDING,
    $or: [{ worker: null }, { worker: { $exists: false } }],
  });

  if (!booking) {
    return fail(
      res,
      "This gig is no longer available or has already been accepted by another worker",
      null,
      409
    );
  }

  booking.worker = worker._id;
  if (!booking.cooperative && worker.cooperativeId) {
    booking.cooperative = worker.cooperativeId;
  }
  booking.status = BookingStatus.CONFIRMED;
  booking.assignedAt = new Date();

  await booking.save();

  const updated = await Booking.findById(booking._id)
    .populate("service", "name description priceType hourlyPrice metersPrice")
    .populate("category", "name icon")
    .populate("customer", "name phone profilePicture address")
    .lean();

  return ok(res, updated, "Gig accepted successfully! It is now in your active jobs.");
}

export async function updateJobStatus(req: Request, res: Response) {
  const userId = (req.user as any)?.userId || (req.user as any)?._id;
  const worker = await Worker.findOne({ userId }).select("_id totalJobsCompleted");

  if (!worker) {
    return fail(res, "Worker profile not found", null, 404);
  }

  const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
  const { status, reason } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, "Invalid job ID", null, 400);
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return fail(res, "Job not found", null, 404);
  }

  // Verify worker owns this job
  if (String(booking.worker) !== String(worker._id)) {
    return fail(res, "You are not assigned to this job", null, 403);
  }

  if (status === BookingStatus.IN_PROGRESS) {
    if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.ASSIGNED) {
      return fail(res, "Job must be confirmed before starting", null, 400);
    }
    booking.status = BookingStatus.IN_PROGRESS;
    booking.startedAt = new Date();
  } else if (status === BookingStatus.COMPLETED) {
    if (booking.status !== BookingStatus.IN_PROGRESS && booking.status !== BookingStatus.CONFIRMED) {
      return fail(res, "Only active or in-progress jobs can be completed", null, 400);
    }
    booking.status = BookingStatus.COMPLETED;
    booking.completedAt = new Date();

    // Increment worker's completed jobs
    worker.totalJobsCompleted = (worker.totalJobsCompleted || 0) + 1;
    await worker.save();
  } else if (status === BookingStatus.CANCELLED) {
    if (booking.status === BookingStatus.COMPLETED) {
      return fail(res, "Completed jobs cannot be cancelled", null, 400);
    }
    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date();
    booking.cancelledBy = CancelledByRole.WORKER;
    booking.cancellationReason = typeof reason === "string" ? reason.trim() : "Cancelled by worker";
  } else {
    return fail(res, "Invalid status transition", null, 400);
  }

  await booking.save();

  const updated = await Booking.findById(booking._id)
    .populate("service", "name description priceType hourlyPrice metersPrice")
    .populate("category", "name icon")
    .populate("customer", "name phone profilePicture address")
    .populate("rating")
    .lean();

  return ok(res, updated, `Job status updated to ${booking.status}`);
}

export async function getWorkerStats(req: Request, res: Response) {
  const userId = (req.user as any)?.userId || (req.user as any)?._id;
  const worker = await Worker.findOne({ userId })
    .select("_id skills cooperativeId rating totalJobsCompleted verificationStatus")
    .lean();

  if (!worker) {
    return fail(res, "Worker profile not found", null, 404);
  }

  const gigFilter = {
    status: BookingStatus.PENDING,
    $or: [{ worker: null }, { worker: { $exists: false } }],
    ...(worker.skills && worker.skills.length > 0
      ? {
          $or: [
            { service: { $in: worker.skills } },
            ...(worker.cooperativeId ? [{ cooperative: worker.cooperativeId }] : []),
          ],
        }
      : {}),
  };

  // Run all counts and earnings aggregate in parallel in 1 roundtrip
  const [activeJobsCount, completedJobsCount, availableGigsCount, earningsAgg] =
    await Promise.all([
      Booking.countDocuments({
        worker: worker._id,
        status: {
          $in: [
            BookingStatus.CONFIRMED,
            BookingStatus.ASSIGNED,
            BookingStatus.IN_PROGRESS,
          ],
        },
      }),
      Booking.countDocuments({
        worker: worker._id,
        status: BookingStatus.COMPLETED,
      }),
      Booking.countDocuments(gigFilter),
      Booking.aggregate([
        {
          $match: {
            worker: worker._id,
            status: BookingStatus.COMPLETED,
          },
        },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

  const totalEarnings = earningsAgg[0]?.totalEarnings || 0;

  return ok(
    res,
    {
      activeJobs: activeJobsCount,
      completedJobs: completedJobsCount,
      availableGigs: availableGigsCount,
      totalEarnings,
      rating: worker.rating || 0,
      totalJobsCompleted: worker.totalJobsCompleted || completedJobsCount,
      verificationStatus: worker.verificationStatus,
    },
    "Worker stats retrieved successfully"
  );
}

export async function updateWorkerProfile(req: Request, res: Response) {
  const userId = (req.user as any)?.userId || (req.user as any)?._id;
  const worker = await Worker.findOne({ userId });

  if (!worker) {
    return fail(res, "Worker profile not found", null, 404);
  }

  const { availability, experience, location, isActive, name, phone } = req.body;

  if (availability !== undefined) {
    worker.availability = availability;
  }
  if (experience !== undefined && !isNaN(Number(experience))) {
    worker.experience = Number(experience);
  }
  if (isActive !== undefined) {
    worker.isActive = Boolean(isActive);
  }
  if (location && typeof location === "object") {
    worker.location = {
      address: location.address !== undefined ? String(location.address) : worker.location?.address || "",
      city: location.city !== undefined ? String(location.city) : worker.location?.city || "",
      state: location.state !== undefined ? String(location.state) : worker.location?.state || "",
      pincode: location.pincode !== undefined ? String(location.pincode) : worker.location?.pincode || "",
      latitude: location.latitude !== undefined ? Number(location.latitude) : worker.location?.latitude || 0,
      longitude: location.longitude !== undefined ? Number(location.longitude) : worker.location?.longitude || 0,
    };
  }

  await worker.save();

  if (name || phone) {
    const user = await User.findById(userId);
    if (user) {
      if (name && typeof name === "string") user.name = name.trim();
      if (phone && typeof phone === "string") user.phone = phone.trim();
      await user.save();
    }
  }

  const updatedWorker = await Worker.findOne({ userId })
    .populate("cooperativeId")
    .populate("skills", "name description priceType hourlyPrice metersPrice");
  const updatedUser = await User.findById(userId);

  return ok(
    res,
    {
      user: updatedUser,
      worker: updatedWorker,
      profile: updatedWorker,
    },
    "Worker profile updated successfully"
  );
}

