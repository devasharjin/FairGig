export type InquiryCategory =
  | "Booking & Services"
  | "Worker Affiliation"
  | "Cooperative Society"
  | "Billing & Payments"
  | "Technical Support"
  | "General Inquiry";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  category: InquiryCategory;
  subject: string;
  message: string;
}

export interface ContactResponseData {
  ticketNumber: string;
  createdAt: string;
}
