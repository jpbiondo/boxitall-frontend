import { Grid, Stack, Typography } from "@mui/material";
import CustomCardStat from "../components/CustomCardStat";
import CustomCardManage from "../components/CustomCardManage";
import {
  getArticleIcon,
  getOrderSaleIcon,
  getProviderIcon,
  getSaleIcon,
} from "../utils/domainIcons";
import { useNavigate } from "react-router";
import {
  articuloColorRange,
  ordenColorRange,
  proveedorColorRange,
  ventaColorRange,
} from "../utils/domainColors";

export function Home() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Stack direction="column" spacing={2} gap={2}>
      <Stack direction="column">
        <Typography variant="h2" marginBottom={0}>
          Home
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          style={{ marginTop: "0px !important" }}
        >
          Best retailer ever!
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ sm: 12, md: 4 }}>
          <CustomCardStat
            title="Total de artículos"
            value={100}
            icon={getArticleIcon()}
            colorRange={articuloColorRange}
          />
        </Grid>
        <Grid size={{ sm: 12, md: 4 }}>
          <CustomCardStat
            title="Total de órdenes de compra"
            value={100}
            icon={getOrderSaleIcon()}
            colorRange={ordenColorRange}
          />
        </Grid>
        <Grid size={{ sm: 12, md: 4 }}>
          <CustomCardStat
            title="Total de ventas"
            value={100}
            icon={getSaleIcon()}
            colorRange={ventaColorRange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ sm: 12, lg: 6 }}>
          <CustomCardManage
            title="Gestionar Artículos"
            description="Gestiona los artículos y sus proveedores"
            icon={getArticleIcon()}
            action={() => handleNavigate("/articulo")}
            colorRange={articuloColorRange}
          />
        </Grid>
        <Grid size={{ sm: 12, lg: 6 }}>
          <CustomCardManage
            title="Gestionar Órdenes de Compra"
            description="Gestiona las órdenes de compra"
            icon={getOrderSaleIcon()}
            action={() => handleNavigate("/orden-compra")}
            colorRange={ordenColorRange}
          />
        </Grid>
        <Grid size={{ sm: 12, lg: 6 }}>
          <CustomCardManage
            title="Gestionar Proveedores"
            description="Gestiona los proveedores"
            icon={getProviderIcon()}
            action={() => handleNavigate("/proveedor")}
            colorRange={proveedorColorRange}
          />
        </Grid>
        <Grid size={{ sm: 12, lg: 6 }}>
          <CustomCardManage
            title="Gestionar Ventas"
            description="Gestiona las ventas"
            icon={getSaleIcon()}
            action={() => handleNavigate("/venta")}
            colorRange={ventaColorRange}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
