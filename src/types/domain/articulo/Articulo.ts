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

  modeloInventario: ArticuloModeloLoteFijo | ArticuloModeloIntervaloFijo;
  restanteProximoPedido: number;
}

export interface ArticuloProveedor {
  cargoPedido: number; // Costo envío producto
  costoCompra: number; // Costo unitario articulo
  costoPedido: number; // Cargo administrativo
  demoraEntrega: number;
  precioUnitario: number;
  proveedor: Proveedor;
}

export interface ArticuloModeloInventario {
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
  inventarioMax: number;
}
