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
import { initialsOf } from "@/lib/format";
import type { Profile } from "@/lib/types";

function SaveButton({ label = "Save changes" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending && <Spinner className="h-5 w-5" />}
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

  return (
    <form action={action} className="card space-y-5">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-gradient text-xl font-bold text-white">
          {initialsOf(profile.full_name || profile.email)}
        </span>
        <h2 className="text-h3">Your details</h2>
      </div>
      <div>
        <label className="label" htmlFor="full_name">
          Your name
        </label>
        <input
          id="full_name"
          name="full_name"
          className="input"
          defaultValue={profile.full_name ?? ""}
        />
      </div>
      <div>
        <label className="label" htmlFor="phone">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="input"
          defaultValue={profile.phone ?? ""}
          placeholder="(813) 555-0142"
        />
      </div>
      <div>
        <label className="label" htmlFor="city">
          Your city
        </label>
        <input
          id="city"
          name="city"
          className="input"
          defaultValue={profile.city ?? ""}
          placeholder="Tampa"
        />
        <p className="help-text">Helps us find helpers close to you.</p>
      </div>
      <div>
        <label className="label" htmlFor="emergency_contact">
          Emergency contact{" "}
          <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <input
          id="emergency_contact"
          name="emergency_contact"
          className="input"
          defaultValue={profile.emergency_contact ?? ""}
          placeholder="Name and phone of a family member or friend"
        />
        <p className="help-text">
          A trusted person we can reach in an emergency.
        </p>
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
    <form action={action} className="card space-y-5">
      <h2 className="text-h3">Change password</h2>
      <div>
        <label className="label" htmlFor="new_password">
          New password
        </label>
        <input
          id="new_password"
          name="password"
          type="password"
          className="input"
          minLength={8}
          required
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label className="label" htmlFor="confirm_password">
          Confirm new password
        </label>
        <input
          id="confirm_password"
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

function Toggle({
  name,
  title,
  hint,
  defaultChecked,
}: {
  name: string;
  title: string;
  hint: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border-2 border-surface-border p-4">
      <span>
        <span className="block text-lg font-bold text-ink">{title}</span>
        <span className="block text-base text-ink-soft">{hint}</span>
      </span>
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-7 w-7 shrink-0 accent-[#1466B8]"
      />
    </label>
  );
}

export function NotificationsSection({ profile }: { profile: Profile }) {
  const [state, action] = useActionState<ActionState, FormData>(
    updateNotifications,
    {},
  );
  useActionToast(state);
  return (
    <form action={action} className="card space-y-5">
      <h2 className="text-h3">How we reach you</h2>
      <Toggle
        name="notify_sms"
        title="Text messages"
        hint="Reminders and updates about your tasks by text."
        defaultChecked={profile.notify_sms}
      />
      <Toggle
        name="notify_email"
        title="Email"
        hint="A copy of updates sent to your email."
        defaultChecked={profile.notify_email}
      />
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
        "Are you sure you want to delete your account? All your tasks and messages will be removed permanently. This cannot be undone.",
      )
    )
      return;
    const res = await deleteAccount();
    if (res?.error) toast(res.error, "error");
  }
  return (
    <div className="card space-y-4 border-red-200">
      <h2 className="text-h3 text-red-700">Close your account</h2>
      <p className="text-lg text-ink-soft">
        Deleting your account removes all your tasks and messages. This action
        is permanent and cannot be undone.
      </p>
      <form action={onDelete}>
        <button className="btn-danger" type="submit">
          Delete my account
        </button>
      </form>
    </div>
  );
}
