import { Controller, useFieldArray, useForm } from "react-hook-form";
import type {
  Articulo,
  ArticuloModeloIntervaloFijo,
  ArticuloProveedor,
} from "../types/domain/articulo/Articulo";
import { useArticulo } from "../hooks/useArticulo";
import {
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Proveedor } from "../types/domain/proveedor/Proveedor";
import ArticuloAMProveedorPopupTable from "../pages/articulo/ArticuloAMProveedorPopupTable";
import { Add, Delete, Save } from "@mui/icons-material";
import type {
  ArticuloAlta,
  ArticuloProveedorAlta,
} from "../types/domain/articulo/ArticuloAlta";
import { useNavigate, useParams } from "react-router";

interface IFormValues extends Articulo {}

interface ArticuloFormProps {
  onSuccess?: () => void;
  //articulo?: Articulo;
  updateMode: boolean;
}

export default function ArticuloForm({
  onSuccess,
  updateMode,
}: ArticuloFormProps) {
  const { createArticulo, updateArticulo, error, isLoading, getArticuloById } =
    useArticulo();
  const [articulo, setArticulo] = useState<Articulo>();
  const { articuloCod } = useParams();
  const [provPred, setProvPred] = useState<number>(0);
  const [initialProvPred, setInitialProvPred] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    updateMode
      ? getArticuloById(articuloCod!).then((art) => {
          setArticulo(art);
          reset(art);
        })
      : undefined;
  }, []);

  useEffect(() => {
    setInitialProvPred(articulo?.proveedorPredeterminadoId as number);
    setProvPred(articulo?.proveedorPredeterminadoId as number);
  }, [articulo]);

  // React Hook Form set-up
  const { register, control, watch, handleSubmit, reset } =
    useForm<IFormValues>({
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

            articuloProveedores: articulo.articuloProveedores,
            proveedorPredeterminadoId: articulo.proveedorPredeterminadoId,

            modeloInventario: articulo.modeloInventario,
          }
        : undefined,
    });

  const { fields, append, remove } = useFieldArray({
    name: "articuloProveedores",
    control,
  });

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

  async function onSubmit(data: IFormValues) {
    const altaArticulo: ArticuloAlta = {
      ...data,
      proveedorPredeterminadoId: provPred as number,
      articuloProveedores: data.articuloProveedores.map((artProv) => {
        const artProvAlta: ArticuloProveedorAlta = {
          ...artProv,
          proveedorId: artProv.proveedor.id,
          articuloId: data.id,
        };
        return artProvAlta;
      }),
      modeloInventario: {
        nombre: data.modeloInventario.nombre,
        fechaProxPedido: (data.modeloInventario as ArticuloModeloIntervaloFijo)
          .fechaProximoPedido,
        intervaloPedido: (data.modeloInventario as ArticuloModeloIntervaloFijo)
          .intervaloPedido,
        inventarioMaximo: (data.modeloInventario as ArticuloModeloIntervaloFijo)
          .inventarioMaximo,
      },
    };

    if (!articulo) {
      createArticulo(altaArticulo).then(
        (resp) => {
          alert("Artículo creado exitosamente");
          navigate(`/articulo/${resp.id}`);
        },
        () => {
          error?.response?.json().then((resp) => {
            alert(`El artículo no pudo ser creado\n ${resp.error}`);
          });
        }
      );
      return;
    }

    updateArticulo(String(articulo.id), altaArticulo).then(
      () => {
        alert(`Artículo actualizado exitosamente`);
        navigate(`/articulo/${data.id}`);
      },
      () => {
        error?.response?.json().then((resp) => {
          alert(`El artículo no pudo ser actualizado\n ${resp.error}`);
        });
      }
    );
  }

  const handleProvPred = (event: any, provPredId: string) => {
    setProvPred(parseInt(provPredId));
  };

  const handleResetProvPred = () => {
    setProvPred(initialProvPred);
  };

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
  const modeloInventarioTipo = watch("modeloInventario.nombre");

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
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
          />

          <TextField
            {...register("demanda")}
            label="Cantidad demandada del artículo"
            type="number"
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
          />

          <TextField
            {...register("desviacionEstandar")}
            label="Desviación estandar demanda artículo"
            type="number"
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
          />

          <TextField
            {...register("nivelServicio")}
            label="Nivel de servicio del artículo"
            type="number"
            slotProps={{
              htmlInput: {
                min: 0,
                max: 1,
                step: "any",
              },
            }}
          />

          <TextField
            {...register("stock")}
            label="Stock del artículo"
            type="number"
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
          />
        </Stack>
        <Stack direction="column" spacing={2} flex="1">
          {/* Articulo Proveedor Fields */}
          <ArticuloAMProveedorPopupTable
            open={openProveedoresPopUp}
            setIsOpen={setOpenProveedoresPopUp}
            onAddArtProveedor={onAddArtProveedor}
            artProveedores={fields.map(
              ({ id, ...rest }) => rest as ArticuloProveedor
            )}
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
            name="modeloInventario.nombre"
          />

          <div
            style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          >
            {/* Articulo Modelo Inventario IF */}
            {modeloInventarioTipo === "Intervalo Fijo" && (
              <>
                <TextField
                  label="Fecha próximo pedido"
                  slotProps={{ inputLabel: { shrink: true } }}
                  type="datetime-local"
                  {...register("modeloInventario.fechaProximoPedido")}
                />
                <TextField
                  label="Intervalo pedido"
                  type="number"
                  {...register("modeloInventario.intervaloPedido")}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                    },
                  }}
                />
                <TextField
                  label="Inventario máximo"
                  type="number"
                  {...register("modeloInventario.inventarioMaximo")}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                    },
                  }}
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
              <Button onClick={() => setProvPred(0)}>
                {" "}
                Deseleccionar proveedor predeterminado
              </Button>
              <Button onClick={() => handleResetProvPred()}>
                {" "}
                Resetear proveedor predeterminado
              </Button>
            </div>

            {/* Articulo Proveedor Fields */}
            <ArticuloAMProveedorPopupTable
              open={openProveedoresPopUp}
              setIsOpen={setOpenProveedoresPopUp}
              onAddArtProveedor={onAddArtProveedor}
              artProveedores={fields}
            />
            <Stack direction="column" spacing={2}>
              <RadioGroup
                aria-labelledby="provPredSelectionLabel"
                onChange={handleProvPred}
                name="provPredSelection"
              >
                {fields.map((field, index) => (
                  <div id="field.proveedor.id">
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
                        {"Id"} {field.proveedor.id} - {}
                        {(field.proveedor as any).proveedorNombre} - {}
                        {(field.proveedor as any).proveedorTelefono}
                      </Typography>
                      <FormControlLabel
                        value={field.proveedor.id}
                        control={
                          <Radio checked={field.proveedor.id == provPred} />
                        }
                        label="Proveedor predeterminado"
                      />
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
                        {...register(
                          `articuloProveedores.${index}.cargoPedido`
                        )}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                          },
                        }}
                      />
                      <TextField
                        label="Precio Unitario"
                        type="number"
                        {...register(
                          `articuloProveedores.${index}.precioUnitario`
                        )}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                          },
                        }}
                      />
                      <TextField
                        label="Costo Pedido"
                        type="number"
                        {...register(
                          `articuloProveedores.${index}.costoPedido`
                        )}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                          },
                        }}
                      />
                      <TextField
                        label="Demora entrega (días)"
                        type="number"
                        {...register(
                          `articuloProveedores.${index}.demoraEntrega`
                        )}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                          },
                        }}
                      />
                    </div>
                  </div>
                ))}
              </RadioGroup>
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
