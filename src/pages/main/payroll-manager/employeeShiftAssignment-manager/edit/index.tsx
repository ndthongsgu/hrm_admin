import Loading from "@/components/loading/Loading";
import { useDetailEmployeeShiftAssignment, useUpdateEmployeeShiftAssignment } from "@/hooks/employeeShiftAssignment";
import { useParams } from "react-router-dom";
import AddEmployeeShiftAssignmentScreen from "../add";

export default function EditEmployeeShiftAssignmentScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailEmployeeShiftAssignment(id ?? "");
  const { onUpdateEmployeeShiftAssignment, isLoading: isLoadingUpdate } = useUpdateEmployeeShiftAssignment(
    id ?? ""
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AddEmployeeShiftAssignmentScreen
      initData={data}
      title="Cập nhật gán ca làm việc"
      isEdit={true}
      handleUpdate={onUpdateEmployeeShiftAssignment}
      isLoadingUpdate={isLoadingUpdate}
    />
  );
}
