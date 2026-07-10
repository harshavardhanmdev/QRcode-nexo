"use client";

import { AnimatePresence, m } from "@/components/motion/Motion";
import { Label, TextInput, TextArea, Select, Checkbox } from "@/components/ui/fields";
import { specFor, type FieldSpec } from "@/lib/form-specs";
import { selectFields, useGeneratorStore } from "@/store/generator-store";
import { IconAlert } from "@/components/ui/icons";

function Field({ spec }: { spec: FieldSpec }) {
  const value = useGeneratorStore((s) => selectFields(s)[spec.key] ?? "");
  const setField = useGeneratorStore((s) => s.setField);
  const id = `field-${spec.key}`;

  if (spec.kind === "checkbox") {
    return (
      <Checkbox
        id={id}
        label={spec.label}
        checked={value === "true"}
        onChange={(v) => setField(spec.key, v ? "true" : "")}
      />
    );
  }

  const common = {
    id,
    value,
    placeholder: spec.placeholder,
    autoComplete: spec.autocomplete,
    "aria-required": spec.required,
  };

  return (
    <div>
      <Label htmlFor={id} required={spec.required}>
        {spec.label}
      </Label>
      {spec.kind === "textarea" ? (
        <TextArea
          {...common}
          onChange={(e) => setField(spec.key, e.target.value)}
        />
      ) : spec.kind === "select" ? (
        <Select
          {...common}
          value={value || spec.options?.[0]?.value}
          onChange={(e) => setField(spec.key, e.target.value)}
        >
          {spec.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ) : (
        <TextInput
          {...common}
          type={spec.kind}
          inputMode={spec.kind === "number" ? "decimal" : undefined}
          onChange={(e) => setField(spec.key, e.target.value)}
        />
      )}
      {spec.help && <p className="mt-1.5 text-xs text-fg-faint">{spec.help}</p>}
    </div>
  );
}

export function DynamicForm() {
  const type = useGeneratorStore((s) => s.type);
  const payloadError = useGeneratorStore((s) => s.payloadError);
  const hasAnyInput = useGeneratorStore((s) =>
    Object.values(selectFields(s)).some((v) => v && v.trim().length > 0),
  );
  const spec = specFor(type);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={type}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18 }}
      >
        <p className="text-sm text-fg-muted">{spec.intro}</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {spec.fields.map((f) => (
            <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
              <Field spec={f} />
            </div>
          ))}
        </div>
        {payloadError && hasAnyInput && (
          <p
            role="status"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-warn-soft px-3 py-2 text-[13px] text-warn"
          >
            <IconAlert size={15} />
            {payloadError}
          </p>
        )}
      </m.div>
    </AnimatePresence>
  );
}
