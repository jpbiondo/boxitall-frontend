export const API_URL = "http://localhost:8080";

// Domain entities path
export const ARTICULO_PATH = "/articulo";
export const PROVEEDORES_PATH = "/proveedores";
export const VENTAS_PATH = "/ventas";
export const COMPRAS_PATH = "/compras";

// General actions endpoints
export const CREATE_PATH = "/create";
export const UPDATE_PATH = "/update";

// Domain entities actions endpoints
export const ARTICULO_CREATE_PATH = `${ARTICULO_PATH}${CREATE_PATH}`;
export const ARTICULO_UPDATE_PATH = `${ARTICULO_PATH}${UPDATE_PATH}`;
export const PROVEEDORES_CREATE_PATH = `${PROVEEDORES_PATH}${CREATE_PATH}`;
export const PROVEEDORES_UPDATE_PATH = `${PROVEEDORES_PATH}${UPDATE_PATH}`;
export const VENTAS_CREATE_PATH = `${VENTAS_PATH}${CREATE_PATH}`;
export const VENTAS_UPDATE_PATH = `${VENTAS_PATH}${UPDATE_PATH}`;
export const COMPRAS_CREATE_PATH = `${COMPRAS_PATH}${CREATE_PATH}`;
export const COMPRAS_UPDATE_PATH = `${COMPRAS_PATH}${UPDATE_PATH}`;
