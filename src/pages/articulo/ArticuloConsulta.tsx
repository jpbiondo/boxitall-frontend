// TODO: Conectar con el backend
// TODO: Enlazar eliminar con metodo eliminar
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useArticulo } from "../../hooks/useArticulo";
import { useEffect, useState } from "react";
import type {
  Articulo,
  ArticuloModeloIntervaloFijo,
  ArticuloModeloInventario,
  ArticuloModeloLoteFijo,
} from "../../types/domain/articulo/Articulo";
import { DataGrid } from "@mui/x-data-grid";
import type { ArticuloProveedorDataGrid } from "../../types/domain/articulo/ArticuloProveedor";
import { Edit, Delete } from "@mui/icons-material";

export function ArticuloConsulta() {
  const { articuloCod } = useParams();
  const { isLoading, getArticuloById, deleteArticulo, error } = useArticulo();
  const [articulo, setArticulo] = useState<Articulo>(new Object() as Articulo);
  const [modInv, setModInv] = useState<ArticuloModeloInventario>(
    new Object() as ArticuloModeloInventario
  );
  const [artProvsRows, setArtProvRows] = useState<ArticuloProveedorDataGrid[]>(
    []
  );
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirm("Realmente quieres eliminar el artículo?\nEsta acción no puede deshacerse")){
      await deleteArticulo(articulo.id.toString()).then(
        () => {
          alert("Artículo dado de baja exitosamente")
          navigate("/articulo")
        },
        ( ) => {
          error?.response?.json().then((resp)=>{
            alert(`Ha ocurrido un error dando de baja al artículo\n ${resp.error}`);
          });
        }
      );
    }
  };

  useEffect(() => {
    getArticuloById(articuloCod!).then((articulo) => {
      setArticulo(articulo);
      articulo?.modeloInventario ? setModInv(articulo.modeloInventario) : {};
      articulo?.articuloProveedores ? setArtProvsInfo() : {};
    });
  }, [getArticuloById]);

  useEffect(() => {
    setArtProvsInfo();
  }, [articulo]);

  const renderModeloInfo = () => {
    const common = <p>Stock de seguridad: {modInv.stockSeguridad}</p>;
    if (modInv.nombre == "Lote Fijo") {
      const asMLF = modInv as ArticuloModeloLoteFijo;
      return (
        <>
          {common}
          <p>
            Stock restante hasta próximo pedido:{" "}
            {articulo.restanteProximoPedido}
          </p>
          <p>Lote óptimo: {asMLF.loteOptimo}</p>
          <p>Punto de pedio: {asMLF.puntoPedido}</p>
        </>
      );
    } else {
      const asMIF = modInv as ArticuloModeloIntervaloFijo;
      const date: Date = new Date(asMIF.fechaProximoPedido);
      return (
        <>
          {common}
          <p>Fecha próximo pedido: {date.toUTCString()}</p>
          <p>Intervalo de pedido: {asMIF.intervaloPedido}</p>
          <p>Inventario máximo: {asMIF.inventarioMaximo}</p>
        </>
      );
    }
  };

  const renderProveedorPredInfo = () => {
    if (articulo.proveedorPredeterminadoId) {
      return `Id ${articulo.proveedorPredeterminadoId} - ${articulo.proveedorPredeterminadoNombre}`;
    } else {
      return `${articulo.proveedorPredeterminadoNombre}`;
    }
  };

  const setArtProvsInfo = () => {
    var artProvsGrid: ArticuloProveedorDataGrid[] = [];
    if (articulo.articuloProveedores != undefined)
      articulo.articuloProveedores.forEach((artProv) => {
        const artProvGrid: ArticuloProveedorDataGrid = {
          proveedorId: artProv.proveedor.id,
          proveedorCod: artProv.proveedor.proveedorCod,
          proveedorNombre: artProv.proveedor.proveedorNombre,
          proveedorTelefono: artProv.proveedor.proveedorTelefono,
          cargoPedido: artProv.cargoPedido,
          costoCompra: artProv.costoCompra,
          costoPedido: artProv.costoPedido,
          demoraEntrega: artProv.demoraEntrega,
          precioUnitario: artProv.precioUnitario,
        };
        artProvsGrid.push(artProvGrid);
      });
    setArtProvRows(artProvsGrid);
  };

  const artProvColumns = [
    { field: "proveedorId", headerName: "ID", width: 100 },
    { field: "proveedorCod", headerName: "Código", width: 100 },
    { field: "proveedorNombre", headerName: "Nombre", width: 200 },
    { field: "proveedorTelefono", headerName: "Teléfono", width: 200 },

    { field: "cargoPedido", headerName: "Cargo de pedido", width: 200 },
    { field: "costoCompra", headerName: "Costo de compra", width: 200 },
    { field: "costoPedido", headerName: "Costo de pedido", width: 200 },
    { field: "demoraEntrega", headerName: "Demora de entrega", width: 200 },
    { field: "precioUnitario", headerName: "Precio por unidad", width: 200 },
  ];

  const getRowId = (row: any) => {
    return row.proveedorId;
  };

  return (
    <div>
      {!isLoading && (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h2" marginBottom={2}>
              Artículo #{articuloCod} {articulo.nombre}
            </Typography>
            <div>
              <Link to={`/articulo/update/${articuloCod}`}>
                <IconButton color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <IconButton color="error" onClick={handleDelete}>
                <Delete />
              </IconButton>
            </div>
          </Stack>
          <Typography variant="h3">Información base</Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Stock</Typography>
                  </TableCell>
                  <TableCell>{articulo.stock}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Descripción</Typography>
                  </TableCell>
                  <TableCell>{articulo.descripcion}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">
                      Costo de almacenamiento (anual)
                    </Typography>
                  </TableCell>
                  <TableCell>{articulo.costoAlmacenamiento}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Demanda (anual)</Typography>
                  </TableCell>
                  <TableCell>{articulo.demanda}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">
                      Desviación estándar (anual)
                    </Typography>
                  </TableCell>
                  <TableCell>{articulo.desviacionEstandar}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Nivel de servicio</Typography>
                  </TableCell>
                  <TableCell>{articulo.nivelServicio}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h3">
            Información de modelo de inventario
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Modelo Inventario</Typography>
                  </TableCell>
                  <TableCell>{modInv.nombre}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">
                      Stock de seguridad
                    </Typography>
                  </TableCell>
                  <TableCell>{modInv.stockSeguridad}</TableCell>
                </TableRow>

                {modInv.nombre == "Lote Fijo" ? (
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight="bold">Lote óptimo</Typography>
                    </TableCell>
                    <TableCell>{(modInv as ArticuloModeloLoteFijo).loteOptimo}</TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight="bold">
                        Fecha próximo pedido
                      </Typography>
                    </TableCell>
                    <TableCell>{(modInv as ArticuloModeloIntervaloFijo).fechaProximoPedido?.toUTCString()}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h3">
            CGI para el proveedor predeterminado
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">CGI</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Costo de almacenamiento</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Costo de compra</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Costo de pedido</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{articulo?.cgi?.cgiTotal}</TableCell>
                  <TableCell>{articulo?.cgi?.costoAlmacenamiento}</TableCell>
                  <TableCell>{articulo?.cgi?.costoCompra}</TableCell>
                  <TableCell>{articulo?.cgi?.costoPedido}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h3">
            Proveedor predeterminado
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Id del proveedor</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Nombre del proveedor</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableCell>
                  <Typography> { articulo.proveedorPredeterminadoId } </Typography>
                </TableCell>
                <TableCell>
                  <Typography> { articulo.proveedorPredeterminadoNombre } </Typography>
                </TableCell>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h3">
            Información de los proveedores
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Nombre</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Cargo de pedido</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Costo de compra</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Costo de pedido</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Demora de entrega</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Precio por unidad</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {articulo.articuloProveedores?.map((artProv) => (
                  <TableRow>
                    <TableCell>{artProv.proveedor.proveedorNombre}</TableCell>
                    <TableCell>{artProv.cargoPedido}</TableCell>
                    <TableCell>{artProv.costoCompra}</TableCell>
                    <TableCell>{artProv.costoPedido}</TableCell>
                    <TableCell>{artProv.demoraEntrega}</TableCell>
                    <TableCell>{artProv.precioUnitario}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}
