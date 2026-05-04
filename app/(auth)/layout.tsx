import Link from "next/link";
import { ToastContainer } from "@/components/ui/Toast";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <ToastContainer />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="font-[family-name:var(--font-cormorant)] italic text-3xl text-primary-hover font-light"
            >
              ModasClub
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
