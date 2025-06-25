import type { DTOOrdenCompraArticuloObtenerDetalle } from "./DTOOrdenCompraArticuloObtenerDetalle";

export interface DTOOrdenCompraObtenerDetalle {
  idordenCompra: number;
  detalleArticulos: DTOOrdenCompraArticuloObtenerDetalle[];
  estado: string;
  idproveedor:number;
  nombreproveedor:string;
}
