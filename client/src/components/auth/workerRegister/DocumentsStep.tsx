import React from "react";
import {
  FileText,
  Wrench,
  UploadCloud,
  Trash2,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DocumentsStepProps {
  identityFile: File | null;
  identityPreview: string | null;
  identityInputRef: React.RefObject<HTMLInputElement | null>;
  onIdentityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveIdentity: () => void;
  certificateFile: File | null;
  certificatePreview: string | null;
  certificateInputRef: React.RefObject<HTMLInputElement | null>;
  onCertificateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCertificate: () => void;
  isSubmitting: boolean;
  onBack: () => void;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({
  identityFile,
  identityPreview,
  identityInputRef,
  onIdentityChange,
  onRemoveIdentity,
  certificateFile,
  certificatePreview,
  certificateInputRef,
  onCertificateChange,
  onRemoveCertificate,
  isSubmitting,
  onBack,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Government ID Proof */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FileText className="size-3.5 text-primary" />
              Government ID Proof <span className="text-destructive">*</span>
            </Label>
            <span className="text-[10px] text-muted-foreground">
              Aadhaar / Passport / DL
            </span>
          </div>

          <input
            type="file"
            ref={identityInputRef}
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={onIdentityChange}
          />

          {identityFile ? (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-primary/30 shadow-xs">
              <div className="flex items-center gap-2.5 truncate">
                {identityPreview ? (
                  <img
                    src={identityPreview}
                    alt="ID Preview"
                    className="size-10 rounded-xl object-cover border"
                  />
                ) : (
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="size-5" />
                  </div>
                )}
                <div className="truncate text-left">
                  <p className="text-xs font-semibold text-foreground truncate max-w-[130px]">
                    {identityFile.name}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium">
                    Ready for upload ({(identityFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onRemoveIdentity}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Remove ID"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => identityInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center py-6 px-4 rounded-2xl border-2 border-dashed border-border/70 hover:border-primary/60 bg-muted/10 hover:bg-primary/5 transition-all cursor-pointer group"
            >
              <UploadCloud className="size-7 text-muted-foreground group-hover:text-primary transition-colors mb-1.5" />
              <p className="text-xs font-semibold text-foreground">
                Upload Government ID
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                PDF or image, max 10MB
              </p>
            </button>
          )}
        </div>

        {/* 2. Trade Certificate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Wrench className="size-3.5 text-primary" />
              Trade / Skill Certificate <span className="text-destructive">*</span>
            </Label>
            <span className="text-[10px] text-muted-foreground">
              ITI / Diploma / Apprenticeship
            </span>
          </div>

          <input
            type="file"
            ref={certificateInputRef}
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={onCertificateChange}
          />

          {certificateFile ? (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-primary/30 shadow-xs">
              <div className="flex items-center gap-2.5 truncate">
                {certificatePreview ? (
                  <img
                    src={certificatePreview}
                    alt="Certificate Preview"
                    className="size-10 rounded-xl object-cover border"
                  />
                ) : (
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="size-5" />
                  </div>
                )}
                <div className="truncate text-left">
                  <p className="text-xs font-semibold text-foreground truncate max-w-[130px]">
                    {certificateFile.name}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium">
                    Ready for upload ({(certificateFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onRemoveCertificate}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Remove Certificate"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => certificateInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center py-6 px-4 rounded-2xl border-2 border-dashed border-border/70 hover:border-primary/60 bg-muted/10 hover:bg-primary/5 transition-all cursor-pointer group"
            >
              <UploadCloud className="size-7 text-muted-foreground group-hover:text-primary transition-colors mb-1.5" />
              <p className="text-xs font-semibold text-foreground">
                Upload Trade Certificate
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                PDF or image, max 10MB
              </p>
            </button>
          )}
        </div>
      </div>

      {/* Trust and privacy disclaimer */}
      <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 text-[11px] text-muted-foreground flex items-center gap-2">
        <ShieldCheck className="size-4 text-primary shrink-0" />
        <span>
          Your documents are stored in secure encrypted cloud storage and verified within 24-48 hours.
        </span>
      </div>

      {/* Back and Submit Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-12 px-5 rounded-2xl text-sm font-medium border-border/80 gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-12 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Uploading Documents & Submitting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Complete Worker Registration
              <CheckCircle2 className="size-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};
