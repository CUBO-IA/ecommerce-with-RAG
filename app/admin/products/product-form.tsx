"use client";

import { useActionState, useState } from "react";
import { createProductAction } from "./actions";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function ProductForm() {
  const [state, formAction, pending] = useActionState(createProductAction, null);
  const [fileError, setFileError] = useState<string>();

  function checkImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.size > MAX_IMAGE_BYTES) {
      setFileError("La imagen supera 5 MB");
      e.target.value = "";
    } else {
      setFileError(undefined);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" required maxLength={120} className="rounded border px-3 py-2" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description">Descripción</label>
        <textarea id="description" name="description" required maxLength={2000} rows={4} className="rounded border px-3 py-2" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="price">Precio (USD)</label>
        <input id="price" name="price" type="number" step="0.01" min="0.01" required className="rounded border px-3 py-2" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="image">Imagen (JPEG, PNG o WebP, máx. 5 MB)</label>
        <input id="image" name="image" type="file" accept="image/*" required onChange={checkImage} />
        {fileError && <p role="alert" className="text-red-600">{fileError}</p>}
      </div>
      <button type="submit" disabled={pending} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Guardando..." : "Crear producto"}
      </button>
      {state?.error && <p role="alert" className="text-red-600">{state.error}</p>}
      {state?.ok && <p role="status" className="text-green-700">Producto creado</p>}
    </form>
  );
}
