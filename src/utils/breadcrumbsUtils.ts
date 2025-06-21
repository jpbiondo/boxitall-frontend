interface PathDictionary {
  pathName: string;
  name: string;
}

interface BreadcrumbItem extends PathDictionary {
  isActive: boolean;
}

function isIndexPath(path: string) {
  return path === "/";
}

function isPathANumber(path: string) {
  return !isNaN(Number(path));
}

export const pathDictionary: PathDictionary[] = [
  { pathName: "", name: "Index" },
  { pathName: "articulo", name: "Articulo" },
  { pathName: "proveedor", name: "Proveedor" },
  { pathName: "venta", name: "Venta" },
  { pathName: "orden-compra", name: "Orden de Compra" },
  { pathName: "update", name: "Actualizar" },
  { pathName: "create", name: "Crear" },
];

function getBreadcrumbs(
  path: string,
  pathDictionary: PathDictionary[]
): BreadcrumbItem[] {
  // Create a lookup map for better performance
  const pathMap = new Map(
    pathDictionary.map((item) => [item.pathName, item.name])
  );

  // Handle root path
  if (isIndexPath(path)) {
    return [
      {
        pathName: "/",
        name: pathMap.get("") || "Index",
        isActive: true,
      },
    ];
  }

  // Split path and filter out empty strings
  const pathParts = path.split("/").filter((part) => part !== "");

  // Start with Index
  const breadcrumbs: BreadcrumbItem[] = [
    {
      pathName: "/",
      name: pathMap.get("") || "Index",
      isActive: false,
    },
  ];

  // Build cumulative path
  let cumulativePath = "";

  // Process each path part
  pathParts.forEach((part, index) => {
    // Always add to cumulative path (including IDs)
    cumulativePath += `/${part}`;

    // Skip numeric parts (like IDs) for breadcrumb creation
    if (isPathANumber(part)) return;

    const name = pathMap.get(part);
    if (name) {
      // Check if this is the last meaningful part
      const isLast =
        index === pathParts.length - 1 ||
        pathParts.slice(index + 1).every((p) => isPathANumber(p));

      breadcrumbs.push({
        pathName: cumulativePath,
        name: name,
        isActive: isLast,
      });
    }
  });

  return breadcrumbs;
}

export default getBreadcrumbs;
