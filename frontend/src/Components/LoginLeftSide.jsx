import { LayoutGrid } from "lucide-react";

function LoginLeftSide() {
  return (
    <div className="hidden h-screen md:flex w-1/2 bg-brand-950 relative overflow-hidden border-r border-brand-900/50">
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-12 left-12 w-32 h-32 border-2 border-white rounded-full" />
        <div className="absolute bottom-24 right-16 w-48 h-48 border-2 border-white rounded-2xl rotate-12" />
      </div>
      <div className="relative z-10 flex flex-col items-start justify-center p-12 lg:p-20 w-full h-full">
        <div className="mb-8 p-3 rounded-xl bg-brand-500/15 border border-brand-500/20">
          <LayoutGrid className="w-8 h-8 text-brand-400" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
          Employee <br /> Management System
        </h1>
        <p className="text-brand-200/80 text-lg max-w-md leading-relaxed">
          Streamline your workforce operations, track attendance, and manage
          payroll & leave requests with ease.
        </p>
      </div>
    </div>
  );
}

export default LoginLeftSide;
