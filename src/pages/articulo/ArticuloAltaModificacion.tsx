import { Typography } from "@mui/material";
import ArticuloForm from "../../components/ArticuloForm";
import { useArticulo } from "../../hooks/useArticulo";
import { useParams } from "react-router-dom";
import { Articulo } from "../../types/domain/articulo/Articulo";
import { useEffect, useState } from "react";

interface ArticuloAltaModificacionProps {
  updateMode: boolean;
}

export function ArticuloAltaModificacion({
  updateMode,
}: ArticuloAltaModificacionProps) {
  const { getArticuloById } = useArticulo();
  const { articuloCod } = useParams();
  const [articulo, setArticulo] = useState<Articulo | undefined>(undefined);

  useEffect(() => {
    if (articuloCod) {
      getArticuloById(articuloCod).then((articulo) => setArticulo(articulo));
    }
  }, [articuloCod]);
  return (
    <div>
      <Typography variant="h2" marginBottom={2}>
        {updateMode ? "Actualizar" : "Crear"} Artículo
      </Typography>
      <ArticuloForm articulo={articulo} />
    </div>
  );
}
