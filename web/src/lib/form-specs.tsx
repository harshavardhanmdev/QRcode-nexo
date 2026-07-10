import type { QrType } from "@/lib/qr-engine";
import {
  IconLink,
  IconLetters,
  IconWifi,
  IconUser,
  IconMail,
  IconMessage,
  IconPhone,
  IconRupee,
  IconPin,
  IconCalendar,
  type IconProps,
} from "@/components/ui/icons";

export type FieldKind =
  | "text"
  | "textarea"
  | "password"
  | "tel"
  | "email"
  | "url"
  | "number"
  | "datetime-local"
  | "select"
  | "checkbox";

export interface FieldSpec {
  key: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  half?: boolean;
  autocomplete?: string;
}

export interface TypeSpec {
  type: QrType;
  label: string;
  shortLabel?: string;
  icon: (p: IconProps) => React.ReactNode;
  intro: string;
  fields: FieldSpec[];
}

export const typeSpecs: TypeSpec[] = [
  {
    type: "url",
    label: "Website / URL",
    shortLabel: "URL",
    icon: IconLink,
    intro: "Open any link when scanned — the classic QR code.",
    fields: [
      {
        key: "url",
        label: "Link",
        kind: "url",
        placeholder: "https://example.com/menu",
        required: true,
      },
    ],
  },
  {
    type: "text",
    label: "Plain text",
    shortLabel: "Text",
    icon: IconLetters,
    intro: "Show any text — serial numbers, notes, secret messages.",
    fields: [
      {
        key: "text",
        label: "Text",
        kind: "textarea",
        placeholder: "Up to ~500 characters scans best",
        required: true,
      },
    ],
  },
  {
    type: "wifi",
    label: "Wi-Fi network",
    shortLabel: "Wi-Fi",
    icon: IconWifi,
    intro: "Guests scan and connect — no password typing.",
    fields: [
      { key: "ssid", label: "Network name (SSID)", kind: "text", required: true, placeholder: "CafeGuest" },
      { key: "password", label: "Password", kind: "password", placeholder: "••••••••" },
      {
        key: "enc",
        label: "Security",
        kind: "select",
        options: [
          { value: "WPA", label: "WPA / WPA2 / WPA3" },
          { value: "WEP", label: "WEP (legacy)" },
          { value: "nopass", label: "Open network — no password" },
        ],
        half: true,
      },
      { key: "hidden", label: "Hidden network", kind: "checkbox", half: true },
    ],
  },
  {
    type: "vcard",
    label: "Contact card (vCard)",
    shortLabel: "vCard",
    icon: IconUser,
    intro: "Scan-to-save contact for business cards and signage.",
    fields: [
      { key: "firstName", label: "First name", kind: "text", required: true, half: true, autocomplete: "given-name" },
      { key: "lastName", label: "Last name", kind: "text", half: true, autocomplete: "family-name" },
      { key: "phone", label: "Mobile", kind: "tel", half: true, placeholder: "+91 98765 43210" },
      { key: "email", label: "Email", kind: "email", half: true },
      { key: "org", label: "Company", kind: "text", half: true },
      { key: "title", label: "Job title", kind: "text", half: true },
      { key: "website", label: "Website", kind: "url", placeholder: "example.com" },
      { key: "address", label: "Address", kind: "textarea" },
    ],
  },
  {
    type: "email",
    label: "Email",
    icon: IconMail,
    intro: "Opens a pre-filled email draft to you.",
    fields: [
      { key: "to", label: "To", kind: "email", required: true, placeholder: "hello@yourbrand.com" },
      { key: "subject", label: "Subject", kind: "text" },
      { key: "body", label: "Message", kind: "textarea" },
    ],
  },
  {
    type: "sms",
    label: "SMS",
    icon: IconMessage,
    intro: "Opens a pre-filled text message.",
    fields: [
      { key: "phone", label: "Phone number", kind: "tel", required: true, placeholder: "+91 98765 43210" },
      { key: "message", label: "Message", kind: "textarea" },
    ],
  },
  {
    type: "whatsapp",
    label: "WhatsApp",
    icon: IconPhone,
    intro: "Starts a WhatsApp chat with you, message pre-typed.",
    fields: [
      {
        key: "phone",
        label: "WhatsApp number (with country code)",
        kind: "tel",
        required: true,
        placeholder: "919876543210",
        help: "Digits only, including country code — e.g. 91 for India.",
      },
      { key: "message", label: "Pre-filled message", kind: "textarea", placeholder: "Hi! I found you via QR" },
    ],
  },
  {
    type: "upi",
    label: "UPI payment",
    shortLabel: "UPI",
    icon: IconRupee,
    intro: "Standards-compliant upi:// code — works with GPay, PhonePe, Paytm, BHIM.",
    fields: [
      { key: "vpa", label: "UPI ID (VPA)", kind: "text", required: true, placeholder: "yourname@oksbi" },
      { key: "name", label: "Payee name", kind: "text", required: true, placeholder: "Your Shop Name" },
      {
        key: "amount",
        label: "Amount (₹, optional)",
        kind: "number",
        half: true,
        help: "Leave empty to let the payer type any amount.",
      },
      { key: "note", label: "Note (optional)", kind: "text", half: true, placeholder: "Table 4" },
    ],
  },
  {
    type: "location",
    label: "Location",
    shortLabel: "Map",
    icon: IconPin,
    intro: "Opens the point in the scanner's maps app.",
    fields: [
      {
        key: "lat",
        label: "Latitude",
        kind: "number",
        required: true,
        half: true,
        placeholder: "17.3850",
      },
      {
        key: "lng",
        label: "Longitude",
        kind: "number",
        required: true,
        half: true,
        placeholder: "78.4867",
      },
    ],
  },
  {
    type: "event",
    label: "Calendar event",
    shortLabel: "Event",
    icon: IconCalendar,
    intro: "Scan-to-add event for invites and posters.",
    fields: [
      { key: "title", label: "Event title", kind: "text", required: true },
      { key: "start", label: "Starts", kind: "datetime-local", required: true, half: true },
      { key: "end", label: "Ends", kind: "datetime-local", half: true },
      { key: "venue", label: "Venue", kind: "text" },
      { key: "details", label: "Details", kind: "textarea" },
    ],
  },
];

export function specFor(type: QrType): TypeSpec {
  return typeSpecs.find((s) => s.type === type) ?? typeSpecs[0];
}
