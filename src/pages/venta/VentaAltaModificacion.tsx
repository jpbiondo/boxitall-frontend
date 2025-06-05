import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import type { Venta } from "../../types/domain/venta/Venta";

interface IFormInput extends Venta {}

interface VentaAltaModificacionProps {
  updateMode: boolean;
}

export function VentaAltaModificacion({
  updateMode,
}: VentaAltaModificacionProps) {
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit = (data: IFormInput) => console.log(data);

  return (
    <div>
      <h1>{updateMode ? "Actualizar" : "Crear"} Artículo</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register("ventaCod")} />
        <TextField {...register("ventaFecha")} />
        <TextField {...register("ventaTotal")} />
        <TextField {...register("ventaDetalles")} />
      </form>
    </div>
  );
}
