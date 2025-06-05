import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import type { OrdenCompra } from "../../types/domain/orden-compra/OrdenCompra";

interface IFormInput extends OrdenCompra {}

interface OrdenCompraAltaModificacionProps {
  updateMode: boolean;
}

export function OrdenCompraAltaModificacion({
  updateMode,
}: OrdenCompraAltaModificacionProps) {
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit = (data: IFormInput) => console.log(data);

  return (
    <div>
      <h1>{updateMode ? "Actualizar" : "Crear"} Artículo</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register("OCNumero")} />
        <TextField {...register("OCFechaInicio")} />
        <TextField {...register("OCFechaFin")} />
        <TextField {...register("OCEstado")} />
        <TextField {...register("OCArticulos")} />
        <TextField {...register("proveedor")} />
      </form>
    </div>
  );
}
