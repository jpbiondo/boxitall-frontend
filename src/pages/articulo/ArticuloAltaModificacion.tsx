// TODO: Añadir lista de proveedores
// TODO: Añadir lista de modelos de inventario
// TODO: Conectar con el backend
// TODO: Añadir validaciones formulario
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Button,
  type SelectChangeEvent,
} from "@mui/material";
import type { Articulo } from "../../types/domain/articulo/Articulo";
import { useForm } from "react-hook-form";

interface IFormInput extends Articulo {
  modeloInventarioTipo: "loteFijo" | "intervaloFijo";
}

interface ArticuloAltaModificacionProps {
  updateMode: boolean;
}

export function ArticuloAltaModificacion({
  updateMode,
}: ArticuloAltaModificacionProps) {
  const { register, handleSubmit, watch, setValue } = useForm<IFormInput>();
  const modeloInventarioTipo = watch("modeloInventarioTipo");

  const onSubmit = (data: IFormInput) => console.log(data);

  const handleSelectInventario = (e: SelectChangeEvent) => {
    setValue(
      "modeloInventarioTipo",
      e.target.value as "loteFijo" | "intervaloFijo"
    );
  };

  return (
    <div>
      <h1>{updateMode ? "Actualizar" : "Crear"} Artículo</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <TextField
          {...register("articuloCod")}
          id="articuloCod"
          label="Código de artículo"
        />
        <TextField
          {...register("articuloNombre")}
          label="Nombre del artículo"
        />

        <TextField
          {...register("articuloDescripcion")}
          label="Descripción del artículo"
        />

        <TextField
          {...register("articuloCostoAlmacenamiento")}
          label="Costo almacenamiento artículo"
          type="number"
        />

        <TextField
          {...register("articuloDemanda")}
          label="Cantidad demandada del artículo"
          type="number"
        />

        <TextField
          {...register("articuloDesviacionEstandar")}
          label="Desviación estandar demanda artículo"
          type="number"
        />

        <TextField
          {...register("articuloNivelServicio")}
          label="Nivel de servicio del artículo"
          type="number"
        />

        <TextField
          {...register("articuloStock")}
          label="Stock del artículo"
          type="number"
        />

        <div>
          <h2>Proveedores</h2>
          <p>TODO:Añadir lista proveedores</p>
        </div>

        <FormControl>
          <InputLabel id="proveedorPred-label">
            Proveedor predeterminado
          </InputLabel>
          <Select
            labelId="proveedorPred-label"
            id="proveedorPred"
            label="Proveedor predeterminado"
          >
            <MenuItem>Proveedor 1</MenuItem>
            <MenuItem>Proveedor 2</MenuItem>
            <MenuItem>Proveedor 3</MenuItem>
          </Select>
        </FormControl>

        <div>
          <h2>Modelo de inventario</h2>
          <p>TODO:Añadir lista modelos de inventario</p>
          <FormControl fullWidth>
            <InputLabel id="modeloInventario-label">
              Modelo de inventario
            </InputLabel>
            <Select
              labelId="modeloInventario-label"
              id="modeloInventario"
              label="Modelo de inventario"
              value={modeloInventarioTipo || ""}
              onChange={handleSelectInventario}
            >
              <MenuItem value="loteFijo">Modelo 1</MenuItem>
              <MenuItem value="intervaloFijo">Modelo 2</MenuItem>
            </Select>
          </FormControl>

          {/* Lote fijo */}
          {modeloInventarioTipo === "loteFijo" && (
            <>
              <TextField label="Lote óptimo" type="number" />
              <TextField label="Punto de pedido" type="number" />
              <TextField label="Stock de seguridad" type="number" />
            </>
          )}

          {/* Intervalo fijo */}
          {modeloInventarioTipo === "intervaloFijo" && (
            <>
              <TextField label="Fecha próximo pedido" type="date" />
              <TextField label="Intervalo pedido" type="number" />
              <TextField label="Intervalo máximo" type="number" />
              <TextField label="Stock de seguridad" type="number" />
            </>
          )}
        </div>

        <Button type="submit" variant="contained">
          Guardar
        </Button>
      </form>
    </div>
  );
}
