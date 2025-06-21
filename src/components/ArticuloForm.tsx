// TODO: Añadir lista de proveedores
// TODO: Añadir lista de modelos de inventario
// TODO: Conectar con el backend
// TODO: Añadir validaciones formulario
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { Articulo } from "../types/domain/articulo/Articulo";
import { useArticulo } from "../hooks/useArticulo";
import {
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Proveedor } from "../types/domain/proveedor/Proveedor";
import ArticuloAMProveedorPopupTable from "../pages/articulo/ArticuloAMProveedorPopupTable";
import { Add, Delete } from "@mui/icons-material";

interface IFormValues extends Articulo {
  modeloInventarioTipo: "loteFijo" | "intervaloFijo";
}

interface ArticuloFormProps {
  onSuccess?: () => void;
  articulo?: Articulo;
}

export default function ArticuloForm({
  articulo,
  onSuccess,
}: ArticuloFormProps) {
  const { createArticulo, updateArticulo, error, isLoading } = useArticulo();

  // React Hook Form set-up
  const { register, control, watch, handleSubmit } = useForm<IFormValues>({
    defaultValues: articulo
      ? {
          articuloCod: articulo.articuloCod,
          articuloNombre: articulo.articuloNombre,
          articuloDescripcion: articulo.articuloDescripcion,
          articuloDemanda: articulo.articuloDemanda,
          articuloDesviacionEstandar: articulo.articuloDesviacionEstandar,
          articuloNivelServicio: articulo.articuloNivelServicio,
          articuloStock: articulo.articuloStock,

          proveedores: articulo.proveedores,
          proveedorPred: articulo.proveedorPred,

          modeloInventario: articulo.modeloInventario,
        }
      : undefined,
  });

  const { fields, append, remove } = useFieldArray({
    name: "proveedores",
    control,
  });

  const onAddArtProveedor = (proveedor: Proveedor) => {
    append({
      APCargoPedido: 0,
      APCostoCompra: 0,
      APCostoPedido: 0,
      APDemoraEntregaDias: 0,
      proveedor: proveedor,
    });
  };

  useEffect(() => {
    if (!articulo) return;

    articulo.proveedores.map((proveedor) => {
      append(proveedor);
    });
  }, [articulo]);

  async function onSubmit(data: IFormValues) {
    console.log(data);

    if (!articulo) {
      createArticulo(data);
      return;
    }

    updateArticulo(String(articulo.articuloCod), data);
  }

  //   Handling ArticuloProveedor state
  const [openProveedoresPopUp, setOpenProveedoresPopUp] =
    useState<boolean>(false);

  const handleClickAddProveedor = () => {
    setOpenProveedoresPopUp(true);
  };

  const handleDeleteArtProveedor = (artProvIndex: number) => {
    remove(artProvIndex);
  };

  //   Articulo Modelo Inventario
  const modeloInventarioTipo = watch("modeloInventarioTipo");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Stack
        direction="row"
        gap={4}
        flexWrap="wrap"
        width="100%"
        sx={{
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { md: "space-between" },
        }}
      >
        <Stack direction="column" spacing={2} flex="1">
          {/* Base Articulo Fields */}
          <Typography variant="h3">Base</Typography>
          <TextField
            {...register("articuloNombre")}
            label="Nombre del artículo"
          />

          <TextField
            multiline
            rows={2}
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
        </Stack>

        <Stack direction="column" spacing={2} flex="1" marginLeft={0}>
          <Typography variant="h3">Modelo de inventario</Typography>
          {/* Articulo Modelo Inventario Fields */}
          <Controller
            control={control}
            defaultValue="loteFijo"
            render={({ field: { onChange, value } }) => (
              <Select
                labelId="modeloInventarioLabel"
                id="modeloInventario"
                label="Modelo de Inventario"
                value={value}
                onChange={onChange}
              >
                <MenuItem value="loteFijo">Modelo Lote Fijo</MenuItem>
                <MenuItem value="intervaloFijo">Modelo Intervalo Fijo</MenuItem>
              </Select>
            )}
            name="modeloInventarioTipo"
          />

          <div
            style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          >
            {/* Articulo Modelo Inventario LF */}
            {modeloInventarioTipo === "loteFijo" && (
              <>
                <TextField
                  label="Lote óptimo"
                  type="number"
                  {...register("modeloInventario.loteOptimo")}
                />
                <TextField
                  label="Punto de pedido"
                  type="number"
                  {...register("modeloInventario.puntoPedido")}
                />
                <TextField
                  label="Stock de seguridad"
                  type="number"
                  {...register("modeloInventario.stockSeguridad")}
                />
              </>
            )}

            {/* Articulo Modelo Inventario IF */}
            {modeloInventarioTipo === "intervaloFijo" && (
              <>
                <TextField
                  label="Fecha próximo pedido"
                  slotProps={{ inputLabel: { shrink: true } }}
                  type="date"
                  {...register("modeloInventario.fechaProximoPedido")}
                />
                <TextField
                  label="Intervalo pedido"
                  type="number"
                  {...register("modeloInventario.intervaloPedido")}
                />
                <TextField
                  label="Intervalo máximo"
                  type="number"
                  {...register("modeloInventario.intervaloMax")}
                />
                <TextField
                  label="Stock de seguridad"
                  type="number"
                  {...register("modeloInventario.stockSeguridad")}
                />
              </>
            )}
          </div>

          <div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                marginBottom: "1rem",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h3">Proveedores</Typography>
            </div>

            {/* Articulo Proveedor Fields */}
            <ArticuloAMProveedorPopupTable
              open={openProveedoresPopUp}
              setIsOpen={setOpenProveedoresPopUp}
              onAddArtProveedor={onAddArtProveedor}
              artProveedores={fields.map(({ id, ...rest }) => rest)}
            />
            <Stack direction="column" spacing={2}>
              {fields.map((field, index) => (
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <Typography variant="h6" fontWeight={500}>
                      {field.proveedor.proveedorNombre} -{" "}
                      {field.proveedor.proveedorTelefono}
                    </Typography>
                    <IconButton
                      onClick={() => handleDeleteArtProveedor(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <TextField
                      label="Cargo Pedido"
                      type="number"
                      {...register(`proveedores.${index}.APCargoPedido`)}
                    />
                    <TextField
                      label="Costo Compra"
                      type="number"
                      {...register(`proveedores.${index}.APCostoCompra`)}
                    />
                    <TextField
                      label="Costo Pedido"
                      type="number"
                      {...register(`proveedores.${index}.APCostoPedido`)}
                    />
                    <TextField
                      label="Demora entrega (días)"
                      type="number"
                      {...register(`proveedores.${index}.APDemoraEntregaDias`)}
                    />
                  </div>
                </div>
              ))}

              <Button
                onClick={handleClickAddProveedor}
                color="primary"
                startIcon={<Add />}
              >
                Agregar proveedor
              </Button>
            </Stack>
          </div>
        </Stack>
      </Stack>

      <Button type="submit" variant="contained">
        Guardar
      </Button>
    </form>
  );
}
