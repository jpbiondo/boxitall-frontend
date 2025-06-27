// TODO: Añadir validaciones
// TODO: Conectar al backend
// TODO: Añadir artículos
import {
  Button,
  Stack,
  TextField,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { ArticuloProveedor } from "../../types/domain/articulo/Articulo";
import type { ArticuloList } from "../../types/domain/articulo/ArticuloList";
import { useProveedor } from "../../hooks/useProveedor";
import { Add, Delete, Save } from "@mui/icons-material";
import ProveedorArticuloPopupTable from "./ProveedorArticuloPopupTable";
import { ProveedorAltaDTO } from "../../types/domain/proveedor/ProveedorAltaDTO";

interface IFormInput {
  nombre: string;
  telefono: string;
}

type ArticuloProveedorWithArticulo = ArticuloProveedor & {
  articulo: ArticuloList;
};

export function ProveedorAlta() {
  const { register, handleSubmit } = useForm<IFormInput>();
  const { createProveedor } = useProveedor();

  const [selectedArticulos, setSelectedArticulos] = useState<
    ArticuloProveedorWithArticulo[]
  >([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const onSubmit = (data: IFormInput) => {
    // Create the ProveedorAltaDTO with correct property names
    const proveedorData: ProveedorAltaDTO = {
      nombre: data.nombre,
      telefono: data.telefono,
      proveedorArticulos: selectedArticulos.map((item) => ({
        cargoPedido: item.cargoPedido,
        costoCompra: item.costoCompra,
        costoPedido: item.costoPedido,
        demoraEntrega: item.demoraEntrega,
        precioUnitario: item.precioUnitario,
        proveedorId: 0, // Will be set by backend
        articuloId: item.articulo.id,
      })),
    };

    console.log(JSON.stringify(proveedorData));
    createProveedor(proveedorData)
      .then((response) => {
        alert("Proveedor creado: " + response);
      })
      .catch((error) => {
        alert("Error al crear el proveedor: " + error);
      });
  };

  const handleAddArticulo = (
    articuloProveedor: ArticuloProveedorWithArticulo
  ) => {
    setSelectedArticulos((prev) => [...prev, articuloProveedor]);
  };

  const handleRemoveArticulo = (articuloId: number) => {
    setSelectedArticulos((prev) =>
      prev.filter((item) => item.articulo.id !== articuloId)
    );
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  return (
    <div>
      <Typography variant="h2" marginBottom={2}>
        Crear Proveedor
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

        {/* Artículos del proveedor */}
        <Paper sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={3}
          >
            <Typography variant="h5">Artículos proveídos</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenPopup}
            >
              Agregar Artículo
            </Button>
          </Box>

          {selectedArticulos.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No hay artículos seleccionados. Haga clic en "Agregar Artículo"
              para comenzar.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Cargo Pedido</TableCell>
                    <TableCell>Costo Compra</TableCell>
                    <TableCell>Costo Pedido</TableCell>
                    <TableCell>Demora Entrega (días)</TableCell>
                    <TableCell>Precio Unitario</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedArticulos.map((item) => (
                    <TableRow key={item.articulo.id}>
                      <TableCell>{item.articulo.id}</TableCell>
                      <TableCell>{item.articulo.nombre}</TableCell>
                      <TableCell>${item.cargoPedido?.toFixed(2)}</TableCell>
                      <TableCell>${item.costoCompra?.toFixed(2)}</TableCell>
                      <TableCell>${item.costoPedido?.toFixed(2)}</TableCell>
                      <TableCell>{item.demoraEntrega}</TableCell>
                      <TableCell>${item.precioUnitario?.toFixed(2)}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveArticulo(item.articulo.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={selectedArticulos.length === 0}
          startIcon={<Save />}
        >
          Guardar Proveedor
        </Button>
      </form>

      {/* Popup para seleccionar artículos */}
      <ProveedorArticuloPopupTable
        onAddArticulo={handleAddArticulo}
        selectedArticulos={selectedArticulos}
        open={isPopupOpen}
        setIsOpen={setIsPopupOpen}
      />
    </div>
  );
}
