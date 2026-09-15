import { Suspense } from "react";
import { AuthForm } from "@/components/site/AuthForm";

export const metadata = { title: "Get started — Velt" };

export default function SignupPage() {
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
