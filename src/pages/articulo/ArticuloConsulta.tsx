import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
import { Edit, Delete } from "@mui/icons-material";

export function ArticuloConsulta() {
  const { articuloCod } = useParams();
  const { isLoading, getArticuloById, deleteArticulo, error } = useArticulo();
  const [articulo, setArticulo] = useState<Articulo>(new Object() as Articulo);
  const [modInv, setModInv] = useState<ArticuloModeloInventario>(
    new Object() as ArticuloModeloInventario
  );
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (
      confirm(
        "Realmente quieres eliminar el artículo?\nEsta acción no puede deshacerse"
      )
    ) {
      await deleteArticulo(articulo.id.toString()).then(
        () => {
          alert("Artículo dado de baja exitosamente");
          navigate("/articulo");
        },
        () => {
          error?.response?.json().then((resp) => {
            alert(
              `Ha ocurrido un error dando de baja al artículo\n ${resp.error}`
            );
          });
        }
      );
    }
  };

  useEffect(() => {
    getArticuloById(articuloCod!).then((articulo) => {
      setArticulo(articulo);
      articulo?.modeloInventario ? setModInv(articulo.modeloInventario) : {};
    });
  }, [getArticuloById]);

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
                  <>
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight="bold">Lote óptimo</Typography>
                      </TableCell>
                      <TableCell>
                        {(modInv as ArticuloModeloLoteFijo).loteOptimo}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight="bold">
                          Punto de pedido
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {(modInv as ArticuloModeloLoteFijo).puntoPedido}
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <>
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight="bold">
                          Fecha próximo pedido
                        </Typography>
                      </TableCell>
                      <TableCell>{(modInv as ArticuloModeloIntervaloFijo).fechaProximoPedido?.toString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight="bold">
                          Intervalo de pedido
                        </Typography>
                      </TableCell>
                      <TableCell>{(modInv as ArticuloModeloIntervaloFijo).intervaloPedido}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight="bold">
                          Inventario máximo
                        </Typography>
                      </TableCell>
                      <TableCell>{(modInv as ArticuloModeloIntervaloFijo).inventarioMaximo}</TableCell>
                    </TableRow>
                      </>
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
                    <Typography fontWeight="bold">
                      Costo de almacenamiento
                    </Typography>
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

          <Typography variant="h3">Proveedor predeterminado</Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Id del proveedor</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      Nombre del proveedor
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableCell>
                  <Typography>
                    {" "}
                    {articulo.proveedorPredeterminadoId}{" "}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {" "}
                    {articulo.proveedorPredeterminadoNombre}{" "}
                  </Typography>
                </TableCell>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h3">Información de los proveedores</Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Id</Typography>
                  </TableCell>
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
                    <TableCell>{artProv.proveedor.id}</TableCell>
                    <TableCell>{(artProv.proveedor as any).proveedorNombre}</TableCell>
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
