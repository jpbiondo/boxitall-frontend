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
import { Add, Delete, Save } from "@mui/icons-material";

interface IFormValues extends Articulo {
  modeloInventarioTipo: "Lote Fijo" | "Intervalo Fijo";
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
          id: articulo.id,
          nombre: articulo.nombre,
          descripcion: articulo.descripcion,
          demanda: articulo.demanda,
          desviacionEstandar: articulo.desviacionEstandar,
          nivelServicio: articulo.nivelServicio,
          stock: articulo.stock,
          costoAlmacenamiento: articulo.costoAlmacenamiento,

          proveedores: articulo.proveedores,
          proveedorPredeterminadoId: articulo.proveedorPredeterminadoId,
          proveedorPredeterminadoNombre: articulo.proveedorPredeterminadoNombre,

          modeloInventario: articulo.modeloInventario,
        }
      : undefined,
  });

  const { fields, append, remove } = useFieldArray({
    name: "proveedores",
    control,
  });
  // nigga I'm going nuts

  const onAddArtProveedor = (proveedor: Proveedor) => {
    append({
      cargoPedido: 0,
      costoCompra: 0,
      costoPedido: 0,
      demoraEntrega: 0,
      precioUnitario: 0,
      proveedor: proveedor,
    });
  };

  useEffect(() => {
    if (!articulo) return;

    articulo.proveedores.map((artProv) => {
      append(artProv);
    });
  }, [articulo]);

  async function onSubmit(data: IFormValues) {
    console.log(data);

    if (!articulo) {
      createArticulo(data);
      return;
    }

    updateArticulo(String(articulo.id), data);
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
        // why this shyt even broke?😭
        sx={{
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { md: "space-between" },
        }}
      >
        <Stack direction="column" spacing={2} flex="1">
          {/* Base Articulo Fields */}
          <Typography variant="h3">Base</Typography>
          <TextField {...register("nombre")} label="Nombre del artículo" />

          <TextField
            multiline
            rows={3}
            {...register("descripcion")}
            label="Descripción del artículo"
          />

          <TextField
            {...register("costoAlmacenamiento")}
            label="Costo almacenamiento artículo"
            type="number"
          />

          <TextField
            {...register("demanda")}
            label="Cantidad demandada del artículo"
            type="number"
          />

          <TextField
            {...register("desviacionEstandar")}
            label="Desviación estandar demanda artículo"
            type="number"
          />

          <TextField
            {...register("nivelServicio")}
            label="Nivel de servicio del artículo"
            type="number"
          />

          <TextField
            {...register("stock")}
            label="Stock del artículo"
            type="number"
          />
        </Stack>
        <Stack direction="column" spacing={2} flex="1">
          {/* Articulo Proveedor Fields */}
          <ArticuloAMProveedorPopupTable
            open={openProveedoresPopUp}
            setIsOpen={setOpenProveedoresPopUp}
            onAddArtProveedor={onAddArtProveedor}
            artProveedores={fields.map(({ id, ...rest }) => rest)}
          />

          {/* Articulo Modelo Inventario Fields */}
          <Typography variant="h3">Modelo de inventario</Typography>
          <Controller
            control={control}
            defaultValue="Lote Fijo"
            render={({ field: { onChange, value } }) => (
              <Select
                labelId="modeloInventarioLabel"
                id="modeloInventario"
                label="Modelo de Inventario"
                value={value}
                onChange={onChange}
              >
                <MenuItem value="Lote Fijo">Modelo Lote Fijo</MenuItem>
                <MenuItem value="Intervalo Fijo">
                  Modelo Intervalo Fijo
                </MenuItem>
              </Select>
            )}
            name="modeloInventarioTipo"
          />

          <div
            style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          >
            {/* Articulo Modelo Inventario LF */}
            {modeloInventarioTipo === "Lote Fijo" && (
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
            {modeloInventarioTipo === "Intervalo Fijo" && (
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
                  {...register("modeloInventario.inventarioMax")}
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
                      {...register(`proveedores.${index}.cargoPedido`)}
                    />
                    <TextField
                      label="Costo Compra"
                      type="number"
                      {...register(`proveedores.${index}.costoCompra`)}
                    />
                    <TextField
                      label="Costo Pedido"
                      type="number"
                      {...register(`proveedores.${index}.costoPedido`)}
                    />
                    <TextField
                      label="Demora entrega (días)"
                      type="number"
                      {...register(`proveedores.${index}.demoraEntrega`)}
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

      <Button type="submit" variant="contained" startIcon={<Save />}>
        Guardar
      </Button>
    </form>
  );
}
