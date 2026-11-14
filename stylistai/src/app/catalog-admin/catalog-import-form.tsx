"use client";

import { useActionState, useRef, useState, type ChangeEvent } from "react";
import { reviewCatalogImport } from "./actions";

export function CatalogImportForm({ example }: { example: string }) {
  const [state, action, pending] = useActionState(reviewCatalogImport, { message: "", errors: [], names: [], csv: example });
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [fileError, setFileError] = useState("");
  async function loadCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (file.size > 160_000) {
      setFileError("Choose a smaller UTF-8 CSV file.");
      return;
    }
    try {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
      if (text.length > 40_000) {
        setFileError("The CSV must be 40,000 characters or smaller.");
        return;
      }
      if (textarea.current) textarea.current.value = text;
      setFileError("");
    } catch {
      setFileError("The selected file could not be read as UTF-8.");
    }
  }
  return (
    <form action={action} className="mt-8 space-y-4 rounded-2xl border border-stone-300 bg-[#fffbf5] p-5">
      <label className="block">Local administrator token
        <input className="mt-1 block w-full rounded-md border border-stone-400 bg-white p-2" type="password" name="token" required maxLength={256} autoComplete="off" />
      </label>
      <label className="block">Load a CSV file
        <input className="mt-1 block w-full text-sm" type="file" accept=".csv,text/csv" onChange={loadCsv} disabled={pending} />
      </label>
      {fileError && <p role="alert" className="text-red-900">{fileError}</p>}
      <label className="block">CSV content
        <textarea ref={textarea} key={state.csv} className="mt-1 block w-full rounded-md border border-stone-400 bg-white p-2 font-mono text-sm" name="csv" rows={8} required maxLength={40000} defaultValue={state.csv} />
      </label>
      <div className="flex flex-wrap gap-3">
        <button disabled={pending} className="rounded-full border border-stone-800 px-4 py-2" name="intent" value="preview">Validate and preview</button>
        <button disabled={pending} className="rounded-full bg-stone-950 px-4 py-2 text-white" name="intent" value="import">Import sample items</button>
      </div>
      <p role="status">{pending ? "Processing CSV…" : state.message}</p>
      {state.errors.length > 0 && <ul className="list-inside list-disc text-red-900">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul>}
      {state.names.length > 0 && <ul className="list-inside list-disc">{state.names.map((name, index) => <li key={index}>{name}</li>)}</ul>}
    </form>
  );
}
