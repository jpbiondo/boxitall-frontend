export interface VentaGetByIdDTO {
  id: number;
  fechaVenta: string;
  detalle: VentaDetalleGetByIdDTO[];
}

export interface VentaDetalleGetByIdDTO {
  id: number;
  renglon: number;
  cantidad: number;
  idArt: number;
  nombreArt: string;
}
