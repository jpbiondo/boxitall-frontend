import type { Articulo } from "../articulo/Articulo";

export interface Venta {
  ventaCod: number;
  ventaFecha: Date;
  ventaTotal: number;

  ventaDetalles: VentaDetalle[];
}

export interface VentaDetalle {
  ventaDetalleRenglon: number;
  ventaDetalleCantidad: number;

  articulo: Articulo;
}
