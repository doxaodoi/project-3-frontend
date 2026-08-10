"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { Eye, EyeOff } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth-context";

type Mode = "signin" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const isRegister = mode === "register";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);

    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).trim();
    const password = fd.get("password") as string;

    try {
      if (isRegister) {
        const fullName = (fd.get("name") as string).trim();
        if (!fullName) {
          setError("Full name is required.");
          setBusy(false);
          return;
        }
        await register({ fullName, email, password });
      } else {
        await login(email, password);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center p-4 sm:p-8">
      <div className="flex w-full max-w-[1160px] flex-col overflow-hidden rounded-[14px] border border-line2 bg-paper shadow-[0_20px_60px_-20px_rgba(40,30,15,0.4)] md:min-h-[560px] md:flex-row">
        {/* Brand panel */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-ink px-8 py-10 text-paper sm:px-10 md:w-[44%] md:py-11">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full border border-paper/10" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full border border-paper/10" />

          <div className="flex items-center gap-3">
            <LogoMark size={36} />
            <span className="font-serif text-2xl font-semibold">Reclaim</span>
          </div>

          <div className="relative my-8 md:my-0">
            <div className="eyebrow mb-4 text-[#c98a6e]">Campus Lost &amp; Found</div>
            <h2 className="mb-3.5 font-serif text-[32px] font-medium leading-[1.08] tracking-[-0.02em] sm:text-[38px]">
              Lost it here.
              <br />
              Find it here.
            </h2>
            <p className="max-w-[340px] text-[14.5px] leading-relaxed text-[#c9c1b2]">
              One board for everything misplaced on campus — matched
              automatically, claimed privately.
            </p>
          </div>

          <div className="relative text-[13px] text-[#9a9384]">
            1,240 items reunited this semester
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-[52px] sm:py-12">
          <div className="mb-7 flex w-fit gap-1.5 rounded-[9px] bg-[#eee7db] p-[5px] text-sm font-semibold">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(""); }}
              className={
                "rounded-[6px] px-[22px] py-[9px] transition-colors " +
                (!isRegister
                  ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-muted")
              }
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); }}
              className={
                "rounded-[6px] px-[22px] py-[9px] transition-colors " +
                (isRegister
                  ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-muted")
              }
            >
              Register
            </button>
          </div>

          <h3 className="mb-1.5 font-serif text-[28px] font-semibold tracking-[-0.01em]">
            {isRegister ? "Create your account" : "Welcome back"}
          </h3>
          <p className="mb-6 text-sm text-ink3">
            {isRegister
              ? "Join the campus board to report and claim items."
              : "Sign in to manage your reports and claims."}
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-[#e5c1b0] bg-[#fdf0ea] px-4 py-3 text-sm text-rust">
              {error}
            </div>
          )}

          <form className="flex flex-col" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="mb-[18px]">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" placeholder="Ama Mensah" autoComplete="name" />
              </div>
            )}

            <div className="mb-[18px]">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ama.mensah@ug.edu.gh"
                autoComplete="email"
              />
            </div>

            <div className="mb-6">
              <Label
                htmlFor="password"
                hint={
                  !isRegister && (
                    <Link
                      href="#"
                      className="text-xs font-medium text-rust hover:text-rustdark"
                    >
                      Forgot?
                    </Link>
                  )
                }
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••••"
                autoComplete={isRegister ? "new-password" : "current-password"}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="hover:text-ink2"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy
                ? "Please wait..."
                : isRegister
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </form>

          <div className="mt-5 text-center text-[13px] text-muted">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(""); }}
                  className="font-semibold text-rust hover:text-rustdark"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("register"); setError(""); }}
                  className="font-semibold text-rust hover:text-rustdark"
                >
                  Create an account →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
