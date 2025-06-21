import { Button, TextField, Typography } from "@mui/material";
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
      <Typography variant="h2" marginBottom={2}>
        {updateMode ? "Actualizar" : "Crear"} Venta
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <TextField
          {...register("ventaCod")}
          id="ventaCod"
          label="Código de venta"
        />
        <TextField
          {...register("ventaFecha")}
          id="ventaFecha"
          label="Fecha de venta"
        />
        <TextField
          {...register("ventaTotal")}
          id="ventaTotal"
          label="Total de venta"
        />
        <TextField
          {...register("ventaDetalles")}
          id="ventaDetalles"
          label="Detalles de venta"
        />
        <Button type="submit" variant="contained">
          Guardar
        </Button>
      </form>
    </div>
  );
}
