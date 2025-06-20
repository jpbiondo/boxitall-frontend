// TODO: Conectar con el backend
// TODO: Enlazar eliminar con metodo eliminar
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useArticulo } from "../../hooks/useArticulo";
import { useEffect, useState } from "react";
import type { Articulo, ArticuloModeloIntervaloFijo, ArticuloModeloInventario, ArticuloModeloLoteFijo } from "../../types/domain/articulo/Articulo";

export function ArticuloConsulta() {
  const { articuloCod } = useParams();
  const { isLoading, getArticuloById} = useArticulo();
  const [articulo, setArticulo] = useState<Articulo>(new Object() as Articulo);
  const [modInv, setModInv] = useState<ArticuloModeloInventario>(new Object() as ArticuloModeloInventario);

  const handleDelete = () => {
    console.log("Eliminar artículo", articuloCod);
  };

  useEffect(() => {
    getArticuloById(articuloCod!).then((articulo) => {
      setArticulo(articulo);
      console.log(articulo);
      articulo?.modeloInventario?setModInv(articulo.modeloInventario):{}
    });
    }, [getArticuloById]
  );

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
  }
  const renderProveedorInfo = () =>{
    if(articulo.proveedorPredeterminadoId){
      return `Id ${articulo.proveedorPredeterminadoId} - ${articulo.proveedorPredeterminadoNombre}`
    }
    else{
      return `${articulo.proveedorPredeterminadoNombre}`
    }
  }

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
            Proveedor predeterminado: {renderProveedorInfo()}
          </p>

          <div>
            <p>
              Proveedores:
            </p>
            <ul>
              <li>Proveedor 1</li>
              <li>Proveedor 2</li>
              <li>Proveedor 3</li>
            </ul>
          </div>
        </>
      }
    </div>
  );
}
