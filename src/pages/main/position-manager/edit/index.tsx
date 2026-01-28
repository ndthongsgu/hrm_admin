import Loading from "@/components/loading/Loading";
import { useDetailPosition, useUpdatePosition } from "@/hooks/position";
import { useParams } from "react-router-dom";
import AddPositionScreen from "../add";

export default function EditPositionScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailPosition(id ?? "");
  const { onUpdatePosition, isLoading: isLoadingUpdate } = useUpdatePosition(
    id ?? ""
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AddPositionScreen
      initData={data}
      title="Cập nhật chức vụ"
      isEdit={true}
      handleUpdate={onUpdatePosition}
      isLoadingUpdate={isLoadingUpdate}
    />
  );
}
