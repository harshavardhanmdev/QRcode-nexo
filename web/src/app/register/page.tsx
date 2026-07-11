import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Create a free account",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}
