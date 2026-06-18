"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginContent />
    </React.Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { logIn, user } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const redirectTo = params.get("redirect") ?? "/dashboard";

  React.useEffect(() => {
    if (user) {
      router.push(user.role === "admin" ? "/admin" : redirectTo);
    }
  }, [user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await logIn(email, password);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/invalid-credential") setError("Invalid email or password");
      else if (code === "auth/too-many-requests") setError("Too many attempts. Try again later.");
      else if (code === "auth/user-not-found") setError("No account found with this email");
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="pt-32 pb-20">
      <div className="mx-auto max-w-sm">
        <p className="label-mono text-[color:var(--primary)]">Welcome back</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight">
          Log in
        </h1>
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
          Access your dashboard and track your invitations.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            {loading ? "Logging in…" : "Log in"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[color:var(--muted-foreground)]">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-[color:var(--foreground)] underline">
            Sign up
          </a>
        </p>
      </div>
    </Container>
  );
}
