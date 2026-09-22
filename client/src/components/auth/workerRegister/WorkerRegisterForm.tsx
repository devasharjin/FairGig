import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { workerRegister, getMe, getCooperatives } from "@/features/auth/api";
import { getCustomerServices } from "@/features/customer/services/api";
import { useAuthStore } from "@/features/auth/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CooperativeOption } from "@/features/auth/types";

import { WorkerRegisterStepper } from "./WorkerRegisterStepper";
import { CategoryStep } from "./CategoryStep";
import { LocationStep } from "./LocationStep";
import { DocumentsStep } from "./DocumentsStep";
import { compressImageFile, formatBytes } from "@/lib/imageCompressor";

const DEFAULT_TRADES: any[] = [
  { _id: "trade_plumber", name: "Plumber", icon: "🚰", description: "Pipes, leakage repairs, bathroom fixtures, and drainage", isActive: true },
  { _id: "trade_electrician", name: "Electrician", icon: "⚡", description: "Wiring, switchboards, fixtures, fans, and power diagnostics", isActive: true },
  { _id: "trade_gardener", name: "Gardener", icon: "🌱", description: "Lawn mowing, landscaping, hedge trimming, and plant care", isActive: true },
  { _id: "trade_carpenter", name: "Carpenter", icon: "🪚", description: "Furniture fabrication, woodwork repairs, and door fixtures", isActive: true },
  { _id: "trade_painter", name: "Painter", icon: "🎨", description: "Interior & exterior wall painting, waterproof coating", isActive: true },
  { _id: "trade_cleaner", name: "House Cleaner", icon: "🧹", description: "Deep cleaning, kitchen sanitation, and floor polishing", isActive: true },
  { _id: "trade_appliance", name: "Appliance Technician", icon: "🔧", description: "Refrigerators, washing machines, and electronics repair", isActive: true },
  { _id: "trade_mason", name: "Mason", icon: "🧱", description: "Brickwork, plastering, ceramic tile alignment, and masonry", isActive: true },
];

export default function WorkerRegisterForm() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // Auth role checks
  const userRoles: string[] = Array.isArray(user?.role)
    ? user.role.map((r) => (typeof r === "string" ? r.toUpperCase() : ""))
    : typeof user?.role === "string"
    ? [user.role.toUpperCase()]
    : [];
  const isAlreadyWorker = userRoles.includes("WORKER");

  // Step state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Trade Service & Work settings
  const [categoriesList, setCategoriesList] = useState<any[]>(DEFAULT_TRADES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [availability, setAvailability] = useState<"Full-Time" | "Part-Time">("Full-Time");
  const [experience, setExperience] = useState<number>(3);
  const [cooperativesList, setCooperativesList] = useState<CooperativeOption[]>([]);
  const [cooperativeId, setCooperativeId] = useState<string>("");

  // Step 2: Location
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Step 3: Verification Documents
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [identityPreview, setIdentityPreview] = useState<string | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);

  const identityInputRef = useRef<HTMLInputElement | null>(null);
  const certificateInputRef = useRef<HTMLInputElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch real services and cooperatives
  useEffect(() => {
    let isMounted = true;

    getCustomerServices({ isActive: true })
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCategoriesList(data);
          setSelectedCategoryId((curr) => curr || data[0]._id);
        }
        if (isMounted) setIsLoadingCategories(false);
      })
      .catch(() => {
        if (isMounted) setIsLoadingCategories(false);
      });

    getCooperatives()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setCooperativesList(data);
          if (data.length > 0 && !cooperativeId) {
            setCooperativeId(data[0]._id);
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Location Auto-Detect
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(Number(position.coords.latitude.toFixed(6)));
        setLongitude(Number(position.coords.longitude.toFixed(6)));
        setIsDetectingLocation(false);
        toast.success("GPS coordinates locked successfully!");
      },
      (error) => {
        setIsDetectingLocation(false);
        toast.error(`Could not detect GPS location: ${error.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Document File Handlers
  const handleIdentityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size cannot exceed 15MB.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, JPEG, PNG, or WebP file.");
      return;
    }

    const toastId = file.type.startsWith("image/") ? toast.loading("Compressing document...") : null;
    const result = await compressImageFile(file);
    if (toastId) toast.dismiss(toastId);

    if (result.wasCompressed) {
      toast.success(
        `Optimized for instant upload: ${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)} (-${result.percentSaved}%)`
      );
    }

    setIdentityFile(result.file);
    setIdentityPreview(result.file.type.startsWith("image/") ? URL.createObjectURL(result.file) : null);
  };

  const handleRemoveIdentity = () => {
    setIdentityFile(null);
    if (identityPreview) URL.revokeObjectURL(identityPreview);
    setIdentityPreview(null);
    if (identityInputRef.current) identityInputRef.current.value = "";
  };

  const handleCertificateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size cannot exceed 15MB.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, JPEG, PNG, or WebP file.");
      return;
    }

    const toastId = file.type.startsWith("image/") ? toast.loading("Compressing certificate...") : null;
    const result = await compressImageFile(file);
    if (toastId) toast.dismiss(toastId);

    if (result.wasCompressed) {
      toast.success(
        `Optimized for instant upload: ${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)} (-${result.percentSaved}%)`
      );
    }

    setCertificateFile(result.file);
    setCertificatePreview(result.file.type.startsWith("image/") ? URL.createObjectURL(result.file) : null);
  };

  const handleRemoveCertificate = () => {
    setCertificateFile(null);
    if (certificatePreview) URL.revokeObjectURL(certificatePreview);
    setCertificatePreview(null);
    if (certificateInputRef.current) certificateInputRef.current.value = "";
  };

  // Step Validations
  const validateStep1 = () => {
    if (!selectedCategoryId || !selectedCategoryId.trim()) {
      toast.error("Please select your primary trade category.");
      return false;
    }
    if (experience < 0 || isNaN(experience)) {
      toast.error("Please enter a valid number of years of experience.");
      return false;
    }
    if (!cooperativeId || cooperativeId === "none" || !cooperativeId.trim()) {
      toast.error("Cooperative selection is mandatory. Please select an affiliated cooperative society.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!address.trim()) {
      toast.error("Please enter your street address or locality.");
      return false;
    }
    if (!city.trim()) {
      toast.error("Please enter your city.");
      return false;
    }
    if (!stateName.trim()) {
      toast.error("Please enter your state.");
      return false;
    }
    if (!pincode.trim()) {
      toast.error("Please enter your postal pincode.");
      return false;
    }
    return true;
  };

  const handleStepClick = (step: 1 | 2 | 3) => {
    if (step === 1) {
      setCurrentStep(1);
    } else if (step === 2 && validateStep1()) {
      setCurrentStep(2);
    } else if (step === 3 && validateStep1() && validateStep2()) {
      setCurrentStep(3);
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }

    if (!identityFile) {
      toast.error("Please upload your government-issued Identity document.");
      return;
    }

    if (!certificateFile) {
      toast.error("Please upload your Trade or Skill Certificate.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("services", JSON.stringify([selectedCategoryId]));
      formData.append("serviceIds", JSON.stringify([selectedCategoryId]));
      formData.append("skills", JSON.stringify([selectedCategoryId]));
      formData.append("trades", JSON.stringify([selectedCategoryId]));
      formData.append("category", selectedCategoryId);
      formData.append("categoryId", selectedCategoryId);
      formData.append("categories", JSON.stringify([selectedCategoryId]));
      formData.append("categoryIds", JSON.stringify([selectedCategoryId]));
      formData.append("availability", availability);
      formData.append("experience", String(Math.max(0, Number(experience) || 0)));
      formData.append("cooperativeId", cooperativeId.trim());

      formData.append(
        "location",
        JSON.stringify({
          address: address.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
          latitude: latitude ?? 0,
          longitude: longitude ?? 0,
        })
      );

      // Ensure files are compressed before network upload
      const [optIdentity, optCert] = await Promise.all([
        compressImageFile(identityFile),
        compressImageFile(certificateFile),
      ]);

      formData.append("identity", optIdentity.file);
      formData.append("certificate", optCert.file);

      await workerRegister(formData);

      toast.success("Worker profile registered successfully! Verification is pending.");

      try {
        const updated = await getMe();
        if (updated) setUser(updated);
      } catch {}

      navigate("/worker", { replace: true });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please check your details and try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auth & role guards
  if (!user) return <Navigate to="/login?redirect=/register/worker" replace />;
  if (isAlreadyWorker) return <Navigate to="/worker" replace />;

  return (
    <div className="w-full">
      <Card className="border border-border/60 bg-card/90 shadow-xl backdrop-blur-xl rounded-xl overflow-hidden">
        {/* Header & Stepper */}
        <CardHeader className="p-6 sm:p-8 pb-4 border-b border-border/40 bg-muted/15">
          <WorkerRegisterStepper
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </CardHeader>

        {/* Content Body */}
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <CategoryStep
                categories={categoriesList}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={(id) => setSelectedCategoryId(id)}
                isLoadingCategories={isLoadingCategories}
                availability={availability}
                onAvailabilityChange={setAvailability}
                experience={experience}
                onExperienceChange={setExperience}
                cooperativesList={cooperativesList}
                cooperativeId={cooperativeId}
                onCooperativeChange={setCooperativeId}
                onNext={() => {
                  if (validateStep1()) setCurrentStep(2);
                }}
              />
            )}

            {currentStep === 2 && (
              <LocationStep
                address={address}
                onAddressChange={setAddress}
                city={city}
                onCityChange={setCity}
                stateName={stateName}
                onStateNameChange={setStateName}
                pincode={pincode}
                onPincodeChange={setPincode}
                latitude={latitude}
                longitude={longitude}
                isDetectingLocation={isDetectingLocation}
                onDetectLocation={handleDetectLocation}
                onBack={() => setCurrentStep(1)}
                onNext={() => {
                  if (validateStep2()) setCurrentStep(3);
                }}
              />
            )}

            {currentStep === 3 && (
              <DocumentsStep
                identityFile={identityFile}
                identityPreview={identityPreview}
                identityInputRef={identityInputRef}
                onIdentityChange={handleIdentityChange}
                onRemoveIdentity={handleRemoveIdentity}
                certificateFile={certificateFile}
                certificatePreview={certificatePreview}
                certificateInputRef={certificateInputRef}
                onCertificateChange={handleCertificateChange}
                onRemoveCertificate={handleRemoveCertificate}
                isSubmitting={isSubmitting}
                onBack={() => setCurrentStep(2)}
              />
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
