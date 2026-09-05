import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { workerRegister, getMe, getCooperatives } from "@/features/auth/api";
import { getCustomerServices } from "@/features/customer/services/api";
import type { CustomerService } from "@/features/customer/services/types";
import { useAuthStore } from "@/features/auth/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CooperativeOption } from "@/features/auth/types";

import { WorkerRegisterStepper } from "./WorkerRegisterStepper";
import { SkillsStep } from "./SkillsStep";
import { LocationStep } from "./LocationStep";
import { DocumentsStep } from "./DocumentsStep";
import type { ServiceOption } from "./ServiceSelector";

const DEFAULT_SERVICES: ServiceOption[] = [
  { _id: "65f0a1b2c3d4e5f6a7b8c101", name: "Electrician", category: "Electrical" },
  { _id: "65f0a1b2c3d4e5f6a7b8c102", name: "Plumber", category: "Plumbing" },
  { _id: "65f0a1b2c3d4e5f6a7b8c103", name: "Carpenter", category: "Carpentry" },
  { _id: "65f0a1b2c3d4e5f6a7b8c104", name: "AC Technician", category: "HVAC & Cooling" },
  { _id: "65f0a1b2c3d4e5f6a7b8c105", name: "House Painter", category: "Painting & Renovation" },
  { _id: "65f0a1b2c3d4e5f6a7b8c106", name: "Appliance Repair", category: "Appliances" },
  { _id: "65f0a1b2c3d4e5f6a7b8c107", name: "Masonry & Tiling", category: "Construction" },
  { _id: "65f0a1b2c3d4e5f6a7b8c108", name: "Deep Home Cleaning", category: "Cleaning" },
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

  // Step 1: Services & Work settings
  const [servicesList, setServicesList] = useState<ServiceOption[]>(DEFAULT_SERVICES);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
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
          setServicesList(
            data.map((s: CustomerService) => ({
              _id: s._id,
              name: s.name,
              category:
                typeof s.category === "object" && s.category?.name
                  ? s.category.name
                  : "Trade Skill",
            }))
          );
        }
        if (isMounted) setIsLoadingServices(false);
      })
      .catch(() => {
        if (isMounted) setIsLoadingServices(false);
      });

    getCooperatives()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setCooperativesList(data);
          // If cooperatives exist and none selected yet, optionally select the first one
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

  const handleToggleSkill = (id: string) => {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size cannot exceed 10MB.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, JPEG, PNG, or WebP file.");
      return;
    }

    setIdentityFile(file);
    setIdentityPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const handleRemoveIdentity = () => {
    setIdentityFile(null);
    if (identityPreview) URL.revokeObjectURL(identityPreview);
    setIdentityPreview(null);
    if (identityInputRef.current) identityInputRef.current.value = "";
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size cannot exceed 10MB.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, JPEG, PNG, or WebP file.");
      return;
    }

    setCertificateFile(file);
    setCertificatePreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const handleRemoveCertificate = () => {
    setCertificateFile(null);
    if (certificatePreview) URL.revokeObjectURL(certificatePreview);
    setCertificatePreview(null);
    if (certificateInputRef.current) certificateInputRef.current.value = "";
  };

  // Step Validations
  const validateStep1 = () => {
    if (selectedSkillIds.length === 0) {
      toast.error("Please select at least one trade skill.");
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
      formData.append("skills", JSON.stringify(selectedSkillIds));
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

      formData.append("identity", identityFile);
      formData.append("certificate", certificateFile);

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
      <Card className="border border-border/60 bg-card/90 shadow-xl backdrop-blur-xl rounded-3xl overflow-hidden">
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
              <SkillsStep
                services={servicesList}
                selectedSkillIds={selectedSkillIds}
                onToggleSkill={handleToggleSkill}
                isLoadingServices={isLoadingServices}
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
