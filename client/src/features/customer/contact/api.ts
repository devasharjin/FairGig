import { apiPost } from "@/lib/api";
import type { ContactFormData, ContactResponseData } from "./types";

export async function submitContactForm(
  payload: ContactFormData
): Promise<ContactResponseData> {
  return apiPost<ContactResponseData, ContactFormData>(
    "/api/customer/contact",
    payload
  );
}
