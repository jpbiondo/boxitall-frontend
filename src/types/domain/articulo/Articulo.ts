import type { Proveedor } from "../proveedor/Proveedor";

export interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  costoAlmacenamiento: number;
  demanda: number;
  desviacionEstandar: number;
  nivelServicio: number;
  stock: number;

  proveedorPredeterminadoId: number | null;
  proveedorPredeterminadoNombre: string | null;


  proveedores: ArticuloProveedor[];

  modeloInventario: ArticuloModeloInventario;
  restanteProximoPedido: number;
}

export interface ArticuloProveedor {
  APCargoPedido: number; // Costo envío producto
  APCostoCompra: number; // Costo unitario articulo
  APCostoPedido: number; // Cargo administrativo
  APDemoraEntregaDias: number;
  proveedor: Proveedor;
}

export interface ArticuloModeloInventario{
  stockSeguridad: number;
  nombre: string;
}

export interface ArticuloModeloLoteFijo extends ArticuloModeloInventario {
  loteOptimo: number;
  puntoPedido: number;
}

export interface ArticuloModeloIntervaloFijo extends ArticuloModeloInventario {
  fechaProximoPedido: Date;
  intervaloPedido: number;
  intervaloMax: number;
}
