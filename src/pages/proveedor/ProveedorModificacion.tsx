// TODO: Añadir validaciones
// TODO: Conectar al backend
// TODO: Añadir artículos
import { Button, Stack, TextField, Typography, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useProveedor } from "../../hooks/useProveedor";
import { useParams } from "react-router-dom";
import { Save } from "@mui/icons-material";
import { ProveedorBase } from "../../types/domain/proveedor/ProveedorBase";

interface IFormInput {
  nombre: string;
  telefono: string;
}

export function ProveedorModificacion() {
  const { register, handleSubmit, setValue } = useForm<IFormInput>();
  const { getProveedorById, error, updateProveedor } = useProveedor();

  const { proveedorCod } = useParams();
  const [proveedor, setProveedor] = useState<ProveedorBase | null>(null);

  const onSubmit = (data: IFormInput) => {
    if (!proveedor) return;

    console.log(proveedor.id);
    updateProveedor(proveedor.id.toString(), {
      id: proveedor.id,
      proveedorCod: proveedor.proveedorCod,
      proveedorNombre: data.nombre,
      proveedorTelefono: data.telefono,
      proveedorFechaBaja: proveedor.proveedorFechaBaja,
    })
      .then((resp) => {
        alert("Proveedor actualizado" + resp.proveedorNombre + " " + resp.id);
      })
      .catch((_) => {
        alert(
          "No se pudo actualizar el proveedor" +
            error?.response?.json().then((resp) => resp)
        );
      });
  };

  useEffect(() => {
    if (proveedorCod) {
      getProveedorById(proveedorCod)
        .then((proveedor) => {
          setProveedor(proveedor);
          setValue("nombre", proveedor.proveedorNombre);
          setValue("telefono", proveedor.proveedorTelefono);
        })
        .catch((error) => {
          alert("Error al obtener el proveedor: " + error);
        });
    }
  }, [proveedorCod, setValue]);

  return (
    <div>
      <Typography variant="h2" marginBottom={2}>
        Actualizar Proveedor
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* Datos básicos del proveedor */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" marginBottom={3}>
            Datos del Proveedor
          </Typography>
          <Stack spacing={2}>
            <TextField
              {...register("nombre")}
              id="nombre"
              label="Nombre del proveedor"
              required
            />
            <TextField
              {...register("telefono")}
              id="telefono"
              label="Teléfono del proveedor"
              required
            />
          </Stack>
        </Paper>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!proveedor}
          startIcon={<Save />}
        >
          Guardar Proveedor
        </Button>
      </form>
    </div>
  );
}
