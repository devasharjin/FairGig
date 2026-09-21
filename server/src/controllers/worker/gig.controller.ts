import { Request, Response } from "express";
import mongoose from "mongoose";
import Booking, {
  BookingStatus,
  BookingType,
  CancelledByRole,
} from "../../models/booking.model";
import Worker from "../../models/auth/worker.model";
import User from "../../models/auth/user.model";
import Service from "../../models/service.model";
import { fail, ok } from "../../shared/envelope";
import { FIXED_TRANSPORT_FEE, BillingService } from "../../services/billing.service";

export async function getAvailableGigs(req: Request, res: Response) {
  const userId = (req.user as any)?.userId || (req.user as any)?._id;
  const worker = await Worker.findOne({ userId })
    .select("_id category categories skills cooperativeId")
    .lean();

  if (!worker) {
    return fail(res, "Worker profile not found", null, 404);
  }

  const { type } = req.query;

  // If worker has registered trade category, resolve category IDs and all services under that category
  const workerCats = [
    ...(worker.category ? [worker.category] : []),
    ...((worker as any).categories || []),
  ].filter(Boolean);

  if (workerCats.length === 0 && worker.skills && worker.skills.length > 0) {
    const srvCats = await Service.find({ _id: { $in: worker.skills } }).distinct("category");
    workerCats.push(...srvCats.filter(Boolean));
  }

  const categoryServices = workerCats.length > 0
    ? await Service.find({ category: { $in: workerCats } }).distinct("_id")
    : (worker.skills || []);

  // Strict category isolation: only jobs belonging to this worker's trade category can be returned
  const andConditions: any[] = [
    { status: BookingStatus.PENDING },
    { $or: [{ worker: null }, { worker: { $exists: false } }] },
  ];

  if (workerCats.length > 0 || categoryServices.length > 0) {
    const categoryClauses: any[] = [];
    if (workerCats.length > 0) {
      categoryClauses.push({ category: { $in: workerCats } });
    }
    if (categoryServices.length > 0) {
      categoryClauses.push({ service: { $in: categoryServices } });
    }
    andConditions.push({ $or: categoryClauses });
  }

  // Cooperative membership filter: workers only receive unassigned jobs or jobs designated for their cooperative
  if (worker.cooperativeId) {
    andConditions.push({
      $or: [
        { cooperative: worker.cooperativeId },
        { cooperative: null },
        { cooperative: { $exists: false } },
      ],
    });
  }

  if (type && typeof type === "string") {
    const t = type.toLowerCase();
    if (t === "emergency") {
      andConditions.push({ isEmergency: true });
    } else if (t === "on_demand" || t === "ondemand") {
      andConditions.push({ bookingType: BookingType.ON_DEMAND });
    } else if (t === "scheduled") {
      andConditions.push({ bookingType: BookingType.SCHEDULED });
    }
  }

  const query = { $and: andConditions };

  // Priority sorting: EMERGENCY gigs ranked FIRST, then imminent scheduled/on-demand dates
  const gigs = await Booking.find(query)
    .populate("service", "name description priceType firstHourRate additionalHourRate transportFee cooperativeShare insuranceShare hourlyPrice metersPrice emergencyAvailable emergencyFee")
    .populate("category", "name icon slug")
    .populate("customer", "name phone profilePicture address")
    .sort({ isEmergency: -1, scheduledDate: 1, createdAt: -1 })
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
    .populate("service", "name description priceType firstHourRate additionalHourRate transportFee cooperativeShare insuranceShare hourlyPrice metersPrice")
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
    .populate("service", "name description priceType firstHourRate additionalHourRate transportFee cooperativeShare insuranceShare hourlyPrice metersPrice")
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
  const worker = await Worker.findOne({ userId }).select("_id category categories skills cooperativeId");

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
  }).populate("service", "category");

  if (!booking) {
    return fail(
      res,
      "This gig is no longer available or has already been accepted by another worker",
      null,
      409
    );
  }

  // Enforce trade category match: worker can only accept gigs from their selected category
  const workerCats = [
    ...(worker.category ? [worker.category.toString()] : []),
    ...((worker as any).categories || []).map((c: any) => c.toString()),
  ].filter(Boolean);

  if (workerCats.length > 0) {
    const bookingCat = (booking.category || (booking.service as any)?.category)?.toString();
    if (bookingCat && !workerCats.includes(bookingCat)) {
      return fail(
        res,
        "You can only accept jobs matching your registered trade category.",
        null,
        403
      );
    }
  }

  // Enforce cooperative isolation if booking is reserved for a specific cooperative
  if (
    booking.cooperative &&
    worker.cooperativeId &&
    booking.cooperative.toString() !== worker.cooperativeId.toString()
  ) {
    return fail(
      res,
      "This job is reserved for members of another cooperative society.",
      null,
      403
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
    .populate("service", "name description priceType firstHourRate additionalHourRate transportFee cooperativeShare insuranceShare hourlyPrice metersPrice")
    .populate("category", "name icon")
    .populate("customer", "name phone profilePicture address")
    .lean();

  const message = booking.isEmergency
    ? "🚨 Emergency callout accepted! Proceed immediately to the customer location."
    : "Gig accepted successfully! It is now in your active jobs.";

  return ok(res, updated, message);
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
    if (booking.status === BookingStatus.COMPLETED) {
      return fail(res, "Cannot start a job that has already been completed", null, 400);
    }
    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.REJECTED) {
      return fail(res, "Cannot start a cancelled or rejected job", null, 400);
    }
    if (booking.startedAt || booking.status === BookingStatus.IN_PROGRESS) {
      return fail(res, "Job has already been started and is currently in progress", null, 400);
    }
    if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.ASSIGNED) {
      return fail(res, "Job must be confirmed or assigned before starting", null, 400);
    }

    // Record exact start timestamp on backend
    booking.status = BookingStatus.IN_PROGRESS;
    booking.startedAt = new Date();
  } else if (status === BookingStatus.COMPLETED) {
    if (booking.status === BookingStatus.COMPLETED || booking.completedAt) {
      return fail(res, "Job has already been completed and finalized", null, 400);
    }
    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.REJECTED) {
      return fail(res, "Cannot complete a cancelled or rejected job", null, 400);
    }
    if (booking.status !== BookingStatus.IN_PROGRESS) {
      return fail(res, "Job must be started (on-site in progress) before it can be completed", null, 400);
    }

    // Record exact completion timestamp on backend
    const completedTimestamp = new Date();
    const startTimestamp = booking.startedAt || booking.assignedAt || booking.createdAt || new Date();
    booking.startedAt = startTimestamp;
    booking.completedAt = completedTimestamp;

    // Validate timestamps & calculate actual duration in minutes
    let durationMinutes = 0;
    try {
      durationMinutes = BillingService.calculateWorkingDurationMinutes(
        booking.startedAt,
        booking.completedAt
      );
    } catch (err: any) {
      return fail(res, err.message || "Invalid work duration timestamps", null, 400);
    }

    // Retrieve rates from historical booking pricing snapshot or fall back to service
    let firstHourRate = booking.pricing?.firstHourRate;
    let additionalHourRate = booking.pricing?.additionalHourRate;
    let cooperativePercentage = booking.pricing?.cooperativePercentage;
    let insurancePercentage = booking.pricing?.insurancePercentage;

    if (!firstHourRate || firstHourRate <= 0) {
      const serviceDoc = await Service.findById(booking.service);
      const baseFirst = serviceDoc?.firstHourRate ?? serviceDoc?.hourlyPrice ?? booking.rate ?? 0;
      const baseAddl = serviceDoc?.additionalHourRate ?? serviceDoc?.firstHourRate ?? serviceDoc?.hourlyPrice ?? baseFirst;
      
      const multiplier =
        booking.bookingType === BookingType.EMERGENCY || booking.isEmergency
          ? 1.20
          : booking.bookingType === BookingType.ON_DEMAND
          ? 1.10
          : 1.0;

      firstHourRate = Math.round(baseFirst * multiplier);
      additionalHourRate = Math.round(baseAddl * multiplier);
      cooperativePercentage = serviceDoc?.cooperativeShare ?? 10;
      insurancePercentage = serviceDoc?.insuranceShare ?? 5;
    }

    const calcResult = BillingService.calculateBillingAndDistribution(durationMinutes, {
      firstHourRate: firstHourRate ?? 0,
      additionalHourRate: additionalHourRate ?? firstHourRate ?? 0,
      cooperativePercentage: cooperativePercentage ?? 10,
      insurancePercentage: insurancePercentage ?? 5,
      transportFee: FIXED_TRANSPORT_FEE,
    });

    booking.pricing = {
      firstHourRate: calcResult.firstHourCharge,
      additionalHourRate: additionalHourRate ?? calcResult.firstHourCharge,
      transportFee: calcResult.transportFee,
      cooperativePercentage: cooperativePercentage ?? 10,
      insurancePercentage: insurancePercentage ?? 5,
      actualDurationMinutes: calcResult.actualDurationMinutes,
      billableHours: calcResult.billableHours,
      firstHourCharge: calcResult.firstHourCharge,
      additionalHoursCharge: calcResult.additionalHoursCharge,
      serviceAmount: calcResult.serviceAmount,
      cooperativeShareAmount: calcResult.cooperativeAdminShare,
      insuranceShareAmount: calcResult.insuranceShare,
      workerNetEarnings: calcResult.workerNetEarnings,
      customerTotalAmount: calcResult.customerTotal,
      isFinalized: true,
    };

    booking.rate = calcResult.firstHourCharge;
    booking.units = calcResult.billableHours;
    booking.totalAmount = calcResult.customerTotal;
    booking.status = BookingStatus.COMPLETED;

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
    .populate("service", "name description priceType firstHourRate additionalHourRate transportFee cooperativeShare insuranceShare hourlyPrice metersPrice")
    .populate("category", "name icon")
    .populate("customer", "name phone profilePicture address")
    .populate("rating")
    .lean();

  return ok(res, updated, `Job status updated to ${booking.status}`);
}

export async function getWorkerStats(req: Request, res: Response) {
  const userId = (req.user as any)?.userId || (req.user as any)?._id;
  const worker = await Worker.findOne({ userId })
    .select("_id category categories skills cooperativeId rating totalJobsCompleted verificationStatus")
    .lean();

  if (!worker) {
    return fail(res, "Worker profile not found", null, 404);
  }

  const workerCats = [
    ...(worker.category ? [worker.category] : []),
    ...((worker as any).categories || []),
  ];

  const statsMatchConditions: any[] = [];
  if (workerCats.length > 0) {
    statsMatchConditions.push({ category: { $in: workerCats } });
  }
  if (worker.skills && worker.skills.length > 0) {
    statsMatchConditions.push({ service: { $in: worker.skills } });
  }
  if (worker.cooperativeId) {
    statsMatchConditions.push({ cooperative: worker.cooperativeId });
  }

  const gigFilter = {
    status: BookingStatus.PENDING,
    $or: [{ worker: null }, { worker: { $exists: false } }],
    ...(statsMatchConditions.length > 0 ? { $or: statsMatchConditions } : {}),
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
            totalEarnings: {
              $sum: {
                $ifNull: ["$pricing.workerNetEarnings", "$totalAmount"],
              },
            },
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
    .populate("category", "name icon description")
    .populate("categories", "name icon description")
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

