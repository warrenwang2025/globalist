"use client";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { use } from "react";

interface ResetPasswordPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = use(params);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md p-8">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
