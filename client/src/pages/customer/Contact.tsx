import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

const CATEGORIES: InquiryCategory[] = [
  "Booking & Services",
  "Billing & Payments",
  "Worker Affiliation",
  "Cooperative Society",
  "Technical Support",
  "General Inquiry",
];

const FAQS = [
  {
    question: "How do I reschedule or cancel a booked service?",
    answer:
      "You can manage your bookings directly from your 'My Bookings' dashboard. Active and pending requests can be rescheduled or cancelled with zero penalty prior to worker dispatch.",
  },
  {
    question: "Are all trade workers certified and verified?",
    answer:
      "Yes. Every specialist on FairGig is verified by an affiliated local cooperative society and vetted for certified trade skills, government ID documentation, and floor wage compliance.",
  },
  {
    question: "How does fair pricing work without surge charges?",
    answer:
      "Unlike conventional aggregator apps that inflate prices during peak hours, FairGig operates on standardized hourly and per-meter tariff cards determined democratically by trade unions and federations.",
  },
  {
    question: "How can a local cooperative society join the platform?",
    answer:
      "Registered cooperative societies can submit their registration documents through our 'Affiliate Co-op' portal. Our apex verification team reviews and approves societies within 48 business hours.",
  },
];

export const CustomerContact: React.FC = () => {
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

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* 1. Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="size-3.5" />
          <span>Cooperative Assistance & Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          We're Here to Help
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
          Have an inquiry about an ongoing gig, dispute resolution, or cooperative society membership? Get in touch with our dedicated support secretariat.
        </p>
      </div>

      {/* 2. Quick Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Helpline */}
        <div className="p-5 rounded-3xl border border-border/80 bg-card shadow-xs space-y-2 hover:border-primary/30 transition-all">
          <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Phone className="size-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Helpline Desk</h3>
          <p className="text-xs text-muted-foreground">
            Mon – Sat, 8:00 AM – 8:00 PM IST
          </p>
          <a
            href="tel:18003247444"
            className="text-xs font-bold text-primary hover:underline block pt-1"
          >
            +91 1800-FAIR-GIG
          </a>
        </div>

        {/* Email Desk */}
        <div className="p-5 rounded-3xl border border-border/80 bg-card shadow-xs space-y-2 hover:border-primary/30 transition-all">
          <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Mail className="size-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Email Secretariat</h3>
          <p className="text-xs text-muted-foreground">
            Average response time: &lt; 2 hours
          </p>
          <a
            href="mailto:support@fairgig.coop"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline block pt-1 truncate"
          >
            support@fairgig.coop
          </a>
        </div>

        {/* Apex Office */}
        <div className="p-5 rounded-3xl border border-border/80 bg-card shadow-xs space-y-2 hover:border-primary/30 transition-all">
          <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Building2 className="size-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Apex Headquarters</h3>
          <p className="text-xs text-muted-foreground leading-snug">
            Institutional Area, New Delhi, India 110001
          </p>
          <span className="text-[11px] font-semibold text-muted-foreground block pt-1">
            Registered Trade Society
          </span>
        </div>

        {/* Dispute Protocol */}
        <div className="p-5 rounded-3xl border border-border/80 bg-card shadow-xs space-y-2 hover:border-primary/30 transition-all">
          <div className="size-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Dispute Resolution</h3>
          <p className="text-xs text-muted-foreground">
            Ombudsman arbitration for patrons and workers
          </p>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block pt-1">
            Zero-Cut Arbitration
          </span>
        </div>
      </div>

      {/* 3. Main Two-Column Content: Left = Inquiry Form, Right = FAQs & Assurance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Interactive Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-border/50">
              <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Send Us a Message
                </h2>
                <p className="text-xs text-muted-foreground">
                  Fill out the form below and a representative will respond via email or phone
                </p>
              </div>
            </div>

            {/* Submission Success Notification */}
            {submittedTicket && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Inquiry Submitted Successfully!</span>
                </div>
                <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90">
                  Your reference ticket number is{" "}
                  <strong className="font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded">
                    {submittedTicket}
                  </strong>
                  . A support officer will inspect your inquiry shortly.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSubmittedTicket(null)}
                  className="h-7 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 p-0"
                >
                  Send another inquiry →
                </Button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Pills */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Inquiry Topic <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = formData.category === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleChange("category", cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-muted/40 text-muted-foreground border-border/70 hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name" className="text-xs font-semibold text-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contact-name"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={submitContactMutation.isPending}
                    className="rounded-xl h-10 text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-email" className="text-xs font-semibold text-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={submitContactMutation.isPending}
                    className="rounded-xl h-10 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Phone and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-phone" className="text-xs font-semibold text-foreground">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="contact-phone"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={submitContactMutation.isPending}
                    className="rounded-xl h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-subject" className="text-xs font-semibold text-foreground">
                    Subject <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contact-subject"
                    placeholder="Brief description of your query"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    disabled={submitContactMutation.isPending}
                    className="rounded-xl h-10 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="contact-message" className="text-xs font-semibold text-foreground">
                    Message Details <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    {formData.message.length} / 2000
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Provide all relevant details, booking numbers (if applicable), or description of your question..."
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  maxLength={2000}
                  disabled={submitContactMutation.isPending}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-input bg-input/20 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitContactMutation.isPending}
                className="w-full sm:w-auto rounded-xl h-11 px-6 text-xs sm:text-sm font-semibold gap-2 cursor-pointer bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
              >
                {submitContactMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Transmitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: FAQs & Trust Banner */}
        <div className="lg:col-span-5 space-y-6">
          {/* FAQ Accordion */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
              <HelpCircle className="size-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-2">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="border border-border/60 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 text-xs font-semibold text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`size-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : ""
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
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-primary/15 text-primary border-primary/30 text-xs font-semibold"
              >
                Guaranteed Patron Care
              </Badge>
            </div>
            <h4 className="text-base font-bold text-foreground">
              Direct Cooperative Federation Support
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every message is routed straight to registered trade federation ombudsmen. You are never left dealing with robotic chatbots or offshore support queues.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/services">
                <Button
                  variant="outline"
                  className="w-full justify-center rounded-xl text-xs font-semibold h-9"
                >
                  Browse Verified Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerContact;
