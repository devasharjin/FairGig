import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Phone,
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Building2,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { useSubmitContact } from "@/features/customer/contact/hooks";
import type {
  ContactFormData,
  InquiryCategory,
} from "@/features/customer/contact/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const CATEGORIES: { value: InquiryCategory; key: string }[] = [
  { value: "Booking & Services", key: "booking_services" },
  { value: "Billing & Payments", key: "billing_payments" },
  { value: "Worker Affiliation", key: "worker_affiliation" },
  { value: "Cooperative Society", key: "cooperative_society" },
  { value: "Technical Support", key: "technical_support" },
  { value: "General Inquiry", key: "general_inquiry" },
];

export const CustomerContact: React.FC = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const submitContactMutation = useSubmitContact();

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    category: "Booking & Services",
    subject: "",
    message: "",
  });

  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    { question: t("contact.faqs.q1"), answer: t("contact.faqs.a1") },
    { question: t("contact.faqs.q2"), answer: t("contact.faqs.a2") },
    { question: t("contact.faqs.q3"), answer: t("contact.faqs.a3") },
    { question: t("contact.faqs.q4"), answer: t("contact.faqs.a4") },
  ];

  // Auto-populate authenticated customer details
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    submitContactMutation.mutate(formData, {
      onSuccess: (data) => {
        setSubmittedTicket(data.ticketNumber);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          category: "Booking & Services",
          subject: "",
          message: "",
        });
      },
    });
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0B131D] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* 1. Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="size-3.5 text-accent" />
            <span>{t("contact.badge")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            {t("contact.title")}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* 2. Quick Contact Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Helpline */}
          <div className="p-3.5 sm:p-5 rounded-2xl border border-border/70 bg-card shadow-xs space-y-1.5 sm:space-y-2 hover:border-primary/30 transition-all min-w-0">
            <div className="size-8 sm:size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Phone className="size-4 sm:size-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-foreground truncate">{t("contact.helplineTitle")}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug line-clamp-2 sm:line-clamp-none">
              {t("contact.helplineHours")}
            </p>
            <a
              href="tel:18003247444"
              className="text-[11px] sm:text-xs font-bold text-primary hover:underline block pt-0.5 sm:pt-1 truncate"
            >
              +91 1800-FAIR-GIG
            </a>
          </div>

          {/* Email Desk */}
          <div className="p-3.5 sm:p-5 rounded-2xl border border-border/70 bg-card shadow-xs space-y-1.5 sm:space-y-2 hover:border-primary/30 transition-all min-w-0">
            <div className="size-8 sm:size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Mail className="size-4 sm:size-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-foreground truncate">{t("contact.emailTitle")}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug line-clamp-2 sm:line-clamp-none">
              {t("contact.emailAvg")}
            </p>
            <a
              href="mailto:support@fairgig.coop"
              className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline block pt-0.5 sm:pt-1 truncate"
              title="support@fairgig.coop"
            >
              support@fairgig.coop
            </a>
          </div>

          {/* Apex Office */}
          <div className="p-3.5 sm:p-5 rounded-2xl border border-border/70 bg-card shadow-xs space-y-1.5 sm:space-y-2 hover:border-primary/30 transition-all min-w-0">
            <div className="size-8 sm:size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Building2 className="size-4 sm:size-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-foreground truncate">{t("contact.apexTitle")}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug line-clamp-2 sm:line-clamp-none">
              {t("contact.apexAddress")}
            </p>
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground block pt-0.5 sm:pt-1 truncate">
              {t("contact.registeredTrade")}
            </span>
          </div>

          {/* Dispute Protocol */}
          <div className="p-3.5 sm:p-5 rounded-2xl border border-border/70 bg-card shadow-xs space-y-1.5 sm:space-y-2 hover:border-primary/30 transition-all min-w-0">
            <div className="size-8 sm:size-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4 sm:size-5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-foreground truncate">{t("contact.disputeTitle")}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug line-clamp-2 sm:line-clamp-none">
              {t("contact.disputeSubtitle")}
            </p>
            <span className="text-[11px] sm:text-xs font-bold text-accent block pt-0.5 sm:pt-1 truncate">
              {t("contact.zeroCut")}
            </span>
          </div>
        </div>

        {/* 3. Main Two-Column Content: Left = Inquiry Form, Right = FAQs & Assurance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {t("contact.formTitle")}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t("contact.formSubtitle")}
                  </p>
                </div>
              </div>

              {/* Submission Success Notification */}
              {submittedTicket && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>{t("contact.submittedTitle")}</span>
                  </div>
                  <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90">
                    {t("contact.submittedDesc", { ticket: submittedTicket })}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmittedTicket(null)}
                    className="text-xs h-8 mt-1 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 cursor-pointer"
                  >
                    {t("contact.submitAnother")}
                  </Button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className="text-xs font-semibold text-foreground">
                      {t("contact.fullName")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder={t("contact.fullNamePlaceholder")}
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      disabled={submitContactMutation.isPending}
                      className="rounded-xl h-10 text-xs sm:text-sm"
                      required
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="text-xs font-semibold text-foreground">
                      {t("contact.emailAddress")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder={t("contact.emailPlaceholder")}
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={submitContactMutation.isPending}
                      className="rounded-xl h-10 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-phone" className="text-xs font-semibold text-foreground">
                      {t("contact.phone")}
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder={t("contact.phonePlaceholder")}
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      disabled={submitContactMutation.isPending}
                      className="rounded-xl h-10 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-category" className="text-xs font-semibold text-foreground">
                      {t("contact.inquiryDomain")} <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="contact-category"
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value as InquiryCategory)}
                      disabled={submitContactMutation.isPending}
                      className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {t(`contact.categories.${cat.key}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <Label htmlFor="contact-subject" className="text-xs font-semibold text-foreground">
                    {t("contact.subject")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contact-subject"
                    placeholder={t("contact.subjectPlaceholder")}
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    disabled={submitContactMutation.isPending}
                    className="rounded-xl h-10 text-xs sm:text-sm"
                    required
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contact-message" className="text-xs font-semibold text-foreground">
                      {t("contact.messageDetails")} <span className="text-destructive">*</span>
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      {formData.message.length} / 2000
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder={t("contact.messagePlaceholder")}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    maxLength={2000}
                    disabled={submitContactMutation.isPending}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-card text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitContactMutation.isPending}
                  className="w-full sm:w-auto rounded-xl h-10 px-6 text-xs sm:text-sm font-semibold gap-2 cursor-pointer bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
                >
                  {submitContactMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>{t("contact.transmitting")}</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>{t("contact.sendMessage")}</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: FAQs & Trust Banner */}
          <div className="lg:col-span-5 space-y-6">
            {/* FAQ Accordion */}
            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
                <HelpCircle className="size-4 text-accent" />
                <h3 className="font-bold text-sm text-foreground">
                  {t("contact.faqTitle")}
                </h3>
              </div>

              <div className="space-y-2">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={faq.question}
                      className="border border-border/60 rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 text-xs font-semibold text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`size-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-accent" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3.5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40 bg-muted/10">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cooperative Guarantee Box */}
            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-accent/10 text-accent border-accent/25 text-xs font-semibold"
                >
                  {t("contact.patronCareBadge", { defaultValue: "Guaranteed Patron Care" })}
                </Badge>
              </div>
              <h4 className="text-base font-bold text-foreground">
                {t("contact.patronCareTitle", { defaultValue: "Direct Cooperative Federation Support" })}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("contact.patronCareDesc", { defaultValue: "Every message is routed straight to registered trade federation ombudsmen. You are never left dealing with robotic chatbots or offshore support queues." })}
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/services">
                  <Button
                    variant="outline"
                    className="w-full justify-center rounded-xl text-xs font-semibold h-10 hover:border-accent/50"
                  >
                    {t("contact.browseServicesBtn", { defaultValue: "Browse Verified Services" })}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerContact;
