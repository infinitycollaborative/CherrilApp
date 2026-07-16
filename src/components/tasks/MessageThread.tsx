"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/app/actions/messages";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateTime } from "@/lib/format";
import type { TaskMessage, Tasker } from "@/lib/types";

export function MessageThread({
  taskId,
  messages,
  tasker,
  canSend,
}: {
  taskId: string;
  messages: TaskMessage[];
  tasker: Tasker | null;
  canSend: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setSending(true);
    const res = await sendMessage(taskId, body);
    if (res.error) {
      toast(res.error, "error");
      setSending(false);
      return;
    }
    setText("");
    setSending(false);
    router.refresh();
  }

  return (
    <div>
      <div className="max-h-[26rem] space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <p className="py-6 text-center text-lg text-ink-muted">
            No messages yet.
          </p>
        )}
        {messages.map((m) => {
          if (m.sender === "system") {
            return (
              <div key={m.id} className="text-center">
                <p className="mx-auto inline-block rounded-full bg-surface-overlay px-4 py-2 text-base text-ink-soft">
                  {m.body}
                </p>
              </div>
            );
          }
          const mine = m.sender === "senior";
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[85%]">
                {!mine && tasker && (
                  <p className="mb-1 ml-1 text-base font-semibold text-ink-soft">
                    {tasker.emoji} {tasker.name}
                  </p>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 text-lg ${
                    mine
                      ? "bg-brand-500 text-white"
                      : "border-2 border-surface-border bg-surface-raised text-ink"
                  }`}
                >
                  {m.body}
                </div>
                <p
                  className={`mt-1 text-sm text-ink-muted ${
                    mine ? "text-right" : "ml-1"
                  }`}
                >
                  {formatDateTime(m.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {canSend ? (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label htmlFor="message" className="sr-only">
            Type a message
          </label>
          <textarea
            id="message"
            className="textarea flex-1"
            style={{ minHeight: "56px" }}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message to your helper…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            onClick={send}
            disabled={sending || !text.trim()}
            className="btn-primary sm:self-end"
          >
            {sending ? <Spinner className="h-5 w-5" /> : "Send"}
          </button>
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-surface-overlay p-4 text-center text-lg text-ink-soft">
          Choose a helper above to start messaging.
        </p>
      )}
    </div>
  );
}
