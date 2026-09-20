import { UserRole } from "../models/auth/user.model";
import { VerificationStatus, AvailabilityStatus } from "../models/auth/worker.model";
import { ContractStatus, BidStatus } from "../models/contractBid.model";

console.log("=== RUNNING COOPERATIVE FLOW UNIT TEST SUITE ===");

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
    console.error(`✗ FAIL: ${testName} (expected true, got false)`);
    failed++;
  }
}

// 1. Cooperative Roles and Enums
assertEqual(UserRole.COOPERATIVE, "COOPERATIVE", "Cooperative role exists in UserRole enum");
assertEqual(VerificationStatus.APPROVED, "Approved", "Worker Approved verification status is correct");
assertEqual(VerificationStatus.PENDING, "Pending", "Worker Pending verification status is correct");
assertEqual(VerificationStatus.REJECTED, "Rejected", "Worker Rejected verification status is correct");

// 2. Contract Status Enums
assertEqual(ContractStatus.OPEN, "OPEN", "ContractStatus.OPEN exists");
assertEqual(ContractStatus.BID_SUBMITTED, "BID_SUBMITTED", "ContractStatus.BID_SUBMITTED exists");
assertEqual(ContractStatus.AWARDED, "AWARDED", "ContractStatus.AWARDED exists");
assertEqual(ContractStatus.IN_PROGRESS, "IN_PROGRESS", "ContractStatus.IN_PROGRESS exists");
assertEqual(ContractStatus.COMPLETED, "COMPLETED", "ContractStatus.COMPLETED exists");

// 3. Bid Status Enums
assertEqual(BidStatus.PENDING, "PENDING", "BidStatus.PENDING exists");
assertEqual(BidStatus.ACCEPTED, "ACCEPTED", "BidStatus.ACCEPTED exists");
assertEqual(BidStatus.REJECTED, "REJECTED", "BidStatus.REJECTED exists");

// 4. Test Contract Bidding Submission Validation Logic
function validateBidSubmission(
  contractStatus: ContractStatus,
  deadlineDate: Date,
  proposedAmount: number,
  proposedWorkers: number,
  notes: string
): { valid: boolean; error?: string } {
  if (contractStatus !== ContractStatus.OPEN && contractStatus !== ContractStatus.BID_SUBMITTED) {
    return { valid: false, error: "Contract is closed for bidding" };
  }
  if (deadlineDate.getTime() < Date.now()) {
    return { valid: false, error: "Deadline has passed" };
  }
  if (proposedAmount <= 0) {
    return { valid: false, error: "Invalid proposed amount" };
  }
  if (proposedWorkers < 1) {
    return { valid: false, error: "Must allocate at least 1 worker" };
  }
  if (!notes || !notes.trim()) {
    return { valid: false, error: "Proposal notes required" };
  }
  return { valid: true };
}

const futureDate = new Date(Date.now() + 86400000);
const pastDate = new Date(Date.now() - 86400000);

assertTrue(
  validateBidSubmission(ContractStatus.OPEN, futureDate, 150000, 5, "Certified electricians").valid,
  "Valid bid submission passes validation"
);

assertEqual(
  validateBidSubmission(ContractStatus.AWARDED, futureDate, 150000, 5, "Proposal notes").valid,
  false,
  "Cannot submit bid on already awarded contract"
);

assertEqual(
  validateBidSubmission(ContractStatus.OPEN, pastDate, 150000, 5, "Proposal notes").valid,
  false,
  "Cannot submit bid after deadline has passed"
);

assertEqual(
  validateBidSubmission(ContractStatus.OPEN, futureDate, 0, 5, "Proposal notes").valid,
  false,
  "Cannot submit bid with 0 amount"
);

assertEqual(
  validateBidSubmission(ContractStatus.OPEN, futureDate, 50000, 0, "Proposal notes").valid,
  false,
  "Cannot submit bid with 0 workers"
);

// 5. Test Member Status Toggle & Availability Logic
function validateMemberUpdate(
  isActive?: boolean,
  availability?: string
): { valid: boolean; error?: string } {
  if (typeof isActive !== "boolean" && !availability) {
    return { valid: false, error: "No update parameters provided" };
  }
  if (
    availability &&
    !Object.values(AvailabilityStatus).includes(availability as AvailabilityStatus)
  ) {
    return { valid: false, error: "Invalid availability status" };
  }
  return { valid: true };
}

assertTrue(
  validateMemberUpdate(true, undefined).valid,
  "Can toggle worker active status"
);

assertTrue(
  validateMemberUpdate(undefined, AvailabilityStatus.PART_TIME).valid,
  "Can update worker availability"
);

assertEqual(
  validateMemberUpdate(undefined, "INVALID_STATUS").valid,
  false,
  "Rejects invalid worker availability status"
);

// 6. Test Worker Allocation to Awarded Contract
function validateWorkerAllocation(
  isAwardedToCooperative: boolean,
  workerIds: string[],
  approvedWorkersCount: number
): { valid: boolean; error?: string } {
  if (!isAwardedToCooperative) {
    return { valid: false, error: "Contract is not awarded to this cooperative" };
  }
  if (!workerIds || workerIds.length === 0) {
    return { valid: false, error: "Must select at least 1 worker" };
  }
  if (approvedWorkersCount < workerIds.length) {
    return { valid: false, error: "Only approved verified workers can be allocated" };
  }
  return { valid: true };
}

assertTrue(
  validateWorkerAllocation(true, ["w1", "w2"], 2).valid,
  "Can allocate verified members to awarded contract"
);

assertEqual(
  validateWorkerAllocation(false, ["w1", "w2"], 2).valid,
  false,
  "Cannot allocate workers to contract awarded to another society"
);

assertEqual(
  validateWorkerAllocation(true, ["w1", "w2"], 1).valid,
  false,
  "Cannot allocate unapproved or unverified workers"
);

console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
if (failed > 0) {
  process.exit(1);
}
