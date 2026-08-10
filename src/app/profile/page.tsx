"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { useAuth } from "@/lib/auth-context";
import { auth as authApi } from "@/lib/api";


export default function ProfilePage() {
  const { user, logout, refresh } = useAuth();
  const [name, setName] = useState(user?.fullName ?? "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const initial = user?.fullName?.charAt(0).toUpperCase() ?? "?";

  async function handleSave() {
    setSaving(true);
    try {
      await authApi.updateProfile({ fullName: name });
      await refresh();
      setSaved(true);
    } catch {
      // ignore
    }
    setSaving(false);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[600px] py-6">
        <div className="overflow-hidden rounded-[14px] border border-line2 bg-paper">
          {/* Header */}
          <div className="flex items-center gap-[18px] border-b border-line px-6 py-6 sm:px-7">
            <div className="flex h-[72px] w-[72px] flex-none items-center justify-center rounded-full bg-gradient-to-br from-rust to-[#c8703f] font-serif text-3xl font-semibold text-white">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-serif text-2xl font-semibold">
                {name || user?.fullName}
              </div>
              <div className="text-[13px] text-ink3">{user?.email}</div>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4 px-6 py-6 sm:px-7">
            <div>
              <Label htmlFor="fullname">Full name</Label>
              <Input
                id="fullname"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="rounded-[9px] border border-line bg-panel px-3.5 py-3 text-sm text-ink3">
                  {user?.email}
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone (private)</Label>
                <div className="rounded-[9px] border border-line bg-card px-3.5 py-3 text-sm text-ink">
                  {user?.phone ?? "Not set"}
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-1"
              onClick={handleSave}
              disabled={saving}
            >
              {saved ? "Saved" : saving ? "Saving..." : "Save changes"}
            </Button>

            <button
              type="button"
              onClick={logout}
              className="mt-2 text-sm font-semibold text-rust hover:text-rustdark"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
