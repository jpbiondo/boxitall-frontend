import {
  StoreOutlined,
  ShoppingCartOutlined,
  BookmarkBorderOutlined,
  AnalyticsOutlined,
} from "@mui/icons-material";
export const ICON_SIZE = 32;

const createIcon = (IconComponent: React.ElementType, size = ICON_SIZE) => (
  <IconComponent sx={{ fontSize: size }} />
);

export const getArticleIcon = (size?: number) =>
  createIcon(AnalyticsOutlined, size);
export const getProviderIcon = (size?: number) =>
  createIcon(StoreOutlined, size);
export const getOrderSaleIcon = (size?: number) =>
  createIcon(BookmarkBorderOutlined, size);
export const getSaleIcon = (size?: number) =>
  createIcon(ShoppingCartOutlined, size);
