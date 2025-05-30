import { useState } from "react";
import type { Articulo } from "../types/domain/articulo/Articulo";
import { API_URL } from "../utils/constants";

export function useArticuloCreate() {
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = "/articulos";

  const createArticulo = async (articulo: Articulo) => {
    setPending(true);
    setError(null);
    try {
      await fetch(API_URL + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articulo),
      });
    } catch (err) {
      setError(
        "Error al crear el artículo: " +
          (err instanceof Error ? err.message : "Error desconocido")
      );
    } finally {
      setPending(false);
    }
  };

  return {
    createArticulo,
    pending,
    error,
  };
}
