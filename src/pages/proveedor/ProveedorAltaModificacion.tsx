// TODO: Añadir validaciones
// TODO: Conectar al backend
// TODO: Añadir artículos
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import type { Proveedor } from "../../types/domain/proveedor/Proveedor";
import { useProveedor } from "../../hooks/useProveedor";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface IFormInput extends Proveedor {}

interface ProveedorAltaModificacionProps {
  updateMode: boolean;
}

export function ProveedorAltaModificacion({
  updateMode,
}: ProveedorAltaModificacionProps) {
  const { register, handleSubmit } = useForm<IFormInput>();
  const { createProveedor } = useProveedor();
  const navigate = useNavigate();
  const onSubmit = (data: IFormInput) => {
    createProveedor(data);
  };

  return (
    <div>
      <Typography variant="h2" marginBottom={2}>
        {updateMode ? "Actualizar" : "Crear"} Proveedor
      </Typography>
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
