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
import AppTheme from "./theme/AppTheme";
import { alpha, Box, CssBaseline, Stack } from "@mui/material";
import AppNavbar from "./components/AppNavbar";
import SideMenu from "./components/SideMenu";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />

        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={4}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
            direction="column"
          >
            <Header />
            <Box
              sx={{
                width: "100%",
                maxWidth: { sm: "100%", md: "1700px" },
              }}
            >
              <Routes>
                <Route index element={<Home />} />

                <Route path="articulo">
                  <Route index element={<ArticuloListado />} />

                  <Route
                    path="create"
                    element={<ArticuloAltaModificacion updateMode={false} />}
                  />

                  <Route
                    path="update/:articuloCod"
                    element={<ArticuloAltaModificacion updateMode={true} />}
                  />

                  <Route path=":articuloCod" element={<ArticuloConsulta />} />
                </Route>

                <Route path="orden-compra">
                  <Route index element={<OrdenCompraListado />} />

                  <Route
                    path=":ordenCompraCod/detalle"
                    element={<OrdenCompraConsulta />}
                  />

                  <Route
                    path="create"
                    element={<OrdenCompraAltaModificacion updateMode={false} />}
                  />

                  <Route
                    path="update/:ordenCompraCod"
                    element={<OrdenCompraAltaModificacion updateMode={true} />}
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
                    path="update/:ventaCod"
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
                    path="update/:proveedorCod"
                    element={<ProveedorAltaModificacion updateMode={true} />}
                  />
                </Route>
              </Routes>
            </Box>
            <Footer />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}

export default App;
