import ArticuloForm from "../../components/ArticuloForm";

interface ArticuloAltaModificacionProps {
  updateMode: boolean;
}

export function ArticuloAltaModificacion({
  updateMode,
}: ArticuloAltaModificacionProps) {
  return (
    <div>
      <h1>{updateMode ? "Actualizar" : "Crear"} Artículo</h1>
      <ArticuloForm updateMode = {updateMode}/>
    </div>
  );
}
