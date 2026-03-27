import Loading from "@/components/loading/Loading";
import { useDetailWorkShift, useUpdateWorkShift } from "@/hooks/workshift";
import { useParams } from "react-router-dom";
import AddWorkShiftScreen from "../add";

export default function EditWorkShiftScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailWorkShift(id ?? "");
  const { onUpdateWorkShift, isLoading: isLoadingUpdate } = useUpdateWorkShift(
    id ?? ""
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AddWorkShiftScreen
      initData={data}
      title="Cập nhật ca làm việc"
      isEdit={true}
      handleUpdate={onUpdateWorkShift}
      isLoadingUpdate={isLoadingUpdate}
    />
  );
}
