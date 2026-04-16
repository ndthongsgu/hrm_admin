import Loading from "@/components/loading/Loading";
import { useDetailDailyAttendance, useUpdateDailyAttendance } from "@/hooks/payroll/dailyAttendance";
import { useParams } from "react-router-dom";
import AddDailyAttendanceScreen from "../add";

export default function EditDailyAttendanceScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailDailyAttendance(id ?? "");
  const { onUpdateDailyAttendance, isLoading: isLoadingUpdate } = useUpdateDailyAttendance(
    id ?? ""
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AddDailyAttendanceScreen
      initData={data}
      title="Cập nhật chấm công"
      isEdit={true}
      handleUpdate={onUpdateDailyAttendance}
      isLoadingUpdate={isLoadingUpdate}
    />
  );
}