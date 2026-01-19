export interface RouteNode {
  key: string;
  label: string;
  path: string;
  icon?: string;
  parent?: string;
}

export const buildRouteTree = (
  obj: Record<string, any>,
  parentPath = "",
  parentKey = ""
): Record<string, RouteNode> => {
  const result: Record<string, RouteNode> = {};

  for (const key in obj) {
    const value = obj[key];

    if (value?.path && typeof value.path === "string") {
      result[value.path] = {
        key: value.key,
        label: value.label,
        path: value.path,
        parent: parentPath || undefined,
      };

      if (value.children) {
        Object.assign(
          result,
          buildRouteTree(value.children, value.path, value.key)
        );
      }
    } else if (typeof value === "object") {
      Object.assign(result, buildRouteTree(value, parentPath, parentKey));
    }
  }

  return result;
};
