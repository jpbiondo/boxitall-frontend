import type { Proveedor } from "../proveedor/Proveedor";

export interface Articulo {
  articuloCod: number;
  articuloNombre: string;
  articuloDescripcion: string;
  articuloCostoAlmacenamiento: number;
  articuloDemanda: number;
  articuloDesviacionEstandar: number;
  articuloNivelServicio: number;
  articuloStock: number;

  proveedorPred: Proveedor | null;
  proveedores: ArticuloProveedor[];

  modeloInventario: ArticuloModeloLoteFijo | ArticuloModeloIntervaloFijo;
}

export interface ArticuloProveedor {
  APCargoPedido: number; // Costo envío producto
  APCostoCompra: number; // Costo unitario articulo
  APCostoPedido: number; // Cargo administrativo
  APDemoraEntregaDias: number;
  proveedor: Proveedor;
}

export interface ArticuloModeloLoteFijo {
  loteOptimo: number;
  puntoPedido: number;
  stockSeguridad: number;
}

export interface ArticuloModeloIntervaloFijo {
  fechaProximoPedido: Date;
  intervaloPedido: number;
  intervaloMax: number;
  stockSeguridad: number;
}
