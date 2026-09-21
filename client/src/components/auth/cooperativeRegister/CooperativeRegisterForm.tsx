import React, { useState, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

import { cooperativeRegister, getMe } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { CooperativeRegisterStepper } from "./CooperativeRegisterStepper";
import { CooperativeDetailsStep } from "./CooperativeDetailsStep";
import { CooperativeDocumentsStep } from "./CooperativeDocumentsStep";
import { compressImageFile, formatBytes } from "@/lib/imageCompressor";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const ALLOWED_CERT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "application/pdf",
];

export default function CooperativeRegisterForm() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // Stepper state
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Check roles
  const userRoles: string[] = Array.isArray(user?.role)
    ? user.role.map((r) => (typeof r === "string" ? r.toUpperCase() : ""))
    : typeof user?.role === "string"
      ? [user.role.toUpperCase()]
      : [];

  const isAlreadyCooperative = userRoles.includes("COOPERATIVE");

  // Step 1 states
  const [cooperativeName, setCooperativeName] = useState("");
  const [cooperativeEmail, setCooperativeEmail] = useState("");
  const [cooperativePhone, setCooperativePhone] = useState("");
  const [cooperativeAddress, setCooperativeAddress] = useState("");

  // Step 2 states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const certificateInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Step 1 validation
  const validateStep1 = (): boolean => {
    if (!cooperativeName.trim() || cooperativeName.trim().length < 3) {
      toast.error("Please enter a valid cooperative legal name (at least 3 characters).");
      return false;
    }

    if (!cooperativeEmail.trim()) {
      toast.error("Official cooperative email address is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cooperativeEmail.trim())) {
      toast.error("Please enter a valid official email address.");
      return false;
    }

    if (!cooperativePhone.trim() || cooperativePhone.trim().length < 7) {
      toast.error("Please enter a valid contact phone number.");
      return false;
    }

    if (!cooperativeAddress.trim() || cooperativeAddress.trim().length < 5) {
      toast.error("Please enter the complete registered office address.");
      return false;
    }

    return true;
  };

  const handleNextToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleStepClick = (step: 1 | 2) => {
    if (step === 2) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else {
      setCurrentStep(1);
    }
  };

  // Logo file selection
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      toast.error("Invalid logo format. Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Logo file size exceeds the 10MB limit.");
      return;
    }

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    const toastId = toast.loading("Compressing logo image...");
    const result = await compressImageFile(file, { maxWidth: 800, maxHeight: 800, quality: 0.85 });
    toast.dismiss(toastId);

    if (result.wasCompressed) {
      toast.success(`Logo optimized: ${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)} (-${result.percentSaved}%)`);
    }

    setLogoFile(result.file);
    setLogoPreview(URL.createObjectURL(result.file));
  };

  const handleRemoveLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(null);
    setLogoPreview(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  // Certificate file selection
  const handleCertificateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_CERT_TYPES.includes(file.type)) {
      toast.error("Invalid certificate format. Please select a PDF or Image (JPG, PNG).");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Certificate file size exceeds the 10MB limit.");
      return;
    }

    if (certificatePreview) {
      URL.revokeObjectURL(certificatePreview);
    }

    const toastId = file.type.startsWith("image/") ? toast.loading("Compressing certificate...") : null;
    const result = await compressImageFile(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.8 });
    if (toastId) toast.dismiss(toastId);

    if (result.wasCompressed) {
      toast.success(`Certificate optimized: ${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)} (-${result.percentSaved}%)`);
    }

    setCertificateFile(result.file);
    if (result.file.type.startsWith("image/")) {
      setCertificatePreview(URL.createObjectURL(result.file));
    } else {
      setCertificatePreview(null);
    }
  };

  const handleRemoveCertificate = () => {
    if (certificatePreview) {
      URL.revokeObjectURL(certificatePreview);
    }
    setCertificateFile(null);
    setCertificatePreview(null);
    if (certificateInputRef.current) {
      certificateInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    if (!logoFile) {
      toast.error("Please upload the official Cooperative Society Logo.");
      return;
    }

    if (!certificateFile) {
      toast.error("Please upload the official Government Registration Certificate or Bylaws.");
      return;
    }

    setIsLoading(true);

    try {
      // Ensure both files are compressed before network upload
      const [optLogo, optCert] = await Promise.all([
        compressImageFile(logoFile, { maxWidth: 800, maxHeight: 800, quality: 0.85 }),
        compressImageFile(certificateFile, { maxWidth: 1600, maxHeight: 1600, quality: 0.8 }),
      ]);

      const formData = new FormData();
      formData.append("cooperativeName", cooperativeName.trim());
      formData.append("cooperativeEmail", cooperativeEmail.trim().toLowerCase());
      formData.append("cooperativePhone", cooperativePhone.trim());
      formData.append("cooperativeAddress", cooperativeAddress.trim());
      formData.append("cooperativeLogo", optLogo.file);
      formData.append("verificationCertificate", optCert.file);

      await cooperativeRegister(formData);
      toast.success("Cooperative registered! Your profile is submitted for verification.");

      try {
        const updated = await getMe();
        if (updated) setUser(updated);
      } catch {}

      navigate("/cooperative", { replace: true });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <Navigate to="/login?redirect=/register/cooperative" replace />;
  if (isAlreadyCooperative) return <Navigate to="/cooperative" replace />;

  return (
    <div className="w-full mx-auto">
      <Card className="border border-border/80 bg-card/95 shadow-2xl backdrop-blur-xl rounded-xl overflow-hidden transition-all">
        {/* Header with 2-Step Navigator */}
        <CardHeader className="space-y-4 pb-5 pt-6 sm:pt-8 px-5 sm:px-8 border-b border-border/50 bg-gradient-to-r from-muted/30 via-background to-muted/20">
          <CooperativeRegisterStepper
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </CardHeader>

        {/* Step Content Body */}
        <CardContent className="px-5 sm:px-8 py-6">
          {currentStep === 1 ? (
            <CooperativeDetailsStep
              cooperativeName={cooperativeName}
              setCooperativeName={setCooperativeName}
              cooperativeEmail={cooperativeEmail}
              setCooperativeEmail={setCooperativeEmail}
              cooperativePhone={cooperativePhone}
              setCooperativePhone={setCooperativePhone}
              cooperativeAddress={cooperativeAddress}
              setCooperativeAddress={setCooperativeAddress}
              onNext={handleNextToStep2}
            />
          ) : (
            <CooperativeDocumentsStep
              logoFile={logoFile}
              logoPreview={logoPreview}
              logoInputRef={logoInputRef}
              onLogoChange={handleLogoChange}
              onRemoveLogo={handleRemoveLogo}
              certificateFile={certificateFile}
              certificatePreview={certificatePreview}
              certificateInputRef={certificateInputRef}
              onCertificateChange={handleCertificateChange}
              onRemoveCertificate={handleRemoveCertificate}
              isLoading={isLoading}
              onBack={() => setCurrentStep(1)}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>

        <Separator className="bg-border/50" />

        {/* Footer */}
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between px-5 sm:px-8 py-4 gap-2 text-xs text-muted-foreground bg-muted/10">
          <span>
            Signed in as <strong className="text-foreground">{user.email}</strong>
          </span>
          <Link
            to="/login"
            className="font-medium text-primary hover:underline inline-flex items-center gap-1 transition-colors"
          >
            Switch Account
            <ChevronRight className="size-3" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
