import { Suspense } from "react";
import { AuthForm } from "@/components/site/AuthForm";

export const metadata = { title: "Sign in — Velt" };

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
