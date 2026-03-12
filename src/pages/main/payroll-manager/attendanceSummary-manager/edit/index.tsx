import Loading from "@/components/loading/Loading";
import { useDetailAttendanceSummary, useUpdateAttendanceSummary } from "@/hooks/payroll";
import { useParams } from "react-router-dom";
import AddAttendanceSummaryScreen from "../add";

const handleUpdateWrapper = (onUpdate: any) => {
  return (data: any) => {
    return onUpdate(data);
  };
};

export default function EditAttendanceSummaryScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailAttendanceSummary(id ?? "");
  const { onUpdateAttendanceSummary, isLoading: isLoadingUpdate } = useUpdateAttendanceSummary(id ?? "");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AddAttendanceSummaryScreen
      initData={data}
      title="Cập nhật tổng hợp công"
      isEdit={true}
      handleUpdate={handleUpdateWrapper(onUpdateAttendanceSummary)}
      isLoadingUpdate={isLoadingUpdate}
    />
  );
}
