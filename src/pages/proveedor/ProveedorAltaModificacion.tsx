import { TextField } from "@mui/material";
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
      <h1>{updateMode ? "Actualizar" : "Crear"} Artículo</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register("proveedorCod")} />
        <TextField {...register("proveedorNombre")} />
        <TextField {...register("proveedorTelefono")} />
      </form>
    </div>
  );
}
