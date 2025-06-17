export interface ArticuloList {
  articuloId: number;
  articuloNombre: string;
  stock: number;

  cgi: string;

  modeloInventario: string;
  fechaProximoPedido: string;
  restanteProximoPedido: string;

  proveedorPredeterminadoId: string;
  proveedorPredeterminadoNombre: string;
}