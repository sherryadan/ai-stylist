"use client";

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";

export function useRecoverableForm(submit: (previous: string, form: FormData) => Promise<string>) {
  const [message, action, pending] = useActionState(submit, "");
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (message && !pending) errorRef.current?.focus();
  }, [message, pending]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  }

  return { message, action, pending, onSubmit, errorRef };
}
