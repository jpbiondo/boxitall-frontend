import { useNavigate, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import {
  getArticleIcon,
  getOrderSaleIcon,
  getProviderIcon,
  getSaleIcon,
  getInventoryIcon,
  getProductCautionIcon
} from "../utils/domainIcons";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, path: "/" },
  { text: "Artículos", icon: getArticleIcon(), path: "/articulo" },
  { text: "Proveedores", icon: getProviderIcon(), path: "/proveedor" },
  {
    text: "Ordenes de Compra",
    icon: getOrderSaleIcon(),
    path: "/orden-compra",
  },
  { text: "Ventas", icon: getSaleIcon(), path: "/venta" },
  { text: "Artículos a reponer", icon: getInventoryIcon(), path:"/listados/reponer" },
  { text: "Artículos faltantes", icon: getProductCautionIcon(), path:"/listados/faltantes" }
];

const secondaryListItems = [
  { text: "About", icon: <InfoRoundedIcon />, path: "/about" },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={isActiveRoute(item.path)}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={isActiveRoute(item.path)}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
