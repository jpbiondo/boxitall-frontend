import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useArticulo } from "../hooks/useArticulo";
import type { DTOArticuloProveedorListado } from "../types/domain/articulo/DTOArticuloProveedorListado";
import type { DTOOrdenCompraArticuloObtenerDetalle } from "../types/domain/orden-compra/DTOOrdenCompraArticuloObtenerDetalle";

interface Props {
  open: boolean;
  proveedorid: number;
  detalleActual: DTOOrdenCompraArticuloObtenerDetalle[];
  onClose: (articuloSeleccionado?: DTOArticuloProveedorListado) => void;
}

export function AddArticuloModal({ open, proveedorid, detalleActual, onClose }: Props) {
  const { listarArticulosPorProveedorId } = useArticulo();
  const [articulos, setArticulos] = useState<DTOArticuloProveedorListado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const fetchArticulos = async () => {
      setLoading(true);
      const lista = await listarArticulosPorProveedorId(proveedorid);
      const idsActuales = detalleActual.map((d) => d.idarticulo);
      const disponibles = lista.filter((a) => !idsActuales.includes(a.idArticulo));
      setArticulos(disponibles);
      setLoading(false);
    };

    fetchArticulos();
  }, [open, proveedorid, detalleActual]);

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth>
      <DialogTitle>Agregar artículo</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : articulos.length === 0 ? (
          <Typography>No hay más artículos disponibles para agregar.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articulos.map((a) => (
                <TableRow key={a.idArticulo}>
                  <TableCell>{a.nombreArticulo}</TableCell>
                  <TableCell>${a.precioProveedor.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => onClose(a)}>
                      Agregar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} color="secondary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
