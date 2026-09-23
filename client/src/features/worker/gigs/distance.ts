/**
 * Calculates distance (randomly up to 5 km) and transport fee (₹5 per 1 km).
 * Uses deterministic pseudo-random hashing on gig._id so the distance remains stable
 * across re-renders and between list view and modal view, while providing realistic random variations.
 */
export function getGigDistanceInfo(gig?: {
  _id?: string;
  distanceKm?: number;
  distanceText?: string;
  transportFee?: number;
}) {
  if (!gig) {
    return {
      distanceKm: 1.0,
      distanceDisplay: "1.0 km",
      transportFee: 5,
    };
  }

  let distanceKm = gig.distanceKm;

  if (typeof distanceKm !== "number") {
    const idStr = gig._id || "default_gig";
    let h = 0;
    for (let i = 0; i < idStr.length; i++) {
      h = (Math.imul(31, h) + idStr.charCodeAt(i)) | 0;
    }
    // Mulberry32 mix for wide uniform distribution
    let t = h + 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const normalized = ((t ^ (t >>> 14)) >>> 0) / 4294967296;

    // Random distance up to 5.0 km (from 0.5 to 5.0 km, 1 decimal place)
    const min = 0.5;
    const max = 5.0;
    distanceKm = Math.round((min + normalized * (max - min)) * 10) / 10;
  }

  const distanceDisplay = gig.distanceText || `${distanceKm.toFixed(1)} km`;
  // Transport fee is ₹5 per 1 km
  const transportFee = gig.transportFee ?? Math.round(distanceKm * 5);

  return {
    distanceKm,
    distanceDisplay,
    transportFee,
  };
}
