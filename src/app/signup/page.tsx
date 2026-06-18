"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, user } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/email-already-in-use") setError("An account with this email already exists");
      else if (code === "auth/weak-password") setError("Password is too weak");
      else if (code === "auth/invalid-email") setError("Invalid email address");
      else setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="pt-32 pb-20">
      <div className="mx-auto max-w-sm">
        <p className="label-mono text-[color:var(--primary)]">Get started</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight">
          Create account
        </h1>
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
          Sign up to create and track your invitations.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="mt-2"
              required
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="mt-2"
              required
            />
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-sm text-[color:var(--primary)]">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[color:var(--muted-foreground)]">
          Already have an account?{" "}
          <a href="/login" className="text-[color:var(--foreground)] underline">
            Log in
          </a>
        </p>
      </div>
    </Container>
  );
}
