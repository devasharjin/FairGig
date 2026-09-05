import React from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  ImageIcon,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CooperativeDocumentsStepProps {
  logoFile: File | null;
  logoPreview: string | null;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
  certificateFile: File | null;
  certificatePreview: string | null;
  certificateInputRef: React.RefObject<HTMLInputElement | null>;
  onCertificateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCertificate: () => void;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CooperativeDocumentsStep: React.FC<CooperativeDocumentsStepProps> = ({
  logoFile,
  logoPreview,
  logoInputRef,
  onLogoChange,
  onRemoveLogo,
  certificateFile,
  certificatePreview,
  certificateInputRef,
  onCertificateChange,
  onRemoveCertificate,
  isLoading,
  onBack,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-in fade-in-50 duration-200">
      {/* File Upload Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Document 1: Cooperative Logo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <ImageIcon className="size-3.5 text-primary" />
              Society Brand Logo <span className="text-destructive">*</span>
            </Label>
            <span className="text-[10px] text-muted-foreground">
              JPG, PNG, WebP (Max 10MB)
            </span>
          </div>

          <input
            type="file"
            ref={logoInputRef}
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={onLogoChange}
          />

          {logoFile ? (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-primary/30 shadow-xs">
              <div className="flex items-center gap-3 truncate">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="size-11 rounded-xl object-cover border border-border/80 bg-background"
                  />
                ) : (
                  <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ImageIcon className="size-5" />
                  </div>
                )}
                <div className="truncate text-left">
                  <p className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                    {logoFile.name}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    Ready ({(logoFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onRemoveLogo}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Remove Logo"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => logoInputRef.current?.click()}
              className="group border-2 border-dashed border-border/80 hover:border-primary/50 hover:bg-primary/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center min-h-[140px]"
            >
              <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Upload Society Logo
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Click or drag official image file
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Document 2: Verification Certificate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FileCheck className="size-3.5 text-primary" />
              Registration Certificate <span className="text-destructive">*</span>
            </Label>
            <span className="text-[10px] text-muted-foreground">
              PDF, JPG, PNG (Max 10MB)
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
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-primary/30 shadow-xs">
              <div className="flex items-center gap-3 truncate">
                {certificatePreview ? (
                  <img
                    src={certificatePreview}
                    alt="Certificate Preview"
                    className="size-11 rounded-xl object-cover border border-border/80 bg-background"
                  />
                ) : (
                  <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="size-5" />
                  </div>
                )}
                <div className="truncate text-left">
                  <p className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                    {certificateFile.name}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    Ready ({(certificateFile.size / 1024).toFixed(1)} KB)
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
            <div
              onClick={() => certificateInputRef.current?.click()}
              className="group border-2 border-dashed border-border/80 hover:border-primary/50 hover:bg-primary/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center min-h-[140px]"
            >
              <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Upload Registration Certificate
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Societies Act Certificate or Bylaws
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Notice Banner */}
      <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 flex items-start gap-3">
        <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground block mb-0.5">
            Administrative Approval Process
          </span>
          Submitted documents are audited by platform administrators within 24 to 48 hours to confirm legal cooperative registration before full membership and bidding features are activated.
        </div>
      </div>

      {/* Navigation & Submit Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold border-border/80 hover:bg-muted/50 cursor-pointer"
        >
          <ArrowLeft className="size-4 mr-1.5" />
          Back to Details
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-11 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer active:scale-98"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Submitting Society Profile...
            </>
          ) : (
            <>
              Complete Cooperative Registration
              <ArrowRight className="size-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
