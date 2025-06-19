import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import type { ArticuloProveedor } from "../../types/domain/articulo/Articulo";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Proveedor } from "../../types/domain/proveedor/Proveedor";

interface ArticuloAMProveedorPopupTableProps {
  onAddArtProveedor: (proveedor: Proveedor) => void;
  artProveedores: ArticuloProveedor[];
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function createProveedorRow(
  proveedorCod: number,
  proveedorNombre: string,
  proveedorTelefono: string
) {
  return { proveedorCod, proveedorNombre, proveedorTelefono };
}

const proveedoresMock = [
  createProveedorRow(1, "Proveedor 1", "1234567890"),
  createProveedorRow(2, "Proveedor 2", "1234567890"),
  createProveedorRow(3, "Proveedor 3", "1234567890"),
];

export default function ArticuloAMProveedorPopupTable({
  onAddArtProveedor,
  artProveedores,
  open,
  setIsOpen,
}: ArticuloAMProveedorPopupTableProps) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  useEffect(() => {
    const provList = proveedoresMock.filter(
      ({ proveedorCod }) =>
        artProveedores.filter(
          (artProv) => artProv.proveedor.proveedorCod === proveedorCod
        ).length === 0
    );
    setProveedores(provList);
  }, [artProveedores]);

  const handleAddArtProveedor = (proveedor: Proveedor) => {
    onAddArtProveedor(proveedor);

    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Agregar proveedores para el artículo</DialogTitle>
      <DialogContent>
        <TableContainer>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell></TableCell>
          </TableRow>
          {proveedores.map((proveedor) => (
            <TableRow key={proveedor.proveedorCod}>
              <TableCell>{proveedor.proveedorCod}</TableCell>
              <TableCell>{proveedor.proveedorNombre}</TableCell>
              <TableCell>{proveedor.proveedorTelefono}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddArtProveedor(proveedor)}
                >
                  Agregar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
