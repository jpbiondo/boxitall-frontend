export interface ArticuloAlta {
  nombre: string;
  descripcion: string;
  costoAlmacenamiento: number;
  demanda: number;
  desviacionEstandar: number;
  nivelServicio: number;
  stock: number;

  proveedorPredeterminadoId: number | null;

  articuloProveedores: ArticuloProveedorAlta[];

  modeloInventario: ArticuloModeloInventarioAlta;
}

export interface ArticuloProveedorAlta {
  cargoPedido: number; // Costo envío producto
  costoCompra: number; // Costo unitario articulo
  costoPedido: number; // Cargo administrativo
  demoraEntrega: number;
  precioUnitario: number;

  proveedorId: number;
  articuloId: number;
}

export interface ArticuloModeloInventarioAlta{
    nombre: string;
    fechaProxPedido: Date;
    intervaloPedido: number;
    inventarioMaximo: number;
}
