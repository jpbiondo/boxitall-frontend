import type { ProveedorShortDTO } from "../proveedor/ProveedorShortDTO";

export interface ArticuloShortDTO {
  articuloCod: number;
  articuloNombre: string;
  stock: number;

  articuloCostoPrecio: number;
  proveedorPred: ProveedorShortDTO;

  modeloInventario:
    | ArticuloModeloLoteFijoShortDTO
    | ArticuloModeloIntervaloFijoShortDTO;
}

export interface ArticuloModeloLoteFijoShortDTO {
  puntoPedido: number;
}

export interface ArticuloModeloIntervaloFijoShortDTO {
  fechaProximoPedido: Date;
}
