import { SignUpForm } from "@/components/auth/signup-form"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md p-8">
        <SignUpForm />
      </div>
    </div>
  )
}