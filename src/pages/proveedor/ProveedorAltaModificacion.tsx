// TODO: Añadir validaciones
// TODO: Conectar al backend
// TODO: Añadir artículos
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import type { Proveedor } from "../../types/domain/proveedor/Proveedor";

interface IFormInput extends Proveedor {}

interface ProveedorAltaModificacionProps {
  updateMode: boolean;
}

export function ProveedorAltaModificacion({
  updateMode,
}: ProveedorAltaModificacionProps) {
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit = (data: IFormInput) => console.log(data);

  return (
    <div>
      <h1>{updateMode ? "Actualizar" : "Crear"} Proveedor</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <TextField
          {...register("proveedorCod")}
          id="proveedorCod"
          label="Código de proveedor"
        />
        <TextField
          {...register("proveedorNombre")}
          id="proveedorNombre"
          label="Nombre del proveedor"
        />
        <TextField
          {...register("proveedorTelefono")}
          id="proveedorTelefono"
          label="Teléfono del proveedor"
        />

        <Button type="submit" variant="contained">
          Guardar
        </Button>
      </form>
    </div>
  );
}
