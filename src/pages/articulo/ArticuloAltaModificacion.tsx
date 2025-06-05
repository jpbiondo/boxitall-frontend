import { TextField } from "@mui/material";
import type { Articulo } from "../../types/domain/articulo/Articulo";
import { useForm } from "react-hook-form";

interface IFormInput extends Articulo {}

interface ArticuloAltaModificacionProps {
  updateMode: boolean;
}

export function ArticuloAltaModificacion({
  updateMode,
}: ArticuloAltaModificacionProps) {
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit = (data: IFormInput) => console.log(data);

  return (
    <div>
      <h1>{updateMode ? "Actualizar" : "Crear"} Artículo</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register("articuloCod")} />
        <TextField {...register("articuloNombre")} />
      </form>
    </div>
  );
}
