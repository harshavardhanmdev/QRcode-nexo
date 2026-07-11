"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Label, TextArea, TextInput } from "@/components/ui/fields";
import { IconAlert, IconCheck } from "@/components/ui/icons";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    setError(null);
    try {
      await api.post("/api/contact", { name, email, message, website });
      setState("sent");
    } catch (err) {
      setState("error");
      setError(err instanceof ApiError ? err.message : "Sending failed — email us instead.");
    }
  }

  if (state === "sent") {
    return (
      <div className="card mt-8 flex items-center gap-3 p-6 sm:p-8">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary-soft text-accent-text">
          <IconCheck size={20} />
        </span>
        <div>
          <p className="font-heading font-semibold">Message received.</p>
          <p className="text-sm text-fg-muted">We usually reply within one business day.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card mt-8 space-y-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ct-name" required>
            Your name
          </Label>
          <TextInput
            id="ct-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="ct-email" required>
            Email
          </Label>
          <TextInput
            id="ct-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="ct-message" required>
          Message
        </Label>
        <TextArea
          id="ct-message"
          required
          minLength={10}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Bug reports, feature ideas, abuse reports, partnerships…"
        />
      </div>
      {/* honeypot — hidden from humans, irresistible to bots */}
      <div aria-hidden className="absolute -left-[9999px] top-0 h-0 overflow-hidden">
        <label htmlFor="ct-website">Website</label>
        <input
          id="ct-website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      {error && (
        <p className="inline-flex items-center gap-2 rounded-md bg-danger-soft px-3 py-2 text-[13px] text-danger">
          <IconAlert size={15} />
          {error}
        </p>
      )}
      <Button type="submit" disabled={state === "busy"} size="lg">
        {state === "busy" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
