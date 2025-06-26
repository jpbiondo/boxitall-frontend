import {
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useProveedor } from "../../hooks/useProveedor";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Save } from "@mui/icons-material";
import { ProveedorBase } from "../../types/domain/proveedor/ProveedorBase";

interface IFormInput {
  nombre: string;
  telefono: string;
}

export function ProveedorModificacion() {
  const { proveedorCod } = useParams();
  const { register, handleSubmit, setValue } = useForm<IFormInput>();

  const { getProveedorById } = useProveedor();
  const { updateProveedor, isLoading, error: updateError } = useProveedor();

  const navigate = useNavigate();

  const [proveedor, setProveedor] = useState<ProveedorBase | null>(null);
  const [wasUpdated, setWasUpdated] = useState<boolean>(false);

  const onSubmit = (data: IFormInput) => {
    if (!proveedor) return;
    setWasUpdated(true);
    updateProveedor(proveedor.id.toString(), {
      id: proveedor.id,
      proveedorCod: proveedor.proveedorCod,
      proveedorNombre: data.nombre,
      proveedorTelefono: data.telefono,
      proveedorFechaBaja: proveedor.proveedorFechaBaja,
    });
  };

  useEffect(() => {
    if (!wasUpdated || isLoading || updateError) return;

    setTimeout(
      () => {
        navigate("/proveedor");
      },
      3000,
      [navigate]
    );
  }, [wasUpdated, updateError, isLoading]);

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
          loading={isLoading}
          startIcon={<Save />}
        >
          Guardar Proveedor
        </Button>
        {wasUpdated &&
          !isLoading &&
          (!updateError ? (
            <Alert icon={<Check />} severity="success">
              El artículo fue actualizado correctamente.
            </Alert>
          ) : (
            <Alert icon={<Check />} severity="error">
              No se puedo actualizar el artículo.
              {updateError.response?.json().then((resp) => resp)}
            </Alert>
          ))}
      </form>
    </div>
  );
}
