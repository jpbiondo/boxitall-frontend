import { Typography } from "@mui/material";
import ArticuloForm from "../../components/ArticuloForm";

interface ArticuloAltaModificacionProps {
  updateMode: boolean;
}

export function ArticuloAltaModificacion({
  updateMode,
}: ArticuloAltaModificacionProps) {
  return (
    <div>
      <Typography variant="h2" marginBottom={2}>
        {updateMode ? "Actualizar" : "Crear"} Artículo
      </Typography>
      <ArticuloForm updateMode = {updateMode}/>
    </div>
  );
}
