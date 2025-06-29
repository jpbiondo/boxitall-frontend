import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import type { ArticuloProveedor } from "../../types/domain/articulo/Articulo";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Proveedor } from "../../types/domain/proveedor/Proveedor";
import { useProveedor } from "../../hooks/useProveedor";
import { Close } from "@mui/icons-material";

interface ArticuloAMProveedorPopupTableProps {
  onAddArtProveedor: (proveedor: Proveedor) => void;
  artProveedores: ArticuloProveedor[];
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ArticuloAMProveedorPopupTable({
  onAddArtProveedor,
  artProveedores,
  open,
  setIsOpen,
}: ArticuloAMProveedorPopupTableProps) {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const { getProveedorShort } = useProveedor();

  const proveedorProveeArticulo = (
    proveedor: Proveedor,
    artProveedores: ArticuloProveedor[]
  ) => {
    const artProvsDelProveedor = artProveedores.find(
      (artProv) => artProv.proveedor.id === proveedor.id
    );
    return artProvsDelProveedor;
  };

  useEffect(() => {
    getProveedorShort().then((provs) => {
      const filteredProvList = provs.filter(
        (prov) => !proveedorProveeArticulo(prov, artProveedores)
      );
      setProveedores(filteredProvList);
    });
  }, [artProveedores, getProveedorShort]);

  const handleAddArtProveedor = (proveedor: Proveedor) => {
    onAddArtProveedor(proveedor);

    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar proveedores para el artículo</DialogTitle>

      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent>
        <TableContainer>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell></TableCell>
          </TableRow>
          {proveedores.map((proveedor) => (
            <TableRow key={proveedor.id}>
              <TableCell>{proveedor.id}</TableCell>
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
