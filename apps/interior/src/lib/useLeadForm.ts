import { useState, type FormEvent } from "react";
import { isValidEmail, isValidPhone, submitLead } from "./submitLead";

type Status = "idle" | "loading" | "success" | "error";

/** Hook dùng chung cho mọi form: quản lý giá trị, validate SĐT/email, trạng thái gửi. */
export function useLeadForm<T extends Record<string, string>>(
  initial: T,
  endpoint: string,
  required: (keyof T)[] = [],
) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof T) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = () => {
    const next: Record<string, string> = {};
    for (const k of required) if (!values[k]?.trim()) next[k as string] = "Vui lòng nhập thông tin này";
    if ("phone" in values && values.phone && !isValidPhone(values.phone)) next.phone = "Số điện thoại chưa hợp lệ";
    if ("email" in values && values.email && !isValidEmail(values.email)) next.email = "Email chưa hợp lệ";
    setErrors(next as Partial<Record<keyof T, string>>);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading" || !validate()) return;
    setStatus("loading");
    try {
      await submitLead(endpoint, values);
      setStatus("success");
      setValues(initial);
    } catch {
      setStatus("error");
    }
  };

  return { values, errors, status, set, onSubmit, reset: () => setStatus("idle") };
}
