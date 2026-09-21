import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface EditProfileFormData {
  name: string;
  phone: string;
  experience: number | string;
  availability: "Full-Time" | "Part-Time";
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EditProfileFormData;
  onChange: (field: keyof EditProfileFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  formData,
  onChange,
  onSubmit,
  isPending,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Edit Worker Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update your contact details, trade experience, and dispatch coverage area.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="formName" className="text-xs font-medium">
                Full Name
              </Label>
              <Input
                id="formName"
                value={formData.name}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Your Full Name"
                className="rounded-lg h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="formPhone" className="text-xs font-medium">
                Phone Number
              </Label>
              <Input
                id="formPhone"
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="rounded-lg h-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="formExp" className="text-xs font-medium">
                Years of Experience
              </Label>
              <Input
                id="formExp"
                type="number"
                min="0"
                max="50"
                value={formData.experience}
                onChange={(e) => onChange("experience", e.target.value)}
                placeholder="e.g. 5"
                className="rounded-lg h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="formAvail" className="text-xs font-medium">
                Availability
              </Label>
              <select
                id="formAvail"
                value={formData.availability}
                onChange={(e) =>
                  onChange("availability", e.target.value as "Full-Time" | "Part-Time")
                }
                className="w-full rounded-lg border border-input bg-background h-9 px-3 text-xs focus:ring-1 focus:ring-ring focus:outline-none"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="formAddress" className="text-xs font-medium">
              Street Address
            </Label>
            <Input
              id="formAddress"
              value={formData.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Street address or workshop location"
              className="rounded-lg h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="formCity" className="text-xs font-medium">
                City
              </Label>
              <Input
                id="formCity"
                value={formData.city}
                onChange={(e) => onChange("city", e.target.value)}
                placeholder="City"
                className="rounded-lg h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="formState" className="text-xs font-medium">
                State
              </Label>
              <Input
                id="formState"
                value={formData.state}
                onChange={(e) => onChange("state", e.target.value)}
                placeholder="State"
                className="rounded-lg h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="formPin" className="text-xs font-medium">
                Pincode
              </Label>
              <Input
                id="formPin"
                value={formData.pincode}
                onChange={(e) => onChange("pincode", e.target.value)}
                placeholder="600001"
                className="rounded-lg h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-lg text-xs font-semibold cursor-pointer bg-primary text-primary-foreground"
            >
              {isPending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
