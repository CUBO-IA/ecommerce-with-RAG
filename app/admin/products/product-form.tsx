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
        <label htmlFor="name" className="text-sm font-bold">Nombre</label>
        <input id="name" name="name" required maxLength={120} className="rounded-sm border border-line bg-white px-3 py-2 outline-none focus:border-navy" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-bold">Descripción</label>
        <textarea id="description" name="description" required maxLength={2000} rows={4} className="rounded-sm border border-line bg-white px-3 py-2 outline-none focus:border-navy" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="price" className="text-sm font-bold">Precio (USD)</label>
        <input id="price" name="price" type="number" step="0.01" min="0.01" required className="rounded-sm border border-line bg-white px-3 py-2 outline-none focus:border-navy" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="image" className="text-sm font-bold">Imagen (JPEG, PNG o WebP, máx. 5 MB)</label>
        <input id="image" name="image" type="file" accept="image/*" required onChange={checkImage} className="text-sm" />
        {fileError && <p role="alert" className="font-bold text-promo">{fileError}</p>}
      </div>
      <button type="submit" disabled={pending} className="w-fit rounded-full bg-promo px-8 py-2.5 font-bold text-white disabled:opacity-50">
        {pending ? "Guardando..." : "Crear producto"}
      </button>
      {state?.error && <p role="alert" className="font-bold text-promo">{state.error}</p>}
      {state?.ok && <p role="status" className="font-bold text-navy">Producto creado</p>}
    </form>
  );
}
