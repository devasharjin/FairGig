import LoginShowcase from "@/components/auth/login/LoginShowcase";
import LoginForm from "@/components/auth/login/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-gradient-to-br from-background via-muted/25 to-background relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 translate-x-1/3 w-[420px] h-[420px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Brand Showcase & Value Props */}
        <LoginShowcase />

        {/* Right Side: Login Form Card */}
        <LoginForm />
      </div>
    </div>
  );
}