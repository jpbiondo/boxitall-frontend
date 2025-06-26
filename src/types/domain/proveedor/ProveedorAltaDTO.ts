export interface ProveedorAltaDTO {
  nombre: string;
  telefono: string;
  proveedorArticulos?: ProveedorAltaDTOArticulo[];
}

export interface ProveedorAltaDTOArticulo {
  cargoPedido: number; // Costo envío producto
  costoCompra: number; // Costo unitario articulo
  costoPedido: number; // Cargo administrativo
  demoraEntrega: number;
  precioUnitario: number;
  proveedorId: number;
  articuloId: number;
}
