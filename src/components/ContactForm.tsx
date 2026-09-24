"use client";

import { useState } from "react";
import type { Dict } from "@/content/site";
import { company } from "@/content/site";
import { Button } from "./Button";
import { SectionHeader } from "./SectionHeader";
import { Icon } from "./Icons";

type Status = "idle" | "loading" | "success" | "error";
type Errors = Partial<Record<string, string>>;

const inputCls =
  "w-full rounded-xl border border-line/70 bg-base-soft/50 px-4.5 py-3.5 text-ink placeholder:text-mist/60 transition-colors duration-300 focus:border-solar focus:outline-none aria-invalid:border-danger/70";

export function ContactForm({ t }: { t: Dict }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const c = t.contact;

  const validate = (data: Record<string, string>): Errors => {
    const e: Errors = {};
    for (const k of ["firstName", "lastName", "email", "phone", "projectType", "message"]) {
      if (!data[k]?.trim()) e[k] = c.validation.required;
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = c.validation.email;
    if (data.phone && !/^[+\d][\d\s.-]{6,}$/.test(data.phone)) e.phone = c.validation.phone;
    return e;
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const field = (
    name: string,
    label: string,
    opts: { type?: string; optional?: boolean; span2?: boolean } = {}
  ) => (
    <div className={opts.span2 ? "sm:col-span-2" : ""}>
      <label htmlFor={`f-${name}`} className="mb-2 block text-sm text-ink/85">
        {label}
        {opts.optional && <span className="text-mist/70"> ({c.optional})</span>}
      </label>
      {name === "message" ? (
        <textarea
          id={`f-${name}`}
          name={name}
          rows={5}
          className={inputCls}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `e-${name}` : undefined}
        />
      ) : (
        <input
          id={`f-${name}`}
          name={name}
          type={opts.type ?? "text"}
          dir={opts.type === "email" || opts.type === "tel" ? "ltr" : undefined}
          className={inputCls}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `e-${name}` : undefined}
        />
      )}
      {errors[name] && (
        <p id={`e-${name}`} className="mt-1.5 text-xs text-danger" role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" className="py-24 md:py-36 border-t border-line/50 bg-base-deep/60">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeader title={c.title} sub={c.sub} />
          <ul className="space-y-4 text-mist -mt-6">
            <li>
              <a href={`mailto:${company.email}`} className="hover:text-accent transition-colors" dir="ltr">
                {company.email}
              </a>
            </li>
            <li dir="ltr">{company.phone}</li>
          </ul>
        </div>

        {status === "success" ? (
          <div
            role="status"
            className="rounded-2xl border border-leaf/60 bg-leaf/10 p-10 flex flex-col items-center justify-center text-center gap-5"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border border-leaf text-leaf">
              <Icon name="check" />
            </span>
            <p className="text-lg leading-relaxed max-w-md">{c.success}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
            {field("firstName", c.fields.firstName)}
            {field("lastName", c.fields.lastName)}
            {field("email", c.fields.email, { type: "email" })}
            {field("phone", c.fields.phone, { type: "tel" })}
            {field("company", c.fields.companyName, { optional: true, span2: true })}
            <div className="sm:col-span-2">
              <label htmlFor="f-projectType" className="mb-2 block text-sm text-ink/85">
                {c.fields.projectType}
              </label>
              <select
                id="f-projectType"
                name="projectType"
                defaultValue=""
                className={inputCls}
                aria-invalid={!!errors.projectType}
                aria-describedby={errors.projectType ? "e-projectType" : undefined}
              >
                <option value="" disabled hidden />
                {c.projectTypes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.projectType && (
                <p id="e-projectType" className="mt-1.5 text-xs text-danger" role="alert">
                  {errors.projectType}
                </p>
              )}
            </div>
            {field("message", c.fields.message, { span2: true })}
            <div className="sm:col-span-2 flex flex-wrap items-center gap-5">
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? c.sending : c.submit}
              </Button>
              {status === "error" && (
                <p className="text-sm text-danger" role="alert">
                  {c.error}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
