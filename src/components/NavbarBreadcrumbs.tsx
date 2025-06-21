import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useLocation } from "react-router";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

const breadcrumbRouteItems = [
  { text: "Home", path: "/" },
  { text: "Articulos", path: "/articulo" },
  { text: "Proveedores", path: "/proveedor" },
  { text: "Ordenes de Compra", path: "/orden-compra" },
  { text: "Ventas", path: "/venta" },
];

export default function NavbarBreadcrumbs() {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Dashboard</Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.primary", fontWeight: 600 }}
      >
        {breadcrumbRouteItems.filter(({ path }) => isActiveRoute(path))[0].text}
      </Typography>
    </StyledBreadcrumbs>
  );
}
