import RegisterShowcase from "@/components/auth/register/RegisterShowcase";
import RegisterForm from "@/components/auth/register/RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-gradient-to-br from-background via-muted/25 to-background relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-120 h-120 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 translate-x-1/3 w-105 h-105 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Brand Showcase & Value Props */}
        <RegisterShowcase />

        {/* Right Side: Registration Form Card */}
        <RegisterForm />
      </div>
    </div>
  );
}