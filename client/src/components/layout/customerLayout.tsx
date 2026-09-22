import { Outlet } from "react-router-dom";
import CustomerNavbar from "../customer/common/navbar";
import Footer from "../common/footer";
import { VoiceAssistantModal } from "../customer/voice/VoiceAssistantModal";
import { VoiceAssistantTrigger } from "../customer/voice/VoiceAssistantTrigger";
import { ServiceBookingDialog } from "../customer/services/service-booking-dialog";
import { useVoiceAssistantStore } from "@/features/customer/voice/voiceStore";

const CustomerLayout = () => {
  const {
    isBookingDialogOpen,
    closeExistingBookingDialog,
    bookingServiceForDialog,
    bookingPrefillForDialog,
  } = useVoiceAssistantStore();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <CustomerNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />

      {/* Multilingual AI Voice Booking Assistant Modal */}
      <VoiceAssistantModal />

      {/* Floating Microphone Trigger Orb */}
      <VoiceAssistantTrigger />

      {/* Existing Service Booking Dialog with Voice Prefill Bridge */}
      <ServiceBookingDialog
        open={isBookingDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeExistingBookingDialog();
        }}
        service={bookingServiceForDialog}
        initialData={bookingPrefillForDialog}
      />
    </div>
  );
};

export default CustomerLayout;