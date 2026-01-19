import Loading from "@/components/loading/Loading";
import { useDetailRoute, useUpdateRoute } from "@/hooks/route";
import { useParams } from "react-router-dom";
import AddRouteScreen from "../add";

export default function EditRouteScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailRoute(id || "");

  const { onUpdateRoute, isLoading: isLoadingUpdate } = useUpdateRoute(
    id || ""
  );

  const mappedInitData = data
    ? {
        ...data,
      }
    : undefined;

  const handleUpdate = (values: any) => {
    onUpdateRoute({
      ...values,
    });
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddRouteScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa tuyến đường"
          initData={mappedInitData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
