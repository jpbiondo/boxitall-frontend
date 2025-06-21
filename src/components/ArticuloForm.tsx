// TODO: Añadir lista de proveedores
// TODO: Añadir lista de modelos de inventario
// TODO: Conectar con el backend
// TODO: Añadir validaciones formulario
import { Controller, set, useFieldArray, useForm } from "react-hook-form";
import type { Articulo, ArticuloProveedor } from "../types/domain/articulo/Articulo";
import { useArticulo } from "../hooks/useArticulo";
import { Button, IconButton, MenuItem, Select, Step, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { Proveedor } from "../types/domain/proveedor/Proveedor";
import ArticuloAMProveedorPopupTable from "../pages/articulo/ArticuloAMProveedorPopupTable";
import { Add, Delete } from "@mui/icons-material";
import type { ArticuloAlta } from "../types/domain/articulo/ArticuloAlta";
import { useNavigate, useParams } from "react-router";

interface IFormValues extends ArticuloAlta {
}

interface ArticuloFormProps {
  onSuccess?: () => void;
  //articulo?: Articulo;
  updateMode: boolean;
}

export default function ArticuloForm({
  onSuccess,
  updateMode
}: ArticuloFormProps) {
  const { createArticulo, updateArticulo, error, isLoading, getArticuloById} = useArticulo();
  const [ articulo, setArticulo ] = useState<Articulo>();
  const { articuloCod } = useParams();
  const navigate = useNavigate();

  // Recibe el art desde el local storage
  useEffect(()=>{
    updateMode?
    getArticuloById(articuloCod!).then((art) => {
      setArticulo(art);
      reset(art);
    })
    : undefined;
    // if(updateMode && localStorage.getItem("articulo") != null){
    //   setArticulo(JSON.parse(localStorage.getItem("articulo")!));
    // }
    // else
    //   setArticulo(undefined)
  }, []);
  
  useEffect(()=>{

    // if (!articulo) return;
    // articulo.articuloProveedores?.map((artProv) => {
    //   append(artProv);
    // });

    // if(articulo != undefined){
    //   if(articuloCod != articulo.id?.toString()){
    //     navigate("/articulo/create", {replace : true});
    //   }
    //   reset(articulo);
    // }

    // console.log(articulo);

  }, [articulo]);

  // React Hook Form set-up
  const { register, control, watch, handleSubmit, getValues, setValue, reset } = useForm<IFormValues>({
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
      {/* Base Articulo Fields */}
      <TextField
        {...register("nombre")}
        label="Nombre del artículo"
        />

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
        slotProps={{ htmlInput: {
          min: 0,
          max: 1,
          step: "any"
        }}}
        />

      <TextField
        {...register("stock")}
        label="Stock del artículo"
        type="number"
      />

      {/* Articulo Proveedor Fields */}
      <ArticuloAMProveedorPopupTable
        open={openProveedoresPopUp}
        setIsOpen={setOpenProveedoresPopUp}
        onAddArtProveedor={onAddArtProveedor}
        artProveedores={fields.map(({ id, ...rest }) => rest as ArticuloProveedor)}
      />

      <div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <h2>Lista Proveedores</h2>
          <IconButton
            onClick={handleClickAddProveedor}
            color="primary"
            size="large"
          >
            <Add />
          </IconButton>
        </div>
        {fields.map((field, index) => (
          <div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <h3>
                {/* {field.proveedor.proveedorNombre} -{" "}
                {field.proveedor.proveedorTelefono} */}
              </h3>
              <IconButton
                onClick={() => handleDeleteArtProveedor(index)}
                color="error"
                size="large"
              >
                <Delete />
              </IconButton>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <TextField
                label="Cargo Pedido"
                type="number"
                {...register(`articuloProveedores.${index}.cargoPedido`)}
              />
              <TextField
                label="Costo Compra"
                type="number"
                {...register(`articuloProveedores.${index}.costoCompra`)}
              />
              <TextField
                label="Costo Pedido"
                type="number"
                {...register(`articuloProveedores.${index}.costoPedido`)}
              />
              <TextField
                label="Demora entrega (días)"
                type="number"
                {...register(`articuloProveedores.${index}.demoraEntrega`)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Articulo Modelo Inventario Fields */}
      <h2>Modelo de inventario</h2>
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
            <MenuItem value="Intervalo Fijo">Modelo Intervalo Fijo</MenuItem>
          </Select>
        )}
        name="modeloInventario.nombre"
      />

      <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
        {/* Articulo Modelo Inventario LF */}
        {/* {modeloInventarioTipo === "Lote Fijo" && (
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
        )} */}

        {/* Articulo Modelo Inventario IF */}
        {modeloInventarioTipo === "Intervalo Fijo" && (
          <>
            <TextField
              label="Fecha próximo pedido"
              slotProps={{ inputLabel: { shrink: true } }}
              type="date"
              {...register("modeloInventario.fechaProxPedido")}
            />
            <TextField
              label="Intervalo pedido"
              type="number"
              {...register("modeloInventario.intervaloPedido")}
            />
            <TextField
              label="Inventario máximo"
              type="number"
              {...register("modeloInventario.inventarioMaximo")}
            />
            {/* <TextField
              label="Stock de seguridad"
              type="number"
              {...register("modeloInventario.stockSeguridad")}
            /> */}
          </>
        )}
      </div>
      <Button type="submit" variant="contained">
        Guardar
      </Button>
    </form>
  );
}
