import { useState } from "react";
import type { Articulo } from "../types/domain/articulo/Articulo";

export const useArticulosReadFull = (articuloCod: number) => {
  const [articulo, setArticulo] = useState<Articulo | null>(null);

  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = "/articulos?view=full";

  const readArticulosShort = async () => {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(endpoint + "/" + articuloCod);
      if (!response.ok) {
        throw new Error("Error al obtener el artículo");
      }
      const data: Articulo = await response.json();
      setArticulo(data);
    } catch (err) {
      setError(
        "Error al obtener el artículo: " +
          (err instanceof Error ? err.message : "Error desconocido")
      );
    } finally {
      setPending(false);
    }
  };

  return { readArticulosShort, articulos: articulo, pending, error };
};
