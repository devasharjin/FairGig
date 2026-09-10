import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { submitContactForm } from "./api";
import type { ContactFormData, ContactResponseData } from "./types";

export function useSubmitContact() {
  return useMutation<ContactResponseData, Error, ContactFormData>({
    mutationFn: (payload: ContactFormData) => submitContactForm(payload),
    onSuccess: (data) => {
      toast.success(
        `Inquiry submitted successfully! Reference ticket: ${data.ticketNumber}`,
        { duration: 5000 }
      );
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit inquiry. Please try again.");
    },
  });
}
