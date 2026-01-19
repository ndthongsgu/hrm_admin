import { ROUTES } from "@/common/constants/routes";
import { buildRouteTree, type RouteNode } from "@/utils/route.util";
import { Breadcrumb } from "antd";
import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const params = useParams();

  const routeTree = useMemo(() => buildRouteTree(ROUTES), []);
  const currentPath = useMemo(() => {
    let tempPath = pathname;
    Object.values(params).forEach((param) => {
      tempPath = tempPath.replace(`/${param}`, "/:id");
    });
    return tempPath;
  }, [pathname, params]);

  const items = useMemo(() => {
    const currentNode = routeTree[currentPath];
    if (!currentNode) {
      return [{ title: "Trang chủ" }];
    }

    const breadcrumbChain: RouteNode[] = [];
    let node: RouteNode | undefined = currentNode;

    while (node) {
      breadcrumbChain.unshift(node);
      node = node.parent ? routeTree[node.parent] : undefined;
    }

    if (!breadcrumbChain.find((n) => n.path === "/") && routeTree["/"]) {
      breadcrumbChain.unshift(routeTree["/"]);
    }

    return breadcrumbChain.map((node, idx) => {
      const isLast = idx === breadcrumbChain.length - 1;
      return {
        title: isLast ? (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {node.label}
          </span>
        ) : (
          <Link
            to={node.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              textDecoration: "none",
              color: "#000000",
            }}
          >
            {node.label}
          </Link>
        ),
      };
    });
  }, [currentPath, routeTree]);

  return (
    <div style={{ padding: "0 24px" }}>
      <Breadcrumb items={items} />
    </div>
  );
};

export default Breadcrumbs;
