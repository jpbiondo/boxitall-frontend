import {
  Store,
  ShoppingCart,
  BookmarkBorder,
  AnalyticsRounded,
} from "@mui/icons-material";
export const ICON_SIZE = 32;

const createIcon = (IconComponent: React.ElementType, size = ICON_SIZE) => (
  <IconComponent sx={{ fontSize: size }} />
);

export const getArticleIcon = (size?: number) =>
  createIcon(AnalyticsRounded, size);
export const getProviderIcon = (size?: number) => createIcon(Store, size);
export const getOrderSaleIcon = (size?: number) =>
  createIcon(BookmarkBorder, size);
export const getSaleIcon = (size?: number) => createIcon(ShoppingCart, size);
