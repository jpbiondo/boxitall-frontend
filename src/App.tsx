import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { ArticuloAltaModificacion } from "./pages/articulo/ArticuloAltaModificacion";
import { ArticuloConsulta } from "./pages/articulo/ArticuloConsulta";
import { ArticuloListado } from "./pages/articulo/ArticuloListado";
import { OrdenCompraConsulta } from "./pages/orden-compra/OrdenCompraConsulta";
import { OrdenCompraListado } from "./pages/orden-compra/OrdenCompraListado";
import { OrdenCompraAltaModificacion } from "./pages/orden-compra/OrdenCompraAltaModificacion";
import { VentaListado } from "./pages/venta/VentaListado";
import { VentaConsulta } from "./pages/venta/VentaConsulta";
import { VentaAltaModificacion } from "./pages/venta/VentaAltaModificacion";
import { ProveedorListado } from "./pages/proveedor/ProveedorListado";
import { ProveedorConsulta } from "./pages/proveedor/ProveedorConsulta";
import { ProveedorAltaModificacion } from "./pages/proveedor/ProveedorAltaModificacion";

function App() {
  return (
    <>
      <h1> Welcome to BoxItAll Frontend!</h1>
      <p>Best stock retailer ever!</p>
      <Routes>
        <Route index element={<Home />} />

        <Route path="articulo">
          <Route index element={<ArticuloListado />} />

          <Route
            path="/create"
            element={<ArticuloAltaModificacion updateMode={true} />}
          />

          <Route
            path="/update/:articulo_cod"
            element={<ArticuloAltaModificacion updateMode={false} />}
          />

          <Route path=":articulo_cod" element={<ArticuloConsulta />} />
        </Route>

        <Route path="orden-compra">
          <Route index element={<OrdenCompraListado />} />

          <Route path=":ordenCompraCod" element={<OrdenCompraConsulta />} />

          <Route
            path="/create"
            element={<OrdenCompraAltaModificacion updateMode={true} />}
          />

          <Route
            path="/update/:ordenCompraCod"
            element={<OrdenCompraAltaModificacion updateMode={false} />}
          />
        </Route>

        <Route path="venta">
          <Route index element={<VentaListado />} />

          <Route path=":ventaCod" element={<VentaConsulta />} />

          <Route
            path="create"
            element={<VentaAltaModificacion updateMode={false} />}
          />
          <Route
            path="/update/:ventaCod"
            element={<VentaAltaModificacion updateMode={true} />}
          />
        </Route>

        <Route path="proveedor">
          <Route index element={<ProveedorListado />} />

          <Route path=":proveedorCod" element={<ProveedorConsulta />} />

          <Route
            path="create"
            element={<ProveedorAltaModificacion updateMode={false} />}
          />
          <Route
            path="/update/:proveedorCod"
            element={<ProveedorAltaModificacion updateMode={true} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
