import { Request, Response } from "express";
import mongoose from "mongoose";
import Booking, {
  BookingStatus,
  CancelledByRole,
  PaymentStatus,
} from "../../models/booking.model";
import Rating from "../../models/rating.model";
import Service from "../../models/service.model";
import { fail, ok } from "../../shared/envelope";

export async function createBooking(req: Request, res: Response) {
  const customerId = (req.user as any)?.userId || (req.user as any)?._id;
  if (!customerId) {
    return fail(res, "Unauthorized", null, 401);
  }

  const {
    serviceId,
    address,
    scheduledDate,
    customerNotes,
    units = 1,
  } = req.body;

  if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
    return fail(res, "Valid service ID is required", null, 400);
  }

  if (!address || (typeof address === "string" && !address.trim())) {
    return fail(res, "Service address is required", null, 400);
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    return fail(res, "Service not found", null, 404);
  }

  if (!service.isActive) {
    return fail(res, "This service is currently unavailable for booking", null, 400);
  }

  const rate =
    service.priceType === "hourly"
      ? service.hourlyPrice ?? 0
      : service.metersPrice ?? 0;

  const validUnits = Math.max(0.1, Number(units) || 1);
  const totalAmount = Math.round(rate * validUnits);

  const formattedAddress =
    typeof address === "string"
      ? { street: address.trim() }
      : {
        street: address.street?.trim() || "",
        city: address.city?.trim() || "",
        state: address.state?.trim() || "",
        pincode: address.pincode?.trim() || "",
        landmark: address.landmark?.trim() || "",
      };

  if (!formattedAddress.street) {
    return fail(res, "Street address is required", null, 400);
  }

  const booking = await Booking.create({
    customer: customerId,
    service: service._id,
    category: service.category,
    address: formattedAddress,
    scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
    customerNotes: typeof customerNotes === "string" ? customerNotes.trim() : "",
    priceType: service.priceType,
    rate,
    units: validUnits,
    totalAmount,
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
  });

  const populated = await Booking.findById(booking._id)
    .populate("service", "name description priceType hourlyPrice metersPrice")
    .populate("category", "name icon");

  return ok(res, populated, "Booking requested successfully");
}

export async function getCustomerBookings(req: Request, res: Response) {
  const customerId = (req.user as any)?.userId || (req.user as any)?._id;
  if (!customerId) {
    return fail(res, "Unauthorized", null, 401);
  }

  const { status } = req.query;
  const filter: Record<string, any> = { customer: customerId };

  if (status && typeof status === "string" && status !== "all") {
    filter.status = status.toUpperCase();
  }

  const bookings = await Booking.find(filter)
    .populate("service", "name description priceType hourlyPrice metersPrice")
    .populate("category", "name icon slug")
    .populate({
      path: "worker",
      select: "userId rating totalJobsCompleted location",
      populate: {
        path: "userId",
        select: "name phone profilePicture email",
      },
    })
    .populate("rating")
    .sort({ createdAt: -1 })
    .lean();

  return ok(res, bookings, "Customer bookings retrieved successfully");
}

export async function getBookingById(req: Request, res: Response) {
  const customerId = (req.user as any)?.userId || (req.user as any)?._id;
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, "Invalid booking ID", null, 400);
  }

  const booking = await Booking.findById(id)
    .populate("service", "name description priceType hourlyPrice metersPrice")
    .populate("category", "name icon slug")
    .populate({
      path: "worker",
      select: "userId rating totalJobsCompleted location",
      populate: {
        path: "userId",
        select: "name phone profilePicture email",
      },
    })
    .populate("rating")
    .lean();

  if (!booking) {
    return fail(res, "Booking not found", null, 404);
  }

  // Ensure customer owns the booking
  if (booking.customer.toString() !== customerId.toString()) {
    return fail(res, "Forbidden: You cannot access this booking", null, 403);
  }

  return ok(res, booking, "Booking retrieved successfully");
}

export async function cancelBooking(req: Request, res: Response) {
  const customerId = (req.user as any)?.userId || (req.user as any)?._id;
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
  const { reason = "Cancelled by customer" } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, "Invalid booking ID", null, 400);
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return fail(res, "Booking not found", null, 404);
  }

  if (booking.customer.toString() !== customerId.toString()) {
    return fail(res, "Forbidden: You cannot cancel this booking", null, 403);
  }

  if (
    booking.status !== BookingStatus.PENDING &&
    booking.status !== BookingStatus.CONFIRMED &&
    booking.status !== BookingStatus.ASSIGNED
  ) {
    return fail(
      res,
      `Cannot cancel booking in '${booking.status}' status. Only pending or confirmed bookings can be cancelled.`,
      null,
      400
    );
  }

  booking.status = BookingStatus.CANCELLED;
  booking.cancelledAt = new Date();
  booking.cancelledBy = CancelledByRole.CUSTOMER;
  booking.cancellationReason = typeof reason === "string" ? reason.trim() : "Cancelled by customer";

  await booking.save();

  const updated = await Booking.findById(booking._id)
    .populate("service", "name description priceType hourlyPrice metersPrice")
    .populate("category", "name icon");

  return ok(res, updated, "Booking cancelled successfully");
}

export async function rateBooking(req: Request, res: Response) {
  const customerId = (req.user as any)?.userId || (req.user as any)?._id;
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];
  const { rating, review = "" } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, "Invalid booking ID", null, 400);
  }

  const numericRating = Number(rating);
  if (!numericRating || numericRating < 1 || numericRating > 5) {
    return fail(res, "Rating must be a number between 1 and 5", null, 400);
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return fail(res, "Booking not found", null, 404);
  }

  if (booking.customer.toString() !== customerId.toString()) {
    return fail(res, "Forbidden: You cannot rate this booking", null, 403);
  }

  if (booking.status !== BookingStatus.COMPLETED) {
    return fail(res, "You can only rate completed bookings", null, 400);
  }

  if (!booking.worker) {
    return fail(res, "No worker was associated with this booking to rate", null, 400);
  }

  // Find existing rating if previously submitted, or create a new one to prevent duplicate key errors
  let ratingDoc = await Rating.findOne({ booking: booking._id });

  if (ratingDoc) {
    ratingDoc.rating = numericRating;
    ratingDoc.review = typeof review === "string" ? review.trim() : "";
    if (!ratingDoc.worker && booking.worker) {
      ratingDoc.worker = booking.worker;
    }
    if (!ratingDoc.service && booking.service) {
      ratingDoc.service = booking.service;
    }
    if (!ratingDoc.cooperative && booking.cooperative) {
      ratingDoc.cooperative = booking.cooperative;
    }
    await ratingDoc.save();
  } else {
    try {
      ratingDoc = await Rating.create({
        booking: booking._id,
        customer: customerId,
        worker: booking.worker,
        service: booking.service,
        cooperative: booking.cooperative,
        rating: numericRating,
        review: typeof review === "string" ? review.trim() : "",
      });
    } catch (err: any) {
      if (
        err?.code === 11000 &&
        (err?.keyPattern?.bookingId || err?.message?.includes("bookingId_1"))
      ) {
        await Rating.collection.dropIndex("bookingId_1").catch(() => { });
        ratingDoc = await Rating.create({
          booking: booking._id,
          customer: customerId,
          worker: booking.worker,
          service: booking.service,
          cooperative: booking.cooperative,
          rating: numericRating,
          review: typeof review === "string" ? review.trim() : "",
        });
      } else {
        throw err;
      }
    }
  }

  booking.rating = ratingDoc._id;
  booking.isRated = true;
  await booking.save();

  return ok(res, ratingDoc, "Rating and review submitted successfully");
}
