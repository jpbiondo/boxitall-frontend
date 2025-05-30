import { useState } from "react";
import type { ArticuloShortDTO } from "../types/domain/articulo/ArticuloShortDTO";

export const useArticulosReadShort = () => {
  const [articulos, setArticulos] = useState<ArticuloShortDTO[]>([]);

  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = "/articulos?view=short";

  const readArticulosShort = async () => {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Error al obtener los artículos");
      }
      const data: ArticuloShortDTO[] = await response.json();
      setArticulos(data);
    } catch (err) {
      setError(
        "Error al obtener los artículos: " +
          (err instanceof Error ? err.message : "Error desconocido")
      );
    } finally {
      setPending(false);
    }
  };

  return { readArticulosShort, articulos, pending, error };
};
