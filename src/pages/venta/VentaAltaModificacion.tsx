import {
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import { Add, Delete as DeleteIcon, Save } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { Venta, VentaDetalle } from "../../types/domain/venta/Venta";
import VentaArticuloPopupTable from "./VentaArticuloPopupTable";
import { VentaAltaDTO } from "../../types/domain/venta/VentaAltaDTO";
import { useVenta } from "../../hooks/useVenta";

interface IFormInput extends Omit<Venta, "ventaDetalles"> {
  ventaDetalles?: VentaDetalle[];
}

export function VentaAltaModificacion() {
  const { register, handleSubmit, setValue, watch } = useForm<IFormInput>();
  const [selectedArticulos, setSelectedArticulos] = useState<VentaDetalle[]>(
    []
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { createVenta } = useVenta();
  const onSubmit = async () => {
    const ventaData: VentaAltaDTO = {
      articuloIdCantidad: selectedArticulos.reduce((acc, detalle) => {
        acc[detalle.articulo.id] = detalle.ventaDetalleCantidad;
        return acc;
      }, {} as { [key: number]: number }),
    };
    await createVenta(ventaData);
  };

  const handleAddArticulo = (ventaDetalle: VentaDetalle) => {
    const updatedArticulos = [...selectedArticulos, ventaDetalle];
    setSelectedArticulos(updatedArticulos);
  };

  const handleRemoveArticulo = (index: number) => {
    const updatedArticulos = selectedArticulos.filter((_, i) => i !== index);
    setSelectedArticulos(updatedArticulos);
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) return;

    const updatedArticulos = [...selectedArticulos];
    updatedArticulos[index].ventaDetalleCantidad = newQuantity;
    setSelectedArticulos(updatedArticulos);
  };

  return (
    <div>
      <Typography variant="h2" marginBottom={2}>
        Crear Venta
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" marginBottom={1}>
              Artículos de la Venta
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setIsPopupOpen(true)}
              sx={{ marginBottom: 2 }}
              startIcon={<Add />}
            >
              Agregar
            </Button>
          </Stack>

          {selectedArticulos.length > 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Artículo</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Stock Disponible</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedArticulos.map((detalle, index) => (
                    <TableRow key={`${detalle.articulo.id}-${index}`}>
                      <TableCell>
                        {detalle.articulo.nombre} (ID: {detalle.articulo.id})
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={detalle.ventaDetalleCantidad}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              index,
                              parseInt(e.target.value) || 0
                            )
                          }
                          inputProps={{ min: 1, max: detalle.articulo.stock }}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>{detalle.articulo.stock}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveArticulo(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={selectedArticulos.length === 0}
          startIcon={<Save />}
        >
          Guardar Venta
        </Button>
      </form>

      <VentaArticuloPopupTable
        onAddArticulo={handleAddArticulo}
        selectedArticulos={selectedArticulos}
        open={isPopupOpen}
        setIsOpen={setIsPopupOpen}
      />
    </div>
  );
}
