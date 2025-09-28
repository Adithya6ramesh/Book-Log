import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "../components/register-form";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return <RegisterForm />;
}