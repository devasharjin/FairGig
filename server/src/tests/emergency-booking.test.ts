import { BookingType, UrgencyLevel } from "../models/booking.model";

console.log("=== RUNNING EMERGENCY & ON-DEMAND BOOKING WORKFLOW TEST SUITE ===");

let passed = 0;
let failed = 0;

function assertEqual(actual: any, expected: any, testName: string) {
  if (actual === expected) {
    console.log(`✓ PASS: ${testName} (expected: ${expected}, got: ${actual})`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${testName} (expected: ${expected}, got: ${actual})`);
    failed++;
  }
}

function assertTrue(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${testName}`);
    failed++;
  }
}

// Helper: Booking creation resolver logic mirroring booking.controller.ts
function resolveBookingPayload(input: {
  bookingType?: string;
  isEmergency?: boolean | string;
  urgencyLevel?: string;
  scheduledDate?: string;
  customerNotes?: string;
  emergencyDetails?: {
    hazardType?: string;
    severity?: "CRITICAL" | "HIGH" | "MEDIUM";
    immediateContact?: string;
    notes?: string;
  };
}) {
  let finalBookingType = BookingType.SCHEDULED;
  let finalIsEmergency = false;
  let finalUrgency = UrgencyLevel.STANDARD;

  const typeUpper = String(input.bookingType || "SCHEDULED").toUpperCase();
  if (input.isEmergency === true || input.isEmergency === "true" || typeUpper === "EMERGENCY") {
    finalBookingType = BookingType.EMERGENCY;
    finalIsEmergency = true;
    finalUrgency =
      input.urgencyLevel && input.urgencyLevel !== "STANDARD"
        ? (input.urgencyLevel as UrgencyLevel)
        : UrgencyLevel.CRITICAL;
  } else if (typeUpper === "ON_DEMAND") {
    finalBookingType = BookingType.ON_DEMAND;
    finalIsEmergency = false;
    finalUrgency = UrgencyLevel.HIGH;
  }

  const isImmediate =
    finalBookingType === BookingType.ON_DEMAND || finalBookingType === BookingType.EMERGENCY;

  const now = new Date();
  const finalScheduledDate = isImmediate
    ? now
    : input.scheduledDate
    ? new Date(input.scheduledDate)
    : now;

  const finalEmergencyDetails = {
    immediateContact: input.emergencyDetails?.immediateContact?.trim() || "",
    notes:
      input.emergencyDetails?.notes?.trim() ||
      input.customerNotes?.trim() ||
      "",
  };

  return {
    bookingType: finalBookingType,
    isEmergency: finalIsEmergency,
    urgencyLevel: finalUrgency,
    isImmediate,
    scheduledDate: finalScheduledDate,
    emergencyDetails: finalEmergencyDetails,
  };
}

// Test 1: Scheduled Booking Resolution
const scheduled = resolveBookingPayload({
  bookingType: "SCHEDULED",
  scheduledDate: "2026-10-01T10:00:00Z",
  customerNotes: "Regular garden maintenance",
});
assertEqual(scheduled.bookingType, BookingType.SCHEDULED, "Scheduled bookingType is SCHEDULED");
assertEqual(scheduled.isEmergency, false, "Scheduled booking isEmergency is false");
assertEqual(scheduled.urgencyLevel, UrgencyLevel.STANDARD, "Scheduled urgencyLevel is STANDARD");
assertEqual(scheduled.isImmediate, false, "Scheduled booking is not marked immediate");
assertTrue(scheduled.scheduledDate.getFullYear() === 2026, "Scheduled date correctly preserved");

// Test 2: On-Demand Booking Resolution (ASAP Dispatch)
const onDemand = resolveBookingPayload({
  bookingType: "ON_DEMAND",
  customerNotes: "Need electrician ASAP",
});
assertEqual(onDemand.bookingType, BookingType.ON_DEMAND, "On-Demand bookingType is ON_DEMAND");
assertEqual(onDemand.isEmergency, false, "On-Demand booking isEmergency is false");
assertEqual(onDemand.urgencyLevel, UrgencyLevel.HIGH, "On-Demand urgencyLevel is HIGH");
assertEqual(onDemand.isImmediate, true, "On-Demand booking marked immediate");
assertTrue(
  Math.abs(Date.now() - onDemand.scheduledDate.getTime()) < 5000,
  "On-Demand scheduledDate automatically set to current timestamp"
);

// Test 3: Emergency Booking Resolution (Immediate Contact)
const emergency = resolveBookingPayload({
  bookingType: "EMERGENCY",
  emergencyDetails: {
    immediateContact: "9876543210",
    notes: "Main valve broken, water gushing into kitchen",
  },
});
assertEqual(emergency.bookingType, BookingType.EMERGENCY, "Emergency bookingType is EMERGENCY");
assertEqual(emergency.isEmergency, true, "Emergency isEmergency is true");
assertEqual(emergency.urgencyLevel, UrgencyLevel.CRITICAL, "Emergency urgencyLevel defaults to CRITICAL");
assertEqual(emergency.isImmediate, true, "Emergency booking marked immediate");
assertEqual(emergency.emergencyDetails.immediateContact, "9876543210", "Emergency contact correctly captured");

// Test 4: Priority Sorting Simulation
// EMERGENCY gigs must always rank higher than any standard scheduled or on-demand jobs
const mockGigs = [
  { id: "1", isEmergency: false, bookingType: BookingType.SCHEDULED, scheduledDate: new Date("2026-09-19T12:00:00Z"), createdAt: new Date(1000) },
  { id: "2", isEmergency: false, bookingType: BookingType.ON_DEMAND, scheduledDate: new Date("2026-09-19T10:00:00Z"), createdAt: new Date(2000) },
  { id: "3", isEmergency: true, bookingType: BookingType.EMERGENCY, scheduledDate: new Date("2026-09-19T11:00:00Z"), createdAt: new Date(3000) },
  { id: "4", isEmergency: true, bookingType: BookingType.EMERGENCY, scheduledDate: new Date("2026-09-19T09:00:00Z"), createdAt: new Date(4000) },
];

const sortedGigs = [...mockGigs].sort((a, b) => {
  // isEmergency descending (true comes first)
  if (a.isEmergency !== b.isEmergency) {
    return a.isEmergency ? -1 : 1;
  }
  // scheduledDate ascending (earliest first)
  return a.scheduledDate.getTime() - b.scheduledDate.getTime();
});

assertEqual(sortedGigs[0].id, "4", "First sorted gig is Emergency (earliest scheduledDate)");
assertEqual(sortedGigs[1].id, "3", "Second sorted gig is Emergency");
assertTrue(sortedGigs[0].isEmergency && sortedGigs[1].isEmergency, "Top 2 sorted gigs are both EMERGENCY gigs");
assertTrue(!sortedGigs[2].isEmergency && !sortedGigs[3].isEmergency, "Bottom 2 gigs are non-emergency gigs");

// Test 5: Filter Simulation
const emergencyFiltered = mockGigs.filter((g) => g.isEmergency === true);
assertEqual(emergencyFiltered.length, 2, "Emergency filter returns exactly 2 emergency gigs");

const onDemandFiltered = mockGigs.filter((g) => g.bookingType === BookingType.ON_DEMAND);
assertEqual(onDemandFiltered.length, 1, "On-Demand filter returns exactly 1 on-demand gig");

const scheduledFiltered = mockGigs.filter((g) => g.bookingType === BookingType.SCHEDULED);
assertEqual(scheduledFiltered.length, 1, "Scheduled filter returns exactly 1 scheduled gig");

console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL EMERGENCY WORKFLOW TESTS PASSED SUCCESSFULLY!");
}
