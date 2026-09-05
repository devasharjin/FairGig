import CooperativeRegisterForm from "@/components/auth/cooperativeRegister/CooperativeRegisterForm";

export default function CooperativeRegister() {
  return (
    <div className="min-h-[calc(100vh-2rem)] w-full flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[360px] h-[360px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-3xl my-auto">
        <CooperativeRegisterForm />
      </div>
    </div>
  );
}