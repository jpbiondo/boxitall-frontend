import type { DTOOrdenCompraArticuloObtenerDetalle } from "./DTOOrdenCompraArticuloObtenerDetalle";

export interface DTOOrdenCompraObtenerDetalle {
  IDOrdenCompra: number;
  detalleArticulos: DTOOrdenCompraArticuloObtenerDetalle[];
  estado: string;
  idproveedor:number;
  nombreProveedor:string;
}
