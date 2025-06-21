export interface ArticuloList {
  id: number;
  nombre: string;
  stock: number;

  cgi: string;

  modeloInventario: string;
  fechaProximoPedido: string;
  restanteProximoPedido: string;

  proveedorPredeterminadoId: string;
  proveedorPredeterminadoNombre: string;
}