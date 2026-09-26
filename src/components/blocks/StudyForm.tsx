"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, type Control, type RegisterOptions } from "react-hook-form";
import {
  Alert,
  Button,
  Checkbox,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import type { Locale } from "@/content/types";
import type { Ui } from "@/content/ui";
import { path } from "@/lib/routes";
import { track } from "@/lib/analytics";

const MAX_FILES = 3;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s.-]{6,}$/;

type YesNo = "" | "oui" | "non";
type Values = {
  fullName: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  projectType: string;
  power: string;
  consumption: string;
  bill: string;
  surface: string;
  roof: string;
  storage: YesNo;
  pumping: YesNo;
  ev: YesNo;
  message: string;
  consent: boolean;
  files: File[];
  website: string;
};

const defaults: Values = {
  fullName: "",
  company: "",
  phone: "",
  email: "",
  city: "",
  projectType: "",
  power: "",
  consumption: "",
  bill: "",
  surface: "",
  roof: "",
  storage: "",
  pumping: "",
  ev: "",
  message: "",
  consent: false,
  files: [],
  website: "",
};

type Status = "idle" | "success" | "error" | "tooFast";
type TextName = "fullName" | "company" | "phone" | "email" | "city" | "power" | "consumption" | "bill" | "surface" | "message";

function TextInput({
  control,
  name,
  label,
  rules,
  required,
  type = "text",
  inputMode,
  autoComplete,
  multiline,
  ltr,
  optional,
}: {
  control: Control<Values>;
  name: TextName;
  label: string;
  rules?: RegisterOptions<Values, TextName>;
  required?: boolean;
  type?: "text" | "email" | "tel";
  inputMode?: "decimal" | "tel" | "email";
  autoComplete?: string;
  multiline?: boolean;
  ltr?: boolean;
  optional: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          fullWidth
          type={type}
          name={field.name}
          value={field.value as string}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isRequired={required}
          isInvalid={!!fieldState.error}
          validationBehavior="aria"
          className={multiline ? "sm:col-span-2" : undefined}
        >
          <Label>
            {label}
            {!required && <span className="ms-1 font-normal text-muted">({optional})</span>}
          </Label>
          {multiline ? (
            <TextArea ref={field.ref} rows={6} className="min-h-36" />
          ) : (
            <Input ref={field.ref} inputMode={inputMode} autoComplete={autoComplete} dir={ltr ? "ltr" : undefined} />
          )}
          <FieldError>{fieldState.error?.message}</FieldError>
        </TextField>
      )}
    />
  );
}

function YesNoField({ control, name, label, ui }: { control: Control<Values>; name: "storage" | "pumping" | "ev"; label: string; ui: Ui }) {
  const labelId = `yn-${name}`;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <span id={labelId} className="label">
            {label}
          </span>
          {/* Segmented Oui / Non switch; click the active option again to clear it. */}
          <ToggleButtonGroup
            aria-labelledby={labelId}
            selectionMode="single"
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => field.onChange(([...keys][0] as YesNo | undefined) ?? "")}
            isDetached
            fullWidth
            className="gap-1 rounded-full border border-line bg-field p-1"
          >
            {(
              [
                ["oui", ui.form.yes],
                ["non", ui.form.no],
              ] as const
            ).map(([v, t]) => (
              <ToggleButton
                key={v}
                id={v}
                className="h-10 flex-1 rounded-full bg-transparent text-sm font-medium text-mist transition-colors hover:text-ink data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[selected=true]:shadow-[0_4px_14px_-4px_color-mix(in_srgb,var(--accent)_60%,transparent)]"
              >
                {t}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      )}
    />
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-3xl border border-line/70 bg-base-soft/40 p-6 md:p-9">
      <legend className="sr-only">{title}</legend>
      <div aria-hidden="true" className="mb-7 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/15 text-sm font-semibold text-accent">{n}</span>
        <span className="text-lg font-semibold md:text-xl">{title}</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function StudyForm({ ui, locale }: { ui: Ui; locale: Locale }) {
  const f = ui.form;
  const v = f.validation;
  const [status, setStatus] = useState<Status>("idle");
  const [dragging, setDragging] = useState(false);
  const startedAt = useRef(0);
  const started = useRef(false);
  const submitted = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Values>({ defaultValues: defaults, mode: "onTouched", shouldFocusError: true });

  useEffect(() => {
    startedAt.current = Date.now();
    // Abandonment: form started but left without a successful submission.
    const onLeave = () => {
      if (started.current && !submitted.current) track("form_abandon", { form: "study" });
    };
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, []);

  const onFirstFocus = () => {
    if (started.current) return;
    started.current = true;
    track("form_start", { form: "study" });
  };

  const number: RegisterOptions<Values, TextName> = {
    validate: (x) => !x || !Number.isNaN(Number(String(x).replace(",", "."))) || v.number,
  };

  const onValid = async (values: Values) => {
    const data = new FormData();
    for (const [k, val] of Object.entries(values)) {
      if (k === "files" || k === "consent") continue;
      data.set(k, String(val));
    }
    if (values.consent) data.set("consent", "yes");
    values.files.forEach((file) => data.append("files", file));
    data.set("elapsedMs", String(Date.now() - startedAt.current));
    data.set("locale", locale);
    data.set("page", window.location.pathname);
    const params = new URLSearchParams(window.location.search);
    for (const k of ["utm_source", "utm_medium", "utm_campaign"]) data.set(k, params.get(k) ?? "");
    data.set("referrer", document.referrer);

    setStatus("idle");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: data });
      if (res.status === 429 || res.status === 425) {
        setStatus("tooFast");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      submitted.current = true;
      setStatus("success");
      track("generate_lead", { form: "study", project_type: values.projectType });
      reset(defaults);
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-5">
          <Alert status="success" className="rounded-3xl p-8">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title className="text-lg">{f.success}</Alert.Title>
            </Alert.Content>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24" onFocus={onFirstFocus}>
      <Form
        onSubmit={(e) => handleSubmit(onValid)(e)}
        validationBehavior="aria"
        className="mx-auto grid max-w-4xl gap-8 px-5 md:px-8"
      >
        {/* Honeypot: invisible to people, filled by bots. */}
        <Controller
          control={control}
          name="website"
          render={({ field }) => (
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input {...field} type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
          )}
        />

        <Step n={1} title={f.sections.you}>
          <TextInput
            control={control}
            name="fullName"
            label={f.fields.fullName}
            required
            autoComplete="name"
            optional={f.optional}
            rules={{ validate: (x) => !!String(x).trim() || v.required }}
          />
          <TextInput control={control} name="company" label={f.fields.company} autoComplete="organization" optional={f.optional} />
          <TextInput
            control={control}
            name="phone"
            label={f.fields.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            ltr
            required
            optional={f.optional}
            rules={{ required: v.required, pattern: { value: PHONE, message: v.phone } }}
          />
          <TextInput
            control={control}
            name="email"
            label={f.fields.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            ltr
            required
            optional={f.optional}
            rules={{ required: v.required, pattern: { value: EMAIL, message: v.email } }}
          />
          <TextInput
            control={control}
            name="city"
            label={f.fields.city}
            autoComplete="address-level2"
            required
            optional={f.optional}
            rules={{ validate: (x) => !!String(x).trim() || v.required }}
          />
        </Step>

        <Step n={2} title={f.sections.project}>
          <Controller
            control={control}
            name="projectType"
            rules={{ required: v.required }}
            render={({ field, fieldState }) => (
              <Select
                fullWidth
                isRequired
                name={field.name}
                placeholder={f.choose}
                value={field.value || null}
                onChange={(k) => field.onChange(k ? String(k) : "")}
                onBlur={field.onBlur}
                isInvalid={!!fieldState.error}
                validationBehavior="aria"
                className="sm:col-span-2"
              >
                <Label>{f.fields.projectType}</Label>
                <Select.Trigger ref={field.ref}>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {f.projectTypes.map((p) => (
                      <ListBox.Item key={p} id={p} textValue={p}>
                        {p}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Select>
            )}
          />
        </Step>

        <Step n={3} title={f.sections.details}>
          <TextInput control={control} name="power" label={f.fields.power} inputMode="decimal" optional={f.optional} rules={number} ltr />
          <TextInput control={control} name="consumption" label={f.fields.consumption} inputMode="decimal" optional={f.optional} rules={number} ltr />
          <TextInput control={control} name="bill" label={f.fields.bill} inputMode="decimal" optional={f.optional} rules={number} ltr />
          <TextInput control={control} name="surface" label={f.fields.surface} inputMode="decimal" optional={f.optional} rules={number} ltr />
          <Controller
            control={control}
            name="roof"
            render={({ field }) => (
              <Select
                fullWidth
                name={field.name}
                placeholder={f.choose}
                value={field.value || null}
                onChange={(k) => field.onChange(k ? String(k) : "")}
              >
                <Label>
                  {f.fields.roof}
                  <span className="ms-1 font-normal text-muted">({f.optional})</span>
                </Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {f.roofTypes.map((r) => (
                      <ListBox.Item key={r} id={r} textValue={r}>
                        {r}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            )}
          />
          <div className="grid gap-6 sm:col-span-2 md:grid-cols-3">
            <YesNoField control={control} name="storage" label={f.fields.storage} ui={ui} />
            <YesNoField control={control} name="pumping" label={f.fields.pumping} ui={ui} />
            <YesNoField control={control} name="ev" label={f.fields.ev} ui={ui} />
          </div>
        </Step>

        <Step n={4} title={f.sections.message}>
          <TextInput
            control={control}
            name="message"
            label={f.fields.message}
            multiline
            required
            optional={f.optional}
            rules={{ validate: (x) => !!String(x).trim() || v.required }}
          />

          <Controller
            control={control}
            name="files"
            rules={{
              validate: (files) => {
                const list = files as File[];
                if (list.length > MAX_FILES) return v.fileCount;
                if (list.some((x) => !FILE_TYPES.includes(x.type))) return v.fileType;
                if (list.some((x) => x.size > MAX_FILE_BYTES)) return v.fileSize;
                return true;
              },
            }}
            render={({ field, fieldState }) => {
              const add = (list: FileList | null) => field.onChange([...field.value, ...Array.from(list ?? [])]);
              return (
                <div className="sm:col-span-2">
                  <p className="label mb-2">
                    {f.fields.files}
                    <span className="ms-1 font-normal text-muted">({f.optional})</span>
                  </p>
                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      add(e.dataTransfer.files);
                    }}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-6 py-8 text-center transition-colors focus-within:border-accent focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_14%,transparent)] ${
                      fieldState.error
                        ? "border-danger"
                        : dragging
                          ? "border-accent bg-accent/10"
                          : "border-line hover:border-accent/70 hover:bg-base-soft/60"
                    }`}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-accent">
                      <path
                        d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-mist">{f.filesHint}</span>
                    <input
                      ref={field.ref}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      className="sr-only"
                      aria-invalid={!!fieldState.error}
                      onChange={(e) => {
                        add(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {field.value.length > 0 && (
                    <ul className="mt-3 grid gap-2">
                      {field.value.map((file, i) => (
                        <li
                          key={`${file.name}-${i}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-line/70 bg-base-soft/60 px-4 py-2.5 text-sm"
                        >
                          <span dir="ltr" className="truncate">
                            {file.name} <span className="text-mist">· {(file.size / 1024 / 1024).toFixed(1)} Mo</span>
                          </span>
                          <button
                            type="button"
                            aria-label={`${f.removeFile} ${file.name}`}
                            onClick={() => field.onChange(field.value.filter((_, j) => j !== i))}
                            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-mist hover:bg-line/60 hover:text-ink"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {fieldState.error && (
                    <p role="alert" className="mt-2 text-sm text-danger">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              );
            }}
          />

          <Controller
            control={control}
            name="consent"
            rules={{ validate: (x) => x === true || v.consent }}
            render={({ field, fieldState }) => (
              <Checkbox
                name={field.name}
                isSelected={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                isInvalid={!!fieldState.error}
                validationBehavior="aria"
                className="sm:col-span-2"
              >
                <Checkbox.Content className="items-start gap-3 text-sm leading-relaxed text-ink/85">
                  <Checkbox.Control className="mt-0.5">
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <span>
                    {f.consent}{" "}
                    <Link href={path(locale, "privacy")} className="text-accent underline underline-offset-4">
                      {ui.footer.privacy}
                    </Link>
                  </span>
                </Checkbox.Content>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Checkbox>
            )}
          />
        </Step>

        {(status === "error" || status === "tooFast") && (
          <Alert status="danger" className="rounded-2xl">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{status === "error" ? f.error : f.tooFast}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" isPending={isSubmitting} className="rounded-full px-8 font-semibold">
            {isSubmitting ? f.sending : f.submit}
          </Button>
          <Description className="text-mist">* {f.required}</Description>
        </div>
      </Form>
    </section>
  );
}
