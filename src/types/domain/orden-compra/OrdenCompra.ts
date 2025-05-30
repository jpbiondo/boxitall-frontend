import type { Articulo } from "../articulo/Articulo";
import type { Proveedor } from "../proveedor/Proveedor";

export interface OrdenCompra {
  OCNumero: number;
  OCFechaInicio: Date;
  OCFechaFin: Date | null;

  OCEstado: OrdenCompraEstado;
  OCArticulos: OrdenCompraArticulo[];
  proveedor: Proveedor;
}

export interface OrdenCompraArticulo {
  OCARenglon: number;
  OCACantidad: number;
  articulos: Articulo[];
}

export type OrdenCompraEstado =
  | "Pendiente"
  | "Enviada"
  | "Finalizada"
  | "Cancelada";
