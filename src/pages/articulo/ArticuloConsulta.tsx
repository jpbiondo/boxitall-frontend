// TODO: Conectar con el backend
// TODO: Enlazar eliminar con metodo eliminar
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useArticulo } from "../../hooks/useArticulo";
import { useEffect, useState } from "react";
import type { Articulo, ArticuloModeloIntervaloFijo, ArticuloModeloInventario, ArticuloModeloLoteFijo, ArticuloProveedor } from "../../types/domain/articulo/Articulo";
import { DataGrid } from "@mui/x-data-grid";
import type { ArticuloProveedorDataGrid } from "../../types/domain/articulo/ArticuloProveedor";

export function ArticuloConsulta() {
  const { articuloCod } = useParams();
  const { isLoading, getArticuloById } = useArticulo();
  const [articulo, setArticulo ] = useState<Articulo>(new Object() as Articulo);
  const [ modInv, setModInv ] = useState<ArticuloModeloInventario>(new Object() as ArticuloModeloInventario);
  const [ artProvsRows, setArtProvRows ] = useState<ArticuloProveedorDataGrid[]>([])

  const handleDelete = () => {
    console.log("Eliminar artículo", articuloCod);
  };

  useEffect(() => {
    getArticuloById(articuloCod!).then((articulo) => {
      setArticulo(articulo);
      localStorage.setItem("articulo", JSON.stringify(articulo));
      articulo?.modeloInventario?setModInv(articulo.modeloInventario):{}
      articulo?.articuloProveedores?setArtProvsInfo():{}
    });
    }, [getArticuloById]
  );

  useEffect(()=>{
    setArtProvsInfo();
  }, [articulo]);

  const renderModeloInfo = () =>{
    const common = <p>Stock de seguridad: {modInv.stockSeguridad}</p>
    if( modInv.nombre == "Lote Fijo"){
      const asMLF = modInv as ArticuloModeloLoteFijo;
      return <>
        {common}
        <p>Stock restante hasta próximo pedido: {articulo.restanteProximoPedido}</p>
        <p>Lote óptimo: {asMLF.loteOptimo}</p>
        <p>Punto de pedio: {asMLF.puntoPedido}</p>
      </>;
    }
    else{
      const asMIF = modInv as ArticuloModeloIntervaloFijo;
      const date:Date = new Date(asMIF.fechaProximoPedido);
      return <>
        {common}
        <p>Fecha próximo pedido: {date.toUTCString()}</p>
        <p>Intervalo de pedido: {asMIF.intervaloPedido}</p>
        <p>Inventario máximo: {asMIF.inventarioMax}</p>
      </>;
    }
  };

  const renderProveedorPredInfo = () =>{
    if(articulo.proveedorPredeterminadoId){
      return `Id ${articulo.proveedorPredeterminadoId} - ${articulo.proveedorPredeterminadoNombre}`
    }
    else{
      return `${articulo.proveedorPredeterminadoNombre}`
    }
  };

  const setArtProvsInfo = () => {
    var artProvsGrid:ArticuloProveedorDataGrid[] = [];
    if (articulo.articuloProveedores != undefined)
    articulo.articuloProveedores.forEach((artProv)=>{
      const artProvGrid:ArticuloProveedorDataGrid = {
        proveedorId: artProv.proveedor.proveedorId,
        proveedorCod: artProv.proveedor.proveedorCod,
        proveedorNombre: artProv.proveedor.proveedorNombre,
        proveedorTelefono: artProv.proveedor.proveedorTelefono,
        cargoPedido: artProv.cargoPedido,
        costoCompra: artProv.costoCompra,
        costoPedido: artProv.costoPedido,
        demoraEntrega: artProv.demoraEntrega,
        precioUnitario: artProv.precioUnitario,
      }
      artProvsGrid.push(artProvGrid);
    });
    setArtProvRows(artProvsGrid);
  };

  const artProvColumns = [
    { field: "proveedorId" , headerName: "ID", width: 100 },
    { field: "proveedorCod", headerName: "Código", width: 100 },
    { field: "proveedorNombre", headerName: "Nombre", width: 200 },
    { field: "proveedorTelefono", headerName: "Teléfono", width: 200 },
    
    { field: "cargoPedido", headerName: "Cargo de pedido", width: 200 },
    { field: "costoCompra", headerName: "Costo de compra", width: 200 },
    { field: "costoPedido", headerName: "Costo de pedido", width: 200 },
    { field: "demoraEntrega", headerName: "Demora de entrega", width: 200 },
    { field: "precioUnitario", headerName: "Precio por unidad", width: 200 },
  ];
  
  const getRowId = (row:any) => {
    return row.proveedorId
  };

  return (
    <div>
      { !isLoading &&
        <>
          <h1>{articuloCod} - {articulo.nombre}</h1>
          <div>
            <Link to={`/articulo/update/${articuloCod}`}>
              <Button variant="contained" color="primary">
                Modificar
              </Button>
            </Link>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>

          <p>
            Stock: <span>{articulo.stock}</span>
          </p>

          <p>
            Descripción: <span>{articulo.descripcion}</span>
          </p>

          <p>
            Costo de costo de almacenamiento anual: $<span>{articulo.costoAlmacenamiento}</span>
          </p>

          <p>
            Demanda anual: <span> { articulo.demanda } </span>
          </p>

          <p>
            Nivel de servicio: <span> {articulo.nivelServicio}</span>
          </p>

          <div>
            <p>
              Modelo Inventario: <span> { modInv.nombre } </span>
            </p>
            <div> 
              { renderModeloInfo() }
            </div>
          </div>

          <p>
            Proveedor predeterminado: { renderProveedorPredInfo() }
          </p>

          <div>
            <p>
              Proveedores:
            </p>
              { articulo.articuloProveedores != undefined?
                <p>No hay proveedores</p>:
                <DataGrid columns={artProvColumns} rows={artProvsRows} getRowId={ getRowId }></DataGrid>
              }
          </div>
        </>
      }
    </div>
  );
}
