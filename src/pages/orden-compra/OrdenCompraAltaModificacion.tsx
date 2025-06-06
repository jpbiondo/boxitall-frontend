import { Button, TextField } from "@mui/material";
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
      <h1>{updateMode ? "Actualizar" : "Crear"} Orden de Compra</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <TextField
          {...register("OCNumero")}
          id="OCNumero"
          label="Número de orden de compra"
        />
        <TextField
          {...register("OCFechaInicio")}
          id="OCFechaInicio"
          label="Fecha de inicio de la orden de compra"
        />
        <TextField
          {...register("OCFechaFin")}
          id="OCFechaFin"
          label="Fecha de fin de la orden de compra"
        />
        <TextField
          {...register("OCEstado")}
          id="OCEstado"
          label="Estado de la orden de compra"
        />
        <TextField
          {...register("OCArticulos")}
          id="OCArticulos"
          label="Artículos de la orden de compra"
        />
        <TextField
          {...register("proveedor")}
          id="proveedor"
          label="Proveedor de la orden de compra"
        />
        <Button type="submit" variant="contained">
          Guardar
        </Button>
      </form>
    </div>
  );
}
