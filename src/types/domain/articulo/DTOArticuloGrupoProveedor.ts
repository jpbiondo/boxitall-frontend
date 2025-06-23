import { DTOArticuloProveedorListado } from './DTOArticuloProveedorListado'; // Asegúrate de importar correctamente

export interface DTOArticuloGrupoProveedor {
  proveedorId: number;
  proveedorNombre: string;
  articulos: DTOArticuloProveedorListado[];
}
