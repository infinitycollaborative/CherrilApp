"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  updateProfile,
  updateNotifications,
  changePassword,
  deleteAccount,
  type ActionState,
} from "@/app/actions/settings";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import type { Profile } from "@/lib/types";

function SaveButton({ label = "Save changes" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending && <Spinner />}
      {pending ? "Saving…" : label}
    </button>
  );
}

function useActionToast(state: ActionState) {
  const { toast } = useToast();
  useEffect(() => {
    if (state.message) toast(state.message, "success");
    else if (state.error) toast(state.error, "error");
  }, [state, toast]);
}

export function ProfileSection({ profile }: { profile: Profile }) {
  const [state, action] = useActionState<ActionState, FormData>(
    updateProfile,
    {},
  );
  useActionToast(state);

  const initials = (profile.full_name || profile.email)
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <form action={action} className="card space-y-4">
      <h2 className="text-h3">Profile</h2>
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-gradient text-lg font-bold text-white">
          {initials}
        </span>
        <div className="flex-1">
          <label className="label">Avatar URL</label>
          <input
            name="avatar_url"
            className="input"
            defaultValue={profile.avatar_url ?? ""}
            placeholder="https://…"
          />
        </div>
      </div>
      <div>
        <label className="label">Full name</label>
        <input
          name="full_name"
          className="input"
          defaultValue={profile.full_name ?? ""}
        />
      </div>
      <div>
        <label className="label">Company name</label>
        <input
          name="company_name"
          className="input"
          defaultValue={profile.company_name ?? ""}
        />
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input opacity-60" value={profile.email} disabled />
      </div>
      <div className="flex justify-end">
        <SaveButton />
      </div>
    </form>
  );
}

export function PasswordSection() {
  const [state, action] = useActionState<ActionState, FormData>(
    changePassword,
    {},
  );
  useActionToast(state);
  return (
    <form action={action} className="card space-y-4">
      <h2 className="text-h3">Change password</h2>
      <div>
        <label className="label">New password</label>
        <input
          name="password"
          type="password"
          className="input"
          minLength={8}
          required
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label className="label">Confirm new password</label>
        <input
          name="confirm"
          type="password"
          className="input"
          minLength={8}
          required
        />
      </div>
      <div className="flex justify-end">
        <SaveButton label="Update password" />
      </div>
    </form>
  );
}

export function NotificationsSection({ profile }: { profile: Profile }) {
  const [state, action] = useActionState<ActionState, FormData>(
    updateNotifications,
    {},
  );
  useActionToast(state);
  return (
    <form action={action} className="card space-y-4">
      <h2 className="text-h3">Notifications</h2>
      <label className="flex items-center justify-between gap-4">
        <span>
          <span className="block text-sm font-medium text-gray-100">
            Product updates
          </span>
          <span className="block text-xs text-gray-500">
            New features and improvements.
          </span>
        </span>
        <input
          name="notify_product"
          type="checkbox"
          defaultChecked={profile.notify_product}
          className="h-5 w-5 accent-[#0057B8]"
        />
      </label>
      <label className="flex items-center justify-between gap-4">
        <span>
          <span className="block text-sm font-medium text-gray-100">
            Marketing & tips
          </span>
          <span className="block text-xs text-gray-500">
            Content best practices and occasional offers.
          </span>
        </span>
        <input
          name="notify_marketing"
          type="checkbox"
          defaultChecked={profile.notify_marketing}
          className="h-5 w-5 accent-[#0057B8]"
        />
      </label>
      <div className="flex justify-end">
        <SaveButton label="Save preferences" />
      </div>
    </form>
  );
}

export function DangerSection() {
  const { toast } = useToast();
  async function onDelete() {
    if (
      !confirm(
        "Delete your account and all your content permanently? This cannot be undone.",
      )
    )
      return;
    const res = await deleteAccount();
    if (res?.error) toast(res.error, "error");
  }
  return (
    <div className="card space-y-4 border-red-500/30">
      <h2 className="text-h3 text-red-300">Danger zone</h2>
      <p className="text-sm text-gray-400">
        Deleting your account removes all your brand profiles, content and
        revisions. This action is permanent.
      </p>
      <form action={onDelete}>
        <button className="btn-danger" type="submit">
          Delete my account
        </button>
      </form>
    </div>
  );
}
