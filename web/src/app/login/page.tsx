import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
