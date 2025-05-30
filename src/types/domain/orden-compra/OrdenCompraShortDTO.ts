import type { OrdenCompraEstado } from "./OrdenCompra";

export interface OrdenCompraShortDTO {
  OCNumero: number;
  OCFechaInicio: Date;
  OCFechaFin: Date | null;
  total: number;

  OCEstado: OrdenCompraEstado;
}
