import {
  Box,
  Stack,
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
  TableHead,
  Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useVenta } from "../../hooks/useVenta";
import { useEffect, useState } from "react";
import { VentaGetByIdDTO } from "../../types/domain/venta/VentaGetByIdDTO";

export function VentaConsulta() {
  const { ventaCod } = useParams();
  const { getVentaById } = useVenta();
  const [venta, setVenta] = useState<VentaGetByIdDTO | null>(null);

  useEffect(() => {
    if (ventaCod) {
      getVentaById(ventaCod).then((venta) => {
        setVenta(venta);
      });
    }
  }, [getVentaById, ventaCod]);

  if (!venta) {
    return <div>Cargando...</div>;
  }

  return (
    <Box>
      <Typography variant="h2">Venta #{ventaCod}</Typography>
      <Typography variant="h3" marginBottom={2}>
        {venta.fechaVenta.split("T")[0]}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Renglon</TableCell>
              <TableCell>Articulo Id</TableCell>
              <TableCell>Articulo Nombre</TableCell>
              <TableCell>Cantidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venta.detalle.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.renglon}</TableCell>
                <TableCell>{row.idArt}</TableCell>
                <TableCell>{row.nombreArt}</TableCell>
                <TableCell>{row.cantidad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
